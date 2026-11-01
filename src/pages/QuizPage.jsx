import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Award, CheckCircle2, XCircle, ArrowLeft, RefreshCw, AlertCircle,
  HelpCircle, ArrowRight
} from "lucide-react";
import { api } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Alert from "../components/Alert.jsx";

export default function QuizPage() {
  const { courseSlug, quizId } = useParams();
  const { t } = useLanguage();

  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      setError("");
      try {
        const res = await api.getQuiz(quizId);
        setQuizData(res);
      } catch (err) {
        setError(err.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  function handleSelectOption(questionId, optionId) {
    if (results) return; // locked after submission
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const questions = quizData?.questions || [];
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      if (!confirm(`You have answered ${answeredCount} of ${questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await api.submitQuiz(quizId, answers);
      setResults(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Failed to evaluate quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setResults(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-slate-200 rounded" />
        <div className="h-48 bg-slate-200 rounded-2xl" />
        <div className="h-48 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Quiz Unavailable</h2>
        <p className="text-sm text-slate-600">{error || "Could not retrieve quiz questions."}</p>
        <Link
          to={`/learn/${courseSlug}`}
          className="inline-block px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs"
        >
          {t.backToClassroomLink}
        </Link>
      </div>
    );
  }

  const { quiz, questions = [] } = quizData;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <Link
        to={`/learn/${courseSlug}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700"
      >
        <ArrowLeft className="w-4 h-4" /> {t.backToClassroomLink}
      </Link>

      {/* Quiz Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-100 text-cyan-800">
            {t.assessmentCheckpointBadge}
          </span>
          <span className="text-xs text-slate-500">
            {t.passingScoreMeta} <strong className="text-slate-800">{quiz.passing_score}%</strong>
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">{quiz.title}</h1>
        {quiz.description && <p className="text-xs sm:text-sm text-slate-600">{quiz.description}</p>}
      </div>

      {/* Results Scorecard if submitted */}
      {results && (
        <div
          className={`p-6 rounded-2xl border shadow-lg space-y-4 animate-in fade-in zoom-in-95 ${
            results.passed
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
              : "bg-amber-50/80 border-amber-200 text-amber-950"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {results.passed ? (
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center">
                  <Award className="w-7 h-7" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl">
                  {results.passed ? t.congratsPassedTitle : t.almostThereTitle}
                </h3>
                <p className="text-xs sm:text-sm">
                  {t.youScoredLabel} <strong>{results.score}%</strong> ({results.correctCount} {t.ofCourses} {results.totalQuestions} {t.ofQuestionsCorrect}). {t.requiredScoreLabel} {results.passingScore}%.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 bg-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {t.retakeQuizBtn}
            </button>
            <Link
              to={`/learn/${courseSlug}`}
              className="px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {t.backToClassroomLink} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, qIndex) => {
          const reviewItem = results?.review?.find((r) => r.questionId === q.id);

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl bg-white border shadow-sm space-y-4 transition-all ${
                reviewItem
                  ? reviewItem.isCorrect
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-rose-300 bg-rose-50/20"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  <span className="text-blue-900 font-bold mr-2">Q{qIndex + 1}.</span>
                  {q.text}
                </h3>
                {reviewItem && (
                  <span className="shrink-0">
                    {reviewItem.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t.correctAnswerBadge}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> {t.incorrectAnswerBadge}
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  let optStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";

                  if (isSelected && !results) {
                    optStyle = "border-blue-900 bg-blue-50/50 text-blue-950 font-semibold ring-1 ring-blue-900";
                  } else if (results) {
                    if (reviewItem?.correctOptionId === opt.id) {
                      optStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                    } else if (isSelected && !reviewItem?.isCorrect) {
                      optStyle = "border-rose-400 bg-rose-50 text-rose-950 line-through";
                    } else {
                      optStyle = "border-slate-200 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={Boolean(results)}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${optStyle}`}
                    >
                      <span>{opt.text}</span>
                      <div
                        className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                          isSelected ? "border-blue-900 bg-blue-900 text-white" : "border-slate-300"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Review */}
              {reviewItem?.explanation && (
                <div className="p-3.5 rounded-xl bg-slate-100/80 text-xs text-slate-700 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-slate-900">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-700" /> {t.explanationHeading}
                  </span>
                  <p>{reviewItem.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {!results && (
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting || questions.length === 0}
              className="px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? t.evaluatingQuizBtn : t.submitAssessmentBtn} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}