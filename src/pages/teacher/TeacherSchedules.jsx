import { useState, useEffect } from "react";
import {
  Calendar, Video, ExternalLink, Clock, Edit2, AlertCircle,
  CheckCircle2, Plus, Sparkles, X, Globe, Save
} from "lucide-react";
import { api } from "../../api/client.js";
import { validateTeamsMeetingUrl } from "../../utils/teamsUrl.js";
import Pagination from "../../components/Pagination.jsx";
import Alert from "../../components/Alert.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function TeacherSchedules() {
  const { t } = useLanguage();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Edit schedule modal
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editForm, setEditForm] = useState({
    meetingUrl: "",
    instructions: "",
    status: "scheduled"
  });
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadSchedules() {
    setLoading(true);
    try {
      const res = await api.getInstructorSchedules();
      setSchedules(res.schedules || []);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to load class schedules." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleOpenEdit = (sch) => {
    setEditingSchedule(sch);
    setEditForm({
      meetingUrl: sch.meeting_url || "",
      instructions: sch.instructions || "",
      status: sch.status || "scheduled"
    });
    setEditError("");
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setEditError("");

    if (editForm.meetingUrl && editForm.meetingUrl.trim()) {
      const validation = validateTeamsMeetingUrl(editForm.meetingUrl);
      if (!validation.valid) {
        setEditError(validation.error);
        return;
      }
    }

    setSaving(true);
    try {
      await api.updateInstructorSchedule(editingSchedule.id, {
        meetingUrl: editForm.meetingUrl.trim() || "",
        instructions: editForm.instructions,
        status: editForm.status
      });
      setMsg({ type: "success", text: "Schedule and Microsoft Teams link updated successfully." });
      setEditingSchedule(null);
      loadSchedules();
    } catch (err) {
      setEditError(err.message || "Failed to update schedule.");
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(schedules.length / pageSize));
  const paginatedSchedules = schedules.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[#464EB8] text-xs font-bold mb-1">
          <Video className="w-3.5 h-3.5" />
          <span>Microsoft Teams Timetable</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {t.teacherNavSchedules || "Live Schedule & Teams"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          {t.teacherSchedulesSubtitle || "View your upcoming and past class sessions, manage Microsoft Teams meeting links, and coordinate with students."}
        </p>
      </div>

      {msg.text && (
        <Alert
          type={msg.type}
          message={msg.text}
          onClose={() => setMsg({ type: "", text: "" })}
        />
      )}

      {/* Schedule Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Subject / Course</th>
                <th className="py-3.5 px-3">Date & Time (EAT)</th>
                <th className="py-3.5 px-3">Student / Cohort</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Microsoft Teams Link</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading teaching schedule sessions...
                  </td>
                </tr>
              ) : paginatedSchedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No teaching schedules assigned to your account yet.
                  </td>
                </tr>
              ) : (
                paginatedSchedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Subject */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{sch.subject_name || sch.course_title}</p>
                      {sch.instructions && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic">{sch.instructions}</p>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-800">
                        {new Date(sch.class_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {sch.start_time?.slice(0, 5)} {sch.end_time ? `- ${sch.end_time.slice(0, 5)}` : ""}
                      </p>
                    </td>

                    {/* Student / Cohort */}
                    <td className="py-3.5 px-3">
                      {sch.student_name ? (
                        <div>
                          <p className="font-bold text-slate-800">{sch.student_name}</p>
                          <p className="text-[10px] text-slate-400">Grade {sch.grade || "1-12"}</p>
                        </div>
                      ) : sch.course_title ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1E3A8A] border border-blue-200">
                          Enrolled Cohort
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Academy Class</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sch.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : sch.status === "cancelled"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {sch.status}
                      </span>
                    </td>

                    {/* Microsoft Teams Meeting Link */}
                    <td className="py-3.5 px-3">
                      {sch.meeting_url ? (
                        <a
                          href={sch.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#464EB8] hover:bg-[#3B429F] text-white text-[11px] font-bold rounded-lg shadow-2xs transition-colors"
                        >
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span>Join Teams Class</span>
                          <ExternalLink className="w-3 h-3 opacity-75 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                          Link not configured
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(sch)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        title="Configure Meeting Link & Details"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Link</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={schedules.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>

      {/* Edit Teams Meeting Link Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-[#464EB8] flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-sans tracking-tight">Configure Microsoft Teams Link</h3>
                  <p className="text-[11px] text-slate-500">{editingSchedule.subject_name || editingSchedule.course_title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Microsoft Teams Meeting URL
                </label>
                <input
                  type="url"
                  value={editForm.meetingUrl}
                  onChange={(e) => setEditForm({ ...editForm, meetingUrl: e.target.value })}
                  placeholder="https://teams.microsoft.com/l/meetup-join/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#464EB8] font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Must be a secure HTTPS link from an approved Microsoft host (teams.microsoft.com, teams.live.com).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Session Instructions & Prerequisites
                </label>
                <textarea
                  rows={3}
                  value={editForm.instructions}
                  onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                  placeholder="e.g., Have VS Code open, prepare questions on lesson 3..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#464EB8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class Session Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#464EB8] font-semibold"
                >
                  <option value="scheduled">Scheduled (Active)</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#464EB8] hover:bg-[#3B429F] text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Teams Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

