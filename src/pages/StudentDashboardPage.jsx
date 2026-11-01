import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Clock, CheckCircle2, Award, ArrowRight,
  Sparkles, TrendingUp, AlertCircle, Video, ExternalLink, Calendar, User as UserIcon
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { DashboardSkeleton } from "../components/LoadingSkeleton.jsx";
import CourseCard from "../components/CourseCard.jsx";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getStudentDashboard();
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Dashboard Unavailable</h2>
        <p className="text-sm text-slate-600">{error || "Could not fetch student metrics."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    student,
    admission,
    stats = { enrolledCount: 0, inProgressCount: 0, completedCount: 0, overallProgressPercent: 0, certificatesCount: 0 },
    continueLearning,
    recentCourses = [],
    certificates = [],
    recommendedCourses = [],
    upcomingSchedules = []
  } = data;

  const isAdmissionPending = admission?.status === "pending" || admission?.status === "under_review";
  const isAdmissionRejected = admission?.status === "rejected";

  if (isAdmissionPending) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8 font-sans">
        {/* Status Alert Banner */}
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-200 inline-block">
                {t.studentAdmissionReview || "Admission Review in Progress"}
              </span>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                {t.dashStudentWelcome || "Welcome"}, <span className="text-[#1E3A8A] font-extrabold">{student?.name || user?.name}</span>! {t.studentAdmissionReview || "Your Admission is Under Review"}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your student account is active. Our academic admissions committee is currently evaluating your application. 
            Once approved by an administrator, full access to enrolled course materials, interactive quizzes, and certificates will be unlocked.
          </p>
        </div>

        {/* Application Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-sans">{t.adminApplicantDetailsTitle || "Application Overview"}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {t.adminColStatus || "Status"}: {admission?.status === "under_review" ? (t.adminStatusUnderReview || "Under Review") : (t.adminStatusPending || "Pending Review")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">{t.adminColAppNumber || "Application Number"}</span>
              <span className="text-sm font-mono font-bold text-blue-900 mt-0.5 block">{admission?.applicationNumber}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">{t.adminColProgram || "Program of Interest"}</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{admission?.programInterest}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">{t.adminColLevel || "Grade / Academic Level"}</span>
              <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{admission?.gradeLevel || "Not specified"}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">{t.adminColDate || "Submitted Date"}</span>
              <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                {admission?.createdAt ? new Date(admission.createdAt).toLocaleDateString() : "Recently"}
              </span>
            </div>
          </div>

          {/* Account Profile Summary */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Account</h3>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div><span className="font-semibold text-slate-900">Account:</span> Active Student</div>
              <div><span className="font-semibold text-slate-900">Email:</span> {student?.email || user?.email}</div>
              {user?.phone && <div><span className="font-semibold text-slate-900">Phone:</span> {user.phone}</div>}
            </div>
          </div>

          {/* Helpline Support */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900">Need Immediate Assistance?</p>
              <p className="text-xs text-slate-600">Contact the academy admissions office directly:</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:0981329252"
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-blue-900 hover:text-amber-600 shadow-xs"
              >
                0981329252
              </a>
              <a
                href="tel:0972755976"
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-blue-900 hover:text-amber-600 shadow-xs"
              >
                0972755976
              </a>
            </div>
          </div>
        </div>

        {/* Public Catalog Preview Link */}
        <div className="text-center pt-2">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 hover:text-blue-950 underline"
          >
            <span>Browse public course outlines & previews while waiting</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (isAdmissionRejected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 font-sans">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Admission Application Notice</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your admission application ({admission?.applicationNumber}) could not be approved at this time.
            {admission?.adminNotes && (
              <span className="block mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic">
                Note: {admission.adminNotes}
              </span>
            )}
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="tel:0981329252"
            className="px-5 py-2.5 rounded-xl bg-blue-900 text-white font-bold text-xs shadow-sm hover:bg-blue-800 transition-colors"
          >
            Contact Admissions (0981329252)
          </a>
          <Link
            to="/apply"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Submit New Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.navDashboard}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {t.dashStudentWelcome}, {student?.name || user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.dashSubtitleText}
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.metricEnrolledCourses}</span>
            <BookOpen className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {stats.enrolledCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{t.metricEnrolledSub}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.metricInProgress}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {stats.inProgressCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{t.metricInProgressSub}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.metricCompletedCourses}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {stats.completedCount}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{t.metricCompletedSub}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.metricAvgProgress}</span>
            <TrendingUp className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {stats.overallProgressPercent}%
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{t.metricAvgProgressSub}</p>
        </div>
      </div>

      {/* Continue Learning Hero Card */}
      {continueLearning ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                {t.continueLearningHeroTitle}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {continueLearning.course_title}
              </h2>
            </div>
            <Link
              to={`/learn/${continueLearning.course_slug}`}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              {t.resumeLessonHeroBtn} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>
                {continueLearning.completed_lessons} {t.ofCourses} {continueLearning.total_lessons} {t.lessonsLabel} {t.completedBadge}
              </span>
              <span className="font-bold text-blue-900">{continueLearning.progress_percent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-900 to-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${continueLearning.progress_percent}%` }}
              />
            </div>
            {continueLearning.last_lesson_title && (
              <p className="text-xs text-slate-500 pt-1">
                {t.lastViewedLabel} <span className="font-semibold text-slate-700">{continueLearning.last_lesson_title}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-800">{t.noEnrollmentsYetTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {t.noEnrollmentsYetDesc}
          </p>
          <Link
            to="/courses"
            className="inline-block px-6 py-2.5 bg-blue-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-blue-800 transition-colors shadow"
          >
            {t.exploreFreeCoursesBtn}
          </Link>
        </div>
      )}

      {/* Scheduled Online Classes (Microsoft Teams Integration) */}
      {upcomingSchedules.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[#464EB8] text-xs font-bold">
                <Video className="w-3.5 h-3.5" />
                <span>Microsoft Teams Online Classes</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">Upcoming Live Class Sessions</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Times displayed in East Africa Time (EAT)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingSchedules.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {new Date(sch.class_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 font-mono">
                      {sch.start_time?.slice(0, 5)} {sch.end_time ? `- ${sch.end_time.slice(0, 5)}` : ""}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                    {sch.subject_name || sch.course_title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Instructor: <strong className="text-slate-800">{sch.instructor_full_name || sch.teacher_name || "Academy Faculty"}</strong></span>
                  </div>

                  {sch.instructions && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                      {sch.instructions}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {sch.meeting_url ? (
                    <a
                      href={sch.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#464EB8] hover:bg-[#3B429F] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-[1.01]"
                    >
                      <Video className="w-4 h-4 shrink-0" />
                      <span>Join Microsoft Teams Class</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>No online meeting link added for this session yet.</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enrolled Courses Section */}
      {recentCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{t.myEnrolledCoursesTitle}</h2>
            <Link
              to="/dashboard/courses"
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              {t.tabAllCourses} ({recentCourses.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 uppercase">{c.difficulty}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        c.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {c.status === "completed" ? t.completedBadge : t.metricInProgress}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                    <Link to={`/learn/${c.course_slug}`} className="hover:text-blue-900">
                      {c.course_title}
                    </Link>
                  </h3>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>{t.classroomProgressLabel}</span>
                      <span className="font-bold text-slate-800">{c.progress_percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${c.progress_percent}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/learn/${c.course_slug}`}
                    className="w-full py-2.5 text-center text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors block"
                  >
                    {t.openClassroomBtn}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Earned Certificates */}
      {certificates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            {t.earnedCertificatesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Award className="w-8 h-8 text-amber-600" />
                  <span className="text-[11px] font-mono font-bold text-amber-900 bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                    {cert.certificate_code}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{cert.course_title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t.issuedDateLabel} {new Date(cert.issued_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/certificates/${cert.certificate_code}`}
                  className="w-full text-center py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors block"
                >
                  {t.viewCredentialCardBtn}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Courses */}
      {recommendedCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.recommendedNextTitle}</h2>
              <p className="text-xs text-slate-500">{t.recommendedNextDesc}</p>
            </div>
            <Link to="/courses" className="text-xs font-bold text-blue-900 hover:text-blue-700">
              {t.viewFullCatalog}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedCourses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}