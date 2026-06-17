import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "../../Icons";
import ImageBreadcrumb from "../ImageBreadcrumb";

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) { alert("Please agree to the Terms & Conditions to proceed."); return; }
    setIsSubmitting(true);
    emailjs.send("service_a3cw276g", "template_y529wi6",
      { name: formData.name, email: formData.email, phone: formData.phone, subject: formData.subject, message: formData.message },
      "vEvugozjO3aQJD-Ic"
    ).then(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setAgreed(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, (error) => {
      alert("Failed to send message. Try again!");
      console.error(error);
      setIsSubmitting(false);
    });
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-[#1174d6] focus:ring-2 focus:ring-[#1174d6]/10 transition-all duration-200 bg-white";

  return (
    <div className="min-h-screen bg-white">
      <ImageBreadcrumb
        title="Contact Us"
        subtitle="We'd love to hear from you. Fill out the form and we'll get back to you shortly."
        crumbs={[{ label: 'Contact' }]}
      />

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#1174d6]/10 text-[#1174d6] text-xs font-bold tracking-widest uppercase mb-4">Contact Us</span>
            <h1
              className="text-slate-900 font-light mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Let's <strong className="font-bold text-[#1174d6]">Talk</strong>
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">We'd love to hear from you. Fill out the form and we'll get back soon.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8">
              <h4 className="text-slate-800 font-bold text-lg mb-6">Send a Message</h4>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <CheckCircle size={48} className="text-emerald-500" />
                  <h3 className="text-slate-800 font-bold text-xl">Message Sent!</h3>
                  <p className="text-slate-400 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="text" className={inputCls} placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <input type="email" className={inputCls} placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input type="tel" className={inputCls} placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                    <input type="text" className={inputCls} placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} />
                  </div>
                  <textarea className={`${inputCls} resize-none`} placeholder="Your Message" rows="5" name="message" value={formData.message} onChange={handleChange} required />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1174d6] accent-[#1174d6]"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      required
                    />
                    <span className="text-slate-500 text-sm">
                      I agree to the{" "}
                      <Link to="/terms" target="_blank" className="text-[#1174d6] font-semibold hover:underline">Terms & Conditions</Link>
                      {" "}and{" "}
                      <Link to="/privacy" target="_blank" className="text-[#1174d6] font-semibold hover:underline">Privacy Policy</Link>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !agreed}
                    className="flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white text-xs font-bold tracking-[0.18em] uppercase rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send size={14} className="ml-1" />
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-[#0A2540] to-[#0f3460] rounded-2xl p-8 text-white flex flex-col gap-8">
              <div>
                <h4 className="font-bold text-lg mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Contact Details</h4>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#1174d6]/20 border border-[#1174d6]/30 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-[#1174d6]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-1">Office Address</p>
                      <p className="text-white/80 text-sm leading-relaxed">405 - Shagun Tower, AB Road<br />Indore, 452001</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#1174d6]/20 border border-[#1174d6]/30 flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-[#1174d6]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-1">Phone</p>
                      <a href="tel:07314909915" className="text-white/80 text-sm hover:text-white transition-colors">0731-4909915</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#1174d6]/20 border border-[#1174d6]/30 flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-[#1174d6]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-1">Email</p>
                      <a href="mailto:info@mahanta.org.in" className="text-white/80 text-sm hover:text-white transition-colors">info@mahanta.org.in</a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61581331928145", label: "Facebook" },
                    { icon: Instagram, href: "https://www.instagram.com/mahantagroup/", label: "Instagram" },
                    { icon: Linkedin, href: "https://www.linkedin.com/company/mahanta-group/", label: "LinkedIn" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#1174d6] hover:border-[#1174d6] hover:text-white transition-all duration-200"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map embed */}
              <div className="rounded-xl overflow-hidden flex-1 min-h-[160px]">
                <iframe
                  title="Office Location"
                  src="https://maps.google.com/maps?q=Shagun+Tower+AB+Road+Indore&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 160 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSection;
