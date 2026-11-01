import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, ArrowRight, Award } from "lucide-react";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { CourseCardSkeleton } from "../components/LoadingSkeleton.jsx";

export default function MyCoursesPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, in_progress, completed
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getStudentCourses();
        setCourses(res.courses || []);
      } catch (err) {
        console.error("My courses error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.short_description || "").toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "completed") return c.status === "completed" || c.progress_percent === 100;
    if (filter === "in_progress") return c.status !== "completed" && c.progress_percent < 100;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.myCoursesHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.myCoursesHeadingSub}
          </p>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors shrink-0"
        >
          {t.exploreMoreCoursesBtn} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchMyCoursesPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filter === "all" ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.tabAllCourses} ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("in_progress")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filter === "in_progress"
                ? "bg-blue-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.tabInProgressCourses}
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filter === "completed"
                ? "bg-blue-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.tabCompletedCourses}
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <CourseCardSkeleton key={n} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-800">{t.noMatchTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {courses.length === 0
                ? t.noEnrollmentsYetDesc
                : t.noMatchDesc}
            </p>
          </div>
          {courses.length === 0 && (
            <Link
              to="/courses"
              className="inline-block px-6 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors"
            >
              {t.exploreFreeCoursesBtn}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => {
            const isFinished = course.status === "completed" || course.progress_percent === 100;
            return (
              <div
                key={course.course_id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 uppercase">{course.difficulty}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isFinished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {isFinished ? t.completedBadge : `${course.progress_percent}% ${t.enrolledBadge}`}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.short_description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>
                        {course.completed_lessons} {t.ofCourses} {course.total_lessons} {t.lessonsLabel}
                      </span>
                      <span className="font-bold text-slate-800">{course.progress_percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress_percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to={`/learn/${course.slug}`}
                      className="w-full py-2.5 text-center text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isFinished ? t.reviewCourseBtn : t.continueBtn} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {course.certificate_code && (
                      <Link
                        to={`/certificates/${course.certificate_code}`}
                        className="w-full py-2 text-center text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" /> {t.viewCredentialCardBtn}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}