import { Link } from "react-router-dom";
import {
  Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck,
  GraduationCap, ArrowUpRight, Send
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 pb-20"
      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
    >
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#0F2447] via-[#162E56] to-[#1E3A8A] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/60 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
            <Phone className="w-3.5 h-3.5" />
            <span>{t.contactBadge || "Contact & Campus"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-white">
            {t.contactTitle || "We Are Here to Support Your Learning Journey"}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed">
            {t.contactDesc ||
              "Have questions about courses, cohort schedules, or admissions? Reach out to our academic team in Addis Ababa."}
          </p>
        </div>
      </section>

      {/* 2. Contact Information Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Official Phone Numbers */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Phone className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">Call or WhatsApp</h2>
              <p className="text-xs text-slate-500 mt-0.5">Admissions & Student Advisory Support</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Primary Helpline:</span>
                <a
                  href="tel:0981329252"
                  className="text-base font-bold text-blue-900 hover:text-amber-600 transition-colors"
                >
                  0981329252
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Secondary Line:</span>
                <a
                  href="tel:0972755976"
                  className="text-base font-bold text-blue-900 hover:text-amber-600 transition-colors"
                >
                  0972755976
                </a>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="tel:0981329252"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Primary Line</span>
              </a>
            </div>
          </div>

          {/* Card 2: Email & Support */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
              <Mail className="w-6 h-6 text-blue-800" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">Email Inquiries</h2>
              <p className="text-xs text-slate-500 mt-0.5">General & Academic Communications</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Official Inquiries:</span>
                <a
                  href="mailto:info@ethtechbridgeacademy.com"
                  className="text-sm font-bold text-blue-900 hover:text-cyan-700 transition-colors break-all"
                >
                  info@ethtechbridgeacademy.com
                </a>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="mailto:info@ethtechbridgeacademy.com"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </div>

          {/* Card 3: Operating Hours & Campus */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">Hours & Availability</h2>
              <p className="text-xs text-slate-500 mt-0.5">Office & Online Platform Schedule</p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{t.contactOfficeHours || "Monday – Saturday: 8:30 AM – 5:30 PM (EAT)"}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-emerald-700 font-semibold">
                  {t.contactOnlineNotice || "Online Platform: Available 24/7 nationwide"}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/apply"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>{t.registerApplyNow || "Register / Apply Now"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Campus Locations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Campus & Tutorial Locations</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              Addis Ababa Tutorial Centers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We provide tutoring and physical learning centers in key residential areas across Addis Ababa for convenient student access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-sm font-bold text-slate-900">CMC Campus</p>
              <p className="text-xs text-slate-500">Grades 1–12 & STEM Tutorial</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-sm font-bold text-slate-900">Summit Campus</p>
              <p className="text-xs text-slate-500">Academic & Tech Foundations</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-sm font-bold text-slate-900">Ayat & Semit Center</p>
              <p className="text-xs text-slate-500">Small Group STEM Tutorials</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-sm font-bold text-slate-900">72 Campus</p>
              <p className="text-xs text-slate-500">High School Exam Prep & Labs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

