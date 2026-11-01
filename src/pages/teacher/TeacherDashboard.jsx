import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Users, Calendar, Video, ExternalLink,
  ArrowRight, Sparkles, AlertCircle, Clock, ShieldCheck
} from "lucide-react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOverview() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getInstructorOverview();
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load instructor dashboard.");
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white rounded-3xl border border-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-3xl border border-slate-200" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Dashboard Unavailable</h2>
        <p className="text-xs text-slate-600">{error || "Could not fetch instructor overview."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const { metrics, courses = [], upcomingSchedules = [] } = data;
  const nextSession = upcomingSchedules[0] || null;

  return (
    <div className="space-y-8 font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0B1A30] via-[#1E3A8A] to-[#0F2447] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.teacherBadgeHub || "Faculty Instruction Hub"}</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-sans">
          {t.teacherDashboardTitle || "Instructor Class Console"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          {t.teacherDashboardSubtitle || "Manage your assigned academic tracks, monitor student cohort progression, and host live Microsoft Teams classroom sessions."}
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Assigned Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.teacherActiveCourses || "Assigned Courses"}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{metrics?.assignedCoursesCount || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Active teaching curriculum tracks</p>
        </div>

        {/* Enrolled Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.teacherTotalStudents || "Active Students"}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{metrics?.totalStudentsCount || 0}</p>
          <p className="text-[11px] text-emerald-600 font-bold">Enrolled across your classes</p>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.teacherScheduledClasses || "Live Sessions"}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{metrics?.upcomingSchedulesCount || 0}</p>
          <p className="text-[11px] text-indigo-600 font-bold">Scheduled online classes</p>
        </div>
      </div>

      {/* Next Upcoming Live Session Banner */}
      {nextSession && (
        <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#464EB8] border border-indigo-200">
                <Video className="w-3.5 h-3.5" />
                <span>{t.teacherUpcomingSessions || "Next Scheduled Microsoft Teams Class"}</span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">
                {nextSession.subject_name || nextSession.course_title}
              </h2>
              <p className="text-xs text-slate-500">
                {new Date(nextSession.class_date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}{" "}
                at {nextSession.start_time?.slice(0, 5)} {nextSession.end_time ? `- ${nextSession.end_time.slice(0, 5)}` : ""} (EAT)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {nextSession.meeting_url ? (
                <a
                  href={nextSession.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#464EB8] hover:bg-[#3B429F] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Video className="w-4 h-4" />
                  <span>{t.teacherJoinLiveClass || "Launch Microsoft Teams Meeting"}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              ) : (
                <Link
                  to="/teacher/schedules"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Configure Teams Link
                </Link>
              )}
            </div>
          </div>

          {nextSession.instructions && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
              <strong className="text-slate-800">Session Instructions:</strong> {nextSession.instructions}
            </div>
          )}
        </div>
      )}

      {/* Assigned Classes Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">{t.teacherAssignedClasses || "Your Assigned Courses"}</h2>
            <p className="text-xs text-slate-500">Curricula assigned to your faculty profile</p>
          </div>
          <Link
            to="/teacher/classes"
            className="text-xs font-bold text-[#1E3A8A] hover:text-[#172554] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Courses & Rosters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">No courses currently assigned to your account.</p>
            <p className="text-xs text-slate-500">Contact the academy administrator to assign teaching tracks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-500 uppercase text-[10px]">{c.category_name || "General"}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200">
                      {c.student_count || 0} Students
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{c.title}</h3>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <Link
                    to={`/teacher/classes/${c.id}/roster`}
                    className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1"
                  >
                    <Users className="w-3 h-3" /> {t.teacherViewRoster || "View Roster"}
                  </Link>
                  <Link
                    to={`/courses/${c.slug}`}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    LMS Catalog &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

