import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap, Mail, Phone, MapPin, ExternalLink,
  ShieldCheck, Award, Clock, ArrowUpRight, CheckCircle2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getPublicGoogleFormUrl } from "../utils/googleForm.js";

export default function Footer() {
  const { t } = useLanguage();
  const googleFormUrl = getPublicGoogleFormUrl();
  const location = useLocation();
  const isRegistrationPage = location.pathname === "/apply" || location.pathname === "/register";

  return (
    <footer
      id="contact"
      className="bg-slate-950 text-slate-300 border-t border-slate-800/80 scroll-mt-12"
      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 4 POLISHED COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          {/* Col 1: About the Academy (id="about") */}
          <div id="about" className="space-y-4 scroll-mt-20">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Ethio Techbridge Academy"
                className="w-10 h-10 object-contain rounded-full shadow-xs"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">Ethio Techbridge.</span>
                <span className="block text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  ACADEMY
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.footerMission}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Hybrid Online & In-Person Learning</span>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs font-semibold">
              <Link to="/about" className="text-amber-400 hover:text-amber-300 transition-colors">
                {t.navAbout || "About"} →
              </Link>
              <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                {t.navContact || "Contact"} →
              </Link>
            </div>
          </div>

          {/* Col 2: Academic Programs & Courses */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              {t.footerCoursesHeading}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <span>{t.catalogTitle}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/courses?category=web-development" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {t.webDevTitle}
                </Link>
              </li>
              <li>
                <Link to="/courses?category=programming" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {t.progTitle}
                </Link>
              </li>
              <li>
                <Link to="/courses?category=digital-literacy" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {t.digLitTitle}
                </Link>
              </li>
              <li>
                <Link to="/courses?category=career-skills" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {t.careerTitle}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Hub & Portal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              {t.footerStudentHubHeading}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {t.navDashboard}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/courses" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {t.navMyCourses}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  {t.navSignIn}
                </Link>
              </li>
              {!isRegistrationPage && (
                <li>
                  <Link to="/apply" className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {t.registerApplyNow}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/certificates/ETA-DEMO-2026" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Verify Certificate</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact & Campus Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Campus & Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t.footerAddress}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="flex flex-wrap items-center gap-1.5">
                  <a href="tel:0981329252" className="hover:text-amber-400 transition-colors font-semibold">0981329252</a>
                  <span>/</span>
                  <a href="tel:0972755976" className="hover:text-amber-400 transition-colors font-semibold">0972755976</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>info@ethtechbridgeacademy.com</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1 border-t border-slate-900">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Mon–Sat 8:30 AM–5:30 PM (EAT)<br /><span className="text-emerald-400">Online 24/7 Nationwide</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & INTEGRITY BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {t.academyName}. {t.footerRightsReserved}</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TLS 256-Bit Encrypted</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="cursor-default text-slate-500">{t.footerPrivacyLink}</span>
            <span className="text-slate-600">&bull;</span>
            <span className="cursor-default text-slate-500">{t.footerTermsLink}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
