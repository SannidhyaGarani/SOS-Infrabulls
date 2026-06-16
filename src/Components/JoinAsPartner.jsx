import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Briefcase, MapPin, Phone,
  Camera, Upload, Loader2, CheckCircle2, CreditCard
} from 'lucide-react';
import { db } from './Firebase';
import { collection, addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { createAgentAccount, generateAgentPassword } from './Firebase/agentHelpers';
import { sendCredentialsViaEmail } from './Firebase/emailService';
import { uploadToCloudinary } from './Firebase/cloudinaryService';

const inputClass =
  'w-full h-12 px-4 rounded-lg border border-[#e1e8f0] bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1174d6]/30 focus:border-[#1174d6] transition-colors';
const labelClass = 'block text-xs text-slate-500 mb-1';
const sectionClass = 'p-4 md:p-6 rounded-xl bg-[#f8faff] border border-[#e1e8f0] mb-6';
const sectionTitleClass =
  'text-sm md:text-base font-bold text-[#0A2540] mb-5 flex items-center gap-2.5 uppercase tracking-wide [&_svg]:text-[#1174d6]';
const uploadLabelClass =
  'w-full h-12 px-4 rounded-lg border border-[#e1e8f0] bg-white flex items-center justify-between cursor-pointer hover:border-[#1174d6] transition-colors';

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
        <div className="relative w-full mt-12 pt-4">
            <div className="flex justify-center w-full -mb-5 z-10">
                <img
                    src="/img/logo.jpeg"
                    alt="Mahanta Group Logo"
                    className="h-[150px] w-auto transition-transform duration-300 hover:scale-105"
                />
            </div>

            <section className="max-w-6xl mx-auto px-4 py-10 md:py-12">
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#1174d6] bg-[#1174d6]/10">
                        PARTNER PROGRAM
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A2540] mt-3">
                        Join as <span className="text-[#1174d6]">Partner</span>
                    </h1>
                    <p className="text-slate-500 mt-2 max-w-xl mx-auto">
                        Empower your future with SOS Infrabulls&apos;s premier partnership program.
                    </p>
                </div>

                {submitted && (
                    <div
                        className="flex items-center justify-center gap-2 mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
                        role="alert"
                    >
                        <CheckCircle2 size={20} />
                        <span>Your application has been submitted successfully!</span>
                    </div>
                )}

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#e1e8f0] p-6 md:p-10">
                        <form onSubmit={handleSubmit}>
                            <div className={sectionClass}>
                                <h5 className={sectionTitleClass}><Briefcase size={20} /> Basic Information</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Application Date</label>
                                        <input type="date" className={inputClass} name="date" value={formData.date} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Your Photograph</label>
                                        <input type="file" id="photo" name="photograph" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        <label htmlFor="photo" className={uploadLabelClass}>
                                            <span className="text-slate-500">{previews.photograph ? 'Photo Selected ✓' : 'Upload Photograph'}</span>
                                            <Camera size={18} className="text-[#1174d6]" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={sectionClass}>
                                <h5 className={sectionTitleClass}><User size={20} /> Applicant Name</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input type="text" className={inputClass} placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    <input type="text" className={inputClass} placeholder="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                                    <input type="text" className={inputClass} placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>

                                <h6 className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Father / Husband Details</h6>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                    <input type="text" className={inputClass} placeholder="First Name" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} />
                                    <input type="text" className={inputClass} placeholder="Middle Name" name="fatherHusbandMiddleName" value={formData.fatherHusbandMiddleName} onChange={handleChange} />
                                    <input type="text" className={inputClass} placeholder="Last Name" name="fatherHusbandLastName" value={formData.fatherHusbandLastName} onChange={handleChange} />
                                </div>
                            </div>

                            <div className={sectionClass}>
                                <h5 className={sectionTitleClass}><User size={20} /> Personal Details</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className={labelClass}>Date of Birth</label>
                                        <input type="date" className={inputClass} name="dob" value={formData.dob} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>PAN Card Number</label>
                                        <input type="text" className={inputClass} placeholder="ABCDE1234F" name="panCardNo" value={formData.panCardNo} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>PAN Card Image</label>
                                        <input type="file" id="pan-file" name="panCard" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        <label htmlFor="pan-file" className={uploadLabelClass}>
                                            <span className="text-slate-500 text-sm">{previews.panCard ? 'PAN Selected ✓' : 'Upload PAN'}</span>
                                            <Upload size={18} className="text-[#1174d6]" />
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
                                    <div className="md:col-span-8">
                                        <label className={labelClass}>Aadhaar Card Number</label>
                                        <input type="text" className={inputClass} placeholder="1234 5678 9012" name="aadhaarCardNo" value={formData.aadhaarCardNo} onChange={handleChange} required />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className={labelClass}>Aadhaar Card Image</label>
                                        <input type="file" id="aadhaar-file" name="aadhaarCard" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        <label htmlFor="aadhaar-file" className={uploadLabelClass}>
                                            <span className="text-slate-500 text-sm">{previews.aadhaarCard ? 'Aadhaar Selected ✓' : 'Upload Aadhaar'}</span>
                                            <Upload size={18} className="text-[#1174d6]" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className={`${sectionClass} mb-0`}>
                                    <h5 className={sectionTitleClass}><MapPin size={20} /> Local Address</h5>
                                    <div className="space-y-3">
                                        <input type="text" className={inputClass} placeholder="Address Line" name="localAddressLine2" value={formData.localAddressLine2} onChange={handleChange} required />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <input type="text" className={inputClass} placeholder="City" name="localCity" value={formData.localCity} onChange={handleChange} required />
                                            <input type="text" className={inputClass} placeholder="State" name="localState" value={formData.localState} onChange={handleChange} required />
                                            <input type="text" className={inputClass} placeholder="Pin Code" name="localPinCode" value={formData.localPinCode} onChange={handleChange} required />
                                        </div>
                                    </div>
                                </div>

                                <div className={`${sectionClass} mb-0`}>
                                    <h5 className={sectionTitleClass}><MapPin size={20} /> Permanent Address</h5>
                                    <div className="space-y-3">
                                        <input type="text" className={inputClass} placeholder="Address Line" name="permanentAddressLine1" value={formData.permanentAddressLine1} onChange={handleChange} required />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <input type="text" className={inputClass} placeholder="City" name="permanentCity" value={formData.permanentCity} onChange={handleChange} required />
                                            <input type="text" className={inputClass} placeholder="State" name="permanentState" value={formData.permanentState} onChange={handleChange} required />
                                            <input type="text" className={inputClass} placeholder="Pin Code" name="permanentPinCode" value={formData.permanentPinCode} onChange={handleChange} required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={sectionClass}>
                                <h5 className={sectionTitleClass}><Phone size={20} /> Contact Details</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input type="email" className={inputClass} placeholder="Email ID" name="email" value={formData.email} onChange={handleChange} required />
                                    <input type="tel" className={inputClass} placeholder="Mobile 1" name="mobile1" value={formData.mobile1} onChange={handleChange} required />
                                    <input type="tel" className={inputClass} placeholder="Mobile 2 (Opt)" name="mobile2" value={formData.mobile2} onChange={handleChange} />
                                </div>
                            </div>

                            <div className={sectionClass}>
                                <h5 className={sectionTitleClass}><CreditCard size={20} /> Payment Details (Registration Fee)</h5>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-7">
                                        <p className="text-slate-500 text-sm mb-3">
                                            To complete your partnership registration, please scan the QR code to pay the processing fee.
                                            Once paid, your application will be reviewed by our team.
                                        </p>
                                        <div className="bg-[#1174d6]/5 p-4 rounded-lg border-l-4 border-[#1174d6] text-sm text-slate-600">
                                            <span className="font-bold text-[#1174d6]">Note:</span> Please mention your mobile number in the transaction note for faster verification.
                                        </div>
                                    </div>
                                    <div className="md:col-span-5 flex justify-center">
                                        <div className="relative inline-block bg-white p-6 rounded-2xl shadow-lg border border-[#e1e8f0] mt-4 md:mt-0">
                                            <img src="/img/qr.jpeg" alt="UPI QR Code" className="w-[200px] h-[200px] md:w-[260px] md:h-[260px] object-contain rounded-lg" />
                                            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#1174d6] text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-md shadow-[#1174d6]/30">
                                                Scan to Pay
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-6">
                                {loading && (
                                    <div className="w-full h-5 rounded-full bg-slate-200 overflow-hidden mb-4">
                                        <div
                                            className="h-full bg-[#1174d6] transition-all duration-300 flex items-center justify-center text-white text-xs font-medium"
                                            style={{ width: `${uploadProgress}%` }}
                                            role="progressbar"
                                            aria-valuenow={uploadProgress}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        >
                                            {uploadProgress}%
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="w-full px-5 py-3 bg-[#1174d6] hover:bg-[#0d5fb3] text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 size={20} className="animate-spin" />
                                            {uploadProgress < 100 ? `Uploading Documents (${uploadProgress}%)` : 'Finalizing Registration...'}
                                        </span>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default JoinAsPartner;
