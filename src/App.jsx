import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import RegistrationModal from "./components/RegistrationModal.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LessonPreviewPage from "./pages/LessonPreviewPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ActivateAccountPage from "./pages/ActivateAccountPage.jsx";
import StudentDashboardPage from "./pages/StudentDashboardPage.jsx";
import MyCoursesPage from "./pages/MyCoursesPage.jsx";
import ClassroomPage from "./pages/ClassroomPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import CertificateVerifyPage from "./pages/CertificateVerifyPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminApplicants from "./pages/admin/AdminApplicants.jsx";
import AdminCourses from "./pages/admin/AdminCourses.jsx";
import AdminCourseEditor from "./pages/admin/AdminCourseEditor.jsx";
import AdminCurriculumEditor from "./pages/admin/AdminCurriculumEditor.jsx";
import AdminStudentProgress from "./pages/admin/AdminStudentProgress.jsx";
import AdminTutoring from "./pages/admin/AdminTutoring.jsx";
import AdminProfileSettings from "./pages/admin/AdminProfileSettings.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";

// Teacher Pages
import TeacherLayout from "./pages/teacher/TeacherLayout.jsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import TeacherClasses from "./pages/teacher/TeacherClasses.jsx";
import TeacherRoster from "./pages/teacher/TeacherRoster.jsx";
import TeacherSchedules from "./pages/teacher/TeacherSchedules.jsx";
import TeacherResources from "./pages/teacher/TeacherResources.jsx";

// Student Portal Layout
import StudentLayout from "./pages/student/StudentLayout.jsx";

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper that controls when public Navbar and Footer are rendered
function LayoutWrapper({ children, onOpenTutoring }) {
  const { pathname } = useLocation();
  // Classroom, Admin, Teacher, Student portals, and Auth pages have their own dedicated standalone experiences
  const isClassroom = pathname.startsWith("/learn/") && !pathname.includes("/quiz/");
  const isAdmin = pathname.startsWith("/admin");
  const isTeacher = pathname.startsWith("/teacher");
  const isStudentPortal = pathname.startsWith("/dashboard");
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/activate-account"
  ].some((route) => pathname === route || pathname.startsWith(route + "/"));

  const hidePublicNav = isClassroom || isAdmin || isTeacher || isStudentPortal || isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {!hidePublicNav && (
        <Navbar onOpenTutoringModal={onOpenTutoring} />
      )}
      <main className="flex-1">{children}</main>
      {!hidePublicNav && <Footer />}
    </div>
  );
}

export default function App() {
  const [tutoringModalOpen, setTutoringModalOpen] = useState(false);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <LayoutWrapper onOpenTutoring={() => setTutoringModalOpen(true)}>
          <Routes>
            {/* Public Visitor Routes */}
            <Route
              path="/"
              element={
                <HomePage onOpenTutoringModal={() => setTutoringModalOpen(true)} />
              }
            />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/courses/:slug/preview/:lessonSlug" element={<LessonPreviewPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/apply" element={<ApplyPage />} />

            {/* Authentication & Onboarding */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/activate-account" element={<ActivateAccountPage />} />

            {/* Student Hub Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboardPage />} />
              <Route path="courses" element={<MyCoursesPage />} />
              <Route path="application" element={<ApplyPage />} />
              <Route path="admission" element={<ApplyPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<ProfilePage />} />
            </Route>

            {/* Interactive Learning LMS Protected Routes */}
            <Route
              path="/learn/:courseSlug"
              element={
                <ProtectedRoute requiredRole="student">
                  <ClassroomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:courseSlug/quiz/:quizId"
              element={
                <ProtectedRoute requiredRole="student">
                  <QuizPage />
                </ProtectedRoute>
              }
            />

            {/* Public Certificate Verification */}
            <Route path="/certificates/:code" element={<CertificateVerifyPage />} />

            {/* Admin Management Portal Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplicants />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/new" element={<AdminCourseEditor />} />
              <Route path="courses/:id/curriculum" element={<AdminCurriculumEditor />} />
              <Route path="students-progress" element={<AdminStudentProgress />} />
              <Route path="tutoring" element={<AdminTutoring />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminProfileSettings />} />
              <Route path="profile" element={<AdminProfileSettings />} />
            </Route>

            {/* Teacher / Lecturer Portal Protected Routes */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <TeacherLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDashboard />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="classes/:courseId/roster" element={<TeacherRoster />} />
              <Route path="schedules" element={<TeacherSchedules />} />
              <Route path="resources" element={<TeacherResources />} />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
                  <h1 className="text-3xl font-bold text-slate-900 font-sans">404</h1>
                  <p className="text-sm text-slate-600">The requested page could not be found.</p>
                  <a
                    href="/"
                    className="inline-block px-5 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl"
                  >
                    Return to Homepage
                  </a>
                </div>
              }
            />
          </Routes>
        </LayoutWrapper>

        {/* Tutoring Admissions Modal */}
        {tutoringModalOpen && (
          <RegistrationModal onClose={() => setTutoringModalOpen(false)} />
        )}
      </BrowserRouter>
    </ErrorBoundary>
  );
}
