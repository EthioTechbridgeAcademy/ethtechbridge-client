import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, BookOpen, RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../api/client.js";
import CourseCard from "../components/CourseCard.jsx";
import { CourseCardSkeleton } from "../components/LoadingSkeleton.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function CoursesPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state from URL query
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const difficulty = searchParams.get("difficulty") || "";
  const free = searchParams.get("free") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Load categories once
  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.categories || [])).catch(() => {});
  }, []);

  // Fetch filtered courses
  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const data = await api.getCourses({
          search,
          category,
          difficulty,
          free,
          sort,
          page,
          limit: 9
        });
        setCourses(data.courses || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to load courses:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [search, category, difficulty, free, sort, page]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1"); // reset to page 1 on filter change
    setSearchParams(next);
  }

  function clearAllFilters() {
    setSearchParams({});
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
          {t.catalogBadge}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {t.catalogTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t.catalogSubtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top search & sorting row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
            {search && (
              <button
                type="button"
                onClick={() => updateFilter("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="md:col-span-4">
            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-white"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="popular">{t.sortPopular}</option>
              <option value="title">{t.sortTitle}</option>
              <option value="duration">{t.sortDuration}</option>
            </select>
          </div>
        </div>

        {/* Filter Pills row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Category Tabs */}
          <button
            type="button"
            onClick={() => updateFilter("category", "all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              category === "all" || !category
                ? "bg-blue-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => updateFilter("category", cat.slug)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                category === cat.slug
                  ? "bg-blue-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.name} ({cat.course_count})
            </button>
          ))}

          {/* Difficulty Dropdown */}
          <select
            value={difficulty}
            onChange={(e) => updateFilter("difficulty", e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white"
          >
            <option value="">{t.diffAll}</option>
            <option value="beginner">{t.diffBeginner}</option>
            <option value="intermediate">{t.diffIntermediate}</option>
            <option value="advanced">{t.diffAdvanced}</option>
          </select>

          {/* Free / Paid toggle */}
          <select
            value={free}
            onChange={(e) => updateFilter("free", e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white"
          >
            <option value="">{t.costAll}</option>
            <option value="true">{t.costFreeOnly}</option>
          </select>

          {/* Clear filters if active */}
          {(search || (category && category !== "all") || difficulty || free) && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> {t.resetFilters}
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          {t.showingCourses} {courses.length} {t.ofCourses} {total} {t.coursesWord}
        </span>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-800">{t.noMatchTitle}</h3>
            <p className="text-sm text-slate-500">
              {t.noMatchDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-4 py-2 text-xs font-bold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            {t.clearAllFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => updateFilter("page", String(page - 1))}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-700 px-3">
            {t.pageWord} {page} {t.ofCourses} {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => updateFilter("page", String(page + 1))}
            className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}