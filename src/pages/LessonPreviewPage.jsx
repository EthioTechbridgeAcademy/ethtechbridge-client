import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Lock } from "lucide-react";
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

export default function LessonPreviewPage() {
  const { slug, lessonSlug } = useParams();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getPreviewLesson(slug, lessonSlug);
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load preview lesson.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, lessonSlug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-1/3 bg-slate-200 rounded" />
        <div className="h-10 w-2/3 bg-slate-200 rounded" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Preview Not Available</h2>
        <p className="text-slate-600">{error || "This lesson is private and requires enrollment."}</p>
        <Link to={`/courses/${slug}`} className="inline-block px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl">
          {t.backToCourses}
        </Link>
      </div>
    );
  }

  const { course, lesson } = data;
  const embedUrl = getYoutubeEmbedUrl(lesson.video_url);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" /> {t.backToCourseDetails} {course.title}
        </Link>
        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          {t.freePreviewBadge}
        </span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {lesson.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {lesson.duration_minutes || 15} {t.minutesLabel}
          </span>
          <span>&bull;</span>
          <span>{course.title}</span>
        </div>
      </div>

      {/* Video if present */}
      {embedUrl && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-lg">
          <iframe
            src={embedUrl}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Lesson Text Content */}
      {lesson.content_text && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {lesson.content_text}
          </div>
        </div>
      )}

      {/* Enrollment CTA Footer Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="font-bold text-lg text-white">{t.previewBannerTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.previewBannerDesc}
          </p>
        </div>
        <Link
          to={`/courses/${course.slug}`}
          className="shrink-0 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow"
        >
          {t.enrollFreeInCourseBtn}
        </Link>
      </div>
    </div>
  );
}