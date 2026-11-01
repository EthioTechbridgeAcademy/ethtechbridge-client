import { useState, useEffect } from "react";
import {
  FileText, Search, Filter, Download, RefreshCw, CheckCircle2,
  Clock, AlertCircle, XCircle, UserCheck, ChevronRight, Eye,
  Copy, Check, ExternalLink, MessageSquare, Phone, Mail, GraduationCap,
  BookOpen, ShieldCheck, User, Calendar, Sparkles, FileSpreadsheet
} from "lucide-react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import Pagination from "../../components/Pagination.jsx";
import { exportToExcel, exportToPdf } from "../../utils/exportUtils.js";

export default function AdminApplicants() {
  const { t } = useLanguage();

  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    enrolled: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [relatedApps, setRelatedApps] = useState([]);
  const [editingNotes, setEditingNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Convert to student state
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [appToConvert, setAppToConvert] = useState(null);
  const [converting, setConverting] = useState(false);
  const [convertResult, setConvertResult] = useState(null);
  const [copiedTempPass, setCopiedTempPass] = useState(false);

  // Load applications
  const loadApplications = async (page = 1, customLimit = null) => {
    setLoading(true);
    setError("");
    const limit = customLimit || pagination.limit || 20;
    try {
      const res = await api.getAdminApplications({
        page,
        limit,
        search,
        status: statusFilter,
        grade: gradeFilter,
        program: programFilter
      });
      setApplications(res.applications || []);
      setSummary(res.summary || {});
      setPagination(res.pagination || { page: 1, limit, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message || "Failed to load applications list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications(1);
  }, [statusFilter, gradeFilter, programFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadApplications(1);
  };

  // Open detail modal
  const handleOpenDetails = async (app) => {
    setSelectedApp(app);
    setEditingNotes(app.admin_notes || "");
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await api.getAdminApplicationDetails(app.id);
      setSelectedApp(res.application);
      setRelatedApps(res.relatedApplications || []);
      setEditingNotes(res.application.admin_notes || "");
    } catch (err) {
      console.error("Failed to load details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Status Change
  const handleChangeStatus = async (newStatus) => {
    if (!selectedApp) return;
    setStatusUpdating(true);
    try {
      const res = await api.updateApplicationStatus(selectedApp.id, {
        status: newStatus,
        adminNotes: editingNotes
      });
      setSelectedApp(res.application);
      // Update in table state
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? res.application : a))
      );
      // Refresh summary counters
      const updatedList = await api.getAdminApplications({ page: pagination.page });
      setSummary(updatedList.summary || summary);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    try {
      await api.updateApplicationNotes(selectedApp.id, { adminNotes: editingNotes });
      setSelectedApp((prev) => ({ ...prev, admin_notes: editingNotes }));
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, admin_notes: editingNotes } : a))
      );
      alert("Internal notes saved successfully.");
    } catch (err) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  // Convert to student
  const handleConvertApplicant = async () => {
    if (!appToConvert) return;
    setConverting(true);
    setConvertResult(null);
    try {
      const res = await api.convertApplicationToStudent(appToConvert.id);
      setConvertResult(res);
      // Update in table
      setApplications((prev) =>
        prev.map((a) => (a.id === appToConvert.id ? { ...a, status: "enrolled" } : a))
      );
      if (selectedApp && selectedApp.id === appToConvert.id) {
        setSelectedApp((prev) => ({ ...prev, status: "enrolled" }));
      }
      // Refresh summary
      const updatedList = await api.getAdminApplications({ page: pagination.page });
      setSummary(updatedList.summary || summary);
    } catch (err) {
      alert("Conversion error: " + err.message);
    } finally {
      setConverting(false);
    }
  };

  // Data Export Handlers (Excel & PDF)
  const fetchExportData = async () => {
    const res = await api.getAdminApplications({
      status: statusFilter === "all" ? "" : statusFilter,
      search,
      gradeLevel: gradeFilter === "all" ? "" : gradeFilter,
      programInterest: programFilter === "all" ? "" : programFilter,
      page: 1,
      limit: 2000
    });
    const apps = res.applications || [];
    const headers = [
      "Application #",
      "Full Name",
      "Email Address",
      "Phone",
      "Academic Level",
      "Program of Interest",
      "Contact Mode",
      "Status",
      "Submitted Date",
      "Reviewer"
    ];
    const data = apps.map((a) => [
      a.application_number || a.applicationNumber || "",
      a.full_name || a.fullName || "",
      a.email || "Not Provided",
      a.phone || "",
      a.grade_level || a.gradeLevel || "Not Specified",
      a.program_interest || a.programInterest || "",
      a.preferred_contact || a.preferredContact || "phone",
      (a.status || "pending").toUpperCase(),
      a.created_at ? new Date(a.created_at).toLocaleDateString() : "",
      a.reviewer_name || a.reviewerName || "Unassigned"
    ]);

    const summaryCards = [
      { label: "Total Filtered", value: apps.length },
      { label: "Pending", value: apps.filter((a) => a.status === "pending").length },
      { label: "Under Review", value: apps.filter((a) => a.status === "under_review").length },
      { label: "Approved / Enrolled", value: apps.filter((a) => a.status === "approved" || a.status === "enrolled").length },
      { label: "Rejected", value: apps.filter((a) => a.status === "rejected").length }
    ];

    return { headers, data, summaryCards };
  };

  const handleExportExcel = async () => {
    setIsExporting("excel");
    try {
      const { headers, data, summaryCards } = await fetchExportData();
      exportToExcel({
        filename: "ethio-techbridge-applicants",
        sheetName: "Admissions",
        title: "Ethio Techbridge Academy - Admissions & Applications Registry",
        headers,
        data,
        summaryCards
      });
    } catch (err) {
      alert("Failed to export Excel: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting("pdf");
    try {
      const { headers, data, summaryCards } = await fetchExportData();
      exportToPdf({
        filename: "ethio-techbridge-applicants",
        title: "Admissions & Applications Registry",
        subtitle: "Official Institutional Registry & Applicant Verification Roster",
        headers,
        data,
        summaryCards,
        orientation: "landscape"
      });
    } catch (err) {
      alert("Failed to export PDF: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            {t.adminStatusPending || "Pending"}
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Search className="w-3 h-3 text-blue-600" />
            {t.adminStatusUnderReview || "Under Review"}
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t.adminStatusApproved || "Approved"}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            {t.adminStatusRejected || "Rejected"}
          </span>
        );
      case "enrolled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <UserCheck className="w-3 h-3 text-teal-600" />
            {t.adminStatusEnrolled || "Enrolled"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1E3A8A] text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>Admissions Records & Review</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-900 tracking-tight leading-snug font-sans">
            {t.adminApplicantsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">{t.adminApplicantsSubtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadApplications(pagination.page)}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {/* Export to Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!!isExporting}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
            title="Download Excel Spreadsheet (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">{isExporting === "excel" ? "Exporting..." : (t.adminBtnExportExcel || "Excel (.xlsx)")}</span>
          </button>

          {/* Export to PDF */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!!isExporting}
            className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
            title="Download Formatted PDF Document (.pdf)"
          >
            <FileText className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="hidden sm:inline">{isExporting === "pdf" ? "Exporting..." : (t.adminBtnExportPdf || "PDF (.pdf)")}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "all"
              ? "bg-blue-50/70 border-[#1E3A8A] ring-2 ring-[#1E3A8A]/15 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="text-xs text-slate-500 font-bold uppercase">{t.adminStatusAll}</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{summary.total || 0}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "pending"
              ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="text-xs text-amber-700 font-bold uppercase flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{t.adminStatusPending}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{summary.pending || 0}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("under_review")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "under_review"
              ? "bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="text-xs text-blue-700 font-bold uppercase flex items-center gap-1.5">
            <Search className="w-3 h-3 text-blue-600" />
            <span>{t.adminStatusUnderReview}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{summary.underReview || 0}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("approved")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "approved"
              ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="text-xs text-emerald-700 font-bold uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t.adminStatusApproved}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{summary.approved || 0}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("rejected")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "rejected"
              ? "bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="text-xs text-rose-700 font-bold uppercase flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>{t.adminStatusRejected}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">{summary.rejected || 0}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("enrolled")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === "enrolled"
              ? "bg-teal-50/80 border-teal-400 ring-2 ring-teal-400/20 shadow-sm"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
          }`}
        >
          <div className="text-xs text-teal-700 font-bold uppercase flex items-center gap-1.5">
            <UserCheck className="w-3 h-3 text-teal-600" />
            <span>{t.adminStatusEnrolled}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-teal-600 mt-1">{summary.enrolled || 0}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.adminApplicantsSearchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A] transition-colors"
          />
        </form>

        {/* Academic Level Filter */}
        <div className="w-full md:w-56">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A]"
          >
            <option value="all">All Academic Levels</option>
            <option value="High School (Grade 9-12)">High School (Grade 9-12)</option>
            <option value="University / College">University / College</option>
            <option value="Adult Learner / Career Switcher">Adult Learner / Switcher</option>
            <option value="Professional Development">Professional Development</option>
            <option value="Grade 1-8 (Elementary / Middle)">Grade 1-8</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Program Filter */}
        <div className="w-full md:w-56">
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A]"
          >
            <option value="all">All Programs</option>
            <option value="Full-Stack Web Development">Full-Stack Web Dev</option>
            <option value="Python Programming & Data">Python Programming</option>
            <option value="Computer & Digital Literacy">Digital Literacy</option>
            <option value="1-12 STEM & Curriculum Tutoring">1-12 STEM Tutoring</option>
            <option value="Professional & Career Skills">Career & Git Skills</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1E3A8A]" />
            <p className="text-sm font-medium">Loading applications records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">{t.adminNoApplicationsFound}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">{t.adminColAppNumber}</th>
                  <th className="px-4 py-3.5">{t.adminColApplicant}</th>
                  <th className="px-4 py-3.5">{t.adminColLevel}</th>
                  <th className="px-4 py-3.5">{t.adminColProgram}</th>
                  <th className="px-4 py-3.5">{t.adminColStatus}</th>
                  <th className="px-4 py-3.5">{t.adminColDate}</th>
                  <th className="px-4 py-3.5 text-right">{t.adminColActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* App Number */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-mono text-[#1E3A8A] font-bold text-xs bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                        {app.application_number}
                      </span>
                    </td>

                    {/* Applicant */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{app.full_name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2.5 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {app.phone}
                        </span>
                        {app.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {app.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Level */}
                    <td className="px-4 py-4 text-xs text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        {app.grade_level}
                      </span>
                    </td>

                    {/* Program */}
                    <td className="px-4 py-4 text-xs font-semibold text-slate-800">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        {app.program_interest}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(app)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{t.adminBtnViewDetails}</span>
                      </button>

                      {app.status !== "enrolled" && (
                        <button
                          type="button"
                          onClick={() => {
                            setAppToConvert(app);
                            setConvertResult(null);
                            setConvertModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                          title="Onboard into Student Account"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span className="hidden sm:inline">{t.adminBtnConvertStudent}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={pagination.limit}
          onPageChange={(p) => loadApplications(p)}
          onPageSizeChange={(newSize) => {
            loadApplications(1, newSize);
          }}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>

      {/* ==================================================================== */}
      {/* 1. APPLICATION DETAIL & REVIEW MODAL (LIGHT THEME) */}
      {/* ==================================================================== */}
      {detailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#1E3A8A] font-bold text-xs bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {selectedApp.application_number}
                  </span>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1 font-sans">{selectedApp.full_name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Applicant Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 text-xs font-semibold">Phone Number</span>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  {selectedApp.phone}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 text-xs font-semibold">Email Address</span>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  {selectedApp.email || "Not provided"}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 text-xs font-semibold">Academic Level</span>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  {selectedApp.grade_level}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 text-xs font-semibold">Program of Interest</span>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  {selectedApp.program_interest}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 text-xs font-semibold">Preferred Contact Method</span>
                <p className="font-bold text-slate-900 capitalize flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  {selectedApp.preferred_contact}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-500 text-xs font-semibold">Submitted At</span>
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  {new Date(selectedApp.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Applicant's Submitted Notes */}
            {selectedApp.notes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase">Applicant Statement / Notes</span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedApp.notes}
                </p>
              </div>
            )}

            {/* Conversion / Reviewer Info */}
            {selectedApp.reviewer_name && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Last reviewed by: <strong className="text-slate-900">{selectedApp.reviewer_name}</strong></span>
                {selectedApp.reviewed_at && (
                  <span>{new Date(selectedApp.reviewed_at).toLocaleDateString()}</span>
                )}
              </div>
            )}

            {selectedApp.converted_user_name && (
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Converted to active student: <strong>{selectedApp.converted_user_name}</strong> ({selectedApp.converted_user_email})
                </span>
              </div>
            )}

            {/* Status Changer Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">Update Application Status</label>
              <div className="flex flex-wrap gap-2">
                {["pending", "under_review", "approved", "rejected"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={statusUpdating || selectedApp.status === st}
                    onClick={() => handleChangeStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      selectedApp.status === st
                        ? "bg-[#1E3A8A] text-white shadow-xs cursor-default font-extrabold"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}

                {selectedApp.status !== "enrolled" && (
                  <button
                    type="button"
                    onClick={() => {
                      setAppToConvert(selectedApp);
                      setConvertResult(null);
                      setConvertModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white ml-auto flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{t.adminBtnConvertStudent}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Internal Reviewer Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  {t.adminInternalNotesLabel}
                </label>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-3 py-1 rounded-lg bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  {savingNotes ? "Saving..." : t.adminSaveNotesBtn}
                </button>
              </div>
              <textarea
                rows={3}
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Internal evaluation notes (not visible to applicant)..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A]"
              />
            </div>

            {/* Related Applications by same contact */}
            {relatedApps.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">Previous Applications with Same Contact</span>
                <div className="space-y-1.5">
                  {relatedApps.map((rel) => (
                    <div
                      key={rel.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1E3A8A]">{rel.application_number}</span>
                        <span className="text-slate-600">• {rel.program_interest}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(rel.status)}
                        <span className="text-slate-400 text-[11px]">
                          {new Date(rel.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. CONVERT APPLICANT TO STUDENT CONFIRMATION MODAL (LIGHT THEME) */}
      {/* ==================================================================== */}
      {convertModalOpen && appToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl">
            {convertResult ? (
              /* Success Result State */
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
                  {t.adminConvertModalSuccess}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Student account has been provisioned and enrolled into <strong>{convertResult.enrolledCourse || "Curriculum Track"}</strong>.
                </p>

                {convertResult.isNewUser ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
                    <span className="text-xs text-amber-700 font-bold block uppercase tracking-wider">
                      Single-Use Account Activation Link
                    </span>
                    <div className="text-xs text-slate-600">
                      Applicant Email: <strong className="text-slate-900">{convertResult.user?.email}</strong>
                    </div>

                    {convertResult.activationUrl && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-500 font-semibold block">
                          Activation URL (Expires in 48 hours):
                        </label>
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 gap-2">
                          <div className="font-mono text-[#1E3A8A] text-xs font-semibold truncate select-all">
                            {convertResult.activationUrl}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(convertResult.activationUrl);
                              setCopiedTempPass(true);
                              setTimeout(() => setCopiedTempPass(false), 2000);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
                            title="Copy activation link"
                          >
                            {copiedTempPass ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[11px] text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">
                        Email Status:{" "}
                        <span className={convertResult.emailDelivery?.sent ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                          {convertResult.emailDelivery?.status || "Pending"}
                        </span>
                      </p>
                      <p className="text-slate-600">
                        {convertResult.emailDelivery?.note ||
                          "Deliver this single-use activation link to the student so they can set their password."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                    <span className="text-xs text-emerald-700 font-bold block uppercase tracking-wider">
                      Existing Student Account Linked
                    </span>
                    <p className="text-xs text-slate-600">
                      This applicant already has an active account (<strong>{convertResult.user?.email}</strong>). The application record and program enrollment have been linked without altering their existing password.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setConvertModalOpen(false);
                    setAppToConvert(null);
                    setConvertResult(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] font-bold text-white text-xs sm:text-sm shadow-md transition-all"
                >
                  Done & Close
                </button>
              </div>
            ) : (
              /* Confirmation Prompt State */
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">
                      {t.adminConvertModalTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {appToConvert.full_name} ({appToConvert.application_number})
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                  <p>{t.adminConvertModalConfirm}</p>
                  <div className="pt-2 text-xs text-[#1E3A8A] font-semibold border-t border-slate-200">
                    Target Program Track: <strong>{appToConvert.program_interest}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={converting}
                    onClick={() => {
                      setConvertModalOpen(false);
                      setAppToConvert(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={converting}
                    onClick={handleConvertApplicant}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    {converting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Onboarding...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Confirm Enrollment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
