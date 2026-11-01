import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Clock, BookOpen, Users, CheckCircle2, Award, PlayCircle,
  FileText, ChevronDown, ArrowRight, Lock, Sparkles, AlertCircle
} from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import Alert from "../components/Alert.jsx";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    async function loadCourse() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getCourseDetails(slug);
        setData(res);
        // Default open the first module
        if (res.curriculum && res.curriculum.length > 0) {
          setOpenModules({ [res.curriculum[0].id]: true });
        }
      } catch (err) {
        setError(err.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const toggleModule = (modId) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  async function handleEnroll() {
    if (!isAuthenticated) {
      // Redirect to register with callback
      navigate(`/register?redirect=/courses/${slug}`);
      return;
    }

    setEnrolling(true);
    setError("");
    try {
      const res = await api.enrollCourse(slug);
      setSuccessMsg(res.message);
      // Refresh course state
      const updated = await api.getCourseDetails(slug);
      setData(updated);
      setTimeout(() => {
        navigate(`/learn/${slug}`);
      }, 1200);
    } catch (err) {
      setError(err.message || "Could not complete enrollment.");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-1/4 bg-slate-200 rounded" />
        <div className="h-12 w-3/4 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (!data || !data.course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-slate-600">The requested course could not be located or is unpublished.</p>
        <Link to="/courses" className="inline-block px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl">
          {t.backToCourses}
        </Link>
      </div>
    );
  }

  const { course, curriculum = [], quizzes = [], relatedCourses = [], isEnrolled, enrollment } = data;

  return (
    <div className="pb-20 space-y-12">
      {/* Course Banner Header */}
      <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Course Summary */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {course.category_name && (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {course.category_name}
                  </span>
                )}
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/10 text-slate-200 uppercase tracking-wider">
                  {course.difficulty}
                </span>
                <span className="px-2.5 py-1 text-xs font-extrabold rounded-md bg-cyan-500 text-slate-950">
                  {course.is_free ? t.freeBadge : `$${course.price}`}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                {course.short_description || course.description}
              </p>

              {/* Meta stats */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{course.duration_hours || 10} {t.courseHoursMeta}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>{course.lesson_count || 0} {t.lessonsMeta}</span>
                </div>
                {Number(course.enrollment_count) > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{course.enrollment_count} {t.enrolledMeta}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Award className="w-4 h-4" />
                  <span>{t.certMeta}</span>
                </div>
              </div>

              {/* Instructor info */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-800 text-cyan-300 font-bold flex items-center justify-center text-sm">
                  {course.instructor_name ? course.instructor_name[0] : "F"}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{course.instructor_name}</p>
                  <p className="text-[11px] text-slate-400">{course.instructor_title}</p>
                </div>
              </div>
            </div>

            {/* Right Action / Thumbnail Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.is_free && (
                    <span className="absolute top-2 right-2 px-2.5 py-1 text-xs font-extrabold rounded-md bg-cyan-500 text-white shadow">
                      {t.freeBadge}
                    </span>
                  )}
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError("")} />}
                {successMsg && <Alert type="success" message={successMsg} />}

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600" /> {t.enrolledBannerText}
                      </span>
                      <span className="font-bold text-slate-900">
                        {enrollment?.progress_percent || 0}% {t.completedBadge}
                      </span>
                    </div>
                    <Link
                      to={`/learn/${course.slug}`}
                      className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {t.goToClassroomBtn} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {enrolling ? (
                      t.enrollingText
                    ) : isAuthenticated ? (
                      <>
                        {t.enrollNowFreeBtn} <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        {t.signUpEnrollFreeBtn} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                <div className="text-center text-xs text-slate-500 pt-1">
                  {t.lifetimeAccessText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Learning Objectives */}
            {course.learning_objectives && course.learning_objectives.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  {t.whatYouLearnHeading}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {course.learning_objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{t.curriculumHeading}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {curriculum.length} {t.modulesWord} &bull; {course.lesson_count || 0} {t.lessonsLabel} &bull; {quizzes.length} {t.quizWord}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {curriculum.map((mod) => {
                  const isOpen = Boolean(openModules[mod.id]);
                  return (
                    <div key={mod.id} className="rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-900 text-sm transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>{mod.title}</span>
                          <span className="text-xs font-normal text-slate-500">
                            ({mod.lessons?.length || 0} {t.lessonsLabel})
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {mod.lessons?.map((les) => (
                            <div
                              key={les.id}
                              className="p-3.5 sm:px-5 flex items-center justify-between gap-4 text-xs sm:text-sm hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {les.content_type === "video" ? (
                                   <PlayCircle className="w-4 h-4 text-blue-900 shrink-0" />
                                ) : (
                                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                                )}
                                <span className="font-medium text-slate-800">{les.title}</span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-slate-400">
                                  {les.duration_minutes || 15} {t.minutesLabel}
                                </span>
                                {les.is_preview ? (
                                  <Link
                                    to={`/courses/${course.slug}/preview/${les.slug}`}
                                    className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                  >
                                    {t.previewBtn}
                                  </Link>
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{t.aboutCourseHeading}</h2>
              <div className="text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                {course.description}
              </div>
            </div>
          </div>

          {/* Right Sidebar Info Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Prerequisites & Target Audience */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                  {t.prerequisitesHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {course.prerequisites || "No prior technical experience required. Open to all curious learners."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                  {t.targetAudienceHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {course.target_audience || "Students, aspiring programmers, educators, and working professionals."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                  {t.assessmentCertHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.assessmentCertDesc}
                </p>
              </div>
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-base text-slate-900">{t.relatedCoursesHeading}</h3>
                <div className="space-y-3">
                  {relatedCourses.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/courses/${rel.slug}`}
                      className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-900 line-clamp-1">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {rel.difficulty} &bull; {rel.duration_hours} {t.hrsContent} &bull; {rel.is_free ? t.freeBadge : `$${rel.price}`}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}