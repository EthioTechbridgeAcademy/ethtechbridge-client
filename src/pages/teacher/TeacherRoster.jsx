import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users, ArrowLeft, Search, Award, CheckCircle2,
  BookOpen, AlertCircle, Mail, Phone
} from "lucide-react";
import { api } from "../../api/client.js";
import Pagination from "../../components/Pagination.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function TeacherRoster() {
  const { t } = useLanguage();
  const { id, courseId } = useParams();
  const effectiveId = id || courseId;
  const [course, setCourse] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function loadRoster() {
      if (!effectiveId) return;
      setLoading(true);
      setError("");
      try {
        const res = await api.getInstructorCourseRoster(effectiveId);
        setCourse(res.course);
        setRoster(res.roster || []);
      } catch (err) {
        setError(err.message || "Failed to load class roster.");
      } finally {
        setLoading(false);
      }
    }
    loadRoster();
  }, [effectiveId]);

  const filtered = roster.filter((s) =>
    (s.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedStudents = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Link
            to="/teacher/classes"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t.backToCourses || "Back to My Courses"}
          </Link>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.teacherViewRoster || "Class Student Roster"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {course?.title || "Class Cohort"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor student completion percentage, quiz assessment performance, and certificate issuance for this class.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Filter students by name or email..."
          className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
        />
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-3">Contact</th>
                <th className="py-3.5 px-3">Curriculum Progress</th>
                <th className="py-3.5 px-3">Best Quiz Score</th>
                <th className="py-3.5 px-3">Certificate</th>
                <th className="py-3.5 px-4 text-right">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading student cohort roster...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No enrolled students found for this class.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr key={s.user_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-xs flex items-center justify-center shrink-0">
                          {s.full_name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{s.full_name}</p>
                          <p className="text-[11px] text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="text-[11px] text-slate-700 font-mono">{s.phone || "—"}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              s.progress_percent === 100 ? "bg-emerald-500" : "bg-[#1E3A8A]"
                            }`}
                            style={{ width: `${s.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs text-slate-800">{s.progress_percent || 0}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {s.best_quiz_score !== null && s.best_quiz_score !== undefined ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                          {s.best_quiz_score}%
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not taken</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {s.certificate_code ? (
                        <Link
                          to={`/certificates/${s.certificate_code}`}
                          className="px-2 py-0.5 rounded text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 hover:underline inline-flex items-center gap-1"
                        >
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>{s.certificate_code}</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400">Incomplete</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {new Date(s.enrolled_at).toLocaleDateString()}
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
