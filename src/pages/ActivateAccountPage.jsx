import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck, Lock, Eye, EyeOff, CheckCircle2,
  AlertCircle, ArrowRight, Sparkles, UserCheck
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ActivateAccountPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { lang = "en" } = useLanguage();

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [applicantInfo, setApplicantInfo] = useState(null);
  const [tokenError, setTokenError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setTokenError(
          lang === "am"
            ? "የማግበር ማስመሰያ (ቶከን) አልተገኘም። እባክዎ ከኢሜይልዎ የተላከውን ሙሉ አድራሻ ይጠቀሙ።"
            : lang === "om"
            ? "Mirkaneessi hin argamne. Mee hidhaa guutuu e-meelii keessanii fayyadamaa."
            : "No activation token provided. Please open the full link from your activation email or notification."
        );
        setVerifying(false);
        return;
      }

      try {
        const res = await api.verifyActivationToken(token);
        if (res.valid) {
          setTokenValid(true);
          setApplicantInfo(res);
        } else {
          setTokenError(res.message || "Invalid activation token.");
        }
      } catch (err) {
        setTokenError(err.message || "Invalid or expired activation link.");
      } finally {
        setVerifying(false);
      }
    }

    checkToken();
  }, [token, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!password || password.length < 8) {
      setFormError(
        lang === "am"
          ? "የይለፍ ቃል ቢያንስ 8 ፊደላት ወይም ቁጥሮች መሆን አለበት።"
          : lang === "om"
          ? "Jechi icciitii yoo xiqqaate qubee 8 qabaachuu qaba."
          : "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setFormError(
        lang === "am"
          ? "የይለፍ ቃሎች አይዛመዱም። እባክዎ በትክክል ያረጋግጡ።"
          : lang === "om"
          ? "Jechi icciitii wal hin simne."
          : "Passwords do not match."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.activateAccount({
        token,
        password,
        confirmPassword
      });

      if (res.token && res.user) {
        setSession(res.token, res.user);
        setSuccess(true);
      }
    } catch (err) {
      setFormError(err.message || "Failed to activate account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            {lang === "am" ? "የመግቢያ ማስመሰያውን በማረጋገጥ ላይ..." : lang === "om" ? "Mirkaneessaa jira..." : "Verifying your activation credential..."}
          </p>
        </div>
      </div>
    );
  }

  if (tokenError || !tokenValid) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-red-200 rounded-3xl shadow-xl text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
          {lang === "am" ? "የማግበር አድራሻው ልክ አይደለም" : lang === "om" ? "Hidhiin Dogoggora" : "Activation Link Expired or Invalid"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {tokenError || "This activation link is invalid, has already been used, or has expired."}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs rounded-xl transition-all"
          >
            {lang === "am" ? "ይግቡ" : lang === "om" ? "Seenaa" : "Sign In to Existing Account"}
          </Link>
          <Link
            to="/apply"
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            {lang === "am" ? "ማመልከቻ ገጽ" : lang === "om" ? "Iyyadhaa" : "Admissions Application"}
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-emerald-200 rounded-3xl shadow-xl text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-9 h-9" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
          {lang === "am" ? "እንኳን ደህና መጡ! መለያዎ ነቅቷል" : lang === "om" ? "Baga Nagaan Dhuftan!" : "Account Activated Successfully!"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {lang === "am"
            ? `ውድ ${applicantInfo?.studentName || "ተማሪ"}፣ የተማሪ መለያዎ በተሳካ ሁኔታ ተፈጥሯል። አሁኑኑ ወደ ትምህርት ዳሽቦርድዎ መግባት ይችላሉ።`
            : lang === "om"
            ? `Kabajamoo ${applicantInfo?.studentName || "Barataa"}، herregni keessan milkaa'inaan banameera.`
            : `Welcome, ${applicantInfo?.studentName || "Student"}! Your official student account is now active and ready. You have immediate access to your enrolled courses.`}
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{lang === "am" ? "ወደ ተማሪ ዳሽቦርድ ይግቡ" : lang === "om" ? "Gara Daashboordii Seenaa" : "Enter Student Learning Hub"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-2xl flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
            {lang === "am" ? "መለያዎን ያግብሩ" : lang === "om" ? "Herrega Keessan Eeggadhaa" : "Activate Your Student Account"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === "am"
              ? "እባክዎ ለተማሪ መለያዎ አዲስ እና ደህንነቱ የተጠበቀ የይለፍ ቃል ይምረጡ።"
              : lang === "om"
              ? "Mee jecha icciitii haaraa herrega keessaniif filadhaa."
              : "Set your personal password to activate your Ethio Techbridge Academy account."}
          </p>
        </div>

        {/* Applicant Verification Tag */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="truncate">
            <p className="font-bold text-slate-900 truncate">{applicantInfo?.studentName}</p>
            <p className="text-slate-500 truncate">{applicantInfo?.email}</p>
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === "am" ? "አዲስ የይለፍ ቃል" : lang === "om" ? "Jecha Icciitii Haaraa" : "New Password"}
              <span className="text-red-500 ml-1 font-black">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === "am" ? "ቢያንስ 8 ፊደላት ወይም ቁጥሮች" : lang === "om" ? "Yoo xiqqaate qubee 8" : "Minimum 8 characters"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === "am" ? "የይለፍ ቃል ማረጋገጫ" : lang === "om" ? "Jecha Icciitii Mirkaneessaa" : "Confirm Password"}
              <span className="text-red-500 ml-1 font-black">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === "am" ? "መለያን አግብር እና ጀምር" : lang === "om" ? "Herrega Eeggadhaa" : "Activate Account & Start Learning"}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

