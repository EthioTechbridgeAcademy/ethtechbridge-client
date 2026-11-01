import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { t, lang = "en" } = useLanguage();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">
            {lang === "am" ? "ክፍለ-ጊዜውን በማረጋገጥ ላይ..." : lang === "om" ? "Mirkanneessaa jira..." : "Verifying session authorization..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-lg text-center space-y-4">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
          {lang === "am" ? "የፈቃድ ገደብ ተጥሏል" : lang === "om" ? "Eeyyama Hin Qabdan" : "Access Restricted"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {lang === "am"
            ? `ይህን ክፍል ለመጠቀም የ${requiredRole} ሚና ያስፈልጋል። የአሁኑ መለያዎ: ${user?.role}`
            : lang === "om"
            ? `Gara kutaa kanaatti seenuuf gahee ${requiredRole} barbaachisa. Gaheen keessan: ${user?.role}`
            : `This area requires a ${requiredRole} account. Your current signed-in role is ${user?.role}.`}
        </p>
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-bold">
          <Link
            to={user?.role === "student" ? "/dashboard" : "/"}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#1E3A8A] text-white rounded-xl shadow-xs hover:bg-[#172554] transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "am" ? "ወደ ዳሽቦርድ ተመለስ" : lang === "om" ? "Gara Daashboordii" : "Return to My Hub"}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            {lang === "am" ? "ውጣ" : lang === "om" ? "Ba'aa" : "Sign Out"}
          </button>
        </div>
      </div>
    );
  }

  return children;
}

