import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Save, Sparkles } from "lucide-react";
import { api } from "../../api/client.js";
import Alert from "../../components/Alert.jsx";

export default function AdminCourseEditor() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    difficulty: "beginner",
    format: "online",
    durationHours: 10,
    shortDescription: "",
    description: "",
    thumbnailUrl: "",
    instructorName: "Ethio Techbridge Faculty",
    instructorTitle: "Lead Instructor",
    prerequisites: "",
    learningObjectives: "",
    isFree: true,
    isPublished: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.categories || [])).catch(() => {});
  }, []);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.createCourse({
        ...form,
        durationHours: Number(form.durationHours) || 10,
        categoryId: form.categoryId ? Number(form.categoryId) : null
      });

      // Redirect directly to the curriculum builder for the newly created course!
      navigate(`/admin/courses/${res.courseId}/curriculum`);
    } catch (err) {
      setError(err.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/courses"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Courses List
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 font-sans tracking-tight leading-snug">
            Create New Academy Course
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Define course metadata, learning objectives, and publishing status for the academy catalog.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={update}
                placeholder="e.g. Next.js & React Native App Development"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={update}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 bg-white"
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={update}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all_levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Est. Duration (Hours)
                </label>
                <input
                  type="number"
                  name="durationHours"
                  min={1}
                  value={form.durationHours}
                  onChange={update}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Description (Card Summary)
              </label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={update}
                placeholder="A concise 1-2 sentence overview for course cards..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Description (Detailed Syllabus)
              </label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={update}
                placeholder="In-depth explanation of what the course covers, real-world applications, and exercises..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cover Image Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={form.thumbnailUrl}
                onChange={update}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  name="instructorName"
                  value={form.instructorName}
                  onChange={update}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instructor Title
                </label>
                <input
                  type="text"
                  name="instructorTitle"
                  value={form.instructorTitle}
                  onChange={update}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>
            </div>

            {/* Checkbox options */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={form.isFree}
                  onChange={update}
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span>Free Course (100% Free Enrollment)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={form.isPublished}
                  onChange={update}
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span>Publish Immediately to Public Catalog</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/courses"
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Course & Build Curriculum"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

