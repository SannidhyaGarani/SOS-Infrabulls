import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, ShieldAlert, Sparkles, Award } from "lucide-react";

export default function MissionVision() {
  const luxuryTransition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] };

  const valuesAcronym = [
    { letter: "T", core: "RUTH" },
    { letter: "R", core: "ESPONSIBLE" },
    { letter: "U", core: "NDERSTANDING" },
    { letter: "S", core: "KILLED" },
    { letter: "T", core: "EAMWORK" }
  ];

  return (
    <section className="relative py-24 bg-white text-neutral-900 overflow-hidden font-sans border-t border-neutral-100">
      {/* Structural Accent Geometry */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50/50 via-transparent to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-neutral-50 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* First Section: Executive Summary Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pb-24">
          
          {/* Left Column: Descriptive Profile */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={luxuryTransition}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            <div className="space-y-2">
              <span className="text-[#1174d6] text-xs font-bold tracking-[0.25em] uppercase block">
                Corporate Profile
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">
                Who We Are
              </h2>
              <div className="w-12 h-[3px] bg-[#1174d6] rounded-full mt-3" />
            </div>

            <div className="space-y-5 text-[15px] leading-relaxed text-neutral-500 font-normal">
              <p>
                At SOS Infrabulls International Pvt. Ltd., we believe that owning a property is not just an investment, but it's a dream come true for many. Therefore, we are committed to making the process of finding your dream property as hassle-free and easy as possible
              </p>
              <p>
                Our team of experts understands the complexities of the real estate market, and we use our experience to guide you every step of the way. Whether you are looking for a residential property, commercial property, or industrial land, we have a wide range of options to choose from.
              </p>
              <p className="text-neutral-600 font-medium border-l-2 border-neutral-100 pl-4 py-1 bg-neutral-50/50 rounded-r-xl">
                We are dedicated to providing exceptional customer service, and our focus is always on ensuring that our clients are satisfied with their purchases. With our fast and easy search process, you can find your dream property quickly and easily.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Architectural Vista Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={luxuryTransition}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100 group">
              <div className="absolute inset-0 bg-neutral-900/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src="https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTXIiG4YTApc5IJqdgBX-RLG1P6bYn5kx-HVz-n27HUSc1xtytqAwOaCQ6Vs6J2oal2Cf7zBXv03gmk0pE" 
                alt="SOS Infrabulls Premium Structural Development" 
                className="w-full h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Geometric Accent Frame */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-[#1174d6]/20 rounded-bl-xl -z-10" />
          </motion.div>

        </div>

        {/* Strategic Directives Grid (Mission & Vision) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
          
          {/* Mission Anchor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...luxuryTransition, delay: 0.1 }}
            className="relative bg-neutral-50/60 border border-neutral-100 rounded-2xl p-8 lg:p-10 hover:bg-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.04)] transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1174d6] flex items-center justify-center mb-6 border border-blue-100/60 group-hover:bg-[#1174d6] group-hover:text-white transition-colors duration-300">
              <Target size={22} strokeWidth={1.8} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">
              Our Mission
            </h3>
            <p className="text-sm md:text-[15px] leading-relaxed text-neutral-500 font-normal">
              To make everyone's dream of owning a home a reality, by providing easy and hassle-free access to a wide range of real estate options.
            </p>
          </motion.div>

          {/* Vision Anchor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...luxuryTransition, delay: 0.2 }}
            className="relative bg-neutral-50/60 border border-neutral-100 rounded-2xl p-8 lg:p-10 hover:bg-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.04)] transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1174d6] flex items-center justify-center mb-6 border border-blue-100/60 group-hover:bg-[#1174d6] group-hover:text-white transition-colors duration-300">
              <Eye size={22} strokeWidth={1.8} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">
              Our Vision
            </h3>
            <p className="text-sm md:text-[15px] leading-relaxed text-neutral-800 font-semibold italic bg-white border border-neutral-100 rounded-xl p-4 shadow-sm">
              “ To build 10,000 Success stories & 20,000 satisfy client with successful delivery In 2027 ”
            </p>
          </motion.div>

        </div>

        {/* Corporate Ideology Section (Our Value Matrix) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={luxuryTransition}
          className="border-t border-neutral-100 pt-16"
        >
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[#1174d6] text-xs font-bold tracking-[0.25em] uppercase block mb-2">
              Foundational Pillars
            </span>
            <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Our Value
            </h3>
            <div className="w-8 h-[2.5px] bg-[#1174d6] rounded-full mx-auto mt-2.5" />
          </div>

          {/* Integrated Trust Acronym Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 xl:gap-4">
            {valuesAcronym.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ ...luxuryTransition, delay: index * 0.05 }}
                className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[110px] hover:border-[#1174d6]/30 hover:bg-white hover:shadow-sm transition-all duration-300"
              >
                <div className="text-2xl font-black text-neutral-900 tracking-tight flex items-baseline">
                  <span className="text-[#1174d6] text-3xl font-extrabold">{item.letter}</span>
                  <span className="text-xs font-bold text-neutral-400 tracking-wider ml-0.5 relative -top-0.5">
                    -{item.core}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}