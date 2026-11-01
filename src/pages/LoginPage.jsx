import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ArrowLeft, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import Alert from "../components/Alert.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (redirect) {
        navigate(redirect);
      } else if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "instructor") {
        navigate("/teacher");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
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

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 bg-blue-900 text-cyan-300 rounded-xl flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            {t.loginTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {t.loginSubtitle}
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.emailAddressLabel}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {t.passwordFieldLabel}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-900 hover:text-cyan-700 transition-colors"
              >
                {t.forgotPasswordLink}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? t.signingInText : t.signInActionBtn} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-slate-600 border-t border-slate-100">
          {t.noAccountPrompt}{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="font-bold text-blue-900 hover:text-cyan-700 underline ml-1"
          >
            {t.createFreeAccount}
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