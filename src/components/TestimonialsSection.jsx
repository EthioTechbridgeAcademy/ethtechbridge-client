import { Star } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function TestimonialsSection() {
  const { t } = useLanguage();

  const testimonials = [
    {
      id: "test-1",
      name: t.testimonial1Author || "Yared Tesfaye",
      role: t.testimonial1Role || "Web Development Track Student, Addis Ababa",
      quote:
        t.testimonial1Quote ||
        "The structured curriculum and clear lesson notes transformed how I understand coding. I went from zero programming background to deploying my first web application.",
      rating: 5,
      avatar: "YT"
    },
    {
      id: "test-2",
      name: t.testimonial2Author || "Sara Hailu",
      role: t.testimonial2Role || "Academy Parent & Guardian, CMC Campus",
      quote:
        t.testimonial2Quote ||
        "As a parent in CMC, having both high-standard digital curriculum and dedicated tutor support gave my daughter the academic edge and tech curiosity she needed.",
      rating: 5,
      avatar: "SH"
    },
    {
      id: "test-3",
      name: t.testimonial3Author || "Bikila Gemechu",
      role: t.testimonial3Role || "Python & Computing Student, Regional Cohort",
      quote:
        t.testimonial3Quote ||
        "Ethio Techbridge Academy works seamlessly on my smartphone during my daily commute. The quizzes test real problem solving instead of mere rote memorization.",
      rating: 5,
      avatar: "BG"
    },
    {
      id: "test-4",
      name: "Helen Alemayehu",
      role: "Digital Literacy & Office Productivity Graduate",
      quote:
        "The step-by-step guidance allowed me to gain foundational computer skills at my own pace. The verifiable completion certificate helped me secure my internship.",
      rating: 5,
      avatar: "HA"
    }
  ];

  // Duplicate list for seamless infinite horizontal scroll
  const marqueeCards = [...testimonials, ...testimonials];

  return (
    <section className="bg-slate-50 border-b border-slate-200/80 py-16 scroll-mt-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 px-3.5 py-1 rounded-full border border-cyan-200">
          {t.testimonialsBadge || "Learner Stories"}
        </span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          {t.testimonialsTitle || "Trusted by Learners Across Ethiopia"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.testimonialsSubtitle ||
            "Discover how students, graduates, and parents are achieving their goals with Ethio Techbridge Academy."}
        </p>
      </div>

      {/* HORIZONTAL SLOW-MOTION MARQUEE (Right to Left) */}
      <div className="relative mt-10 w-full overflow-hidden">
        {/* Left & Right gradient fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />

        <div className="animate-marquee-slow flex items-stretch gap-6 py-2">
          {marqueeCards.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="w-[320px] sm:w-[380px] shrink-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: card.rating }).map((_, starIdx) => (
                    <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{card.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-900 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {card.avatar}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{card.name}</h4>
                  <p className="text-[11px] text-slate-500">{card.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
