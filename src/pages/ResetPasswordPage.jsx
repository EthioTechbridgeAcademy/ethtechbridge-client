import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Alert from "../components/Alert.jsx";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing from the URL. Please request a new link.");
      return;
    }
    if (password.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
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
        <div className="space-y-1.5 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">{t.setNewPasswordTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {t.setNewPasswordSubtitle}
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        {success ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">{t.passwordResetSuccess}</h3>
            <p className="text-xs text-slate-600">{t.redirectingToSignIn}</p>
            <Link to="/login" className="inline-block mt-2 font-bold text-xs text-blue-900 underline">
              {t.signInNow}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.newPasswordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {t.confirmPasswordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow transition-all disabled:opacity-50"
            >
              {loading ? t.updatingPassword : t.updatePasswordBtn}
            </button>
          </form>
        )}
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