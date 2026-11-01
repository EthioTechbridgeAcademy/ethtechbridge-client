import { useState, useEffect } from "react";
import {
  Users, Calendar, Megaphone, Plus, Trash2, CheckCircle2,
  Search, ArrowRight, Video, ExternalLink, Edit2, X, AlertCircle,
  Clock, Filter, BookOpen, GraduationCap, Globe
} from "lucide-react";
import { api } from "../../api/client.js";
import { validateTeamsMeetingUrl } from "../../utils/teamsUrl.js";
import Alert from "../../components/Alert.jsx";
import Pagination from "../../components/Pagination.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

const grades = Array.from({ length: 12 }, (_, i) => i + 1);

export default function AdminTutoring() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("students"); // students, schedules, announcements
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Pagination states
  const [stuPage, setStuPage] = useState(1);
  const [stuPageSize, setStuPageSize] = useState(10);

  const [schPage, setSchPage] = useState(1);
  const [schPageSize, setSchPageSize] = useState(10);
  const [schSearch, setSchSearch] = useState("");
  const [schCourseFilter, setSchCourseFilter] = useState("all");
  const [schMissingLinkOnly, setSchMissingLinkOnly] = useState(false);

  const [annPage, setAnnPage] = useState(1);
  const [annPageSize, setAnnPageSize] = useState(6);

  // Schedule modal form state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleForm, setScheduleForm] = useState({
    courseId: "",
    instructorId: "",
    studentId: "",
    subjectName: "",
    classDate: "",
    startTime: "09:00",
    endTime: "10:30",
    timezone: "Africa/Addis_Ababa",
    teacherName: "",
    meetingUrl: "",
    instructions: "",
    status: "scheduled"
  });

  // Edit Schedule Modal state
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editScheduleForm, setEditScheduleForm] = useState({
    courseId: "",
    instructorId: "",
    studentId: "",
    subjectName: "",
    classDate: "",
    startTime: "",
    endTime: "",
    timezone: "Africa/Addis_Ababa",
    teacherName: "",
    meetingUrl: "",
    instructions: "",
    status: "scheduled"
  });
  const [editError, setEditError] = useState("");

  // Announcement form state
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annForm, setAnnForm] = useState({
    title: "",
    category: "General",
    content: "",
    excerpt: ""
  });

  async function loadData() {
    setLoading(true);
    try {
      const [stuRes, schRes, annRes, instRes, coursesRes] = await Promise.all([
        api.getAdminStudents(""),
        api.getSchedules(),
        api.getAdminAnnouncements(),
        api.getAdminInstructors().catch(() => ({ instructors: [] })),
        api.getAdminCourses().catch(() => ({ courses: [] }))
      ]);
      setStudents(stuRes.students || []);
      setSchedules(schRes.schedules || []);
      setAnnouncements(annRes.announcements || []);
      setInstructors(instRes.instructors || []);
      setCourses(coursesRes.courses || []);
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to load tutoring data." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAssignGrade(studentId, assignedGrade) {
    try {
      await api.assignStudentGrade(studentId, Number(assignedGrade));
      setMsg({ type: "success", text: `Assigned Grade ${assignedGrade} to student.` });
      loadData();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to assign grade." });
    }
  }

  async function handleCreateSchedule(e) {
    e.preventDefault();
    setScheduleError("");

    if (scheduleForm.meetingUrl && scheduleForm.meetingUrl.trim()) {
      const valid = validateTeamsMeetingUrl(scheduleForm.meetingUrl);
      if (!valid.valid) {
        setScheduleError(valid.error);
        return;
      }
    }

    try {
      await api.createSchedule({
        courseId: scheduleForm.courseId ? Number(scheduleForm.courseId) : null,
        instructorId: scheduleForm.instructorId ? Number(scheduleForm.instructorId) : null,
        studentId: scheduleForm.studentId ? Number(scheduleForm.studentId) : null,
        subjectName: scheduleForm.subjectName.trim(),
        classDate: scheduleForm.classDate,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime || null,
        timezone: scheduleForm.timezone || "Africa/Addis_Ababa",
        teacherName: scheduleForm.teacherName,
        meetingUrl: scheduleForm.meetingUrl.trim(),
        instructions: scheduleForm.instructions,
        status: scheduleForm.status || "scheduled"
      });
      setMsg({ type: "success", text: "Class schedule and Microsoft Teams session created successfully." });
      setShowScheduleModal(false);
      setScheduleForm({
        courseId: "",
        instructorId: "",
        studentId: "",
        subjectName: "",
        classDate: "",
        startTime: "09:00",
        endTime: "10:30",
        timezone: "Africa/Addis_Ababa",
        teacherName: "",
        meetingUrl: "",
        instructions: "",
        status: "scheduled"
      });
      loadData();
    } catch (err) {
      setScheduleError(err.message || "Failed to create schedule.");
    }
  }

  function handleOpenEditSchedule(sch) {
    setEditingSchedule(sch);
    setEditScheduleForm({
      courseId: sch.course_id ? String(sch.course_id) : "",
      instructorId: sch.instructor_id ? String(sch.instructor_id) : "",
      studentId: sch.student_id ? String(sch.student_id) : "",
      subjectName: sch.subject_name || "",
      classDate: sch.class_date ? sch.class_date.split("T")[0] : "",
      startTime: sch.start_time ? sch.start_time.slice(0, 5) : "",
      endTime: sch.end_time ? sch.end_time.slice(0, 5) : "",
      timezone: sch.timezone || "Africa/Addis_Ababa",
      teacherName: sch.teacher_name || "",
      meetingUrl: sch.meeting_url || "",
      instructions: sch.instructions || "",
      status: sch.status || "scheduled"
    });
    setEditError("");
  }

  async function handleUpdateSchedule(e) {
    e.preventDefault();
    setEditError("");

    if (editScheduleForm.meetingUrl && editScheduleForm.meetingUrl.trim()) {
      const valid = validateTeamsMeetingUrl(editScheduleForm.meetingUrl);
      if (!valid.valid) {
        setEditError(valid.error);
        return;
      }
    }

    try {
      await api.updateSchedule(editingSchedule.id, {
        courseId: editScheduleForm.courseId ? Number(editScheduleForm.courseId) : null,
        instructorId: editScheduleForm.instructorId ? Number(editScheduleForm.instructorId) : null,
        studentId: editScheduleForm.studentId ? Number(editScheduleForm.studentId) : null,
        subjectName: editScheduleForm.subjectName.trim(),
        classDate: editScheduleForm.classDate,
        startTime: editScheduleForm.startTime,
        endTime: editScheduleForm.endTime || null,
        timezone: editScheduleForm.timezone,
        teacherName: editScheduleForm.teacherName,
        meetingUrl: editScheduleForm.meetingUrl.trim(),
        instructions: editScheduleForm.instructions,
        status: editScheduleForm.status
      });
      setMsg({ type: "success", text: "Schedule and Microsoft Teams link updated successfully." });
      setEditingSchedule(null);
      loadData();
    } catch (err) {
      setEditError(err.message || "Failed to update schedule.");
    }
  }

  async function handleDeleteSchedule(id) {
    if (!confirm("Are you sure you want to delete this class schedule?")) return;
    try {
      await api.deleteSchedule(id);
      setMsg({ type: "success", text: "Schedule deleted." });
      loadData();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to delete schedule." });
    }
  }

  async function handleCreateAnnouncement(e) {
    e.preventDefault();
    try {
      await api.createAnnouncement(annForm);
      setMsg({ type: "success", text: "Announcement published." });
      setShowAnnModal(false);
      setAnnForm({ title: "", category: "General", content: "", excerpt: "" });
      loadData();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to publish announcement." });
    }
  }

  async function handleDeleteAnnouncement(id) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await api.deleteAnnouncement(id);
      setMsg({ type: "success", text: "Announcement deleted." });
      loadData();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to delete announcement." });
    }
  }

  // Filter schedules
  const filteredSchedules = schedules.filter((sch) => {
    if (schMissingLinkOnly && sch.meeting_url) return false;
    if (schCourseFilter !== "all" && String(sch.course_id) !== schCourseFilter) return false;
    if (schSearch.trim()) {
      const q = schSearch.toLowerCase();
      const matchSub = sch.subject_name?.toLowerCase().includes(q);
      const matchTeach = (sch.instructor_full_name || sch.teacher_name || "").toLowerCase().includes(q);
      const matchStu = (sch.student_name || "").toLowerCase().includes(q);
      const matchCourse = (sch.course_title || "").toLowerCase().includes(q);
      if (!matchSub && !matchTeach && !matchStu && !matchCourse) return false;
    }
    return true;
  });

  // Pagination calculations for each tab
  const totalStuPages = Math.max(1, Math.ceil(students.length / stuPageSize));
  const paginatedStudents = students.slice((stuPage - 1) * stuPageSize, stuPage * stuPageSize);

  const totalSchPages = Math.max(1, Math.ceil(filteredSchedules.length / schPageSize));
  const paginatedSchedules = filteredSchedules.slice((schPage - 1) * schPageSize, schPage * schPageSize);

  const totalAnnPages = Math.max(1, Math.ceil(announcements.length / annPageSize));
  const paginatedAnnouncements = announcements.slice((annPage - 1) * annPageSize, annPage * annPageSize);

  // Teams URL live validation checks for forms
  const createUrlValidation = scheduleForm.meetingUrl ? validateTeamsMeetingUrl(scheduleForm.meetingUrl) : null;
  const editUrlValidation = editScheduleForm.meetingUrl ? validateTeamsMeetingUrl(editScheduleForm.meetingUrl) : null;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold mb-1">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>Campus Timetables, Online Classes & Tutoring</span>
        </div>
        <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-snug font-sans">
          {t.adminNavTutoring || "Tutoring, Schedules & Microsoft Teams"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Manage local tutoring registrations for Addis Ababa families (CMC, Summit, 72, Ayat), live class timetables, and Microsoft Teams meeting sessions.
        </p>
      </div>

      {msg.text && (
        <Alert type={msg.type} message={msg.text} onClose={() => setMsg({ type: "", text: "" })} />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setTab("students")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            tab === "students" ? "bg-[#1E3A8A] text-white" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Registration Inquiries ({students.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("schedules")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            tab === "schedules" ? "bg-[#1E3A8A] text-white" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Class Schedules & Teams ({schedules.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("announcements")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            tab === "announcements" ? "bg-[#1E3A8A] text-white" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Announcements & News ({announcements.length})
        </button>
      </div>

      {/* TAB 1: REGISTRATIONS */}
      {tab === "students" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Parent</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Assigned Grade</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No student registration inquiries found.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.student_name}</td>
                      <td className="py-3 px-3 text-slate-700">{s.parent_name}</td>
                      <td className="py-3 px-3 font-semibold">Grade {s.grade}</td>
                      <td className="py-3 px-3 font-mono">{s.phone}</td>
                      <td className="py-3 px-3">
                        <select
                          value={s.assigned_grade || ""}
                          onChange={(e) => handleAssignGrade(s.id, e.target.value)}
                          className="px-2 py-1 text-xs rounded border border-slate-200 bg-white"
                        >
                          <option value="">Unassigned</option>
                          {grades.map((g) => (
                            <option key={g} value={g}>
                              Grade {g}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Tab 1 Pagination */}
          <Pagination
            currentPage={stuPage}
            totalPages={totalStuPages}
            totalItems={students.length}
            pageSize={stuPageSize}
            onPageChange={setStuPage}
            onPageSizeChange={(sz) => {
              setStuPageSize(sz);
              setStuPage(1);
            }}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      )}

      {/* TAB 2: SCHEDULES & TEAMS */}
      {tab === "schedules" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={schSearch}
                  onChange={(e) => {
                    setSchSearch(e.target.value);
                    setSchPage(1);
                  }}
                  placeholder="Search subject, teacher..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-900"
                />
              </div>

              <select
                value={schCourseFilter}
                onChange={(e) => {
                  setSchCourseFilter(e.target.value);
                  setSchPage(1);
                }}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  setSchMissingLinkOnly(!schMissingLinkOnly);
                  setSchPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  schMissingLinkOnly
                    ? "bg-amber-100 border-amber-300 text-amber-900"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Missing Teams Link ({schedules.filter((s) => !s.meeting_url).length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Schedule New Class
            </button>
          </div>

          {/* Add Schedule Modal Form */}
          {showScheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <form
                onSubmit={handleCreateSchedule}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-sans tracking-tight">Schedule New Class Session</h3>
                    <p className="text-xs text-slate-500">Configure class details and Microsoft Teams meeting link.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {scheduleError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{scheduleError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Course Link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Linked Course (Optional for 1-1 Tutoring)
                    </label>
                    <select
                      value={scheduleForm.courseId}
                      onChange={(e) => {
                        const cId = e.target.value;
                        const c = courses.find((x) => String(x.id) === cId);
                        setScheduleForm((prev) => ({
                          ...prev,
                          courseId: cId,
                          subjectName: prev.subjectName || (c?.title || ""),
                          instructorId: prev.instructorId || (c?.instructor_user_id ? String(c.instructor_user_id) : ""),
                          teacherName: prev.teacherName || (c?.instructor_name || "")
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">No Course Link (Standalone Tutoring)</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student (or Cohort) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student / Cohort
                    </label>
                    <select
                      value={scheduleForm.studentId}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, studentId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">Entire Course Cohort (All Enrolled)</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.student_name} (Grade {s.grade})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject / Session Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.subjectName}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, subjectName: e.target.value })}
                      placeholder="e.g. Physics Mechanics or Python Live Lab"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  {/* Instructor Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instructor / Teacher
                    </label>
                    <select
                      value={scheduleForm.instructorId}
                      onChange={(e) => {
                        const iId = e.target.value;
                        const inst = instructors.find((x) => String(x.id) === iId);
                        setScheduleForm((prev) => ({
                          ...prev,
                          instructorId: iId,
                          teacherName: inst ? inst.full_name : prev.teacherName
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">Select registered instructor...</option>
                      {instructors.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.full_name} ({i.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Class Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduleForm.classDate}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, classDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Start Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleForm.startTime}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={scheduleForm.endTime}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Timezone display */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                  <input
                    type="text"
                    disabled
                    value={`${scheduleForm.timezone} (East Africa Time, UTC+3)`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                  />
                </div>

                {/* Microsoft Teams URL Input with Real-time Validation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#464EB8]" />
                      <span>Microsoft Teams Meeting URL</span>
                    </label>
                    {createUrlValidation && (
                      createUrlValidation.valid ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid Teams Meeting Link
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Unapproved URL Format
                        </span>
                      )
                    )}
                  </div>
                  <input
                    type="url"
                    value={scheduleForm.meetingUrl}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, meetingUrl: e.target.value })}
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#464EB8]"
                  />
                  <p className="text-[10px] text-slate-500">
                    Must be an approved HTTPS Microsoft Teams URL (<code className="text-slate-700">teams.microsoft.com</code>, <code className="text-slate-700">teams.live.com</code>, or <code className="text-slate-700">meet.microsoft.com</code>).
                  </p>
                </div>

                {/* Session Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Instructions / Preparation Agenda
                  </label>
                  <textarea
                    rows={2}
                    value={scheduleForm.instructions}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, instructions: e.target.value })}
                    placeholder="e.g. Please bring your completed Chapter 3 worksheet and have your microphone tested."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Session Status</label>
                  <select
                    value={scheduleForm.status}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Create Class Session
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* EDIT SCHEDULE MODAL */}
          {editingSchedule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <form
                onSubmit={handleUpdateSchedule}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-sans tracking-tight">Edit Class Schedule</h3>
                    <p className="text-xs text-slate-500">Update session timing, assigned faculty, and Microsoft Teams link.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingSchedule(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {editError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Course Link */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Linked Course
                    </label>
                    <select
                      value={editScheduleForm.courseId}
                      onChange={(e) => setEditScheduleForm({ ...editScheduleForm, courseId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">No Course Link (Standalone)</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student / Cohort
                    </label>
                    <select
                      value={editScheduleForm.studentId}
                      onChange={(e) => setEditScheduleForm({ ...editScheduleForm, studentId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">Entire Course Cohort (All Enrolled)</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.student_name} (Grade {s.grade})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject / Session Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editScheduleForm.subjectName}
                      onChange={(e) => setEditScheduleForm({ ...editScheduleForm, subjectName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  {/* Instructor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instructor / Teacher
                    </label>
                    <select
                      value={editScheduleForm.instructorId}
                      onChange={(e) => {
                        const iId = e.target.value;
                        const inst = instructors.find((x) => String(x.id) === iId);
                        setEditScheduleForm((prev) => ({
                          ...prev,
                          instructorId: iId,
                          teacherName: inst ? inst.full_name : prev.teacherName
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">Select registered instructor...</option>
                      {instructors.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.full_name} ({i.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Class Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={editScheduleForm.classDate}
                      onChange={(e) => setEditScheduleForm({ ...editScheduleForm, classDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Start Time <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={editScheduleForm.startTime}
                      onChange={(e) => setEditScheduleForm({ ...editScheduleForm, startTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={editScheduleForm.endTime}
                      onChange={(e) => setEditScheduleForm({ ...editScheduleForm, endTime: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Microsoft Teams URL Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#464EB8]" />
                      <span>Microsoft Teams Meeting URL</span>
                    </label>
                    {editUrlValidation && (
                      editUrlValidation.valid ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid Teams Meeting Link
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Unapproved URL Format
                        </span>
                      )
                    )}
                  </div>
                  <input
                    type="url"
                    value={editScheduleForm.meetingUrl}
                    onChange={(e) => setEditScheduleForm({ ...editScheduleForm, meetingUrl: e.target.value })}
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#464EB8]"
                  />
                  <p className="text-[10px] text-slate-500">
                    Must be an approved Microsoft Teams link (<code className="text-slate-700">teams.microsoft.com</code>, <code className="text-slate-700">teams.live.com</code>, or <code className="text-slate-700">meet.microsoft.com</code>).
                  </p>
                </div>

                {/* Session Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Instructions / Preparation Agenda
                  </label>
                  <textarea
                    rows={2}
                    value={editScheduleForm.instructions}
                    onChange={(e) => setEditScheduleForm({ ...editScheduleForm, instructions: e.target.value })}
                    placeholder="e.g. Please review Module 2 prior to joining."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editScheduleForm.status}
                    onChange={(e) => setEditScheduleForm({ ...editScheduleForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingSchedule(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Schedules Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Subject & Course</th>
                    <th className="py-3 px-3">Student / Cohort</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Instructor</th>
                    <th className="py-3 px-3">Microsoft Teams Meeting</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 space-y-1">
                        <Video className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-500">No scheduled class sessions found.</p>
                        <p className="text-[11px] text-slate-400">Add a new class or adjust your filter query.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedSchedules.map((sch) => (
                      <tr key={sch.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">{sch.subject_name}</div>
                          {sch.course_title && (
                            <div className="inline-flex items-center gap-1 text-[10px] text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded-md mt-0.5 border border-blue-100">
                              <BookOpen className="w-3 h-3" />
                              <span>{sch.course_title}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          {sch.student_name ? (
                            <div>
                              <div className="font-bold text-slate-800">{sch.student_name}</div>
                              <div className="text-[11px] text-slate-400">1-on-1 Tutoring</div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              <Users className="w-3 h-3" />
                              <span>Enrolled Cohort</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">
                            {new Date(sch.class_date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {sch.start_time?.slice(0, 5)} {sch.end_time ? `- ${sch.end_time.slice(0, 5)}` : ""}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">EAT</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                          <div className="font-medium">{sch.instructor_full_name || sch.teacher_name || "—"}</div>
                          {sch.instructor_email && (
                            <div className="text-[11px] text-slate-400">{sch.instructor_email}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          {sch.meeting_url ? (
                            <a
                              href={sch.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#464EB8] hover:bg-[#3b429f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Teams</span>
                              <ExternalLink className="w-3 h-3 opacity-70" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Missing Link</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              sch.status === "completed"
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : sch.status === "cancelled"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {sch.status || "scheduled"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSchedule(sch)}
                              title="Edit Schedule & Teams Link"
                              className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSchedule(sch.id)}
                              title="Delete Schedule"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tab 2 Pagination */}
            <Pagination
              currentPage={schPage}
              totalPages={totalSchPages}
              totalItems={filteredSchedules.length}
              pageSize={schPageSize}
              onPageChange={setSchPage}
              onPageSizeChange={(sz) => {
                setSchPageSize(sz);
                setSchPage(1);
              }}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {tab === "announcements" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowAnnModal(true)}
              className="px-4 py-2 bg-[#1E3A8A] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#172554] flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Publish Announcement
            </button>
          </div>

          {showAnnModal && (
            <form onSubmit={handleCreateAnnouncement} className="p-5 bg-white rounded-2xl border border-slate-200 shadow space-y-3">
              <h3 className="font-bold text-sm text-slate-900">New Campus Announcement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={annForm.title}
                    onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Content *</label>
                <textarea
                  rows={3}
                  required
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1E3A8A] text-white font-bold text-xs rounded-lg"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedAnnouncements.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No published announcements.
              </div>
            ) : (
              paginatedAnnouncements.map((a) => (
                <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {a.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(a.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{a.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3">{a.content}</p>
                  <p className="text-[10px] text-slate-400 pt-1">
                    Published: {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Tab 3 Pagination */}
          <Pagination
            currentPage={annPage}
            totalPages={totalAnnPages}
            totalItems={announcements.length}
            pageSize={annPageSize}
            onPageChange={setAnnPage}
            onPageSizeChange={(sz) => {
              setAnnPageSize(sz);
              setAnnPage(1);
            }}
            pageSizeOptions={[4, 6, 12, 24]}
          />
        </div>
      )}
    </div>
  );
}
