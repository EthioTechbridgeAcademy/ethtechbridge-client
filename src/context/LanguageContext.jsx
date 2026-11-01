import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations/translations.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem("eta_lang") || "en";
    } catch {
      return "en";
    }
  });

  const setLang = (newLang) => {
    if (translations[newLang]) {
      setLangState(newLang);
      try {
        localStorage.setItem("eta_lang", newLang);
      } catch {}
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("eta_lang", lang);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Active translation dictionary
  const t = translations[lang] || translations.en;

  const value = {
    lang,
    setLang,
    t,
    availableLanguages: [
      { code: "en", label: "English" },
      { code: "am", label: "አማርኛ" },
      { code: "om", label: "Afaan Oromoo" }
    ]
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback so components never throw or crash the app
    let fallbackLang = "en";
    try {
      fallbackLang = localStorage.getItem("eta_lang") || "en";
    } catch {}
    return {
      lang: fallbackLang,
      setLang: () => {},
      t: translations[fallbackLang] || translations.en,
      availableLanguages: [
        { code: "en", label: "English" },
        { code: "am", label: "አማርኛ" },
        { code: "om", label: "Afaan Oromoo" }
      ]
    };
  }
  return context;
}
