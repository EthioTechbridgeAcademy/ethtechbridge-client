import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Layers, Search, AlertCircle } from "lucide-react";
import { api } from "../../api/client.js";
import Alert from "../../components/Alert.jsx";
import Pagination from "../../components/Pagination.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminCourses() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionMsg, setActionMsg] = useState({ type: "", text: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await api.getAdminCourses();
      setCourses(res.courses || []);
    } catch (err) {
      setActionMsg({ type: "error", text: err.message || "Failed to load courses." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function togglePublish(course) {
    try {
      const nextPublished = !course.is_published;
      await api.updateCourse(course.id, { isPublished: nextPublished });
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_published: nextPublished ? 1 : 0 } : c))
      );
      setActionMsg({
        type: "success",
        text: `Course "${course.title}" is now ${nextPublished ? "Published" : "Draft"}.`
      });
    } catch (err) {
      setActionMsg({ type: "error", text: err.message || "Could not update publish state." });
    }
  }

  async function handleDelete(courseId, title) {
    if (!confirm(`Are you sure you want to delete "${title}"? This will delete all its modules, lessons, and student progress!`)) {
      return;
    }

    try {
      await api.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setActionMsg({ type: "success", text: `Course "${title}" deleted.` });
    } catch (err) {
      setActionMsg({ type: "error", text: err.message || "Failed to delete course." });
    }
  }

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.slug || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedCourses = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Curriculum Management</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-snug font-sans">
            {t.adminNavCourses || "Manage Academy Courses"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, organize curriculum modules, and publish courses to the public catalog.
          </p>
        </div>
        <Link
          to="/admin/courses/new"
          className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> {t.adminBtnAddCourse || "Add New Course"}
        </Link>
      </div>

      {actionMsg.text && (
        <Alert
          type={actionMsg.type}
          message={actionMsg.text}
          onClose={() => setActionMsg({ type: "", text: "" })}
        />
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Filter courses by title or slug..."
          className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Curriculum</th>
                <th className="py-3.5 px-3">Students</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading courses...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No courses found.
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{course.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">/{course.slug}</p>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-600">
                      {course.category_name || "General"}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700">
                        {course.module_count || 0} modules &bull; {course.lesson_count || 0} lessons
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      {course.enrollment_count || 0}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => togglePublish(course)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-colors ${
                          course.is_published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {course.is_published ? (
                          <>
                            <Eye className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/courses/${course.id}/curriculum`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                          title="Edit Lessons & Modules"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(course.id, course.title)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}

