import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck,
  Phone, Mail, User, GraduationCap, BookOpen, Send, Copy, Check,
  MessageSquare, Sparkles, Home, Lock, LogIn, UserPlus, Clock
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ApplyPage() {
  const { t, lang } = useLanguage();
  const { user, isAuthenticated, login, register, logout } = useAuth();

  // Authentication gate state for first-time applicants
  const [authTab, setAuthTab] = useState("register"); // 'register' or 'login'
  const [authForm, setAuthForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [authErrors, setAuthErrors] = useState({});
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  // Application form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    gradeLevel: "",
    programInterest: "",
    preferredContact: "phone",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [copiedAppNum, setCopiedAppNum] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(false);

  // Automatically fetch existing application status for authenticated student
  useEffect(() => {
    async function loadStatus() {
      if (!isAuthenticated) {
        setExistingApplication(null);
        return;
      }
      setCheckingExisting(true);
      try {
        const res = await api.getMyApplicationStatus();
        if (res?.hasApplication && res?.application) {
          setExistingApplication(res.application);
        } else {
          setExistingApplication(null);
        }
      } catch (err) {
        console.error("Failed to check existing application:", err);
      } finally {
        setCheckingExisting(false);
      }
    }
    loadStatus();
  }, [isAuthenticated, user]);

  // Automatically pre-fill applicant fields from authenticated user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || ""
      }));
    }
  }, [user]);

  const gradeOptions = [
    { value: "High School (Grade 9-12)", label: t.applyGradeHighSchool },
    { value: "University / College", label: t.applyGradeUniversity },
    { value: "Adult Learner / Career Switcher", label: t.applyGradeAdult },
    { value: "Professional Development", label: t.applyGradeProfessional },
    { value: "Grade 1-8 (Elementary / Middle)", label: t.applyGradeK8 },
    { value: "Other", label: t.applyGradeOther }
  ];

  const programOptions = [
    { value: "Full-Stack Web Development", label: t.applyProgramWebDev },
    { value: "Python Programming & Data", label: t.applyProgramPython },
    { value: "Computer & Digital Literacy", label: t.applyProgramDigLit },
    { value: "1-12 STEM & Curriculum Tutoring", label: t.applyProgramTutoring },
    { value: "Professional & Career Skills", label: t.applyProgramCareer },
    { value: "Other Track", label: t.applyProgramOther }
  ];

  const contactMethods = [
    { value: "phone", label: t.applyContactPhone },
    { value: "telegram", label: t.applyContactTelegram },
    { value: "email", label: t.applyContactEmail },
    { value: "whatsapp", label: t.applyContactWhatsApp }
  ];

  // Helper to render label with pure black text and vibrant red required asterisk *
  const renderFieldLabel = (labelString, isRequired = false) => {
    const cleanLabel = (labelString || "").replace(/\s*\*$/, "").trim();
    return (
      <span className="flex items-center gap-1 text-slate-900 font-bold">
        <span>{cleanLabel}</span>
        {isRequired && (
          <span className="text-red-600 font-black text-sm leading-none" aria-hidden="true">
            *
          </span>
        )}
      </span>
    );
  };

  // Handle Auth Gate Submission (Sign In or Register)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    const errs = {};

    if (authTab === "register") {
      if (!authForm.fullName.trim() || authForm.fullName.trim().length < 2) {
        errs.fullName = "Please enter your full name (at least 2 characters).";
      }
      if (!authForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
      const cleanPhone = authForm.phone.trim().replace(/[^\d+]/g, "");
      if (!cleanPhone || cleanPhone.length < 7) {
        errs.phone = "Please enter a valid phone number (at least 7 digits).";
      }
      if (!authForm.password || authForm.password.length < 8) {
        errs.password = "Password must be at least 8 characters.";
      }
      if (authForm.password !== authForm.confirmPassword) {
        errs.confirmPassword = "Passwords do not match.";
      }

      if (Object.keys(errs).length > 0) {
        setAuthErrors(errs);
        return;
      }

      setAuthSubmitting(true);
      try {
        const newUser = await register({
          fullName: authForm.fullName.trim(),
          email: authForm.email.trim().toLowerCase(),
          password: authForm.password,
          confirmPassword: authForm.confirmPassword,
          phone: authForm.phone.trim()
        });
        setFormData((prev) => ({
          ...prev,
          fullName: newUser.name,
          email: newUser.email,
          phone: newUser.phone || authForm.phone.trim()
        }));
      } catch (err) {
        setAuthError(err.message || "Failed to create account. Please try again.");
      } finally {
        setAuthSubmitting(false);
      }
    } else {
      // Login
      if (!authForm.email.trim()) {
        errs.email = "Please enter your email.";
      }
      if (!authForm.password) {
        errs.password = "Please enter your password.";
      }

      if (Object.keys(errs).length > 0) {
        setAuthErrors(errs);
        return;
      }

      setAuthSubmitting(true);
      try {
        const loggedUser = await login(authForm.email.trim().toLowerCase(), authForm.password);
        setFormData((prev) => ({
          ...prev,
          fullName: loggedUser.name,
          email: loggedUser.email,
          phone: loggedUser.phone || prev.phone
        }));
      } catch (err) {
        setAuthError(err.message || "Invalid email or password.");
      } finally {
        setAuthSubmitting(false);
      }
    }
  };

  // Validate Application Form
  const validateApplication = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (at least 2 characters).";
    }
    const cleanPhone = formData.phone.trim().replace(/[^\d+]/g, "");
    if (!cleanPhone || cleanPhone.length < 7) {
      errs.phone = "Please enter a valid phone number (at least 7 digits).";
    }
    if (!formData.gradeLevel) {
      errs.gradeLevel = "Please select your academic or educational level.";
    }
    if (!formData.programInterest) {
      errs.programInterest = "Please select the course or program you are applying for.";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAppChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAppSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateApplication()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitApplication(formData);
      setSuccessData(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err.status === 409) {
        setSubmitError(
          err.data?.message ||
            "An application with this contact information was already received recently. Our admissions team is currently reviewing it."
        );
      } else {
        setSubmitError(
          err.message || "Failed to submit application. Please check your connection and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAppNumber = () => {
    if (successData?.applicationNumber) {
      navigator.clipboard.writeText(successData.applicationNumber);
      setCopiedAppNum(true);
      setTimeout(() => setCopiedAppNum(false), 2500);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="inline-flex items-center gap-1.5 hover:text-blue-900 font-semibold transition-colors"
          >
            {isAuthenticated ? (
              <>
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Back to Student Dashboard</span>
              </>
            ) : (
              <>
                <Home className="w-4 h-4 text-slate-500" />
                <span>{t.navHome}</span>
              </>
            )}
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>{t.verifiedOfficialForm}</span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 1. SUCCESS CONFIRMATION STATE */}
        {/* ==================================================================== */}
        {successData ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {t.applySuccessTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
                {t.applySuccessMessage}
              </p>
            </div>

            {/* Application Reference Number Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                {t.applyAppNumberLabel}
              </span>
              <div className="flex items-center justify-center gap-3">
                <code className="text-xl sm:text-2xl font-mono font-bold text-blue-900 tracking-wider">
                  {successData.applicationNumber}
                </code>
                <button
                  type="button"
                  onClick={handleCopyAppNumber}
                  className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-950 transition-colors shadow-xs"
                  title="Copy application number"
                >
                  {copiedAppNum ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Please save this reference number for future communication with our admissions team.
              </p>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                {t.applyNextStepsTitle}
              </h3>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-2 shrink-0" />
                  <span>{t.applyNextStep1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-2 shrink-0" />
                  <span>{t.applyNextStep2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-2 shrink-0" />
                  <span>{t.applyNextStep3}</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-[#1E3A8A] hover:bg-[#172554] text-white shadow-md shadow-blue-950/20 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>{t.navDashboard}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition-colors text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                {t.applyBrowseCoursesBtn}
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-blue-900 hover:text-blue-700 transition-colors text-center"
              >
                {t.applyBackHomeBtn}
              </Link>
            </div>
          </div>
        ) : !isAuthenticated ? (
          /* ==================================================================== */
          /* 2. AUTHENTICATION GATE: First-time applicants sign in / register      */
          /* ==================================================================== */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-3 border-b border-slate-100 pb-6">
              <img
                src="/logo.png"
                alt="Ethio Techbridge Academy"
                className="w-14 h-14 object-contain mx-auto rounded-full shadow-xs"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Admission Prerequisite</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {t.applyAuthRequiredTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                {t.applyAuthRequiredSubtitle}
              </p>
            </div>

            {/* Tab Switcher: Create Account vs Sign In */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  setAuthTab("register");
                  setAuthError("");
                  setAuthErrors({});
                }}
                className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  authTab === "register"
                    ? "bg-white text-blue-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserPlus className="w-4 h-4 text-blue-700" />
                <span>{t.applyTabCreateAccount}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab("login");
                  setAuthError("");
                  setAuthErrors({});
                }}
                className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  authTab === "login"
                    ? "bg-white text-blue-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LogIn className="w-4 h-4 text-blue-700" />
                <span>{t.applyTabSignIn}</span>
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-950">Notice</p>
                  <p className="mt-0.5 text-xs sm:text-sm text-red-800">{authError}</p>
                </div>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-5" noValidate>
              {authTab === "register" && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="authFullName" className="block text-xs sm:text-sm">
                      {renderFieldLabel(t.applyFullNameLabel, true)}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="authFullName"
                        type="text"
                        required
                        value={authForm.fullName}
                        onChange={(e) => {
                          setAuthForm((p) => ({ ...p, fullName: e.target.value }));
                          if (authErrors.fullName) setAuthErrors((p) => ({ ...p, fullName: "" }));
                        }}
                        placeholder={t.applyFullNamePlaceholder}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                          authErrors.fullName
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                        }`}
                      />
                    </div>
                    {authErrors.fullName && (
                      <p className="text-xs text-red-600 font-semibold">{authErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="authPhone" className="block text-xs sm:text-sm">
                      {renderFieldLabel(t.applyPhoneLabel, true)}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="authPhone"
                        type="tel"
                        required
                        value={authForm.phone}
                        onChange={(e) => {
                          setAuthForm((p) => ({ ...p, phone: e.target.value }));
                          if (authErrors.phone) setAuthErrors((p) => ({ ...p, phone: "" }));
                        }}
                        placeholder={t.applyPhonePlaceholder}
                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                          authErrors.phone
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                        }`}
                      />
                    </div>
                    {authErrors.phone ? (
                      <p className="text-xs text-red-600 font-semibold">{authErrors.phone}</p>
                    ) : (
                      <p className="text-[11px] text-slate-500">{t.applyPhoneHelp}</p>
                    )}
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="authEmail" className="block text-xs sm:text-sm">
                  {renderFieldLabel("Email Address *", true)}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="authEmail"
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => {
                      setAuthForm((p) => ({ ...p, email: e.target.value }));
                      if (authErrors.email) setAuthErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="e.g. student@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                      authErrors.email
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                    }`}
                  />
                </div>
                {authErrors.email && (
                  <p className="text-xs text-red-600 font-semibold">{authErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="authPassword" className="block text-xs sm:text-sm">
                  {renderFieldLabel(t.applyPasswordLabel, true)}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="authPassword"
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => {
                      setAuthForm((p) => ({ ...p, password: e.target.value }));
                      if (authErrors.password) setAuthErrors((p) => ({ ...p, password: "" }));
                    }}
                    placeholder="Minimum 8 characters"
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                      authErrors.password
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                    }`}
                  />
                </div>
                {authErrors.password && (
                  <p className="text-xs text-red-600 font-semibold">{authErrors.password}</p>
                )}
              </div>

              {authTab === "register" && (
                /* Confirm Password */
                <div className="space-y-1.5">
                  <label htmlFor="authConfirm" className="block text-xs sm:text-sm">
                    {renderFieldLabel(t.applyConfirmPasswordLabel, true)}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="authConfirm"
                      type="password"
                      required
                      value={authForm.confirmPassword}
                      onChange={(e) => {
                        setAuthForm((p) => ({ ...p, confirmPassword: e.target.value }));
                        if (authErrors.confirmPassword)
                          setAuthErrors((p) => ({ ...p, confirmPassword: "" }));
                      }}
                      placeholder="Re-enter password"
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                        authErrors.confirmPassword
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                      }`}
                    />
                  </div>
                  {authErrors.confirmPassword && (
                    <p className="text-xs text-red-600 font-semibold">
                      {authErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Auth Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-sm sm:text-base bg-[#1E3A8A] hover:bg-[#172554] text-white shadow-lg shadow-blue-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.005]"
                >
                  {authSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {authTab === "register"
                          ? t.applyCreateAccountBtn
                          : t.applySignInBtn}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : checkingExisting ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Checking your admission status...</p>
          </div>
        ) : existingApplication && (existingApplication.status === "pending" || existingApplication.status === "under_review") ? (
          /* ==================================================================== */
          /* 3A. EXISTING APPLICATION PENDING REVIEW (AVOID DUPLICATE SUBMISSION) */
          /* ==================================================================== */
          <div className="bg-white border border-amber-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8 animate-fadeIn">
            <div className="text-center space-y-3 border-b border-slate-100 pb-6">
              <div className="w-14 h-14 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-700 shadow-sm">
                <Clock className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <span>Application Under Review</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                You Already Have an Active Application
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Our admissions committee is currently reviewing your application. You do not need to submit another request while this one is in progress.
              </p>
            </div>

            {/* Application Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block text-xs">Application Number</span>
                <span className="text-lg font-mono font-bold text-blue-900">{existingApplication.application_number}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block text-xs">Program of Interest</span>
                <span className="text-base font-bold text-slate-900">{existingApplication.program_interest}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block text-xs">Grade / Level</span>
                <span className="font-semibold text-slate-800">{existingApplication.grade_level || "Not specified"}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block text-xs">Submitted On</span>
                <span className="font-semibold text-slate-800">
                  {existingApplication.created_at ? new Date(existingApplication.created_at).toLocaleDateString() : "Recently"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Go to Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:0981329252"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Call Admissions: 0981329252</span>
              </a>
            </div>
          </div>
        ) : existingApplication && (existingApplication.status === "approved" || existingApplication.status === "enrolled") ? (
          /* ==================================================================== */
          /* 3B. ADMISSION ALREADY APPROVED                                       */
          /* ==================================================================== */
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8 animate-fadeIn text-center">
            <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Admission Approved
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-tight">
                Congratulations, {user?.name}! Your Admission is Approved
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your admission application ({existingApplication.application_number}) for {existingApplication.program_interest} has been approved. You can now access your courses and learning dashboard.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ==================================================================== */
          /* 3C. ADMISSION APPLICATION FORM (FOR AUTHENTICATED STUDENTS)          */
          /* ==================================================================== */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="space-y-3 border-b border-slate-150 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>Admission Application</span>
                </div>

                {/* Signed-in badge with switch account option */}
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  <span>{t.applySignedInAs} <strong className="text-slate-900">{user?.name}</strong></span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-blue-700 hover:text-blue-900 underline font-semibold"
                  >
                    {t.applySwitchAccount}
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {t.applyTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {t.applySubtitle}
              </p>
            </div>

            {/* Error Alert */}
            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-950">Application Notice</p>
                  <p className="mt-0.5 text-xs sm:text-sm text-red-800">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAppSubmit} className="space-y-6" noValidate>
              {/* Field 1: Full Name (Pre-filled, Required *) */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-xs sm:text-sm">
                  {renderFieldLabel(t.applyFullNameLabel, true)}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    maxLength={150}
                    value={formData.fullName}
                    onChange={handleAppChange}
                    placeholder={t.applyFullNamePlaceholder}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-600 font-semibold">{errors.fullName}</p>
                )}
              </div>

              {/* Field 2 & 3: Phone & Email in responsive 2-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone Number (Required *) */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs sm:text-sm">
                    {renderFieldLabel(t.applyPhoneLabel, true)}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={35}
                      value={formData.phone}
                      onChange={handleAppChange}
                      placeholder={t.applyPhonePlaceholder}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                      }`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="text-xs text-red-600 font-semibold">{errors.phone}</p>
                  ) : (
                    <p className="text-[11px] text-slate-500">{t.applyPhoneHelp}</p>
                  )}
                </div>

                {/* Email Address (Pre-filled) */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs sm:text-sm">
                    {renderFieldLabel(t.applyEmailLabel, false)}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      maxLength={190}
                      value={formData.email}
                      onChange={handleAppChange}
                      placeholder={t.applyEmailPlaceholder}
                      className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 font-semibold">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Field 4: Grade / Academic Level (Required *) */}
              <div className="space-y-1.5">
                <label htmlFor="gradeLevel" className="block text-xs sm:text-sm">
                  {renderFieldLabel(t.applyGradeLabel, true)}
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="gradeLevel"
                    name="gradeLevel"
                    required
                    value={formData.gradeLevel}
                    onChange={handleAppChange}
                    className={`w-full pl-10 pr-8 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 appearance-none transition-all ${
                      errors.gradeLevel
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                    }`}
                  >
                    <option value="" disabled className="text-slate-400">
                      {t.applyGradeSelect}
                    </option>
                    {gradeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.gradeLevel && (
                  <p className="text-xs text-red-600 font-semibold">{errors.gradeLevel}</p>
                )}
              </div>

              {/* Field 5: Program / Course of Interest (Required *) */}
              <div className="space-y-1.5">
                <label htmlFor="programInterest" className="block text-xs sm:text-sm">
                  {renderFieldLabel(t.applyProgramLabel, true)}
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="programInterest"
                    name="programInterest"
                    required
                    value={formData.programInterest}
                    onChange={handleAppChange}
                    className={`w-full pl-10 pr-8 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 appearance-none transition-all ${
                      errors.programInterest
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-600 focus:ring-blue-600/15"
                    }`}
                  >
                    <option value="" disabled className="text-slate-400">
                      {t.applyProgramSelect}
                    </option>
                    {programOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.programInterest && (
                  <p className="text-xs text-red-600 font-semibold">{errors.programInterest}</p>
                )}
              </div>

              {/* Field 6: Preferred Contact Method */}
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-900">
                  {t.applyContactPrefLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {contactMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        formData.preferredContact === method.value
                          ? "bg-blue-50/80 border-blue-600 text-blue-950 font-bold shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method.value}
                        checked={formData.preferredContact === method.value}
                        onChange={handleAppChange}
                        className="sr-only"
                      />
                      <MessageSquare
                        className={`w-3.5 h-3.5 shrink-0 ${
                          formData.preferredContact === method.value ? "text-blue-700" : "text-slate-400"
                        }`}
                      />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Field 7: Additional Educational Goals & Background (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="notes" className="block text-xs sm:text-sm">
                  {renderFieldLabel(t.applyNotesLabel, false)}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  maxLength={1000}
                  value={formData.notes}
                  onChange={handleAppChange}
                  placeholder={t.applyNotesPlaceholder}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all resize-y"
                />
              </div>

              {/* Security & Confidentiality Notice */}
              <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.applySecurityNotice}</span>
              </div>

              {/* Submit Application Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-sm sm:text-base bg-[#1E3A8A] hover:bg-[#172554] text-white shadow-lg shadow-blue-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.005]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.applySubmittingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.applySubmitBtn}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
