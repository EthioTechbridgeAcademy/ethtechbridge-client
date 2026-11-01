import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Alert from "../components/Alert.jsx";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;

    setError("");
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to process request.");
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
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t.backToSignIn}
        </Link>

        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">{t.forgotPasswordTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            {t.forgotPasswordSubtitle}
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        {submitted ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">{t.checkInboxTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {email}
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 text-xs font-bold text-blue-900 hover:underline"
            >
              {t.returnToLogin}
            </Link>
          </div>
        ) : (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow transition-all disabled:opacity-50"
            >
              {loading ? "..." : t.sendResetInstructionsBtn}
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