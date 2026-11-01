import { useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const grades = Array.from({ length: 12 }, (_, i) => i + 1);

export default function RegistrationModal({ onClose, initialSubjects = "", initialNotes = "" }) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    studentName: "",
    grade: "9",
    parentName: "",
    phone: "",
    email: "",
    preferredSubjects: initialSubjects,
    notes: initialNotes
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.submitTutoringRegistration(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{t.tutoringModalTitle}</h3>
            <p className="text-xs text-cyan-300">{t.tutoringModalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-xl text-slate-900">{t.applicationReceivedTitle}</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                {t.applicationReceivedDesc}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors"
              >
                {t.doneBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.studentFullNameReq}
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    required
                    value={form.studentName}
                    onChange={update}
                    placeholder="e.g. Dawit Bekele"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.currentGradeReq}
                  </label>
                  <select
                    name="grade"
                    value={form.grade}
                    onChange={update}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-white"
                  >
                    {grades.map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.parentNameReq}
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    required
                    value={form.parentName}
                    onChange={update}
                    placeholder="e.g. Bekele Tadesse"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phoneReq}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={update}
                    placeholder="0911223344"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.emailOptional}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.subjectsGoals}
                </label>
                <input
                  type="text"
                  name="preferredSubjects"
                  value={form.preferredSubjects}
                  onChange={update}
                  placeholder="e.g. Mathematics, Physics, Python coding"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition-colors disabled:opacity-50"
                >
                  {loading ? "..." : t.submitRegistrationBtn}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}