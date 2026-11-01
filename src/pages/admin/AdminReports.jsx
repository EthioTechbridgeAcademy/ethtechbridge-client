import { useState, useEffect } from "react";
import {
  BarChart3, FileSpreadsheet, FileText, Download, RefreshCw,
  Users, GraduationCap, Award, Calendar, BookOpen, Clock,
  CheckCircle2, XCircle, Search, Filter, Video, MapPin,
  TrendingUp, ArrowUpRight, ShieldCheck, ChevronRight
} from "lucide-react";
import { api } from "../../api/client.js";
import { exportToExcel, exportToPdf } from "../../utils/exportUtils.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminReports() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "admissions" | "progress" | "schedules"
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false); // "excel" | "pdf" | false
  const [error, setError] = useState("");

  // Report Data States
  const [summaryData, setSummaryData] = useState(null);
  const [admissionsData, setAdmissionsData] = useState({ list: [], total: 0, statusBreakdown: [], gradeBreakdown: [] });
  const [progressData, setProgressData] = useState({ coursesSummary: [], studentRoster: [] });
  const [schedulesData, setSchedulesData] = useState({ list: [], total: 0, centerStats: [] });

  // Filters for Admissions Tab
  const [admStatusFilter, setAdmStatusFilter] = useState("all");
  const [admSearch, setAdmSearch] = useState("");

  // Filters for Progress Tab
  const [progStatusFilter, setProgStatusFilter] = useState("all");
  const [progSearch, setProgSearch] = useState("");

  // Filters for Schedules Tab
  const [schedTypeFilter, setSchedTypeFilter] = useState("all");
  const [schedCenterFilter, setSchedCenterFilter] = useState("all");

  // Load Executive Summary
  const loadSummary = async () => {
    try {
      const res = await api.getAdminReportsSummary();
      if (res && res.data) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error("Failed to load reports summary:", err);
      setError("Unable to load summary metrics.");
    }
  };

  // Load Admissions Report Data
  const loadAdmissions = async () => {
    try {
      const res = await api.getAdminAdmissionsReport({
        status: admStatusFilter === "all" ? "" : admStatusFilter,
        search: admSearch
      });
      if (res && res.success) {
        setAdmissionsData({
          list: res.data || [],
          total: res.total || 0,
          statusBreakdown: res.statusBreakdown || [],
          gradeBreakdown: res.gradeBreakdown || []
        });
      }
    } catch (err) {
      console.error("Failed to load admissions report:", err);
    }
  };

  // Load Academic Progress Data
  const loadProgress = async () => {
    try {
      const res = await api.getAdminAcademicProgressReport({
        status: progStatusFilter === "all" ? "" : progStatusFilter
      });
      if (res && res.success) {
        setProgressData({
          coursesSummary: res.coursesSummary || [],
          studentRoster: res.studentRoster || []
        });
      }
    } catch (err) {
      console.error("Failed to load academic progress report:", err);
    }
  };

  // Load Schedules Data
  const loadSchedules = async () => {
    try {
      const res = await api.getAdminSchedulesReport({
        sessionType: schedTypeFilter === "all" ? "" : schedTypeFilter,
        center: schedCenterFilter === "all" ? "" : schedCenterFilter
      });
      if (res && res.success) {
        setSchedulesData({
          list: res.data || [],
          total: res.total || 0,
          centerStats: res.centerStats || []
        });
      }
    } catch (err) {
      console.error("Failed to load schedules report:", err);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([loadSummary(), loadAdmissions(), loadProgress(), loadSchedules()]);
      } catch (e) {
        setError("Error loading reports data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Trigger tab-specific reload when filter changes
  useEffect(() => {
    if (!loading) {
      if (activeTab === "admissions") loadAdmissions();
    }
  }, [admStatusFilter, admSearch]);

  useEffect(() => {
    if (!loading) {
      if (activeTab === "progress") loadProgress();
    }
  }, [progStatusFilter]);

  useEffect(() => {
    if (!loading) {
      if (activeTab === "schedules") loadSchedules();
    }
  }, [schedTypeFilter, schedCenterFilter]);

  // =========================================================================
  // EXPORT HANDLERS
  // =========================================================================

  const handleExportCurrent = async (format) => {
    setIsExporting(format);
    try {
      if (activeTab === "overview") {
        const headers = ["Metric Category", "Metric Name", "Value / Count"];
        const apps = summaryData?.applications || {};
        const lms = summaryData?.lms || {};
        const sched = summaryData?.schedules || {};

        const data = [
          ["Admissions", "Total Applications", apps.total || 0],
          ["Admissions", "Pending Review", apps.pending || 0],
          ["Admissions", "Under Review", apps.underReview || 0],
          ["Admissions", "Approved", apps.approved || 0],
          ["Admissions", "Enrolled", apps.enrolled || 0],
          ["Admissions", "Rejected", apps.rejected || 0],
          ["Admissions", "Conversion Rate", `${apps.conversionRate || 0}%`],
          ["LMS & Students", "Total Registered Students", lms.totalStudents || 0],
          ["LMS & Students", "Total Faculty / Instructors", lms.totalInstructors || 0],
          ["LMS & Students", "Total Courses", lms.totalCourses || 0],
          ["LMS & Students", "Published Courses", lms.publishedCourses || 0],
          ["LMS & Students", "Total Course Enrollments", lms.totalEnrollments || 0],
          ["LMS & Students", "Completed Enrollments", lms.completedEnrollments || 0],
          ["LMS & Students", "Course Completion Rate", `${lms.completionRate || 0}%`],
          ["LMS & Students", "Certificates Issued", lms.totalCertificates || 0],
          ["Schedules", "Total Classes Scheduled", sched.total || 0],
          ["Schedules", "Microsoft Teams Online Classes", sched.teamsOnline || 0],
          ["Schedules", "Addis Ababa Tutoring Centers", sched.inPerson || 0],
          ["Schedules", "Teams Links Ready", sched.teamsWithUrl || 0]
        ];

        const summaryCards = [
          { label: "Students", value: lms.totalStudents || 0 },
          { label: "Enrollments", value: lms.totalEnrollments || 0 },
          { label: "Completion Rate", value: `${lms.completionRate || 0}%` },
          { label: "Certificates", value: lms.totalCertificates || 0 },
          { label: "Admissions Conversion", value: `${apps.conversionRate || 0}%` }
        ];

        if (format === "excel") {
          exportToExcel({
            filename: "ethio-techbridge-executive-report",
            sheetName: "Executive Summary",
            title: "Ethio Techbridge Academy - Executive Institutional Summary",
            headers,
            data,
            summaryCards
          });
        } else {
          exportToPdf({
            filename: "ethio-techbridge-executive-report",
            title: "Executive Institutional Performance Summary",
            subtitle: "Academic KPIs, Admissions Velocity, and Operational Records",
            headers,
            data,
            summaryCards,
            orientation: "portrait"
          });
        }
      } else if (activeTab === "admissions") {
        const headers = [
          "Application #",
          "Applicant Name",
          "Phone",
          "Email",
          "Grade Level",
          "Program Interest",
          "Status",
          "Submitted Date",
          "Reviewer"
        ];
        const data = admissionsData.list.map((a) => [
          a.application_number || "",
          a.full_name || "",
          a.phone || "",
          a.email || "N/A",
          a.grade_level || "Not specified",
          a.program_interest || "",
          (a.status || "pending").toUpperCase(),
          a.created_at ? new Date(a.created_at).toLocaleDateString() : "",
          a.reviewer_name || "Unassigned"
        ]);

        const summaryCards = [
          { label: "Total Applications", value: admissionsData.total },
          { label: "Pending / Review", value: admissionsData.list.filter((x) => x.status === "pending" || x.status === "under_review").length },
          { label: "Approved / Enrolled", value: admissionsData.list.filter((x) => x.status === "approved" || x.status === "enrolled").length },
          { label: "Rejected", value: admissionsData.list.filter((x) => x.status === "rejected").length }
        ];

        if (format === "excel") {
          exportToExcel({
            filename: "ethio-techbridge-admissions-report",
            sheetName: "Admissions Pipeline",
            title: "Ethio Techbridge Academy - Admissions & Application Pipeline",
            headers,
            data,
            summaryCards
          });
        } else {
          exportToPdf({
            filename: "ethio-techbridge-admissions-report",
            title: "Admissions & Enrollment Pipeline Report",
            subtitle: "Applicant Evaluation, Verification, and Decision Records",
            headers,
            data,
            summaryCards,
            orientation: "landscape"
          });
        }
      } else if (activeTab === "progress") {
        const headers = [
          "Student Name",
          "Email",
          "Course Title",
          "Progress %",
          "Status",
          "Enrolled Date",
          "Completed Date",
          "Certificate Code"
        ];
        const filteredRoster = progressData.studentRoster.filter((s) => {
          if (!progSearch) return true;
          const q = progSearch.toLowerCase();
          return (
            (s.student_name && s.student_name.toLowerCase().includes(q)) ||
            (s.course_title && s.course_title.toLowerCase().includes(q)) ||
            (s.student_email && s.student_email.toLowerCase().includes(q))
          );
        });

        const data = filteredRoster.map((s) => [
          s.student_name || "",
          s.student_email || "",
          s.course_title || "",
          `${s.progress_percent || 0}%`,
          (s.status || "active").toUpperCase(),
          s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString() : "",
          s.completed_at ? new Date(s.completed_at).toLocaleDateString() : "In Progress",
          s.certificate_code || "None"
        ]);

        const summaryCards = [
          { label: "Total Enrolled", value: progressData.studentRoster.length },
          { label: "Completed", value: progressData.studentRoster.filter((s) => s.status === "completed").length },
          { label: "Active", value: progressData.studentRoster.filter((s) => s.status === "active").length },
          { label: "Certificates", value: progressData.studentRoster.filter((s) => !!s.certificate_code).length }
        ];

        if (format === "excel") {
          exportToExcel({
            filename: "ethio-techbridge-student-progress-report",
            sheetName: "Academic Progress",
            title: "Ethio Techbridge Academy - Student Academic Progress & LMS Completion",
            headers,
            data,
            summaryCards
          });
        } else {
          exportToPdf({
            filename: "ethio-techbridge-student-progress-report",
            title: "Student Academic Progress & LMS Completion",
            subtitle: "Course Enrollee Completion Rates & Certification Audit",
            headers,
            data,
            summaryCards,
            orientation: "landscape"
          });
        }
      } else if (activeTab === "schedules") {
        const headers = [
          "Course / Subject",
          "Delivery Mode",
          "Center Location",
          "Class Date",
          "Start Time",
          "End Time",
          "Faculty / Teacher",
          "MS Teams Link",
          "Status"
        ];
        const data = schedulesData.list.map((sc) => [
          sc.course_title || sc.subject_name || "General Session",
          sc.session_type === "online_teams" ? "Online MS Teams" : "In-Person Center",
          sc.center_name || "Campus Center",
          sc.class_date ? new Date(sc.class_date).toLocaleDateString() : "",
          sc.start_time || "",
          sc.end_time || "",
          sc.assigned_faculty_name || sc.teacher_name || "Faculty Assigned",
          sc.meeting_url ? "Configured" : "Pending Link",
          (sc.status || "scheduled").toUpperCase()
        ]);

        const summaryCards = [
          { label: "Total Classes", value: schedulesData.total },
          { label: "MS Teams Online", value: schedulesData.list.filter((x) => x.session_type === "online_teams").length },
          { label: "In-Person Centers", value: schedulesData.list.filter((x) => x.session_type === "in_person" || !x.session_type).length },
          { label: "Teams Ready", value: schedulesData.list.filter((x) => x.session_type === "online_teams" && !!x.meeting_url).length }
        ];

        if (format === "excel") {
          exportToExcel({
            filename: "ethio-techbridge-class-schedules-report",
            sheetName: "Class Schedules",
            title: "Ethio Techbridge Academy - Tutoring Centers & Microsoft Teams Class Schedules",
            headers,
            data,
            summaryCards
          });
        } else {
          exportToPdf({
            filename: "ethio-techbridge-class-schedules-report",
            title: "Tutoring Centers & MS Teams Live Class Schedules",
            subtitle: "Academic Timetable, Faculty Teaching Rosters, and Teams Meeting Readiness",
            headers,
            data,
            summaryCards,
            orientation: "landscape"
          });
        }
      }
    } catch (err) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header & Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold">
            <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
            <span>Institutional Intelligence & Reporting Hub</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-snug font-sans">
            {t.adminNavReports || "Reports & Analytics"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Live institutional KPI dashboards, admissions funnel, student LMS progress metrics, and Microsoft Teams & tutoring schedules with instant export to Excel and PDF.
          </p>
        </div>

        {/* Global Export & Refresh Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              Promise.all([loadSummary(), loadAdmissions(), loadProgress(), loadSchedules()]).finally(() => setLoading(false));
            }}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            title="Refresh All Reports"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Export Excel Button */}
          <button
            type="button"
            onClick={() => handleExportCurrent("excel")}
            disabled={!!isExporting || loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
            title="Export Current View to Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isExporting === "excel" ? "Generating Excel..." : (t.adminBtnExportExcel || "Export to Excel (.xlsx)")}</span>
          </button>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={() => handleExportCurrent("pdf")}
            disabled={!!isExporting || loading}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
            title="Export Current View to PDF (.pdf)"
          >
            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{isExporting === "pdf" ? "Generating PDF..." : (t.adminBtnExportPdf || "Export to PDF (.pdf)")}</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "overview"
              ? "bg-[#1E3A8A] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Executive Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("admissions")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "admissions"
              ? "bg-[#1E3A8A] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Admissions & Pipeline</span>
          {admissionsData.total > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-900 text-[10px] rounded-full">
              {admissionsData.total}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("progress")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "progress"
              ? "bg-[#1E3A8A] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Progress & LMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schedules")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === "schedules"
              ? "bg-[#1E3A8A] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tutoring & Teams Classes</span>
          {schedulesData.total > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] rounded-full">
              {schedulesData.total}
            </span>
          )}
        </button>
      </div>

      {/* 3. TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Students & Enrollees</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                {summaryData?.lms?.totalStudents || 0}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="font-bold text-emerald-600">{summaryData?.lms?.totalEnrollments || 0}</span>
                <span>total course enrollments</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Completion Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                {summaryData?.lms?.completionRate || 0}%
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="font-bold text-blue-900">{summaryData?.lms?.completedEnrollments || 0}</span>
                <span>completed course programs</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Certificates Issued</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                {summaryData?.lms?.totalCertificates || 0}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="font-bold text-amber-600">100%</span>
                <span>cryptographically verifiable</span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Admissions Pipeline</span>
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                {summaryData?.applications?.total || 0}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="font-bold text-emerald-600">{summaryData?.applications?.conversionRate || 0}%</span>
                <span>admitted / approved rate</span>
              </div>
            </div>
          </div>

          {/* Operational Insights 2-Col Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Enrolled Courses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
                  <h3 className="font-bold text-slate-900 text-sm font-sans">Top Enrolled Courses</h3>
                </div>
                <span className="text-xs text-slate-400">By Student Volume</span>
              </div>

              <div className="space-y-3">
                {summaryData?.topCourses?.map((course) => (
                  <div key={course.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">{course.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span className="capitalize">{course.difficulty}</span>
                        <span>•</span>
                        <span>{course.grade_range}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-extrabold text-blue-900">{course.enrollment_count}</span>
                      <span className="text-[10px] text-slate-400 block">students</span>
                    </div>
                  </div>
                ))}
                {(!summaryData?.topCourses || summaryData.topCourses.length === 0) && (
                  <p className="text-xs text-slate-400 py-4 text-center">No enrolled courses on record.</p>
                )}
              </div>
            </div>

            {/* Program Interest Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#1E3A8A]" />
                  <h3 className="font-bold text-slate-900 text-sm font-sans">Program Demand Breakdown</h3>
                </div>
                <span className="text-xs text-slate-400">Applications</span>
              </div>

              <div className="space-y-3">
                {summaryData?.popularPrograms?.map((prog, idx) => {
                  const maxCount = summaryData.popularPrograms[0]?.count || 1;
                  const pct = Math.round((prog.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{prog.program_interest}</span>
                        <span className="font-bold text-blue-900">{prog.count} applicants</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-700 to-amber-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!summaryData?.popularPrograms || summaryData.popularPrograms.length === 0) && (
                  <p className="text-xs text-slate-400 py-4 text-center">No applicant interest recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery & Centers Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm font-sans">Class Delivery Channels & Addis Ababa Centers</h3>
              </div>
              <span className="text-xs text-slate-400">Scheduled Sessions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Video className="w-4 h-4 text-blue-700" />
                  <span>Microsoft Teams Classes</span>
                </div>
                <div className="text-2xl font-extrabold text-blue-900">
                  {summaryData?.schedules?.teamsOnline || 0}
                </div>
                <div className="text-[11px] text-blue-700">
                  {summaryData?.schedules?.teamsWithUrl || 0} meeting URLs ready
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>In-Person Tutoring</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-900">
                  {summaryData?.schedules?.inPerson || 0}
                </div>
                <div className="text-[11px] text-amber-700">Addis Ababa physical centers</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Interactive Quizzes Passed</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-900">
                  {summaryData?.lms?.quizPassRate || 0}%
                </div>
                <div className="text-[11px] text-emerald-700">{summaryData?.lms?.totalQuizAttempts || 0} total attempts</div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <GraduationCap className="w-4 h-4 text-indigo-700" />
                  <span>Active Instructors</span>
                </div>
                <div className="text-2xl font-extrabold text-indigo-900">
                  {summaryData?.lms?.totalInstructors || 0}
                </div>
                <div className="text-[11px] text-indigo-700">Teaching faculty members</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: ADMISSIONS PIPELINE REPORT */}
      {activeTab === "admissions" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={admSearch}
                  onChange={(e) => setAdmSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={admStatusFilter}
                onChange={(e) => setAdmStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Application Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="enrolled">Enrolled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                Showing <b>{admissionsData.list.length}</b> records
              </span>
            </div>
          </div>

          {/* Admissions Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Application #</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Program Interest</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Reviewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admissionsData.list.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">
                        {item.application_number}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.full_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{item.phone}</div>
                        {item.email && <div className="text-[10px] text-slate-400">{item.email}</div>}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.grade_level || "Not specified"}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.program_interest}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "enrolled" ? "bg-teal-50 text-teal-800 border border-teal-200" :
                          item.status === "approved" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                          item.status === "under_review" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                          item.status === "rejected" ? "bg-rose-50 text-rose-800 border border-rose-200" :
                          "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {item.reviewer_name || "Unassigned"}
                      </td>
                    </tr>
                  ))}
                  {admissionsData.list.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No admissions applications match the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: ACADEMIC PROGRESS & LMS REPORT */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          {/* Course-by-Course Aggregate Performance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
              <span>Course Catalog Completion & Performance Breakdown</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Grade Range</th>
                    <th className="py-3 px-4 text-center">Enrolled</th>
                    <th className="py-3 px-4 text-center">Completed</th>
                    <th className="py-3 px-4 text-center">Avg Progress</th>
                    <th className="py-3 px-4 text-center">Certs Issued</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {progressData.coursesSummary.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.title}</td>
                      <td className="py-3 px-4 capitalize text-slate-600">{c.difficulty}</td>
                      <td className="py-3 px-4 text-slate-600">{c.grade_range}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-900">{c.total_enrolled}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">{c.completed_count}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-semibold">{c.avg_progress}%</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-600">{c.certs_issued}</td>
                    </tr>
                  ))}
                  {progressData.coursesSummary.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                        No course records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Cohort Enrollee Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-900 text-sm font-sans flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1E3A8A]" />
                <span>Student Enrollee Cohort Details</span>
              </h3>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter by student or course..."
                  value={progSearch}
                  onChange={(e) => setProgSearch(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <select
                  value={progStatusFilter}
                  onChange={(e) => setProgStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="all">All Enrollees</option>
                  <option value="active">Active Only</option>
                  <option value="completed">Completed Only</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4">Progress %</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Enrolled Date</th>
                    <th className="py-3 px-4">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {progressData.studentRoster
                    .filter((s) => {
                      if (!progSearch) return true;
                      const q = progSearch.toLowerCase();
                      return (
                        (s.student_name && s.student_name.toLowerCase().includes(q)) ||
                        (s.course_title && s.course_title.toLowerCase().includes(q)) ||
                        (s.student_email && s.student_email.toLowerCase().includes(q))
                      );
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">{item.student_name}</td>
                        <td className="py-3 px-4 text-slate-500">{item.student_email}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{item.course_title}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${item.progress_percent}%` }}
                              />
                            </div>
                            <span className="font-bold text-[11px] text-slate-700">{item.progress_percent}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === "completed"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {item.enrolled_at ? new Date(item.enrolled_at).toLocaleDateString() : ""}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          {item.certificate_code ? (
                            <span className="text-amber-700 font-bold">{item.certificate_code}</span>
                          ) : (
                            <span className="text-slate-400">Not yet issued</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  {progressData.studentRoster.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                        No enrollment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: TUTORING CENTERS & TEAMS SCHEDULES */}
      {activeTab === "schedules" && (
        <div className="space-y-6">
          {/* Schedules Control Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={schedTypeFilter}
                onChange={(e) => setSchedTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Delivery Modes</option>
                <option value="online_teams">Microsoft Teams Online</option>
                <option value="in_person">In-Person Tutoring Centers</option>
              </select>

              <select
                value={schedCenterFilter}
                onChange={(e) => setSchedCenterFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Physical Centers</option>
                <option value="CMC">CMC Center</option>
                <option value="Summit">Summit Center</option>
                <option value="Ayat">Ayat Center</option>
                <option value="Semit">Semit Center</option>
                <option value="72">72 Center</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing <b>{schedulesData.list.length}</b> scheduled classes
            </span>
          </div>

          {/* Schedules Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Subject / Course</th>
                    <th className="py-3 px-4">Delivery Mode</th>
                    <th className="py-3 px-4">Center</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Assigned Faculty</th>
                    <th className="py-3 px-4">Teams Meeting Link</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedulesData.list.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {sc.course_title || sc.subject_name || "General Session"}
                      </td>
                      <td className="py-3 px-4">
                        {sc.session_type === "online_teams" ? (
                          <span className="inline-flex items-center gap-1 text-blue-900 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 text-[10px]">
                            <Video className="w-3 h-3 text-blue-700" />
                            Online Teams
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-900 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[10px]">
                            <MapPin className="w-3 h-3 text-amber-700" />
                            In-Person Center
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{sc.center_name || "Campus Center"}</td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        <div>{sc.class_date ? new Date(sc.class_date).toLocaleDateString() : "TBD"}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {sc.start_time || ""} - {sc.end_time || ""}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {sc.assigned_faculty_name || sc.teacher_name || "Faculty Assigned"}
                      </td>
                      <td className="py-3 px-4">
                        {sc.meeting_url ? (
                          <a
                            href={sc.meeting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-[11px]"
                          >
                            <span>Join Meeting</span>
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        ) : sc.session_type === "online_teams" ? (
                          <span className="text-rose-500 font-bold text-[10px]">Link Pending</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">N/A (Physical)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {sc.status || "scheduled"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {schedulesData.list.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400 text-xs">
                        No scheduled classes match the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
