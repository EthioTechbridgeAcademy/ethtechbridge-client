import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Award, CheckCircle2, BookOpen } from "lucide-react";
import { api } from "../../api/client.js";
import Pagination from "../../components/Pagination.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminStudentProgress() {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getStudentProgressList();
        setStudents(res.students || []);
      } catch (err) {
        console.error("Student progress load error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.course_title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedStudents = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold mb-1">
          <Users className="w-3.5 h-3.5 text-amber-500" />
          <span>Student Cohort Progression</span>
        </div>
        <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-snug font-sans">
          {t.adminNavStudentsProgress || "Student Learning Progress"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Monitor enrolled students, real-time lesson completion percentages, quiz scores, and verified certificates.
        </p>
      </div>

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
          placeholder="Filter by student name, email, or course..."
          className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-3">Course</th>
                <th className="py-3.5 px-3">Progress</th>
                <th className="py-3.5 px-3">Best Quiz Score</th>
                <th className="py-3.5 px-3">Certificate</th>
                <th className="py-3.5 px-4">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading student progress records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No matching student enrollment records found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{s.full_name}</p>
                      <p className="text-[11px] text-slate-500">{s.email}</p>
                      {s.phone && <p className="text-[10px] text-slate-400">{s.phone}</p>}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {s.course_title}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${s.progress_percent}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900">{s.progress_percent}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {s.max_quiz_score !== null && s.max_quiz_score !== undefined ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                          {s.max_quiz_score}%
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
                          <Award className="w-3 h-3 text-amber-600" /> {s.certificate_code}
                        </Link>
                      ) : (
                        <span className="text-slate-400">Incomplete</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(s.enrolled_at).toLocaleDateString()}
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

