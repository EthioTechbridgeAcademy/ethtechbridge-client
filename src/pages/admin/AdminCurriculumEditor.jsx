import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Plus, Layers, PlayCircle, FileText, Trash2,
  CheckCircle2, AlertCircle, Save, Sparkles, Lock
} from "lucide-react";
import { api } from "../../api/client.js";
import Alert from "../../components/Alert.jsx";

export default function AdminCurriculumEditor() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add module form state
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");

  // Add lesson form state
  const [activeModuleForLesson, setActiveModuleForLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    contentType: "article",
    contentText: "",
    videoUrl: "",
    durationMinutes: 15,
    isPreview: false
  });

  async function loadCurriculum() {
    setLoading(true);
    try {
      const res = await api.getCurriculum(id);
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load curriculum.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurriculum();
  }, [id]);

  async function handleCreateModule(e) {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    try {
      await api.addModule(id, {
        title: newModuleTitle.trim(),
        description: newModuleDesc.trim()
      });
      setSuccess("Module created successfully.");
      setNewModuleTitle("");
      setNewModuleDesc("");
      setShowAddModule(false);
      loadCurriculum();
    } catch (err) {
      setError(err.message || "Failed to create module.");
    }
  }

  async function handleAddLesson(e) {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;

    try {
      await api.addLesson(id, {
        ...lessonForm,
        moduleId: activeModuleForLesson,
        durationMinutes: Number(lessonForm.durationMinutes) || 15
      });
      setSuccess("Lesson added successfully.");
      setLessonForm({
        title: "",
        contentType: "article",
        contentText: "",
        videoUrl: "",
        durationMinutes: 15,
        isPreview: false
      });
      setActiveModuleForLesson(null);
      loadCurriculum();
    } catch (err) {
      setError(err.message || "Failed to add lesson.");
    }
  }

  async function handleDeleteLesson(lessonId, lessonTitle) {
    if (!confirm(`Delete lesson "${lessonTitle}"?`)) return;

    try {
      await api.deleteLesson(lessonId);
      setSuccess("Lesson deleted.");
      loadCurriculum();
    } catch (err) {
      setError(err.message || "Failed to delete lesson.");
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading curriculum...</div>;
  }

  const { course, modules = [], lessons = [], quizzes = [] } = data || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
        <span className="text-xs font-bold text-slate-500">Course ID: {id}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 font-sans tracking-tight leading-snug">
              Curriculum Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Course: <strong className="text-slate-800 font-bold">{course?.title}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModule(true)}
            className="px-5 py-2.5 bg-[#1E3A8A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-[#172554] transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Module
          </button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

        {/* Add Module Modal / Inline Box */}
        {showAddModule && (
          <form
            onSubmit={handleCreateModule}
            className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in"
          >
            <h3 className="font-bold text-sm text-blue-950">New Curriculum Module</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Module Title *</label>
                <input
                  type="text"
                  required
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="e.g. Module 1: Core Fundamentals"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={newModuleDesc}
                  onChange={(e) => setNewModuleDesc(e.target.value)}
                  placeholder="Brief summary of concepts in this module..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModule(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-900 text-white font-bold text-xs rounded-lg"
              >
                Save Module
              </button>
            </div>
          </form>
        )}

        {/* Add Lesson Modal / Inline Box */}
        {activeModuleForLesson !== null && (
          <form
            onSubmit={handleAddLesson}
            className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in"
          >
            <h3 className="font-bold text-sm text-emerald-950">Add Lesson to Module</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Title *</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g. Setting up your coding environment"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Min)</label>
                <input
                  type="number"
                  min={1}
                  value={lessonForm.durationMinutes}
                  onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Content Type</label>
                <select
                  value={lessonForm.contentType}
                  onChange={(e) => setLessonForm({ ...lessonForm, contentType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="article">Reading / Article</option>
                  <option value="video">Video Lecture</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Video Embed URL (YouTube)</label>
                <input
                  type="url"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Notes & Markdown Content</label>
              <textarea
                rows={4}
                value={lessonForm.contentText}
                onChange={(e) => setLessonForm({ ...lessonForm, contentText: e.target.value })}
                placeholder="Markdown text, code examples, instructions..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={lessonForm.isPreview}
                  onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                  className="rounded border-slate-300 text-blue-900"
                />
                <span>Allow Public Free Preview (Viewable without account)</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModuleForLesson(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-lg"
                >
                  Save Lesson
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Modules & Lessons List */}
        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
              No modules yet. Click "Add Module" to start structuring this course.
            </div>
          ) : (
            modules.map((mod) => {
              const modLessons = lessons.filter((l) => l.module_id === mod.id);

              return (
                <div key={mod.id} className="rounded-2xl border border-slate-200 overflow-hidden space-y-2 p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{mod.title}</h3>
                      {mod.description && <p className="text-xs text-slate-500">{mod.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModuleForLesson(mod.id)}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs rounded-lg border border-slate-200 flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Lesson
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-1.5 pt-2">
                    {modLessons.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic px-2">No lessons in this module yet.</p>
                    ) : (
                      modLessons.map((les, lIdx) => (
                        <div
                          key={les.id}
                          className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="font-mono text-slate-400 font-bold">{lIdx + 1}.</span>
                            {les.content_type === "video" ? (
                              <PlayCircle className="w-4 h-4 text-blue-900 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="font-bold text-slate-800 truncate">{les.title}</span>
                            {les.is_preview && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Preview
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-slate-400 text-[11px]">{les.duration_minutes}m</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(les.id, les.title)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Delete lesson"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

