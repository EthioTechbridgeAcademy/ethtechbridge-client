import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, BookOpen, Award, CheckCircle2, TrendingUp,
  Plus, Calendar, ArrowRight, ShieldCheck, Clock, FileText, Sparkles
} from "lucide-react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import Pagination from "../../components/Pagination.jsx";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentPage, setEnrollmentPage] = useState(1);
  const [enrollmentPageSize, setEnrollmentPageSize] = useState(5);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAdminOverview();
        setData(res);
      } catch (err) {
        console.error("Admin overview error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-3xl border border-slate-200" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-3xl border border-slate-200" />
      </div>
    );
  }

  const { metrics, recentEnrollments = [] } = data || {};

  const totalEnrollmentPages = Math.max(1, Math.ceil(recentEnrollments.length / enrollmentPageSize));
  const paginatedEnrollments = recentEnrollments.slice(
    (enrollmentPage - 1) * enrollmentPageSize,
    enrollmentPage * enrollmentPageSize
  );

  return (
    <div className="space-y-8">
      {/* Quick Action Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.adminBadgeConsole || "Academy Management Console"}</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-snug font-sans">
            {t.adminDashboardTitle || "Institutional Dashboard Overview"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {t.adminDashboardSubtitle || "Real-time enrollment, curriculum performance, applicant onboarding, and certificate verification records."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/applications"
            className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <FileText className="w-4 h-4" />
            <span>{t.adminNavApplications || "Admissions Applications"}</span>
          </Link>
          <Link
            to="/admin/courses/new"
            className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.adminBtnAddCourse || "Add New Course"}</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t.adminKpiStudents || "Students"}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{metrics?.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">{t.adminKpiStudentsDesc || "Registered student accounts"}</p>
        </div>

        {/* Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t.adminKpiCourses || "Courses"}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{metrics?.totalCourses || 0}</p>
          <p className="text-[11px] text-emerald-600 font-bold">{metrics?.publishedCourses || 0} {t.adminKpiPublished || "Published Live"}</p>
        </div>

        {/* Enrollments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t.adminKpiEnrollments || "Enrollments"}</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{metrics?.totalEnrollments || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">{t.adminKpiEnrollmentsDesc || "Active course seats"}</p>
        </div>

        {/* Completions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t.adminKpiCompletions || "Completions"}</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{metrics?.completedEnrollments || 0}</p>
          <p className="text-[11px] text-teal-600 font-bold">{t.adminKpiFinished || "100% Curriculum Finished"}</p>
        </div>

        {/* Certificates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t.adminKpiCertificates || "Certificates"}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{metrics?.totalCertificates || 0}</p>
          <p className="text-[11px] text-amber-600 font-bold">{t.adminKpiVerified || "Verified Credentials"}</p>
        </div>

        {/* Quiz Attempts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t.adminKpiAssessments || "Assessments"}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{metrics?.totalQuizAttempts || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">{t.adminKpiEvaluated || "Evaluated Quiz Submissions"}</p>
        </div>

        {/* Recent Enrollments Pagination */}
        <Pagination
          currentPage={enrollmentPage}
          totalPages={totalEnrollmentPages}
          totalItems={recentEnrollments.length}
          pageSize={enrollmentPageSize}
          onPageChange={setEnrollmentPage}
          onPageSizeChange={(sz) => {
            setEnrollmentPageSize(sz);
            setEnrollmentPage(1);
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      {/* Recent Student Enrollments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 font-sans tracking-tight">
              {t.adminRecentEnrollments || "Recent Student Enrollments"}
            </h2>
            <p className="text-xs text-slate-500">
              {t.adminRecentEnrollmentsDesc || "Real-time cohort activity and curriculum progression"}
            </p>
          </div>
          <Link
            to="/admin/students-progress"
            className="text-xs font-bold text-[#1E3A8A] hover:text-[#172554] flex items-center gap-1.5 transition-colors"
          >
            <span>{t.adminViewAllRecords || "View All Student Records"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 rounded-l-xl">{t.adminColStudent || "Student"}</th>
                <th className="py-3.5 px-4">{t.adminColCourse || "Course"}</th>
                <th className="py-3.5 px-4">{t.adminColProgress || "Progress"}</th>
                <th className="py-3.5 px-4">{t.adminColStatus || "Status"}</th>
                <th className="py-3.5 px-4 text-right rounded-r-xl">{t.adminColEnrolledAt || "Enrolled At"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No active student enrollments recorded yet.
                  </td>
                </tr>
              ) : (
                paginatedEnrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-xs flex items-center justify-center shrink-0">
                          {enr.student_name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{enr.student_name}</p>
                          <p className="text-[11px] text-slate-500">{enr.student_email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 text-xs sm:text-sm">
                      {enr.course_title}
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              enr.progress_percent === 100 ? "bg-emerald-500" : "bg-[#1E3A8A]"
                            }`}
                            style={{ width: `${enr.progress_percent}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-slate-700">{enr.progress_percent}%</span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          enr.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {enr.status === "completed" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {enr.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-right text-xs text-slate-500">
                      {new Date(enr.enrolled_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Enrollments Pagination */}
        <Pagination
          currentPage={enrollmentPage}
          totalPages={totalEnrollmentPages}
          totalItems={recentEnrollments.length}
          pageSize={enrollmentPageSize}
          onPageChange={setEnrollmentPage}
          onPageSizeChange={(sz) => {
            setEnrollmentPageSize(sz);
            setEnrollmentPage(1);
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
}
