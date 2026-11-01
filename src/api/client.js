const DEFAULT_DEV_API = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "/api"
    : DEFAULT_DEV_API
);

export function getAuthToken() {
  return localStorage.getItem("eta_auth_token") || "";
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("eta_auth_token", token);
  } else {
    localStorage.removeItem("eta_auth_token");
  }
}

export async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me"),
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
  verifyActivationToken: (token) => request(`/auth/verify-activation-token?token=${encodeURIComponent(token)}`),
  activateAccount: (payload) => request("/auth/activate-account", { method: "POST", body: JSON.stringify(payload) }),

  // Public Catalog
  getCategories: () => request("/categories"),
  getCourses: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(`/courses${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getCourseDetails: (slug) => request(`/courses/${slug}`),
  getPreviewLesson: (courseSlug, lessonSlug) => request(`/courses/${courseSlug}/preview/${lessonSlug}`),
  enrollCourse: (slug) => request(`/courses/${slug}/enroll`, { method: "POST" }),

  // Student
  getStudentDashboard: () => request("/student/dashboard"),
  getStudentCourses: () => request("/student/courses"),
  getCourseClassroom: (slug) => request(`/student/courses/${slug}/learn`),
  saveLessonProgress: (lessonId, isCompleted = true) =>
    request(`/student/lessons/${lessonId}/progress`, {
      method: "POST",
      body: JSON.stringify({ isCompleted })
    }),
  getQuiz: (quizId) => request(`/student/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) =>
    request(`/student/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers })
    }),
  getStudentCertificates: () => request("/student/certificates"),
  getStudentProfile: () => request("/student/profile"),
  updateStudentProfile: (payload) => request("/student/profile", { method: "PUT", body: JSON.stringify(payload) }),
  changePassword: (payload) => request("/student/change-password", { method: "PUT", body: JSON.stringify(payload) }),

  // Public Certificate
  verifyCertificate: (code) => request(`/certificates/${code}`),

  // Admin
  getAdminOverview: () => request("/admin/overview"),
  getAdminCourses: () => request("/admin/courses"),
  createCourse: (payload) => request("/admin/courses", { method: "POST", body: JSON.stringify(payload) }),
  updateCourse: (id, payload) => request(`/admin/courses/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCourse: (id) => request(`/admin/courses/${id}`, { method: "DELETE" }),
  getCurriculum: (id) => request(`/admin/courses/${id}/curriculum`),
  addModule: (courseId, payload) => request(`/admin/courses/${courseId}/modules`, { method: "POST", body: JSON.stringify(payload) }),
  addLesson: (courseId, payload) => request(`/admin/courses/${courseId}/lessons`, { method: "POST", body: JSON.stringify(payload) }),
  updateLesson: (lessonId, payload) => request(`/admin/lessons/${lessonId}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteLesson: (lessonId) => request(`/admin/lessons/${lessonId}`, { method: "DELETE" }),
  getStudentProgressList: () => request("/admin/students-progress"),
  getAdminProfile: () => request("/admin/profile"),
  updateAdminProfile: (payload) => request("/admin/profile", { method: "PUT", body: JSON.stringify(payload) }),
  changeAdminPassword: (payload) => request("/admin/change-password", { method: "PUT", body: JSON.stringify(payload) }),

  // Preserved Tutoring endpoints
  submitTutoringRegistration: (payload) => request("/registrations", { method: "POST", body: JSON.stringify(payload) }),

  // Phase 2: Native Student Applications
  submitApplication: (payload) => request("/applications", { method: "POST", body: JSON.stringify(payload) }),
  getMyApplicationStatus: () => request("/applications/my-status"),
  getAdminApplications: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(`/admin/applications${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getAdminApplicationDetails: (id) => request(`/admin/applications/${id}`),
  updateApplicationStatus: (id, payload) =>
    request(`/admin/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  updateApplicationNotes: (id, payload) =>
    request(`/admin/applications/${id}/notes`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  convertApplicationToStudent: (id) =>
    request(`/admin/applications/${id}/convert`, {
      method: "POST"
    }),
  getAdminReportsSummary: () => request("/admin/reports/summary"),
  getAdminAdmissionsReport: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(`/admin/reports/admissions${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getAdminAcademicProgressReport: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(`/admin/reports/academic-progress${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getAdminSchedulesReport: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(`/admin/reports/schedules${query.toString() ? `?${query.toString()}` : ""}`);
  },
  getAdminSummary: () => request("/admin/summary"),
  getAdminStudents: (query = "") => request(`/admin/students${query}`),
  assignStudentGrade: (id, assignedGrade) => request(`/admin/students/${id}/assign`, { method: "PATCH", body: JSON.stringify({ assignedGrade }) }),
  getSchedules: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    return request(`/admin/schedules${query.toString() ? `?${query.toString()}` : ""}`);
  },
  createSchedule: (payload) => request("/admin/schedules", { method: "POST", body: JSON.stringify(payload) }),
  updateSchedule: (id, payload) => request(`/admin/schedules/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteSchedule: (id) => request(`/admin/schedules/${id}`, { method: "DELETE" }),
  getAdminInstructors: () => request("/admin/instructors"),
  assignCourseInstructor: (courseId, instructorUserId) =>
    request(`/admin/courses/${courseId}/assign-instructor`, {
      method: "PATCH",
      body: JSON.stringify({ instructorUserId })
    }),
  getAnnouncements: () => request("/announcements"),
  getAdminAnnouncements: () => request("/admin/announcements"),
  createAnnouncement: (payload) => request("/admin/announcements", { method: "POST", body: JSON.stringify(payload) }),
  deleteAnnouncement: (id) => request(`/admin/announcements/${id}`, { method: "DELETE" }),
  getNotificationLogs: () => request("/admin/notifications"),

  // Student Online Classes & Teams Sessions
  getStudentSchedules: () => request("/student/schedules"),

  // Instructor / Teacher Portal
  getInstructorOverview: () => request("/instructor/overview"),
  getInstructorCourses: () => request("/instructor/courses"),
  getInstructorCourseRoster: (courseId) => request(`/instructor/courses/${courseId}/roster`),
  getInstructorSchedules: () => request("/instructor/schedules"),
  getInstructorClassDetails: (scheduleId) => request(`/instructor/classes/${scheduleId}`),
  updateInstructorSchedule: (scheduleId, payload) =>
    request(`/instructor/schedules/${scheduleId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  getInstructorResources: () => request("/instructor/resources"),
  createInstructorResource: (payload) =>
    request("/instructor/resources", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteInstructorResource: (id) =>
    request(`/instructor/resources/${id}`, {
      method: "DELETE"
    })
};

