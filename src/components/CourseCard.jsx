import { Link } from "react-router-dom";
import { Clock, BookOpen, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function CourseCard({ course, isEnrolled = false, progressPercent = 0 }) {
  const { t } = useLanguage();

  const {
    slug,
    title,
    short_description,
    description,
    category_name,
    difficulty,
    duration_hours,
    lesson_count = 0,
    enrollment_count = 0,
    thumbnail_url,
    instructor_name,
    is_free = true,
    price = 0
  } = course;

  const defaultThumbnail = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop";

  const difficultyColors = {
    beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    intermediate: "bg-blue-50 text-blue-700 border-blue-200",
    advanced: "bg-purple-50 text-purple-700 border-purple-200",
    all_levels: "bg-slate-50 text-slate-700 border-slate-200"
  };

  const difficultyLabels = {
    beginner: t.diffBeginner,
    intermediate: t.diffIntermediate,
    advanced: t.diffAdvanced,
    all_levels: t.allLevels
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* Thumbnail Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnail_url || defaultThumbnail}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = defaultThumbnail;
          }}
        />

        {/* Category Pill */}
        {category_name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
            {category_name}
          </span>
        )}

        {/* Free or Price Badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-extrabold rounded-lg shadow-sm bg-cyan-500 text-white">
          {is_free ? t.freeBadge : `$${Number(price).toFixed(2)}`}
        </span>

        {/* In-progress banner if enrolled */}
        {isEnrolled && (
          <div className="absolute bottom-0 inset-x-0 bg-slate-900/85 backdrop-blur-sm text-white px-3 py-1.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-cyan-300">
              <CheckCircle className="w-3.5 h-3.5" /> {t.enrolledBadge}
            </span>
            <span className="font-bold">{progressPercent}% {t.completedBadge}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta badges */}
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded border ${
              difficultyColors[difficulty] || difficultyColors.beginner
            }`}
          >
            {difficultyLabels[difficulty] || difficultyLabels.beginner}
          </span>
          <span className="text-xs text-slate-400">&bull;</span>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {duration_hours || 10} {t.hrsContent}
          </span>
          {lesson_count > 0 && (
            <>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {lesson_count} {t.lessonsLabel}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base sm:text-lg line-clamp-2 group-hover:text-blue-900 transition-colors mb-2">
          <Link to={`/courses/${slug}`}>{title}</Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {short_description || description}
        </p>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}

        {/* Footer info: Instructor & Enrollment count */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-4">
          <span className="font-medium text-slate-700 truncate max-w-[140px]">
            {instructor_name || "Faculty Member"}
          </span>
          {Number(enrollment_count) > 0 && (
            <span className="flex items-center gap-1 text-slate-500">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {enrollment_count} {enrollment_count === 1 ? t.studentLabel : t.studentsLabel}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            to={`/courses/${slug}`}
            className="w-full text-center py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            {t.courseDetailsBtn}
          </Link>
          {isEnrolled ? (
            <Link
              to={`/learn/${slug}`}
              className="w-full text-center py-2 px-3 text-xs font-bold rounded-lg bg-blue-900 hover:bg-blue-800 text-white shadow-sm flex items-center justify-center gap-1 transition-colors"
            >
              {t.continueBtn} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/courses/${slug}`}
              className="w-full text-center py-2 px-3 text-xs font-bold rounded-lg bg-blue-900 hover:bg-blue-800 text-white shadow-sm transition-colors"
            >
              {t.enrollFreeBtn}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

