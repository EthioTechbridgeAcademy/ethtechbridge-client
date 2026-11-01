import { Link } from "react-router-dom";
import {
  Code2, ShieldCheck, Award, GraduationCap, CheckCircle2,
  MapPin, Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function CoreStandardsSection() {
  const { t } = useLanguage();

  const pillars = [
    {
      id: "pillar-1",
      icon: Code2,
      title: t.pillar1Title || "Hands-On & Industry Aligned",
      description: t.pillar1Desc || "Learn through interactive exercises, practical coding assignments, and guided lessons rather than passive listening.",
      tag: "Applied Learning"
    },
    {
      id: "pillar-2",
      icon: ShieldCheck,
      title: t.pillar2Title || "Safe, Modern & Accessible",
      description: t.pillar2Desc || "Optimized for mobile phones and low-bandwidth connections, with high digital security standards and verified student access.",
      tag: "Digital Infrastructure"
    },
    {
      id: "pillar-3",
      icon: Award,
      title: t.pillar3Title || "Verifiable Digital Credentials",
      description: t.pillar3Desc || "Earn digital certificates with online verification codes, demonstrating verified skills for academic and career advancement.",
      tag: "Verified Achievement"
    }
  ];

  return (
    <section className="bg-slate-50 border-b border-slate-200/80 py-14 sm:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>{t.whyChooseBadge || "Core Standards"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t.whyChooseTitle || "Built for Excellence, Integrity & Practical Impact"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.whyChooseSubtitle || "Every program at Ethio Techbridge Academy is designed to bridge academic ambition with world-class skills."}
          </p>
        </div>

        {/* 3 Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 shadow-xs">
                    <Icon className="w-6 h-6 text-blue-800" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                      {pillar.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tutoring Center Spotlight Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0F2447] via-[#162E56] to-[#1E3A8A] text-white p-6 sm:p-8 border border-blue-900/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t.tutoringBadge || "Addis Ababa Tutorial Center"}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight">
              {t.tutoringTitle || "Grade 1–12 In-Person Tutoring & STEM Labs"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {t.tutoringDesc || "Intensive academic tutoring in Mathematics, Physics, Chemistry, and English serving students in CMC, Summit, 72, and Ayat."}
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-amber-300 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>CMC • Summit • Ayat • Semit • 72</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to="/apply"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all text-center"
            >
              {t.registerApplyNow || "Register / Apply Now"}
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all text-center"
            >
              {t.navCourses || "Courses"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

