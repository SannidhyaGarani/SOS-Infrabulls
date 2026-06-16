import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Briefcase, MapPin, Phone,
  Camera, Upload, Loader2, CheckCircle2, CreditCard
} from 'lucide-react';
import { db } from './Firebase/Firebase';
import { collection, addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { createAgentAccount, generateAgentPassword } from './Firebase/agentHelpers';
import { sendCredentialsViaEmail } from './Firebase/emailService';
import { uploadToCloudinary } from './Firebase/cloudinaryService';
import ImageBreadcrumb from './Pages/ImageBreadcrumb';

const inputClass =
  'w-full h-12 px-4 rounded-lg border border-[#e1e8f0] bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1174d6]/30 focus:border-[#1174d6] transition-colors';
const labelClass = 'block text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider';
const sectionClass = 'p-6 md:p-8 rounded-2xl bg-white border border-slate-100 shadow-sm mb-8';
const sectionTitleClass = 'text-base font-bold text-[#0A2540] mb-6 flex items-center gap-3 uppercase tracking-wider border-b border-slate-50 pb-4 [&_svg]:text-[#1174d6]';
const uploadLabelClass = 'w-full h-12 px-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer hover:border-[#1174d6] hover:bg-[#1174d6]/5 transition-all duration-300 group';

const JoinAsPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fatherHusbandName: '',
    fatherHusbandMiddleName: '',
    fatherHusbandLastName: '',
    dob: '',
    localAddressLine2: '',
    localCity: '',
    localState: '',
    localPinCode: '',
    permanentAddressLine1: '',
    permanentCity: '',
    permanentState: '',
    permanentPinCode: '',
    email: '',
    mobile1: '',
    mobile2: '',
    panCardNo: '',
    aadhaarCardNo: '',
  });

  const [files, setFiles] = useState({
    photograph: null,
    panCard: null,
    aadhaarCard: null
  });

  const [previews, setPreviews] = useState({
    photograph: null,
    panCard: null,
    aadhaarCard: null
  });

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
      setPreviews(prev => ({
        ...prev,
        [name]: URL.createObjectURL(uploadedFiles[0])
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.mobile1) {
      alert("Name, Email and Mobile Number are required.");
      return;
    }
    setLoading(true);
    setUploadProgress(0);

    try {
      let photographUrl = '';
      let panCardUrl = '';
      let aadhaarCardUrl = '';

      const totalFiles = (files.photograph ? 1 : 0) + (files.panCard ? 1 : 0) + (files.aadhaarCard ? 1 : 0);
      let uploadedCount = 0;

      const updateOverallProgress = (p) => {
        const fileShare = 100 / (totalFiles || 1);
        const currentTotalProgress = (uploadedCount * fileShare) + (p * fileShare / 100);
        setUploadProgress(Math.min(95, Math.round(currentTotalProgress)));
      };

      if (files.photograph) {
        photographUrl = await uploadToCloudinary(files.photograph, updateOverallProgress);
        uploadedCount++;
      }
      if (files.panCard) {
        panCardUrl = await uploadToCloudinary(files.panCard, updateOverallProgress);
        uploadedCount++;
      }
      if (files.aadhaarCard) {
        aadhaarCardUrl = await uploadToCloudinary(files.aadhaarCard, updateOverallProgress);
        uploadedCount++;
      }

      setUploadProgress(95);

      const password = generateAgentPassword();
      const loginId = formData.email.trim().toLowerCase();

      const partnerRef = await addDoc(collection(db, 'partnerRequests'), {
        ...formData,
        photographUrl,
        panCardUrl,
        aadhaarCardUrl,
        loginId,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      setUploadProgress(97);

      const { uid } = await createAgentAccount({
        email: loginId,
        password,
        formData,
        photographUrl,
        panCardUrl,
        aadhaarCardUrl,
        partnerRequestId: partnerRef.id,
      });

      await updateDoc(partnerRef, { agentUid: uid });

      setUploadProgress(99);

      const fullName = [formData.firstName, formData.middleName, formData.lastName]
        .filter(Boolean)
        .join(' ');

      const emailResult = await sendCredentialsViaEmail(loginId, password, fullName);

      await updateDoc(doc(db, 'agents', uid), {
        credentialsSentAt: serverTimestamp(),
        emailDeliveryStatus: emailResult.success ? 'sent' : 'failed',
      });

      setUploadProgress(100);
      setSubmitted(true);

      setFormData({
        date: '',
        firstName: '', middleName: '', lastName: '',
        fatherHusbandName: '', fatherHusbandMiddleName: '', fatherHusbandLastName: '',
        dob: '',
        localAddressLine2: '', localCity: '', localState: '', localPinCode: '',
        permanentAddressLine1: '', permanentCity: '', permanentState: '', permanentPinCode: '',
        email: '', mobile1: '', mobile2: '',
        panCardNo: '', aadhaarCardNo: '',
      });
      setFiles({ photograph: null, panCard: null, aadhaarCard: null });
      setPreviews({ photograph: null, panCard: null, aadhaarCard: null });

      setTimeout(() => navigate('/thank-you', {
        state: {
          loginId,
          emailSent: emailResult.success,
        },
      }), 500);
    } catch (error) {
      console.error('Error submitting form:', error);
      const message =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please use Agent Login or a different email.'
          : error.code === 'auth/weak-password'
            ? 'Password generation failed. Please try again.'
            : 'Submission failed. Check your internet and Firebase configuration.';
      alert(message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <ImageBreadcrumb
        title="Join As Partner"
        subtitle="Empower your future with SOS Infrabulls's premier partnership program."
        crumbs={[{ label: 'Partner Program' }]}
      />

      <section className="max-w-6xl mx-auto px-6 py-20">
        {submitted && (
          <div
            className="flex items-center justify-center gap-3 mb-10 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500"
            role="alert"
          >
            <CheckCircle2 size={22} className="text-emerald-500" />
            <span className="font-bold">Your application has been submitted successfully!</span>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div className={sectionClass}>
              <h5 className={sectionTitleClass}><Briefcase size={20} /> Basic Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Application Date</label>
                  <input type="date" className={inputClass} name="date" value={formData.date} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>Your Photograph</label>
                  <input type="file" id="photo" name="photograph" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="photo" className={uploadLabelClass}>
                    <span className="text-slate-500 text-sm">{previews.photograph ? 'Photo Selected ✓' : 'Upload Photograph'}</span>
                    <Camera size={18} className="text-[#1174d6] group-hover:scale-110 transition-transform" />
                  </label>
                </div>
              </div>
            </div>

            {/* Applicant Name */}
            <div className={sectionClass}>
              <h5 className={sectionTitleClass}><User size={20} /> Applicant Name</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                  <input type="text" className={inputClass} placeholder="John" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <label className={labelClass}>Middle Name</label>
                  <input type="text" className={inputClass} placeholder="M." name="middleName" value={formData.middleName} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                  <input type="text" className={inputClass} placeholder="Doe" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Relative Details</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" className={inputClass} placeholder="Father/Husband First Name" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} />
                  <input type="text" className={inputClass} placeholder="Middle Name" name="fatherHusbandMiddleName" value={formData.fatherHusbandMiddleName} onChange={handleChange} />
                  <input type="text" className={inputClass} placeholder="Last Name" name="fatherHusbandLastName" value={formData.fatherHusbandLastName} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className={sectionClass}>
              <h5 className={sectionTitleClass}><User size={20} /> Identity Proofs</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" className={inputClass} name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>PAN Card Number</label>
                  <input type="text" className={inputClass} placeholder="ABCDE1234F" name="panCardNo" value={formData.panCardNo} onChange={handleChange} />
                </div>
                <div>
                  <label className={labelClass}>PAN Card Image</label>
                  <input type="file" id="pan-file" name="panCard" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="pan-file" className={uploadLabelClass}>
                    <span className="text-slate-500 text-sm">{previews.panCard ? 'PAN Selected ✓' : 'Upload PAN'}</span>
                    <Upload size={18} className="text-[#1174d6] group-hover:scale-110 transition-transform" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
                <div className="md:col-span-8">
                  <label className={labelClass}>Aadhaar Card Number</label>
                  <input type="text" className={inputClass} placeholder="1234 5678 9012" name="aadhaarCardNo" value={formData.aadhaarCardNo} onChange={handleChange} />
                </div>
                <div className="md:col-span-4">
                  <label className={labelClass}>Aadhaar Image</label>
                  <input type="file" id="aadhaar-file" name="aadhaarCard" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="aadhaar-file" className={uploadLabelClass}>
                    <span className="text-slate-500 text-sm">{previews.aadhaarCard ? 'Aadhaar Selected ✓' : 'Upload Aadhaar'}</span>
                    <Upload size={18} className="text-[#1174d6] group-hover:scale-110 transition-transform" />
                  </label>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={sectionClass}>
                <h5 className={sectionTitleClass}><MapPin size={20} /> Local Address</h5>
                <div className="space-y-4">
                  <input type="text" className={inputClass} placeholder="Full Address Line" name="localAddressLine2" value={formData.localAddressLine2} onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" className={inputClass} placeholder="City" name="localCity" value={formData.localCity} onChange={handleChange} />
                    <input type="text" className={inputClass} placeholder="State" name="localState" value={formData.localState} onChange={handleChange} />
                  </div>
                  <input type="text" className={inputClass} placeholder="Pin Code" name="localPinCode" value={formData.localPinCode} onChange={handleChange} />
                </div>
              </div>

              <div className={sectionClass}>
                <h5 className={sectionTitleClass}><MapPin size={20} /> Permanent Address</h5>
                <div className="space-y-4">
                  <input type="text" className={inputClass} placeholder="Full Address Line" name="permanentAddressLine1" value={formData.permanentAddressLine1} onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" className={inputClass} placeholder="City" name="permanentCity" value={formData.permanentCity} onChange={handleChange} />
                    <input type="text" className={inputClass} placeholder="State" name="permanentState" value={formData.permanentState} onChange={handleChange} />
                  </div>
                  <input type="text" className={inputClass} placeholder="Pin Code" name="permanentPinCode" value={formData.permanentPinCode} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className={sectionClass}>
              <h5 className={sectionTitleClass}><Phone size={20} /> Contact Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                  <input type="email" className={inputClass} placeholder="john@example.com" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="relative">
                  <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" className={inputClass} placeholder="9876543210" name="mobile1" value={formData.mobile1} onChange={handleChange} required />
                </div>
                <div className="relative">
                  <label className={labelClass}>Alternative Mobile</label>
                  <input type="tel" className={inputClass} placeholder="9000000000" name="mobile2" value={formData.mobile2} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Payment Details */}
           

            {/* Submission */}
            <div className="text-center py-6">
              {loading && (
                <div className="max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1174d6] uppercase tracking-widest mb-2">
                    <span>Processing Application</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1174d6] to-blue-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center justify-center gap-3 w-full max-w-md px-10 py-4 bg-gradient-to-r from-[#1174d6] to-[#0a5ab8] text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(17,116,214,0.35)] hover:shadow-[0_15px_40px_rgba(17,116,214,0.45)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
              <p className="mt-4 text-slate-400 text-[10px] font-medium uppercase tracking-[0.1em]">
                Secure 256-bit SSL encrypted application
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default JoinAsPartner;
