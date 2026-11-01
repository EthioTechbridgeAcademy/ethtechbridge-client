import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Search, ExternalLink, ArrowRight, AlertCircle, Layers } from "lucide-react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function TeacherClasses() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getInstructorCourses();
        setCourses(res.courses || []);
      } catch (err) {
        setError(err.message || "Failed to load assigned courses.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.slug || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold mb-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.teacherAssignedClasses || "Assigned Classes"}</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {t.teacherNavClasses || "My Classes & Rosters"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          {t.teacherClassesSubtitle || "View all academic courses assigned to you, inspect active student cohorts, and review curriculum modules."}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder || "Filter courses by name..."}
          className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-3xl border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">No assigned courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 uppercase text-[10px]">
                    {course.category_name || "General"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200">
                    {course.enrollment_count || 0} Students
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {course.short_description || "Curriculum track prepared for academy students."}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{course.lesson_count || 0} Lessons</span>
                  <span>&bull;</span>
                  <span>Grade {course.grade_range || "1-12"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  to={`/teacher/classes/${course.id}/roster`}
                  className="flex-1 py-2 px-3 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t.teacherViewRoster || "Student Roster"}</span>
                </Link>
                <Link
                  to={`/courses/${course.slug}`}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  title="Open in LMS Catalog"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

