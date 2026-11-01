import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, Calendar,
  LogOut, FileText, Menu, X, Settings, ExternalLink, Video,
  PanelLeftClose, PanelLeftOpen, FolderOpen
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import LanguageSelector from "../../components/LanguageSelector.jsx";

export default function TeacherLayout() {
  const { user, isInstructor, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Desktop sidebar collapse state persisted in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("eta_teacher_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("eta_teacher_sidebar_collapsed", String(next));
    } catch {}
  };

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!isInstructor && !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <GraduationCap className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
          {t.accessRestricted || "Access Restricted"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t.pleaseSignInPrompt || "This portal requires instructor authorization. Please sign in with an instructor or lecturer account."}
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold rounded-xl text-xs shadow-md transition-all"
        >
          {t.navSignIn || "Sign In"}
        </Link>
      </div>
    );
  }

  const navItems = [
    {
      path: "/teacher",
      label: t.teacherNavOverview || "Overview",
      exact: true,
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      path: "/teacher/classes",
      label: t.teacherNavClasses || "My Classes & Rosters",
      icon: <BookOpen className="w-4 h-4 shrink-0" />
    },
    {
      path: "/teacher/schedules",
      label: t.teacherNavSchedules || "Live Schedule & Teams",
      icon: <Video className="w-4 h-4 shrink-0" />
    },
    {
      path: "/teacher/resources",
      label: t.teacherNavResources || "Class Resources",
      icon: <FolderOpen className="w-4 h-4 shrink-0" />
    }
  ];

  const isItemActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const getPageTitle = () => {
    const current = navItems.find((n) => isItemActive(n));
    if (current) return current.label;
    if (location.pathname.includes("/roster")) return "Class Student Roster";
    return t.teacherPortalTitle || "Faculty Portal";
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row font-sans text-slate-900">
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-[#0B1A30] text-white border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header with Top-Right Collapse Toggle */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800/80">
          {collapsed ? (
            <div className="w-full flex items-center justify-between">
              <Link to="/teacher" className="shrink-0" title="Ethio Techbridge Academy">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </Link>
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/teacher" className="flex items-center gap-2.5 min-w-0" title="Ethio Techbridge Academy">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="font-extrabold text-sm tracking-tight text-white font-sans block truncate">
                    Ethio Techbridge<span className="text-cyan-400">.</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Teacher Portal
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors shrink-0 ml-2"
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                  active
                    ? "bg-[#1E3A8A] text-cyan-300 shadow-sm font-extrabold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                } ${collapsed ? "justify-center px-2" : ""}`}
              >
                {item.icon}
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Tooltip on collapsed desktop view */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-slate-700">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: User Card */}
        <div className="p-3 border-t border-slate-800/80">
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 ${
              collapsed ? "justify-center" : ""
            }`}
            title="Faculty Account"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-900/60 text-cyan-300 font-extrabold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || "T"}
            </div>
            {!collapsed && (
              <div className="truncate text-left flex-1 min-w-0">
                <p className="font-bold text-xs text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-cyan-400 font-medium truncate">Instructor Account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE OFF-CANVAS DRAWER */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 bg-[#0B1A30] text-white h-full flex flex-col shadow-2xl p-4 border-r border-slate-800 animate-in slide-in-from-left duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white font-sans">Ethio Techbridge</h3>
                  <p className="text-[10px] text-slate-400">Teacher Portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isItemActive(item)
                      ? "bg-[#1E3A8A] text-cyan-300 font-extrabold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="px-1 py-1">
                <LanguageSelector variant="dark" />
              </div>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> {t.publicSite || "Public Site"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                <span>{t.teacherConsoleTitle || "Teacher Console"}</span>
                <span>/</span>
                <span className="text-[#1E3A8A] font-bold">{getPageTitle()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <LanguageSelector variant="light" />

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.publicSite || "Public Site"}</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-cyan-300 font-extrabold text-xs flex items-center justify-center shadow-xs">
                {user?.name?.charAt(0) || "T"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">Instructor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

