import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ArrowLeft, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import Alert from "../components/Alert.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.acceptTerms) {
      setError("You must accept the Academy Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone.trim()
      });

      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center px-4 py-10 font-sans">
      {/* Brand Header */}
      <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group focus:outline-none" title="Ethio Techbridge Academy">
        <img
          src="/logo.png"
          alt="Ethio Techbridge Academy Logo"
          className="w-10 h-10 object-contain rounded-full shadow-xs"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
            Ethio Techbridge<span className="text-amber-500">.</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
            Academy Platform
          </span>
        </div>
      </Link>

      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-9 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 bg-blue-900 text-cyan-300 rounded-xl flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            {t.registerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {t.registerSubtitle}
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.fullNameLabel} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="fullName"
                required
                autoComplete="name"
                value={form.fullName}
                onChange={update}
                placeholder="e.g. Abebe Bikila"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.emailAddressLabel} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.phoneLabel}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={update}
                placeholder="0911223344"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.passwordFieldLabel} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update}
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.confirmPasswordFieldLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={update}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <span>
                {t.agreeTermsLabel}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? t.creatingAccountText : t.createAccountActionBtn}{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-slate-600 border-t border-slate-100">
          {t.haveAccountPrompt}{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="font-bold text-blue-900 hover:text-cyan-700 underline ml-1"
          >
            {t.navSignIn}
          </Link>
        </div>
      </div>

      {/* Return to website link */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Academy Website</span>
        </Link>
      </div>
    </div>
  );
}