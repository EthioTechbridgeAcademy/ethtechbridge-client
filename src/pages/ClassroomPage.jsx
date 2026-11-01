import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Menu, X, CheckCircle2, ChevronRight, ChevronLeft, PlayCircle,
  FileText, Award, AlertCircle, Check
} from "lucide-react";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";

function getYoutubeEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
  }
  return url;
}

export default function ClassroomPage() {
  const { courseSlug } = useParams();
  const { t } = useLanguage();

  const [courseData, setCourseData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [completionBanner, setCompletionBanner] = useState(null);

  useEffect(() => {
    async function loadClassroom() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getCourseClassroom(courseSlug);
        setCourseData(res);

        // Find initial lesson: either resume last accessed or first uncompleted, or first lesson
        const allLessons = res.lessons || [];
        if (allLessons.length > 0) {
          const lastAccessedId = res.enrollment?.last_accessed_lesson_id;
          let initial = allLessons.find((l) => l.id === lastAccessedId);
          if (!initial) {
            initial = allLessons.find((l) => !l.is_completed) || allLessons[0];
          }
          setActiveLesson(initial);
        }
      } catch (err) {
        setError(err.message || "Failed to load classroom.");
      } finally {
        setLoading(false);
      }
    }
    loadClassroom();
  }, [courseSlug]);

  async function handleToggleComplete(lessonId, currentCompleted) {
    setUpdatingProgress(true);
    try {
      const res = await api.saveLessonProgress(lessonId, !currentCompleted);

      // Update local state
      setCourseData((prev) => {
        if (!prev) return prev;
        const updatedLessons = prev.lessons.map((l) =>
          l.id === lessonId ? { ...l, is_completed: !currentCompleted } : l
        );

        const updatedCurriculum = prev.curriculum.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) =>
            l.id === lessonId ? { ...l, is_completed: !currentCompleted } : l
          )
        }));

        return {
          ...prev,
          lessons: updatedLessons,
          curriculum: updatedCurriculum,
          enrollment: {
            ...prev.enrollment,
            progress_percent: res.progressPercent
          }
        };
      });

      if (activeLesson && activeLesson.id === lessonId) {
        setActiveLesson((prev) => ({ ...prev, is_completed: !currentCompleted }));
      }

      if (res.isCourseCompleted) {
        setCompletionBanner({
          certificateCode: res.certificateCode
        });
      }
    } catch (err) {
      console.error("Progress toggle error:", err.message);
    } finally {
      setUpdatingProgress(false);
    }
  }

  // Navigation helpers
  const allLessons = courseData?.lessons || [];
  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  function goToLesson(lesson) {
    setActiveLesson(lesson);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCompleteAndNext() {
    if (activeLesson) {
      handleToggleComplete(activeLesson.id, activeLesson.is_completed);
      if (nextLesson) {
        goToLesson(nextLesson);
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-slate-200 rounded" />
        <div className="h-[450px] bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Classroom Restricted</h2>
        <p className="text-xs sm:text-sm text-slate-600">{error || "Could not load course."}</p>
        <Link
          to={`/courses/${courseSlug}`}
          className="inline-block px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs"
        >
          {t.courseDetailsBtn}
        </Link>
      </div>
    );
  }

  const { course, curriculum = [], quizzes = [], enrollment } = courseData;
  const embedUrl = activeLesson ? getYoutubeEmbedUrl(activeLesson.video_url) : "";
  const progressPercent = enrollment?.progress_percent || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Learning Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
            aria-label="Toggle curriculum navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link
            to="/dashboard"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            {t.classroomDashboardLink}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
            {course.title}
          </span>
        </div>

        {/* Progress & Certificate status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-slate-400">{t.classroomProgressLabel}</span>
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="font-bold text-cyan-300">{progressPercent}%</span>
          </div>

          {courseData.certificate && (
            <Link
              to={`/certificates/${courseData.certificate.certificate_code}`}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow"
            >
              <Award className="w-3.5 h-3.5" /> {t.viewCertBtn}
            </Link>
          )}
        </div>
      </header>

      {/* Main LMS Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Curriculum Drawer / Column */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 transform lg:transform-none lg:static lg:block transition-transform duration-200 ease-in-out overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile close button */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
            <span className="font-bold text-sm text-slate-800">{t.curriculumNavHeading}</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Progress summary widget */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{t.courseCompletionLabel}</span>
                <span className="text-blue-900">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Curriculum modules */}
            <div className="space-y-4">
              {curriculum.map((mod, modIdx) => (
                <div key={mod.id || modIdx} className="space-y-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-2">
                    {mod.title}
                  </h4>
                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isActive = activeLesson?.id === les.id;
                      return (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => goToLesson(les)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between gap-2 transition-all ${
                            isActive
                              ? "bg-blue-900 text-white font-bold shadow-sm"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {les.is_completed ? (
                              <CheckCircle2
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? "text-cyan-300" : "text-emerald-600"
                                }`}
                              />
                            ) : les.content_type === "video" ? (
                              <PlayCircle
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? "text-cyan-300" : "text-slate-400"
                                }`}
                              />
                            ) : (
                              <FileText
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? "text-cyan-300" : "text-slate-400"
                                }`}
                              />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className={`text-[10px] shrink-0 ${isActive ? "text-blue-200" : "text-slate-400"}`}>
                            {les.duration_minutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Assessment / Quiz Section */}
            {quizzes.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-2">
                  {t.assessmentsHeading}
                </h4>
                {quizzes.map((q) => (
                  <Link
                    key={q.id}
                    to={`/learn/${courseSlug}/quiz/${q.id}`}
                    className="block p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200/80 hover:border-cyan-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-blue-950">
                      <span>{q.title}</span>
                      <Award className="w-4 h-4 text-cyan-600" />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {q.question_count} {t.ofQuestionsCorrect} &bull; {t.passingScoreMeta} {q.passing_score}%
                    </p>
                    {q.best_score !== null && q.best_score !== undefined && (
                      <span className="inline-block mt-1 font-bold text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                        {t.bestScoreLabel} {q.best_score}% {q.best_passed ? `✓ ${t.passedLabel}` : ""}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Content Main View */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-4xl mx-auto">
          {/* Course completion banner */}
          {completionBanner && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-sans">{t.congratsFinishedTitle}</h3>
                  <p className="text-xs text-emerald-100">
                    {t.congratsFinishedDesc}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  to={`/certificates/${completionBanner.certificateCode}`}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  {t.viewDownloadCertBtn}
                </Link>
                <button
                  type="button"
                  onClick={() => setCompletionBanner(null)}
                  className="px-3 py-2 text-xs font-semibold text-emerald-100 hover:text-white"
                >
                  {t.dismissBtn}
                </button>
              </div>
            </div>
          )}

          {activeLesson ? (
            <div className="space-y-6">
              {/* Lesson Title Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                    {t.lessonsLabel} {currentIndex + 1} {t.ofCourses} {allLessons.length}
                  </span>
                  <button
                    type="button"
                    disabled={updatingProgress}
                    onClick={() => handleToggleComplete(activeLesson.id, activeLesson.is_completed)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeLesson.is_completed
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-blue-900 text-white hover:bg-blue-800 shadow-sm"
                    }`}
                  >
                    {activeLesson.is_completed ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> {t.markCompletedBtn}
                      </>
                    ) : (
                      t.markAsCompleteBtn
                    )}
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {activeLesson.title}
                </h1>
              </div>

              {/* Video Player if present */}
              {embedUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <iframe
                    src={embedUrl}
                    title={activeLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Lesson Reading Text */}
              {activeLesson.content_text && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {activeLesson.content_text}
                  </div>
                </div>
              )}

              {/* Bottom Navigation Buttons */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                {prevLesson ? (
                  <button
                    type="button"
                    onClick={() => goToLesson(prevLesson)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> {t.previousLessonBtn}: {prevLesson.title}
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    type="button"
                    onClick={handleCompleteAndNext}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                  >
                    {t.completeNextBtn} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : quizzes.length > 0 ? (
                  <Link
                    to={`/learn/${courseSlug}/quiz/${quizzes[0].id}`}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                  >
                    {t.takeCourseQuizBtn} <Award className="w-4 h-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              {t.noCoursesAvailable}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}