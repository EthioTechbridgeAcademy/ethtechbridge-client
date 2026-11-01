import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Code2, Award, Sparkles, CheckCircle2, MapPin,
  Building2, ArrowRight
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getPublicGoogleFormUrl } from "../utils/googleForm.js";

const SCENE_DURATION_MS = 15000; // 15-second automatic scene rotation

// Lightweight, smooth typewriter effect for the golden headline
function TypewriterText({ text, speed = 40 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setShowCursor(true);
    let index = 0;

    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 2500);
        }
      }, speed);

      return () => clearInterval(interval);
    }, 120);

    return () => clearTimeout(startDelay);
  }, [text, speed]);

  return (
    <span className="inline-block relative">
      <span>{displayedText}</span>
      {showCursor && (
        <span
          className="inline-block w-[3px] h-[0.82em] bg-amber-400 ml-1.5 align-middle animate-pulse shadow-sm shadow-amber-400/80"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export default function MotionHero({ onOpenTutoringModal }) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [currentScene, setCurrentScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef(null);

  const googleFormUrl = getPublicGoogleFormUrl();

  const scenes = [
    // Scene 1 — Live Campus & Brighter Path to Learning (Default First Clip)
    {
      id: "path",
      bgImage: "/campus-quad.jpg",
      badge: t.heroLiveBadge || "ADMISSIONS OPEN 2026/27 • Grades 1–12 & Tech Academy",
      badgeColor: "bg-amber-500/20 border-amber-400/50 text-amber-300",
      accentGlow: "from-blue-600/20 via-amber-500/10 to-transparent",
      titleLine1: t.heroLiveTitle1 || "Ethio Techbridge Academy",
      titleLine2: t.heroLiveTitle2 || "A brighter path to learning",
      description: t.heroLiveSubtitle || "We empower ambitious Ethiopian students through modern academic tutorials and cutting-edge digital technology education to bridge lifelong knowledge into transformative future opportunities.",
      icon: Sparkles
    },

    // Scene 2 — Security and Dedicated Trust
    {
      id: "security",
      bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop",
      badge: t.heroScene1Badge || "Security & Trust • TLS Protected",
      badgeColor: "bg-blue-500/20 border-blue-400/50 text-blue-200",
      accentGlow: "from-blue-600/20 via-emerald-500/10 to-transparent",
      titleLine1: t.academyName || "Ethio Techbridge Academy",
      titleLine2: t.heroScene1Title || "Modern Security & Dedicated Education",
      description: t.heroScene1Desc || "Safe, authenticated student portals with verified credentials and structured learning pipelines.",
      icon: ShieldCheck
    },

    // Scene 3 — Professional Learning and Practical Study
    {
      id: "study",
      bgImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1920&auto=format&fit=crop",
      badge: t.heroScene2Badge || "Curriculum Aligned • Practical Engineering",
      badgeColor: "bg-cyan-500/20 border-cyan-400/50 text-cyan-200",
      accentGlow: "from-blue-500/20 via-amber-500/10 to-transparent",
      titleLine1: t.academyName || "Ethio Techbridge Academy",
      titleLine2: t.heroScene2Title || "Hands-on Coding & Academic Tutorials",
      description: t.heroScene2Desc || "Learn practical software development, full-stack web applications, Python programming, and foundational digital literacy with real lesson exercises.",
      icon: Code2
    },

    // Scene 4 — Student Achievement and Success
    {
      id: "success",
      bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop",
      badge: t.heroScene3Badge || "Student Achievement • Verifiable Certificates",
      badgeColor: "bg-amber-500/20 border-amber-400/50 text-amber-300",
      accentGlow: "from-amber-500/20 via-orange-500/10 to-transparent",
      titleLine1: t.academyName || "Ethio Techbridge Academy",
      titleLine2: t.heroScene3Title || "Building Future Opportunities",
      description: t.heroScene3Desc || "Earn tamper-proof completion certificates verifiable online, equipping you for tech careers and advanced academic pathways.",
      icon: Award
    }
  ];

  const current = scenes[currentScene];

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsPaused(true);
      }
      const handler = (e) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) setIsPaused(true);
      };
      mediaQuery.addEventListener?.("change", handler);
      return () => mediaQuery.removeEventListener?.("change", handler);
    }
  }, []);

  // Auto-advance scenes every 15 seconds continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, SCENE_DURATION_MS);

    return () => clearInterval(interval);
  }, [scenes.length]);

  const handleApplyClick = (e) => {
    if (googleFormUrl) {
      window.open(googleFormUrl, "_blank", "noopener,noreferrer");
    } else if (onOpenTutoringModal) {
      e.preventDefault();
      onOpenTutoringModal();
    }
  };

  return (
    <section
      className="relative overflow-hidden text-white pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-slate-200/20"
      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
      aria-roledescription="carousel"
      aria-label="Academy Overview"
    >
      {/* 1. DYNAMIC RELEVANT BACKGROUND IMAGES WITH CROSSFADE MOTION */}
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className={`absolute inset-0 transition-opacity ${
            prefersReducedMotion ? "duration-0" : "duration-1000 ease-in-out"
          } ${
            currentScene === index ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
          }`}
          aria-hidden={currentScene !== index}
        >
          <img
            src={scene.bgImage}
            alt={scene.titleLine2 || scene.id}
            className={`w-full h-full object-cover transform transition-transform filter blur-[2px] ${
              prefersReducedMotion ? "scale-100" : "duration-[15000ms] ease-out " + (currentScene === index ? "scale-105" : "scale-100")
            }`}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop";
            }}
          />
          {/* Semi-Transparent Oxford Blue Overlay: background image remains visible while text contrast remains high */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2447]/85 via-[#0F2447]/70 to-[#0F2447]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2447]/80 via-transparent to-[#0F2447]/30" />
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ACTIVE SCENE CONTENT */}
        <div className="max-w-3xl lg:max-w-4xl space-y-6 text-center lg:text-left transition-all duration-500 py-4 sm:py-8">
          {/* Top Row: Admissions Open Badge */}
          <div className="flex items-center justify-center lg:justify-start">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-black/40 backdrop-blur-md text-amber-300 text-xs font-bold tracking-wide shadow-xs"
            >
              <span>{current.badge}</span>
            </div>
          </div>

          {/* Main Headline with Clean Modern Tech Typography & Golden Typewriter Effect */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] text-white drop-shadow-sm font-sans">
            <span className="block text-white">{current.titleLine1}</span>
            <span className="block text-amber-400 font-extrabold mt-1 min-h-[1.25em]">
              <TypewriterText key={currentScene} text={current.titleLine2} speed={42} />
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-xs">
            {current.description}
          </p>

          {/* PRIMARY CALLS TO ACTION Matching Live Site */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {/* Primary Apply Button */}
            <Link
              to="/apply"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>{t.registerApplyNow || "Register / Apply Now"}</span>
            </Link>

            {/* Secondary Visit Campus Button */}
            <Link
              to="/courses"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-md transition-all text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <Building2 className="w-4 h-4 text-slate-300" />
              <span>{t.heroVisitCampus}</span>
            </Link>
          </div>

          {/* Key Trust Signals Matching Live Site */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/15 text-xs sm:text-sm text-slate-200 font-medium">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.heroTrustGradeMastery}</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.heroTrustDigitalSkills}</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.heroTrustLocations}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
