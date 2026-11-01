import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap, Menu, X, User, LogOut, BookOpen,
  LayoutDashboard, ShieldCheck, ChevronDown, Award, Globe
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getPublicGoogleFormUrl } from "../utils/googleForm.js";

export default function Navbar({ onOpenTutoringModal }) {
  const { user, isAuthenticated, isAdmin, isInstructor, logout } = useAuth();
  const { lang, setLang, t, availableLanguages } = useLanguage();
  const googleFormUrl = getPublicGoogleFormUrl();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegistrationPage = location.pathname === "/apply" || location.pathname === "/register";

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200/90 transition-all shadow-xs">
      {/* Top Notice Bar matching live site */}
      <div className="bg-[#1E3A8A] text-white text-[11px] sm:text-xs py-1.5 px-4 border-b border-blue-900/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="text-amber-400 font-bold">★</span>
            <span className="truncate text-slate-100">{t.topNoticeText}</span>
            {googleFormUrl && (
              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold underline shrink-0 ml-1"
              >
                {t.topNoticeLink}
              </a>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "am" : lang === "am" ? "om" : "en")}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/20 hover:bg-white/10 text-white transition-colors"
            >
              <Globe className="w-3 h-3 text-amber-300" />
              <span>{lang === "en" ? "English" : lang === "am" ? "አማርኛ" : "Afaan Oromoo"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Academy Name matching live site */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-900/20 rounded-lg p-1">
            <img
              src="/logo.png"
              alt="Ethio Techbridge Academy Logo"
              className="w-10 h-10 object-contain rounded-full shadow-xs"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                Ethio Techbridge.
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                ACADEMY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links: Home, Courses, About, Contact */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-semibold transition-all ${
                isActive("/")
                  ? "text-blue-900 font-bold border-b-2 border-amber-500"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg"
              }`}
            >
              {t.navHome}
            </Link>
            <Link
              to="/courses"
              className={`px-3 py-2 text-sm font-semibold transition-all ${
                isActive("/courses")
                  ? "text-blue-900 font-bold border-b-2 border-amber-500"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg"
              }`}
            >
              {t.navCourses}
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-semibold transition-all ${
                isActive("/about")
                  ? "text-blue-900 font-bold border-b-2 border-amber-500"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg"
              }`}
            >
              {t.navAbout}
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-semibold transition-all ${
                isActive("/contact")
                  ? "text-blue-900 font-bold border-b-2 border-amber-500"
                  : "text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg"
              }`}
            >
              {t.navContact}
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-700" />
                <span>{availableLanguages.find((l) => l.code === lang)?.label || lang.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  {availableLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        lang === l.code ? "text-blue-900 font-extrabold bg-blue-50/60" : "text-slate-700"
                      }`}
                    >
                      <span>{l.label}</span>
                      {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication Buttons / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-900 text-cyan-300 font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 max-w-[120px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-500">{t.signedInAs}</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 mt-1">
                          {t.navAdmin}
                        </span>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-900 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      {t.navDashboard}
                    </Link>

                    <Link
                      to="/dashboard/courses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-900 transition-colors font-medium"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      {t.navMyCourses}
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-900 transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      {t.navProfile}
                    </Link>

                    {(isInstructor || isAdmin) && (
                      <Link
                        to="/teacher"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-blue-900 bg-blue-50/60 hover:bg-blue-50 font-semibold transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-blue-900" />
                        <span>Teacher Portal</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-indigo-900 bg-indigo-50/50 hover:bg-indigo-50 font-semibold transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        {t.navAdmin}
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.navSignOut}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {t.navSignIn}
                </Link>
                {!isRegistrationPage && (
                  <Link
                    to="/apply"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-xl shadow-md shadow-blue-950/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
                  >
                    <span>{lang === "am" ? "አመልክት →" : lang === "om" ? "Iyyadhaa →" : "Apply Now →"}</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2 py-1 text-xs font-bold rounded border border-slate-200 text-slate-700"
              >
                {lang.toUpperCase()}
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  {availableLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              {t.navHome}
            </Link>
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              {t.navCourses}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 text-base font-semibold rounded-lg transition-colors ${
                isActive("/about") ? "text-blue-900 bg-blue-50 font-bold" : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {t.navAbout}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 text-base font-semibold rounded-lg transition-colors ${
                isActive("/contact") ? "text-blue-900 bg-blue-50 font-bold" : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {t.navContact}
            </Link>
          </nav>

          {isAuthenticated ? (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="px-3 py-1">
                <p className="text-xs text-slate-500 font-medium">{t.signedInAs}</p>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-50 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-900" />
                {t.navDashboard}
              </Link>
              <Link
                to="/dashboard/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <BookOpen className="w-4 h-4 text-blue-900" />
                {t.navMyCourses}
              </Link>
              {(isInstructor || isAdmin) && (
                <Link
                  to="/teacher"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-blue-900 bg-blue-50 rounded-lg"
                >
                  <GraduationCap className="w-4 h-4 text-blue-900" />
                  <span>Teacher Portal</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-indigo-900 bg-indigo-50 rounded-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  {t.navAdmin}
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                {t.navSignOut}
              </button>
            </div>
          ) : (
            <div className={`border-t border-slate-100 pt-3 ${isRegistrationPage ? "flex" : "grid grid-cols-2 gap-2"}`}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg"
              >
                {t.navSignIn}
              </Link>
              {!isRegistrationPage && (
                <Link
                  to="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-white bg-blue-900 rounded-xl"
                >
                  {t.registerApplyNow}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
