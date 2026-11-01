import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Award, CheckCircle2, ShieldCheck, Printer, ArrowLeft, AlertCircle } from "lucide-react";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function CertificateVerifyPage() {
  const { code } = useParams();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      setLoading(true);
      setError("");
      try {
        const res = await api.verifyCertificate(code);
        setData(res.certificate);
      } catch (err) {
        setError(err.message || "Certificate verification failed.");
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-slate-200 rounded" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Invalid Credential</h2>
        <p className="text-xs sm:text-sm text-slate-600">
          We could not find an active certificate matching the verification code <strong>{code}</strong>.
        </p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs">
          {t.backToSite}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" /> {t.backToSite}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow"
        >
          <Printer className="w-4 h-4" /> {t.printSavePdfBtn}
        </button>
      </div>

      {/* Verification Status Pill */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
              {t.verifiedCredentialTitle}
            </h4>
            <p className="text-[11px] text-emerald-800">
              {t.verifiedCredentialDesc}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
          {data.code}
        </span>
      </div>

      {/* Official Certificate Presentation Frame */}
      <div className="relative bg-white border-8 border-slate-900 p-8 sm:p-14 rounded-3xl shadow-2xl space-y-8 text-center overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500" />

        {/* Certificate Seal & Academy Header */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-9 h-9" />
          </div>
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            {t.academyName} &bull; {t.certMeta}
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            {t.diplomaHeading}
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 italic">
          {t.thisCertifiesThat}
        </p>

        {/* Recipient Name */}
        <div className="py-2">
          <p className="text-2xl sm:text-4xl font-serif font-extrabold text-blue-950 border-b-2 border-slate-200 inline-block px-8 pb-2">
            {data.recipientName}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t.hasSatisfiedRequirements}
        </p>

        {/* Course Title */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block px-6">
          <p className="text-base sm:text-xl font-bold text-slate-900">
            {data.courseTitle}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {data.courseDurationHours || 10} {t.durationStructured}
          </p>
        </div>

        {/* Signature and Verification Footer */}
        <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-8 items-end text-left">
          <div>
            <p className="font-serif font-bold text-sm text-slate-900">{data.instructorName || "Faculty Board"}</p>
            <p className="text-[11px] text-slate-500">{data.instructorTitle || t.leadAcademicInstructor}</p>
            <p className="text-[10px] text-slate-400 mt-1">{data.issuerLocation}</p>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> {t.officialVerificationSeal}
            </div>
            <p className="text-[11px] font-mono text-slate-500">ID: {data.code}</p>
            <p className="text-[10px] text-slate-400">
              {t.issuedDateLabel} {new Date(data.issuedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}