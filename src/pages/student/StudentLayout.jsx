import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap, LayoutDashboard, BookOpen, Calendar,
  LogOut, FileText, Menu, X, Settings, ExternalLink,
  PanelLeftClose, PanelLeftOpen, Compass, Award, ArrowLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import LanguageSelector from "../../components/LanguageSelector.jsx";

export default function StudentLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Desktop sidebar collapse state persisted in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("eta_student_sidebar_collapsed") === "true";
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
      localStorage.setItem("eta_student_sidebar_collapsed", String(next));
    } catch {}
  };

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <GraduationCap className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
          {t.accessRestricted || "Access Restricted"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t.pleaseSignInPrompt || "Please sign in to access your student dashboard and course materials."}
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
      path: "/dashboard",
      label: t.studentNavDashboard || t.navDashboard || "Dashboard Overview",
      exact: true,
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />
    },
    {
      path: "/dashboard/courses",
      label: t.studentNavMyCourses || t.navMyCourses || "My Courses",
      icon: <BookOpen className="w-4 h-4 shrink-0" />
    },
    {
      path: "/dashboard/application",
      label: t.studentNavApplication || "Admission Application",
      icon: <FileText className="w-4 h-4 shrink-0" />
    },
    {
      path: "/courses",
      label: t.studentNavCatalog || t.navCourses || "Course Catalog",
      icon: <Compass className="w-4 h-4 shrink-0" />
    },
    {
      path: "/dashboard/settings",
      label: t.studentNavSettings || t.navProfile || "Profile & Settings",
      icon: <Settings className="w-4 h-4 shrink-0" />
    }
  ];

  // Helper to determine if link is active
  const isItemActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname === item.path || location.pathname.startsWith(item.path + "/");
  };

  // Dynamic page title based on current path
  const getPageTitle = () => {
    if (location.pathname === "/dashboard") return t.studentNavDashboard || "Student Dashboard";
    if (location.pathname === "/dashboard/courses") return t.studentNavMyCourses || "My Enrolled Courses";
    if (location.pathname.startsWith("/dashboard/application") || location.pathname === "/apply") return t.studentNavApplication || "Admission Application";
    if (location.pathname.startsWith("/dashboard/settings") || location.pathname.startsWith("/dashboard/profile")) return t.studentNavSettings || "Student Profile & Settings";
    const current = navItems.find((n) => isItemActive(n));
    if (current) return current.label;
    return t.studentPortalTitle || "Student Portal";
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row font-sans text-slate-900">
      {/* ==================================================================== */}
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR                                       */}
      {/* ==================================================================== */}
      <aside
        className={`hidden md:flex flex-col bg-[#0B1A30] text-white border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header with Top-Right Collapse/Expand Toggle Button */}
        <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800/80">
          {collapsed ? (
            <div className="w-full flex items-center justify-between">
              <Link
                to="/dashboard"
                className="shrink-0"
                title="Ethio Techbridge Academy - Student Portal"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </Link>
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors shrink-0"
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 min-w-0"
                title="Ethio Techbridge Academy"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="font-extrabold text-sm tracking-tight text-white block truncate">
                    Ethio Techbridge<span className="text-amber-400">.</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Student Portal
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors shrink-0 ml-2"
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
                    ? "bg-[#1E3A8A] text-amber-300 shadow-sm font-extrabold"
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
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 ${
              collapsed ? "justify-center" : ""
            }`}
            title="Student Settings"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || "S"}
            </div>
            {!collapsed && (
              <div className="truncate text-left flex-1 min-w-0">
                <p className="font-bold text-xs text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <div className="flex items-center gap-1.5 pt-1">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                title="Return to Public Website"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Academy Site</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center justify-center p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* 2. MOBILE OFF-CANVAS DRAWER                                          */}
      {/* ==================================================================== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-[#0B1A30] text-white flex flex-col h-full shadow-2xl z-10 border-r border-slate-800">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-white block">Ethio Techbridge</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Student Portal</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-[#1E3A8A] text-amber-300 font-extrabold shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-slate-800 space-y-3">
              <div className="px-1 py-1">
                <LanguageSelector variant="dark" />
              </div>
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" /> {t.publicSite || "Academy Website"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-900/40 text-rose-200 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" /> {t.navSignOut || "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MAIN CONTENT WORKSPACE                                            */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block sm:inline">
                {t.studentPortalTitle || "Student Portal"} /{" "}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Quick Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <LanguageSelector variant="light" />

            {/* View Live Academy Site */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.publicSite || "Public Site"}</span>
            </Link>

            {/* Student Profile Link */}
            <Link
              to="/dashboard/settings"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
              title="Profile & Settings"
            >
              <div className="w-6 h-6 rounded-md bg-[#1E3A8A] text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || "S"}
              </div>
              <span className="hidden md:inline">{user?.name}</span>
            </Link>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navSignOut || "Sign Out"}</span>
            </button>
          </div>
        </header>

        {/* Nested Content Route */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

