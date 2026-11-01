import { useState, useEffect } from "react";
import {
  FolderOpen, Plus, Trash2, ExternalLink, BookOpen,
  AlertCircle, Link2, FileText, Code, Video, X, Save
} from "lucide-react";
import { api } from "../../api/client.js";
import Alert from "../../components/Alert.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function TeacherResources() {
  const { t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Add Resource Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    resourceType: "link",
    url: "",
    description: ""
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [resRes, coursesRes] = await Promise.all([
        api.getInstructorResources(),
        api.getInstructorCourses()
      ]);
      setResources(resRes.resources || []);
      setCourses(coursesRes.courses || []);
      if (coursesRes.courses?.length && !form.courseId) {
        setForm((prev) => ({ ...prev, courseId: String(coursesRes.courses[0].id) }));
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to load resources." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.courseId || !form.title.trim() || !form.url.trim()) {
      setFormError("Please select a course and enter a title and URL.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createInstructorResource({
        courseId: Number(form.courseId),
        title: form.title.trim(),
        resourceType: form.resourceType,
        url: form.url.trim(),
        description: form.description.trim()
      });
      setMsg({ type: "success", text: "Resource shared successfully with students." });
      setShowAddModal(false);
      setForm({
        courseId: courses[0]?.id ? String(courses[0].id) : "",
        title: "",
        resourceType: "link",
        url: "",
        description: ""
      });
      loadData();
    } catch (err) {
      setFormError(err.message || "Failed to share resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteInstructorResource(id);
      setMsg({ type: "success", text: "Resource removed." });
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to delete resource." });
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "code":
        return <Code className="w-4 h-4 text-emerald-600" />;
      case "video":
        return <Video className="w-4 h-4 text-purple-600" />;
      case "document":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Link2 className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold mb-1">
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Supplementary Library</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t.teacherNavResources || "Class Resources"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {t.teacherResourcesSubtitle || "Distribute supplementary notes, code repository links, and study reference materials to your enrolled students."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormError("");
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Share New Resource
        </button>
      </div>

      {msg.text && (
        <Alert
          type={msg.type}
          message={msg.text}
          onClose={() => setMsg({ type: "", text: "" })}
        />
      )}

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-3xl border border-slate-200" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-2">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">No resources shared yet.</p>
          <p className="text-xs text-slate-500">Click &ldquo;Share New Resource&rdquo; to add reference links for students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                    {getResourceIcon(res.resource_type)}
                    <span>{res.resource_type}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(res.id, res.title)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{res.title}</h3>
                <p className="text-[11px] font-semibold text-[#1E3A8A]">
                  Course: {res.course_title}
                </p>
                {res.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{res.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-slate-400">
                  {new Date(res.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-sans tracking-tight">Share Teaching Resource</h3>
                  <p className="text-[11px] text-slate-500">Provide supplementary learning links for enrolled students</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Course Track *
                </label>
                <select
                  required
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:outline-none focus:border-[#1E3A8A]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Lesson 4 GitHub Starter Repo, Lecture Slides PDF"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={form.resourceType}
                    onChange={(e) => setForm({ ...form, resourceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:outline-none focus:border-[#1E3A8A]"
                  >
                    <option value="link">Web Link</option>
                    <option value="code">GitHub / Code</option>
                    <option value="document">Document / PDF</option>
                    <option value="video">Recorded Video</option>
                    <option value="other">Other Reference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Direct Resource URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1E3A8A] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brief Instructions / Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional note for students..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-[#172554] text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? "Sharing..." : "Share Resource"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

