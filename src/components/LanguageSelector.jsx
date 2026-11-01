import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function LanguageSelector({ variant = "light" }) {
  const { lang, setLang, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = availableLanguages.find((l) => l.code === lang) || availableLanguages[0];

  const isDark = variant === "dark";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
          isDark
            ? "bg-white/10 hover:bg-white/20 text-white border border-white/15"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200"
        }`}
        title="Select Language / ቋንቋ ይምረጡ / Afaan Filadhaa"
        aria-label="Change Language"
      >
        <Globe className={`w-3.5 h-3.5 ${isDark ? "text-amber-300" : "text-blue-900"}`} />
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden uppercase">{currentLang.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            Language / ቋንቋ / Afaan
          </div>
          {availableLanguages.map((l) => {
            const active = lang === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                  active ? "text-blue-900 font-bold bg-blue-50/70" : "text-slate-700"
                }`}
              >
                <span>{l.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-blue-900" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

