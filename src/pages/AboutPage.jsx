import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap, Laptop, Code2, CheckCircle2, ArrowRight,
  MapPin, MessageSquare, Phone, Mail, ExternalLink, ChevronDown,
  Target, BookOpen, Award, Sparkles, Compass
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getPublicGoogleFormUrl } from "../utils/googleForm.js";

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);
  const googleFormUrl = getPublicGoogleFormUrl();

  const progAcademicSubs = Array.isArray(t.progAcademicSubs)
    ? t.progAcademicSubs
    : [
        "English & Reading Comprehension",
        "Mathematics (Primary to Grade 12)",
        "Physics (Core Concepts & Formulas)",
        "Chemistry & Biology Fundamentals"
      ];

  const progDigitalSubs = Array.isArray(t.progDigitalSubs)
    ? t.progDigitalSubs
    : [
        "Computer Fundamentals & File Management",
        "Microsoft Office (Word, Excel, PowerPoint)",
        "Canva Visual Design & Presentations",
        "Digital Literacy & Safe Internet Research"
      ];

  const progWebSubs = Array.isArray(t.progWebSubs)
    ? t.progWebSubs
    : [
        "HTML5 Structured Page Layouts",
        "CSS3 Modern Responsive Styling",
        "JavaScript Programming & Logic",
        "Full-Stack Development Foundations"
      ];

  const formats = Array.isArray(t.formats)
    ? t.formats
    : [
        {
          title: "One-to-One Tutoring",
          desc: "Dedicated mentor focused on individual student pacing and mastery."
        },
        {
          title: "Small Groups",
          desc: "Interactive cohorts of 3–6 students for collaborative learning."
        },
        {
          title: "Online Classrooms",
          desc: "Live digital sessions with screen sharing and recordings."
        },
        {
          title: "After-School Support",
          desc: "Structured daily homework assistance and exam preparation drills."
        }
      ];

  const whyCards = Array.isArray(t.whyCards)
    ? t.whyCards
    : [
        {
          title: "Personalized Learning",
          desc: "Every student receives tailored diagnostic guidance and individual pacing for conceptual mastery."
        },
        {
          title: "Homework Support",
          desc: "Structured daily mentorship that resolves academic roadblocks and builds study discipline."
        },
        {
          title: "Exam Preparation",
          desc: "Focused preparation drills for school tests and regional national examinations."
        }
      ];

  const faqs = useMemo(() => {
    if (lang === "am") {
      return [
        [
          "በኢትዮ ቴክብሪጅ አካዳሚ የትኞቹ ክፍሎች እና ትምህርቶች ይሰጣሉ?",
          "ከ1ኛ እስከ 12ኛ ክፍል ላሉ ተማሪዎች በሂሳብ፣ እንግሊዝኛ፣ ፊዚክስ፣ ኬሚስትሪ እና ባዮሎጂ ሙሉ ድጋፍ እንሰጣለን። በተጨማሪም ተግባራዊ የኮምፒውተር ክህሎት እና የዌብሳይት ኮዲንግ ስልጠናዎችን እናቀርባለን።"
        ],
        [
          "የአሰጣጥ አማራጮች ምን ምን ናቸው?",
          "የግል (1-ለ-1) ትምህርት፣ አነስተኛ የቡድን ትምህርት (ከ3-6 ተማሪዎች)፣ የቀጥታ የኦንላይን ክፍል እና ከትምህርት ሰዓት በኋላ የማጠናከሪያ ፕሮግራሞች አሉን።"
        ],
        [
          "የመማሪያ ማዕከላት አድራሻ የት ነው?",
          "በአዲስ አበባ ሲኤምሲ፣ ሰሚት፣ ሰሚት 72፣ አያት እና አቅራቢያ ባሉ አካባቢዎች ያሉ ቤተሰቦችን በግቢ እና በኦንላይን እናገለግላለን።"
        ],
        [
          "ምዝገባ እንዴት ይከናወናል?",
          "በድረ-ገፃችን ፈጣን ማመልከቻ መሙላት ወይም በይፋዊው የጉግል ፎርም መመዝገብ ይችላሉ። የትምህርት ቡድናችን ፈትሾ በ24-48 ሰዓት ውስጥ ያነጋግርዎታል።"
        ],
        [
          "ተቋሙ እውቅና አለው?",
          "አዎ! ኢትዮ ቴክብሪጅ አካዳሚ በሀገር አቀፍ ስርዓተ-ትምህርት መስፈርቶች እና በዘመናዊ የSTEM ዲጂታል እውቀት ላይ የተመሰረተ እውቅና ያለው የትምህርት ተቋም ነው።"
        ]
      ];
    }
    if (lang === "om") {
      return [
        [
          "Akkaadaamii Ethio Techbridge keessatti kutaa fi gosa barnootaa kamtu kennama?",
          "Kutaa 1 hanga 12tti Herrega, Afaan Ingilizii, Fiiziksii, Keemistirii fi Baayoloojii dabalatee barnoota dandeettii dijitaalaa fi koodiingii ni kennina."
        ],
        [
          "Filannoowwan barnootaa maal fa'a?",
          "Barnoota dhuunfaa (1-fi-1), garee xixinnoo (barattoota 3-6), daree toora interneetii fi barnoota sa'aatii boodaa qabna."
        ],
        [
          "Wiirtuuleen barnootaa eessatti argamu?",
          "Finfinnee keessatti CMC, Summit, Semit, 72, Ayat fi naannoo isaa hunda tajaajilla."
        ],
        [
          "Galmeen akkamitti raawwatama?",
          "Uunkaa saffisaa keenya toora interneetiin guutuu yookiin Google Form'n galmaa'uu dandeessu. Barsiisonni keenya hatattamaan isin qunnamu."
        ],
        [
          "Dhaabbatichi beekkamtii qabaa?",
          "Eeyyee! Ethio Techbridge Academy sirna barnootaa biyyaalessaa fi teeknoolojii STEM ammayyaa irratti hundaa'uun beekkamtii kan qabuudha."
        ]
      ];
    }
    return [
      [
        "Which grades and subjects are supported at Ethio Techbridge Academy?",
        "We provide academic support for Grade 1 through Grade 12 students in core subjects including Mathematics, English, Physics, Chemistry, and Biology, alongside practical Digital Skills and Web Development."
      ],
      [
        "What learning formats are available for students?",
        "We offer One-to-One personalized tutoring, Small Interactive Groups, Online Live Sessions, and After-School enrichment classes."
      ],
      [
        "Where are the physical campus and tutorial centers located?",
        "Our learning centers serve Addis Ababa families across CMC, Summit, Semit, 72, Ayat, and neighboring areas."
      ],
      [
        "How do we apply and confirm enrollment?",
        "Parents can submit our Fast-Track Application or complete the official Google Form application. Our admissions coordinator reviews student backgrounds and confirms placement."
      ],
      [
        "Is Ethio Techbridge Academy accredited?",
        "Yes. Ethio Techbridge Academy operates under certified educational standards, adhering to national curriculum benchmarks while integrating practical STEM competencies."
      ]
    ];
  }, [lang]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* 1. RESTORED PREVIOUS HEADER BANNER WITH BACKGROUND */}
      <section className="bg-gradient-to-r from-[#0F2447] via-[#162E56] to-[#1E3A8A] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/60 shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-4 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
            <GraduationCap className="w-4 h-4" />
            <span>{t.aboutHeaderBadge || "About Ethio Techbridge Academy"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif text-white">
            {t.aboutHeaderTitle || "Bridging the Digital Divide with Quality Tech Education"}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-3xl leading-relaxed font-serif">
            {t.aboutHeaderDesc || t.aboutDesc ||
              "Ethio Techbridge Academy was founded to provide accessible, high-quality technical education for students in Addis Ababa and across Ethiopia. We combine foundational computing literacy with modern programming languages, helping young minds develop problem-solving skills for the digital age."}
          </p>
        </div>
      </section>

      {/* 2. RESTORED PREVIOUS MISSION & VISION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900">
              <Target className="w-6 h-6 text-blue-800" />
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-900">
              {t.aboutOurMission || "Our Mission"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutMissionText ||
                "Empowering Ethiopian students with practical digital capabilities, computer literacy, modern web programming, and foundational academic excellence through accessible online learning and dedicated in-person tutoring."}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Compass className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-900">
              {t.aboutOurVision || "Our Vision"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.aboutVisionText ||
                "To build a generation of confident Ethiopian creators, engineers, and problem solvers equipped with international standards of technology and rigorous academic fundamentals."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. CURRENT ABOUT SECTION (ACCREDITED INSTITUTION OVERVIEW) */}
      <section id="about" className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 pt-4 pb-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-center">
            <div>
              <span className="inline-block rounded bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                {t.aboutBadge || "Accredited Educational Institution"}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-[#111827]">
                {t.aboutTitle || "About Ethio Techbridge Academy"}
              </h2>
              <div className="mt-3 border-l-2 border-[#F59E0B] pl-4 space-y-2">
                <p className="text-base text-[#111827] font-medium font-serif leading-relaxed">
                  {t.aboutPara1}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.aboutPara2}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.aboutPara3}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/apply"
                  className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#172554] transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>{t.aboutBtnEnroll || "Enroll Your Student"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="#campus"
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {t.aboutBtnTour || "Campus Locations & Tours"}
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
                {t.aboutHighlightsTitle || "Accredited Academic Highlights"}
              </h3>
              <div className="divide-y divide-slate-200 text-xs text-slate-700">
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">{t.aboutScope || "Curriculum Scope:"}</span>
                  <span className="font-bold text-[#1E3A8A]">{t.aboutScopeVal || "Grade 1 to Grade 12"}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">{t.aboutTrack || "Digital Track:"}</span>
                  <span className="font-bold text-[#1E3A8A]">{t.aboutTrackVal || "Web Dev & Digital Literacy"}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">{t.aboutFormat || "Format:"}</span>
                  <span className="font-bold">{t.aboutFormatVal || "Campus, 1-on-1 & Online"}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="font-semibold">{t.aboutAdmissionsLink || "Admissions:"}</span>
                  {googleFormUrl ? (
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#1E3A8A] underline"
                    >
                      Google Form Link
                    </a>
                  ) : (
                    <Link to="/apply" className="font-bold text-[#1E3A8A] underline">
                      Apply Online
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAMS SECTION */}
      <section id="programs" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
            {t.programsBadge || "Academic Support & Technology"}
          </span>
          <h2 className="mt-2 text-3xl font-bold font-serif text-[#111827]">
            {t.programsTitle || "Educational Programs"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.programsSubtitle || "Structured learning pathways designed for measurable academic progress and practical technology skills."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Program 1: Academic Support */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#1E3A8A] transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <span className="rounded bg-blue-50 text-[#1E3A8A] px-2.5 py-1 text-xs font-bold">
                  {t.progAcademicBadge || "Grades 1 – 12"}
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-[#111827]">
                {t.progAcademicTitle || "Academic Support"}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {t.progAcademicDesc}
              </p>
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                {progAcademicSubs.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/apply"
              className="mt-6 w-full rounded-xl bg-slate-50 hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t.progAcademicBtn || "Enroll for Academic Support"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </article>

          {/* Program 2: Digital Skills & Tech */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#1E3A8A] transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                  <Laptop className="w-5 h-5" />
                </span>
                <span className="rounded bg-blue-50 text-[#1E3A8A] px-2.5 py-1 text-xs font-bold">
                  {t.progDigitalBadge || "Digital Track"}
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-[#111827]">
                {t.progDigitalTitle || "Digital Skills & Tech"}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {t.progDigitalDesc}
              </p>
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                {progDigitalSubs.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/apply"
              className="mt-6 w-full rounded-xl bg-slate-50 hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t.progDigitalBtn || "Enroll for Digital Skills"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </article>

          {/* Program 3: Web Development */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#1E3A8A] transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                  <Code2 className="w-5 h-5" />
                </span>
                <span className="rounded bg-blue-50 text-[#1E3A8A] px-2.5 py-1 text-xs font-bold">
                  {t.progWebBadge || "Coding Track"}
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-[#111827]">
                {t.progWebTitle || "Web Development"}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {t.progWebDesc}
              </p>
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                {progWebSubs.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/apply"
              className="mt-6 w-full rounded-xl bg-slate-50 hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t.progWebBtn || "Enroll for Web Development"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </article>
        </div>

        {/* Learning Formats Sub-section */}
        <div className="mt-12 rounded-2xl bg-[#1E3A8A] text-white p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              {t.learningFormatsBadge || "Learning Formats"}
            </span>
            <h3 className="mt-1 text-xl font-bold font-serif">
              {t.learningFormatsTitle || "Tailored Options for Every Student"}
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map((fmt, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-bold text-sm font-serif text-white">{fmt.title}</h4>
                <p className="mt-1 text-xs text-blue-100 leading-relaxed">{fmt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAMPUS SECTION */}
      <section id="campus" className="bg-white py-16 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
                {t.campusBadge || "Campus Facilities"}
              </span>
              <h2 className="mt-2 text-3xl font-bold font-serif text-[#111827]">
                {t.campusTitle || "Visit Our Learning Campus & Centers"}
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t.campusDesc}
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#1E3A8A] shrink-0 mt-0.5 w-5 h-5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#111827]">
                      {t.campusLocationsTitle || "Locations in Addis Ababa"}
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5">
                      {t.campusLocationsList || "CMC • Summit • Semit • 72 • Ayat & Nearby Neighborhoods"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/apply"
                  className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#172554] transition shadow-xs"
                >
                  {t.campusBtnSchedule || "Schedule a Campus Visit"}
                </Link>
                <a
                  href="https://wa.me/251981329252?text=Hello%20Ethio%20Techbridge%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20campus%20tours%20and%20enrollment."
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span>{t.campusBtnWhatsapp || "WhatsApp Admissions"}</span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <img
                src="/campus-quad.jpg"
                alt="Campus Quad"
                className="h-80 w-full object-cover"
              />
              <div className="bg-[#111827] text-white p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold font-serif text-sm">
                    {t.campusPhotoTitle || "Ethio Techbridge Campus Quad"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t.campusPhotoSubtitle || "Open Monday – Saturday for Student Sessions & Tours"}
                  </p>
                </div>
                <span className="rounded bg-[#F59E0B] text-[#111827] px-2 py-0.5 text-xs font-bold">
                  Addis Ababa
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY US SECTION */}
      <section id="why-us" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
            {t.whyUsBadge || "Institutional Advantage"}
          </span>
          <h2 className="mt-2 text-3xl font-bold font-serif text-[#111827]">
            {t.whyUsTitle || "Why Choose Ethio Techbridge?"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {t.whyUsSlogan || '"Better Learning, Brighter Future. Your Goals, Our Support."'}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {whyCards.map((card, idx) => {
            const Icon = idx === 0 ? Target : idx === 1 ? BookOpen : Award;
            return (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 mb-4">
                  <Icon className="text-[#1E3A8A] w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-serif text-[#111827]">{card.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Ready to Start Enrollment Banner */}
        <div className="mt-12 rounded-2xl bg-[#1E3A8A] p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                {t.readyBadge || "Official Enrollment Channel"}
              </span>
              <h3 className="mt-1 text-2xl font-bold font-serif">
                {t.readyTitle || "Ready to Start Your Student's Journey?"}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
                {t.readySubtitle || "Complete our fast-track online application or submit via the official Google Form."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/apply"
                className="rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#111827] px-6 py-3 text-xs font-extrabold shadow-sm transition"
              >
                {t.readyBtnApply || "Apply Online Now"}
              </Link>
              {googleFormUrl && (
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/30 bg-white/10 hover:bg-white hover:text-[#1E3A8A] px-5 py-3 text-xs font-bold text-white transition flex items-center gap-1.5"
                >
                  <span>{t.readyBtnGoogle || "Open Google Form"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
            {t.faqBadge || "Helpful Answers"}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-[#111827]">
            {t.faqTitle || "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map(([question, answer], idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-bold text-sm text-[#111827] hover:text-[#1E3A8A] transition"
                >
                  <span className="font-serif">{question}</span>
                  <ChevronDown
                    className={`shrink-0 transition-transform duration-200 text-slate-400 ${
                      isOpen ? "rotate-180 text-[#1E3A8A]" : ""
                    } w-4 h-4`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 bg-slate-50/50">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CONTACT SECTION (Campus Quick Contact Cards with updated 0981329252 / 0972755976) */}
      <section id="contact" className="bg-slate-100 py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href="#campus"
              className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-[#1E3A8A] transition no-underline"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">
                  {t.contactCampus || "Campus Locations"}
                </h4>
                <p className="mt-0.5 text-xs text-slate-600">
                  CMC • Summit • Semit • 72 • Ayat
                </p>
              </div>
            </a>

            <div
              className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-[#1E3A8A] transition"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] shrink-0">
                <Phone className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">
                  {t.contactPhone || "WhatsApp & Phone"}
                </h4>
                <div className="mt-0.5 text-xs font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                  <a href="tel:0981329252" className="hover:text-[#1E3A8A] hover:underline transition-colors">
                    0981329252
                  </a>
                  <span className="text-slate-400 font-normal">/</span>
                  <a href="tel:0972755976" className="hover:text-[#1E3A8A] hover:underline transition-colors">
                    0972755976
                  </a>
                </div>
              </div>
            </div>

            <a
              href="mailto:yilmatibarek99@gmail.com"
              className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-[#1E3A8A] transition no-underline"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] shrink-0">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">
                  {t.contactEmail || "Email Admissions"}
                </h4>
                <p className="mt-0.5 text-xs font-semibold text-slate-900 truncate max-w-[200px]">
                  yilmatibarek99@gmail.com
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
