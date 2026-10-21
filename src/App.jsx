import { useEffect, useMemo, useState, useRef } from "react";
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronDown, GraduationCap,
  Menu, ShieldCheck, Sparkles, Users, X, Clock3, Mail, Search, LogOut, RefreshCw,
  Phone, MapPin, Laptop, Code2, Award, Building2, Check, ExternalLink,
  ChevronRight, FileText, Calendar, Plus, User, Info, ArrowUpRight,
  Download, ChevronLeft, ChevronsLeft, ChevronsRight, Printer, Filter, BarChart3,
  FileSpreadsheet, Globe, Megaphone, Trash2, Eye, EyeOff, CheckSquare,
  Play, Video, Edit2, PlayCircle, Cookie, Layers, Tag
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1KmWlZIrQLyVslZzoj_HJR-EVq8KdzR48IjGJf9UcMZM/edit?chromeless=1";
const grades = Array.from({ length: 12 }, (_, i) => i + 1);

async function api(path, options = {}, token = "") {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

function getYoutubeEmbedUrl(url) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  }
  return url;
}

const DEFAULT_COURSES = [
  {
    id: 1,
    title: "Full-Stack Web Coding & Python for Young Creators",
    format: "online",
    grade_range: "Grades 5-12",
    description: "Engaging interactive programming lessons covering HTML5, modern CSS, JavaScript, and introductory Python. Students build real interactive websites and coding projects.",
    topics: "HTML/CSS Projects, JavaScript Basics, Python Games, Real Web Hosting",
    video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE"
  },
  {
    id: 2,
    title: "High School STEM: Advanced Physics & Chemistry Lab Prep",
    format: "campus",
    grade_range: "Grades 9-12",
    description: "Rigorous academic tutorial sessions covering mechanics, electricity, chemical reactions, and organic chemistry aligned with the Ethiopian national curriculum.",
    topics: "Mechanics & Optics, Stoichiometry, Exam Solving Tactics, Lab Concepts",
    video_url: "https://www.youtube.com/watch?v=bhiCXOmm2Nk"
  },
  {
    id: 3,
    title: "Primary & Middle School Mathematics Mastery Foundation",
    format: "hybrid",
    grade_range: "Grades 1-8",
    description: "Strengthening numerical fluency, mental math, algebra foundations, and critical word problems with patient, certified educators.",
    topics: "Mental Math, Geometry Foundations, Pre-Algebra, Step-by-Step Problem Solving",
    video_url: "https://www.youtube.com/watch?v=Yq4d_LdM9oY"
  },
  {
    id: 4,
    title: "English Fluency, Grammar & Public Speaking Laboratory",
    format: "online",
    grade_range: "Grades 3-12",
    description: "Comprehensive communication training focused on written grammar, reading comprehension, vocabulary expansion, and confident verbal expression.",
    topics: "Grammar Mastery, Essay Writing, Reading Fluency, Confident Presentation",
    video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE"
  }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Student Enrollment for 2026/27 Cohort Officially Open!",
    category: "Admissions",
    content: "Admissions for Grade 1 through 12 tutoring, STEM labs, and web coding programs are officially open for Addis Ababa families across CMC, Summit, 72, and Ayat.",
    excerpt: "Registrations are open for 2026/27 academic tutoring & STEM labs.",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Weekend Coding & Robotics Workshop Series Launched",
    category: "STEM & Tech",
    content: "Ethio Techbridge Academy is excited to launch practical hands-on coding, Python for kids, and robotics basics every Saturday at our campus tutorial center.",
    excerpt: "Hands-on Saturday coding and robotics sessions for students.",
    status: "active",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    title: "National Curriculum & Exam Revision Schedule Published",
    category: "Academic",
    content: "Comprehensive preparation schedules for Grade 6, 8, and 12 national exam candidates are now finalized. Dedicated mentor sessions start next week.",
    excerpt: "Exam review schedules released for Grades 6, 8, and 12 candidates.",
    status: "active",
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

// ---------------------------------------------------------------------------
// ACCURATE MULTI-LANGUAGE TRANSLATIONS (ENGLISH, AMHARIC, AFAAN OROMOO)
// ---------------------------------------------------------------------------
const translations = {
  en: {
    langName: "English",
    topBannerEnrollment: "★ Student Enrollment Now Open!",
    topBannerGrades: "Academic Support Grades 1–12 & Technology Track",
    topBannerLocations: "Locations: CMC • Summit • Semit • 72 • Ayat",
    topBannerGoogleForm: "Google Form Application →",
    navHome: "Home",
    navAbout: "About",
    navPrograms: "Programs",
    navCourses: "Courses & Media",
    navNews: "Latest News",
    navCampus: "Campus",
    navWhyUs: "Why Choose Us",
    navFaq: "FAQs",
    navContact: "Contact",
    navAdmin: "Admin Portal",
    navApply: "Apply Now",
    promoBadge: "Special 2026/27 Enrollment Offer",
    promoText: "Get 20% discount on Early STEM & Web Coding cohorts for Addis Ababa students! Limited campus seats in CMC, Summit & Ayat.",
    promoClaim: "Claim Offer",
    promoDismiss: "Dismiss",
    cookieTitle: "Cookie & Preference Notice",
    cookieText: "Ethio Techbridge Academy uses essential cookies and local storage to remember your language preference (English, አማርኛ, Afaan Oromoo), protect admin portal sessions, and analyze site performance for an optimal learning experience.",
    cookieAccept: "Accept All Cookies",
    cookieEssential: "Essential Only",
    coursesBadge: "Online & In-Person Learning Formats",
    coursesTitle: "Courses & Learning Media",
    coursesSubtitle: "Explore our accredited STEM, digital programming, and core academic tutorial programs with interactive video previews.",
    coursesFilterAll: "All Courses",
    coursesFilterOnline: "Online Live",
    coursesFilterCampus: "Campus In-Person",
    coursesFilterHybrid: "Hybrid Format",
    coursesWatchVideo: "Watch Preview",
    coursesWatchMore: "Watch More on YouTube",
    coursesEnrollBtn: "Enroll in this Course",
    newsBadge: "Campus & Academic Announcements",
    newsTitle: "Latest Academy News & Announcements",
    newsSubtitle: "Stay updated on admissions alerts, curriculum releases, academic competitions, and campus events.",
    newsReadFull: "Read Full Notice",
    newsClose: "Close Notice",
    heroBadgeAdmissions: "Admissions Open 2026/27",
    heroBadgeScope: "Grades 1–12 & Tech Academy",
    heroBrandTitle: "Ethio Techbridge Academy",
    heroTypewriterPhrases: [
      "A brighter path to learning,",
      "Bridging Knowledge to Opportunity,",
      "Empowering Tomorrow's Tech Leaders,",
      "Excellence in K–12 & Modern Coding,"
    ],
    heroMission: "We empower ambitious Ethiopian students through modern academic tutorials and cutting-edge digital technology education to bridge lifelong knowledge into transformative future opportunities.",
    heroBtnApply: "Apply Now",
    heroBtnCampus: "Visit Campus",
    heroTrustMastery: "Grade 1–12 Mastery",
    heroTrustCoding: "Digital Skills & Web Coding",
    heroTrustLocations: "CMC • Summit • Ayat • Semit",
    aboutBadge: "Accredited Educational Institution",
    aboutTitle: "About Ethio Techbridge Academy",
    aboutPara1: "Ethio Techbridge Academy is an accredited educational institution committed to delivering premier Grade 1–12 academic support and foundational technology education across Addis Ababa.",
    aboutPara2: "Our mission is to bridge traditional scholastic curriculum with 21st-century digital competencies, unlocking transformative opportunities for every young learner.",
    aboutPara3: "Guided by certified subject specialists, we foster disciplined academic mastery, practical innovation, and ethical leadership in a supportive campus environment.",
    aboutBtnEnroll: "Enroll Your Student",
    aboutBtnTour: "Campus Locations & Tours",
    aboutHighlightsTitle: "Accredited Academic Highlights",
    aboutScope: "Curriculum Scope:",
    aboutScopeVal: "Grade 1 to Grade 12",
    aboutTrack: "Digital Track:",
    aboutTrackVal: "Web Dev & Digital Literacy",
    aboutFormat: "Format:",
    aboutFormatVal: "Campus, 1-on-1 & Online",
    aboutAdmissionsLink: "Admissions:",
    programsBadge: "Academic Support & Technology",
    programsTitle: "Educational Programs",
    programsSubtitle: "Structured learning pathways designed for measurable academic progress and practical technology skills.",
    progAcademicTitle: "Academic Support",
    progAcademicBadge: "Grades 1 – 12",
    progAcademicDesc: "Homework assistance, concept clarification, and targeted exam prep aligned with national school curricula.",
    progAcademicSubs: [
      "English & Reading Comprehension",
      "Mathematics (Primary to Grade 12)",
      "Physics (Core Concepts & Formulas)",
      "Chemistry & Biology Fundamentals"
    ],
    progAcademicBtn: "Enroll for Academic Support",
    progDigitalTitle: "Digital Skills & Tech",
    progDigitalBadge: "Digital Track",
    progDigitalDesc: "Practical computer literacy and modern software tools to prepare students for productive school assignments.",
    progDigitalSubs: [
      "Computer Fundamentals & File Management",
      "Microsoft Office (Word, Excel, PowerPoint)",
      "Canva Visual Design & Presentations",
      "Digital Literacy & Safe Internet Research"
    ],
    progDigitalBtn: "Enroll for Digital Skills",
    progWebTitle: "Web Development",
    progWebBadge: "Coding Track",
    progWebDesc: "Foundational software programming skills, creating interactive web pages and algorithmic thinking.",
    progWebSubs: [
      "HTML5 Structured Page Layouts",
      "CSS3 Modern Responsive Styling",
      "JavaScript Programming & Logic",
      "Full-Stack Development Foundations"
    ],
    progWebBtn: "Enroll for Web Development",
    learningFormatsBadge: "Learning Formats",
    learningFormatsTitle: "Tailored Options for Every Student",
    formats: [
      { title: "One-to-One Tutoring", desc: "Dedicated mentor focused on individual student pacing and mastery." },
      { title: "Small Groups", desc: "Interactive cohorts of 3–6 students for collaborative learning." },
      { title: "Online Classrooms", desc: "Live digital sessions with screen sharing and recordings." },
      { title: "After-School Support", desc: "Structured daily homework assistance and exam preparation drills." }
    ],
    campusBadge: "Campus Facilities",
    campusTitle: "Visit Our Learning Campus & Centers",
    campusDesc: "Our centers offer focused, academic environments with dedicated computer labs, quiet reading quads, and small-group tutorial classrooms.",
    campusLocationsTitle: "Locations in Addis Ababa",
    campusLocationsList: "CMC • Summit • Semit • 72 • Ayat & Nearby Neighborhoods",
    campusBtnSchedule: "Schedule a Campus Visit",
    campusBtnWhatsapp: "WhatsApp Admissions",
    campusPhotoTitle: "Ethio Techbridge Campus Quad",
    campusPhotoSubtitle: "Open Monday – Saturday for Student Sessions & Tours",
    whyUsBadge: "Institutional Advantage",
    whyUsTitle: "Why Choose Ethio Techbridge?",
    whyUsSlogan: '"Better Learning, Brighter Future. Your Goals, Our Support."',
    whyCards: [
      { title: "Personalized Learning", desc: "Every student receives tailored diagnostic guidance and individual pacing for conceptual mastery." },
      { title: "Homework Support", desc: "Structured daily mentorship that resolves academic roadblocks and builds study discipline." },
      { title: "Exam Preparation", desc: "Focused preparation drills for school tests and regional national examinations." }
    ],
    readyBadge: "Official Enrollment Channel",
    readyTitle: "Ready to Start Your Student's Journey?",
    readySubtitle: "Complete our fast-track online application or submit via the official Google Form.",
    readyBtnApply: "Apply Online Now",
    readyBtnGoogle: "Open Google Form",
    faqBadge: "Helpful Answers",
    faqTitle: "Frequently Asked Questions",
    contactCampus: "Campus Locations",
    contactPhone: "WhatsApp & Phone",
    contactEmail: "Email Admissions",
    footerCopy: `© ${new Date().getFullYear()} Ethio Techbridge Academy. All rights reserved. Addis Ababa, Ethiopia.`,
    modalHeaderBadge: "Admissions 2026/27",
    modalHeaderTitle: "Student Application & Enrollment",
    modalHeaderSubtitle: "Grade 1–12 Academic Support & Technology Training · Addis Ababa",
    modalTabInApp: "Fast-Track Application",
    modalTabGoogle: "Official Google Form",
    modalGoogleTitle: "Official Ethio Techbridge Academy Google Form",
    modalGoogleDesc: "If you prefer to fill out our complete enrollment questionnaire via Google Forms, please click below.",
    modalGoogleBtn: "Open Google Form Now",
    modalUseFastTrack: "Use Fast-Track Form",
    fieldStudentName: "Student full name *",
    fieldGrade: "Applying for Grade *",
    fieldParentName: "Parent / Guardian full name *",
    fieldPhone: "Phone number (WhatsApp) *",
    fieldEmail: "Parent email (for schedules)",
    fieldSubjects: "Subjects & Programs of Interest",
    fieldNotes: "Notes or campus tour request (optional)",
    btnSubmitting: "Submitting Application...",
    btnSubmit: "Submit Application",
    registrationSuccessTitle: "Application Successfully Received!",
    btnRegisterAnother: "Register Another Student",
    btnCloseWindow: "Close Window"
  },
  am: {
    langName: "አማርኛ",
    topBannerEnrollment: "★ የተማሪዎች ምዝገባ ተጀምሯል!",
    topBannerGrades: "የ1–12ኛ ክፍል አካዳሚክ ድጋፍ እና የቴክኖሎጂ ስልጠና",
    topBannerLocations: "አድራሻ፡ ሲኤምሲ • ሰሚት • ሰሚት 72 • አያት",
    topBannerGoogleForm: "የጉግል ፎርም ምዝገባ →",
    navHome: "መነሻ",
    navAbout: "ስለ ተቋሙ",
    navPrograms: "ፕሮግራሞች",
    navCourses: "ኮርሶች እና ሚዲያ",
    navNews: "የቅርብ ጊዜ ዜናዎች",
    navCampus: "ግቢ",
    navWhyUs: "ለምን እኛን?",
    navFaq: "ጥያቄዎች",
    navContact: "ያግኙን",
    navAdmin: "አስተዳዳሪ",
    navApply: "አመልክት",
    promoBadge: "ልዩ የ2026/27 የምዝገባ ቅናሽ",
    promoText: "በቀዳሚው የSTEM እና የዌብ ኮዲንግ ስልጠናዎች ላይ የ20% ቅናሽ ያግኙ! በሲኤምሲ፣ ሰሚት እና አያት የተወሰኑ ቦታዎች ብቻ።",
    promoClaim: "ቅናሹን ተጠቀሙ",
    promoDismiss: "ዝጋ",
    cookieTitle: "የኩኪ እና የመረጃ አጠቃቀም ማስታወቂያ",
    cookieText: "ኢትዮ ቴክብሪጅ አካዳሚ የመረጡትን ቋንቋ (እንግሊዝኛ፣ አማርኛ፣ ኦሮምኛ) ለማስታወስ፣ የአስተዳዳሪ ክፍለ-ጊዜዎችን ለመጠበቅ እና የተሻለ የትምህርት አገልግሎት ለመስጠት አስፈላጊ ኩኪዎችን ይጠቀማል።",
    cookieAccept: "ሁሉንም ተቀበል",
    cookieEssential: "አስፈላጊውን ብቻ",
    coursesBadge: "የኦንላይን እና የግቢ ውስጥ አማራጮች",
    coursesTitle: "ኮርሶች እና የመማሪያ ሚዲያ",
    coursesSubtitle: "በተግባራዊ ቪዲዮዎች የተደገፉ የSTEM፣ የኮምፒውተር ፕሮግራሚንግ እና የአካዳሚክ ማጠናከሪያ ትምህርቶቻችንን ይመልከቱ።",
    coursesFilterAll: "ሁሉም ኮርሶች",
    coursesFilterOnline: "የቀጥታ ኦንላይን",
    coursesFilterCampus: "በግቢ ውስጥ",
    coursesFilterHybrid: "ቅይጥ (ሀይብሪድ)",
    coursesWatchVideo: "ቪዲዮ ይመልከቱ",
    coursesWatchMore: "በYouTube ተጨማሪ ይመልከቱ",
    coursesEnrollBtn: "በዚህ ኮርስ ይመዝገቡ",
    newsBadge: "የአካዳሚው ማስታወቂያዎች",
    newsTitle: "የቅርብ ጊዜ ዜናዎች እና መረጃዎች",
    newsSubtitle: "ስለ አዲስ ምዝገባዎች፣ የፈተና ክለሳ መርሃ-ግብሮች እና የSTEM አውደ ጥናቶች ወቅታዊ መረጃዎችን ያግኙ።",
    newsReadFull: "ሙሉውን አንብብ",
    newsClose: "ዝጋ",
    heroBadgeAdmissions: "ምዝገባ ክፍት ነው 2026/27",
    heroBadgeScope: "ከ1–12ኛ ክፍል እና የቴክኖሎጂ አካዳሚ",
    heroBrandTitle: "ኢትዮ ቴክብሪጅ አካዳሚ",
    heroTypewriterPhrases: [
      "ለተሻለ ትምህርት ብሩህ ጎዳና፣",
      "ዕውቀትን ወደ ዕድል ማሸጋገር፣",
      "የነገውን የቴክኖሎጂ መሪዎች ማብቃት፣",
      "በ1–12ኛ ክፍል እና በኮዲንግ የላቀ ውጤት፣"
    ],
    heroMission: "እኛ ታታሪ ኢትዮጵያውያን ተማሪዎችን በዘመናዊ የአካዳሚክ ማጠናከሪያ ትምህርት እና በዲጂታል ቴክኖሎጂ ስልጠና በማብቃት ዕውቀታቸውን ወደ ወደፊት የላቀ ዕድል እናሸጋግራለን።",
    heroBtnApply: "አሁኑኑ ያመልክቱ",
    heroBtnCampus: "ግቢውን ይጎብኙ",
    heroTrustMastery: "ከ1-12ኛ ክፍል ብቃት",
    heroTrustCoding: "ዲጂታል ክህሎት እና ኮዲንግ",
    heroTrustLocations: "ሲኤምሲ • ሰሚት • አያት • ሰሚት",
    aboutBadge: "እውቅና ያለው የትምህርት ተቋም",
    aboutTitle: "ስለ ኢትዮ ቴክብሪጅ አካዳሚ",
    aboutPara1: "ኢትዮ ቴክብሪጅ አካዳሚ በአዲስ አበባ ደረጃውን የጠበቀ የ1-12ኛ ክፍል የአካዳሚክ ድጋፍ እና የመሰረታዊ ቴክኖሎጂ ስልጠና የሚሰጥ እውቅና ያለው ተቋም ነው።",
    aboutPara2: "ተልዕኳችን ባህላዊ የክፍል ትምህርትን ከ21ኛው ክፍለ ዘመን የዲጂታል ክህሎት ጋር በማስተሳሰር ለእያንዳንዱ ወጣት ተማሪ የላቀ ዕድል መክፈት ነው።",
    aboutPara3: "በተመረቁ የትምህርት ባለሙያዎች እየተመራን የተማሪዎችን የአካዳሚክ ብቃት፣ ፈጠራ እና የስነ-ምግባር አመራር በተሟላ ግቢ ውስጥ እናጎለብታለን።",
    aboutBtnEnroll: "ተማሪዎን ያስመዝግቡ",
    aboutBtnTour: "የግቢ አድራሻ እና ጉብኝት",
    aboutHighlightsTitle: "የተረጋገጡ የትምህርት ጥራቶች",
    aboutScope: "የትምህርት ደረጃ፡",
    aboutScopeVal: "ከ1ኛ ክፍል እስከ 12ኛ ክፍል",
    aboutTrack: "የዲጂታል ዘርፍ፡",
    aboutTrackVal: "ዌብ ሳይት እና ዲጂታል እውቀት",
    aboutFormat: "የአሰጣጥ ሁኔታ፡",
    aboutFormatVal: "በግቢ፣ በግል (1-ለ-1) እና በኦንላይን",
    aboutAdmissionsLink: "ማመልከቻ፡",
    programsBadge: "አካዳሚክ ድጋፍ እና ቴክኖሎጂ",
    programsTitle: "የትምህርት ፕሮግራሞች",
    programsSubtitle: "ለተማሪዎች ቀጣይነት ያለው የአካዳሚክ እድገት እና ተግባራዊ የቴክኖሎጂ እውቀት የተዘጋጁ ፕሮግራሞች።",
    progAcademicTitle: "የአካዳሚክ ማጠናከሪያ ድጋፍ",
    progAcademicBadge: "ከ1 – 12ኛ ክፍል",
    progAcademicDesc: "የቤት ስራ እገዛ፣ የፅንሰ-ሀሳብ ማብራሪያ እና ከሀገራዊ ስርዓተ-ትምህርት ጋር የተጣጣመ የፈተና ዝግጅት።",
    progAcademicSubs: [
      "እንግሊዝኛ እና የማንበብ ክህሎት",
      "ሂሳብ (ከመሰረታዊ እስከ 12ኛ ክፍል)",
      "ፊዚክስ (ቀመሮች እና መሰረታዊ ፅንሰ-ሀሳብ)",
      "ኬሚስትሪ እና ባዮሎጂ ትምህርቶች"
    ],
    progAcademicBtn: "ለአካዳሚክ ድጋፍ ይመዝገቡ",
    progDigitalTitle: "ዲጂታል ክህሎት እና ቴክኖሎጂ",
    progDigitalBadge: "ዲጂታል ዘርፍ",
    progDigitalDesc: "ተማሪዎችን ለትምህርት ቤት ስራዎች እና ለቀጣይ ቴክኖሎጂ ዝግጁ የሚያደርግ ተግባራዊ የኮምፒውተር ስልጠና።",
    progDigitalSubs: [
      "የኮምፒውተር መሰረታዊ አሰራር እና ፋይል አያያዝ",
      "ማይክሮሶፍት ኦፊስ (Word, Excel, PowerPoint)",
      "ካንቫ (Canva) የግራፊክስ እና ገለፃ ዲዛይን",
      "የኢንተርኔት ደህንነት እና ጥናት"
    ],
    progDigitalBtn: "ለዲጂታል ክህሎት ይመዝገቡ",
    progWebTitle: "የዌብሳይት ማበልፀግ (Web Development)",
    progWebBadge: "የኮዲንግ ዘርፍ",
    progWebDesc: "የሶፍትዌር ፕሮግራሚንግ መሰረታዊ እውቀት፣ ተለዋዋጭ ዌብሳይቶችን መገንባት እና አልጎሪዝም አስተሳሰብ።",
    progWebSubs: [
      "HTML5 ገፅ አወቃቀር",
      "CSS3 ዘመናዊ ገፅ ውበት",
      "JavaScript ፕሮግራሚንግ እና ሎጂክ",
      "የሙሉ ዌብሳይት ግንባታ መሰረቶች"
    ],
    progWebBtn: "ለዌብ ኮዲንግ ይመዝገቡ",
    learningFormatsBadge: "የመማሪያ አማራጮች",
    learningFormatsTitle: "ለሁሉም ተማሪ የተመቻቹ አማራጮች",
    formats: [
      { title: "የግል (1-ለ-1) ትምህርት", desc: "የተማሪውን ፍጥነት እና ፍላጎት መሰረት ያደረገ ቀጥተኛ የአስተማሪ ድጋፍ።" },
      { title: "አነስተኛ የቡድን ትምህርት", desc: "ከ3–6 ተማሪዎች ጋር በጋራ የመማማር እና ችግር የመፍታት ልምድ።" },
      { title: "የቀጥታ ኦንላይን ትምህርት", desc: "በቀጥታ ስክሪን በማጋራት እና በተቀረፁ ቪዲዮዎች የሚደገፍ የኦንላይን ክፍል ።" },
      { title: "ከትምህርት ሰዓት በኋላ", desc: "የዕለት ተዕለት የቤት ስራ ድጋፍ እና የተጠናከረ የፈተና ልምምድ።" }
    ],
    campusBadge: "የግቢው አገልግሎቶች",
    campusTitle: "የመማሪያ ማዕከላችንን እና ግቢያችንን ይጎብኙ",
    campusDesc: "ማዕከላችን ዘመናዊ የኮምፒውተር ላብራቶሪ፣ ፀጥታ የሰፈነበት የማንበቢያ አደባባይ እና አነስተኛ የመማሪያ ክፍሎችን ያካተተ ነው።",
    campusLocationsTitle: "በአዲስ አበባ ያሉ አድራሻዎቻችን",
    campusLocationsList: "ሲኤምሲ • ሰሚት • ሰሚት 72 • አያት እና አቅራቢያቸው",
    campusBtnSchedule: "የግቢ ጉብኝት ቀጠሮ ይያዙ",
    campusBtnWhatsapp: "በዋትስአፕ ያነጋግሩን",
    campusPhotoTitle: "የኢትዮ ቴክብሪጅ ግቢ እና አደባባይ",
    campusPhotoSubtitle: "ከሰኞ እስከ ቅዳሜ ለተማሪዎች እና ለጉብኝት ክፍት ነው",
    whyUsBadge: "የተቋሙ ብልጫ",
    whyUsTitle: "ለምን ኢትዮ ቴክብሪጅን ይመርጣሉ?",
    whyUsSlogan: '"የተሻለ ትምህርት፣ ብሩህ ተስፋ። የእርስዎ ግብ፣ የእኛ ድጋፍ።"',
    whyCards: [
      { title: "ለተማሪው የተበጀ ትምህርት", desc: "እያንዳንዱ ተማሪ የአቅም መለያ ተሰጥቶት በግል ፍጥነቱ ፅንሰ-ሀሳቦችን ይገነዘባል።" },
      { title: "የቤት ስራ ድጋፍ", desc: "የዕለት ተዕለት የትምህርት እንቅፋቶችን የሚያስወግድ እና የማጥናት ልምድን የሚያዳብር ክትትል።" },
      { title: "የፈተና ዝግጅት", desc: "ለትምህርት ቤት ፈተናዎች እና ለሀገር አቀፍ ፈተናዎች ውጤታማ የማጠናከሪያ ልምምድ።" }
    ],
    readyBadge: "ቀጥተኛ የምዝገባ አማራጭ",
    readyTitle: "የተማሪዎን ጉዞ ለመጀመር ዝግጁ ነዎት?",
    readySubtitle: "የፈጣን ኦንላይን ማመልከቻችንን ይሙሉ ወይም በይፋዊው የጉግል ፎርም ይመዝገቡ።",
    readyBtnApply: "አሁኑኑ በኦንላይን ያመልክቱ",
    readyBtnGoogle: "የጉግል ፎርም ክፈት",
    faqBadge: "ጠቃሚ ምላሾች",
    faqTitle: "ተደጋግመው የሚጠየቁ ጥያቄዎች",
    contactCampus: "የግቢ አድራሻዎች",
    contactPhone: "ዋትስአፕ እና ስልክ",
    contactEmail: "የኢሜይል አድራሻ",
    footerCopy: `© ${new Date().getFullYear()} ኢትዮ ቴክብሪጅ አካዳሚ። መብቱ በህግ የተጠበቀ ነው። አዲስ አበባ፣ ኢትዮጵያ።`,
    modalHeaderBadge: "ምዝገባ 2026/27",
    modalHeaderTitle: "የተማሪዎች ምዝገባ እና ማመልከቻ",
    modalHeaderSubtitle: "ከ1–12ኛ ክፍል የአካዳሚክ ድጋፍ እና የቴክኖሎጂ ስልጠና · አዲስ አበባ",
    modalTabInApp: "የፈጣን ማመልከቻ ፎርም",
    modalTabGoogle: "ይፋዊ የጉግል ፎርም",
    modalGoogleTitle: "የኢትዮ ቴክብሪጅ አካዳሚ ይፋዊ የጉግል ፎርም",
    modalGoogleDesc: "የሙሉ ምዝገባ መጠይቁን በጉግል ፎርም መሙላት ከፈለጉ ከዚህ በታች ያለውን ይጫኑ።",
    modalGoogleBtn: "የጉግል ፎርሙን አሁኑኑ ክፈት",
    modalUseFastTrack: "ወደ ፈጣን ፎርም ተመለስ",
    fieldStudentName: "የተማሪው ሙሉ ስም *",
    fieldGrade: "የሚማሩበት ክፍል *",
    fieldParentName: "የወላጅ / አሳዳጊ ሙሉ ስም *",
    fieldPhone: "ስልክ ቁጥር (ዋትስአፕ) *",
    fieldEmail: "የወላጅ ኢሜይል (ለመርሃ-ግብር)",
    fieldSubjects: "የሚፈልጓቸው የትምህርት አይነቶች",
    fieldNotes: "ተጨማሪ ማስታወሻ ወይም ጥያቄ (አማራጭ)",
    btnSubmitting: "በማስገባት ላይ...",
    btnSubmit: "ማመልከቻውን አስገባ",
    registrationSuccessTitle: "ማመልከቻዎ በተሳካ ሁኔታ ደርሶናል!",
    btnRegisterAnother: "ሌላ ተማሪ አስመዝግብ",
    btnCloseWindow: "መስኮቱን ዝጋ"
  },
  om: {
    langName: "Afaan Oromoo",
    topBannerEnrollment: "★ Galmeen Barattootaa Banameera!",
    topBannerGrades: "Deggarsa Barnoota Kutaa 1–12 fi Sagantaa Teeknoolojii",
    topBannerLocations: "Iddoo: CMC • Summit • Semit • 72 • Ayat",
    topBannerGoogleForm: "Galmee Google Form →",
    navHome: "Fuula Duraa",
    navAbout: "Waa'ee Mana Barumsaa",
    navPrograms: "Sagantaalee",
    navCourses: "Koorsoota & Miidiyaa",
    navNews: "Oduu Haaraa",
    navCampus: "Mooraa",
    navWhyUs: "Maaliif Nu Filattu?",
    navFaq: "Gaaffilee",
    navContact: "Nu Qunnamaa",
    navAdmin: "Bulchiinsa",
    navApply: "Galmaa'aa",
    promoBadge: "Hir'ina Galmee Addaa 2026/27",
    promoText: "Barnoota STEM fi koodiingii toora interneetii irratti hir'ina %20 argadhaa! Bakki CMC, Summit fi Ayat daangeffamaadha.",
    promoClaim: "Carraa Fudhadhaa",
    promoDismiss: "Cufi",
    cookieTitle: "Hubannoo Kookii fi Filannoo",
    cookieText: "Akkaadaamiin Ethio Techbridge filannoo afaanii keessanii qusachuuf, nageenya kutaa bulchiinsaa eeguuf fi tajaajila barnootaa gaarii kennuuf kookii fayyadama.",
    cookieAccept: "Hunda Fudhadhu",
    cookieEssential: "Isa Murteessaa Qofa",
    coursesBadge: "Toora Interneetii & Wiirtuu Barnootaa",
    coursesTitle: "Koorsoota & Miidiyaa Barnootaa",
    coursesSubtitle: "Koorsoota STEM, koodiingii fi barnoota idilee viidiyoodhaan deeggarame hunda filadhaa.",
    coursesFilterAll: "Koorsoota Hunda",
    coursesFilterOnline: "Toora Interneetii",
    coursesFilterCampus: "Wiirtuu Keessatti",
    coursesFilterHybrid: "Makaa (Hybrid)",
    coursesWatchVideo: "Viidiyoo Daawwadhaa",
    coursesWatchMore: "YouTube Irratti Dabalata Daawwadhaa",
    coursesEnrollBtn: "Koorsoo Kanarratti Galmaa'aa",
    newsBadge: "Beeksisa & Oduu Akkaadaamii",
    newsTitle: "Oduu fi Beeksisa Haaraa",
    newsSubtitle: "Odeeffannoo galmee, qormaata biyyaalessaa fi waltajjiiwwan teeknoolojii haaraa hunda hordofaa.",
    newsReadFull: "Guutuu Dubbisaa",
    newsClose: "Cufi",
    heroBadgeAdmissions: "Galmeen Banameera 2026/27",
    heroBadgeScope: "Kutaa 1–12 fi Akkaadaamii Teeknoolojii",
    heroBrandTitle: "Ethio Techbridge Academy",
    heroTypewriterPhrases: [
      "Karaa ifaa barumsaa gara fuulduraatti,",
      "Beekumsa gara carraatti ceesisuu,",
      "Hoggantoota teeknoolojii borii ijaaruu,",
      "Kutaa 1–12 fi barnoota koodiingii olaanaa,"
    ],
    heroMission: "Nuti barattoota Itiyoophiyaa kaka'umsa qaban barnoota dabalataa ammayyaa fi leenjii teeknoolojii dijitaalaatiin beekumsa isaanii gara carraa fuulduraatti ceesisuuf cimnee hojjenna.",
    heroBtnApply: "Amma Galmaa'aa",
    heroBtnCampus: "Mooraa Daawwadhaa",
    heroTrustMastery: "Dandeettii Kutaa 1–12",
    heroTrustCoding: "Dandeettii Dijitaalaa fi Koodiingii",
    heroTrustLocations: "CMC • Summit • Ayat • Semit",
    aboutBadge: "Dhaabbata Barnootaa Beekkamtii Qabu",
    aboutTitle: "Waa'ee Ethio Techbridge Academy",
    aboutPara1: "Ethio Techbridge Academy dhaabbata beekkamtii qabu kan Finfinneetti deggarsa barnoota kutaa 1–12 fi leenjii bu'uura teeknoolojii qulqullina olaanaadhaan kennuudha.",
    aboutPara2: "Kaayyoon keenya barnoota idilee fi dandeettii dijitaalaa jaarraa 21ffaa walitti fiduudhaan barattoota hundaaf carraa addaa banuudha.",
    aboutPara3: "Barsiisota gosa barnootaatiin eebbifamaniin geggeeffamnee, dandeettii barnootaa, kalaqa fi amala gaarii mooraa mijataa keessatti gabbisna.",
    aboutBtnEnroll: "Barataa Keessan Galmeessaa",
    aboutBtnTour: "Iddoowwan Mooraa fi Daawwanna",
    aboutHighlightsTitle: "Qulqullina Barnootaa Mirkanaa'e",
    aboutScope: "Sadarkaa Barnootaa:",
    aboutScopeVal: "Kutaa 1 hanga Kutaa 12",
    aboutTrack: "Kallattii Dijitaalaa:",
    aboutTrackVal: "Ijaarsa Weebsaayitii fi Ogummaa Dijitaalaa",
    aboutFormat: "Haala Barnootaa:",
    aboutFormatVal: "Mooraatti, Dhuunfaa (1-fi-1) fi Toora Interneetii",
    aboutAdmissionsLink: "Galmee:",
    programsBadge: "Deggarsa Barnootaa fi Teeknoolojii",
    programsTitle: "Sagantaalee Barnootaa",
    programsSubtitle: "Guddina barnoota barattootaa fi beekumsa teeknoolojii qabatamaa ta'eef kan qophaa'an.",
    progAcademicTitle: "Deggarsa Barnootaa (Kutaa 1–12)",
    progAcademicBadge: "Kutaa 1 – 12",
    progAcademicDesc: "Hojii manaa gargaaruu, qabxiiwwan barnootaa ibsuu fi qormaataaf qophii sirna barnootaa biyyaalessaa waliin walsimu.",
    progAcademicSubs: [
      "Afaan Ingilizii fi Dandeettii Dubbisuu",
      "Herrega (Bu'uuraa hanga Kutaa 12)",
      "Fiiziksii (Qabxiiwwan fi Foormulaa)",
      "Keemistirii fi Baayoloojii"
    ],
    progAcademicBtn: "Deggarsa Barnootaaf Galmaa'aa",
    progDigitalTitle: "Dandeettii Dijitaalaa fi Teeknoolojii",
    progDigitalBadge: "Kallattii Dijitaalaa",
    progDigitalDesc: "Barattoota hojii barnootaa ammayyaa fi teeknoolojii fuulduraatiif qopheessuuf leenjii kompiitaraa qabatamaa.",
    progDigitalSubs: [
      "Bu'uura Kompiitaraa fi Qabiinsa Faayilii",
      "Microsoft Office (Word, Excel, PowerPoint)",
      "Canva (Dizaayinii fi Dhiheessa)",
      "Nageenya Interneetii fi Qorannoo"
    ],
    progDigitalBtn: "Dandeettii Dijitaalaaf Galmaa'aa",
    progWebTitle: "Ijaarsa Weebsaayitii fi Koodiingii",
    progWebBadge: "Kallattii Koodiingii",
    progWebDesc: "Bu'uura piroogiraamiingii kompiitaraa, weebsaayitoota ammayyaa ijaaruu fi yaada algoorizimii gabbisuu.",
    progWebSubs: [
      "Caasaa Fuula HTML5",
      "Miidhagina Ammayyaa CSS3",
      "Piroogiraamiingii fi Loojikii JavaScript",
      "Bu'uura Full-Stack Development"
    ],
    progWebBtn: "Koodiingiif Galmaa'aa",
    learningFormatsBadge: "Filannoowwan Barnootaa",
    learningFormatsTitle: "Filannoowwan Barattoota Hundaaf Mijatan",
    formats: [
      { title: "Barnoota Dhuunfaa (1-fi-1)", desc: "Barsiisaa dhuunfaa saffisa fi dandeettii barataa irratti xiyyeeffatu." },
      { title: "Garee Xixinnoo", desc: "Barattoota 3–6 waliin ta'uun waliin baratanii fi rakkoo furuu." },
      { title: "Kutaa Toora Interneetii", desc: "Kutaalee kallattiin skiriinii qooduudhaan fi viidiyoodhaan geggeeffaman." },
      { title: "Barnoota Sa'aatii Boodaa", desc: "Hojii manaa guyyaa guyyaa gargaaruu fi shaakala qormaataa cimsuu." }
    ],
    campusBadge: "Tajaajila Mooraa",
    campusTitle: "Mooraa fi Wiirtuuwwan Keenya Daawwadhaa",
    campusDesc: "Wiirtuuleen keenya laaboraatorii kompiitaraa ammayyaa, bakka dubbisaa callisaa fi dareewwan barnootaa qabu.",
    campusLocationsTitle: "Iddoowwan Finfinnee Keessaa",
    campusLocationsList: "CMC • Summit • Semit • 72 • Ayat fi Naannoo Isaa",
    campusBtnSchedule: "Qophii Daawwanna Mooraa Qabadhaa",
    campusBtnWhatsapp: "WhatsApp'n Nu Qunnamaa",
    campusPhotoTitle: "Mooraa fi Dirree Ethio Techbridge",
    campusPhotoSubtitle: "Wiixata hanga Sanbataatti barattootaa fi daawwannaaf banaadha",
    whyUsBadge: "Faayidaa Dhaabbata Keenyaa",
    whyUsTitle: "Maaliif Ethio Techbridge Filattu?",
    whyUsSlogan: '"Barnoota Caalu, Fuuldura Ifaa. Galma Keessan, Deggarsa Keenya."',
    whyCards: [
      { title: "Barnoota Dhuunfatti Mijate", desc: "Barataan kamiyyuu qorannoo dandeettii erga godhameefii saffisa isaatiin hubannoo qabata." },
      { title: "Deggarsa Hojii Manaa", desc: "Gufuuwwan barnootaa guyyaa guyyaa furuudhaan amala qo'annoo cimsuu." },
      { title: "Qophii Qormaataa", desc: "Qormaata mana barumsaa fi kan biyyaalessaatiif shaakala bu'a-qabeessa kennuu." }
    ],
    readyBadge: "Kallattii Galmee Ofiisaalaa",
    readyTitle: "Imala Barumsaa Barataa Keessanii Jalqabuuf Qophiidhaa?",
    readySubtitle: "Uunkaa galmee saffisaa keenya toora interneetiin guutaa yookiin Google Form'n galmaa'aa.",
    readyBtnApply: "Amma Toora Interneetiin Galmaa'aa",
    readyBtnGoogle: "Google Form Bani",
    faqBadge: "Deebiiwwan Gargaaran",
    faqTitle: "Gaaffilee Yeroo Baay'ee Gaafataman",
    contactCampus: "Iddoowwan Mooraa",
    contactPhone: "WhatsApp fi Bilbila",
    contactEmail: "Imeelii Galmee",
    footerCopy: `© ${new Date().getFullYear()} Ethio Techbridge Academy. Mirgi qopheessaa seeraan eegamaadha. Finfinnee, Itiyoophiyaa.`,
    modalHeaderBadge: "Galmee 2026/27",
    modalHeaderTitle: "Galmee fi Iyyannoo Barattootaa",
    modalHeaderSubtitle: "Deggarsa Barnootaa Kutaa 1–12 fi Leenjii Teeknoolojii · Finfinnee",
    modalTabInApp: "Iyyannoo Saffisaa",
    modalTabGoogle: "Google Form Ofiisaalaa",
    modalGoogleTitle: "Uunkaa Google Form Ethio Techbridge Academy",
    modalGoogleDesc: "Gaaffilee galmee guutuu Google Form irratti guutuu yoo barbaaddan as tuqaa.",
    modalGoogleBtn: "Google Form Amma Bani",
    modalUseFastTrack: "Gara Uunkaa Saffisaatti Deebi'i",
    fieldStudentName: "Maqaa Guutuu Barataa *",
    fieldGrade: "Kutaa Itti Galmaa'an *",
    fieldParentName: "Maqaa Guutuu Maatii / Guddiftuu *",
    fieldPhone: "Lakk. Bilbilaa (WhatsApp) *",
    fieldEmail: "Imeelii Maatii (Sagantaaf)",
    fieldSubjects: "Gosoota Barnootaa Barbaaddan",
    fieldNotes: "Yaada Dabalataa ykn Daawwanna Mooraa (Filannoo)",
    btnSubmitting: "Galmeessaa jira...",
    btnSubmit: "Iyyannoo Galchi",
    registrationSuccessTitle: "Iyyannoon Keessan Milkaa'inaan Nu Gaheera!",
    btnRegisterAnother: "Barataa Biraa Galmeessi",
    btnCloseWindow: "Fasikula Cufi"
  }
};

// ---------------------------------------------------------------------------
// TYPEWRITER AUTO-TYPING COMPONENT
// ---------------------------------------------------------------------------
function TypewriterHeadline({ phrases, typingSpeed = 65, deletingSpeed = 35, pauseMs = 2400 }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIndex(0);
    setSubIndex(0);
    setIsDeleting(false);
  }, [phrases]);

  useEffect(() => {
    if (!phrases || !phrases.length) return;
    const currentPhrase = phrases[index % phrases.length];

    if (!isDeleting && subIndex === currentPhrase.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseMs);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, phrases, typingSpeed, deletingSpeed, pauseMs]);

  const currentPhrase = phrases[index % phrases.length] || "";
  const displayedText = currentPhrase.substring(0, subIndex);

  return (
    <span className="inline-block font-serif font-black" style={{ color: "#F59E0B" }}>
      <span>{displayedText}</span>
      <span className="animate-cursor ml-1 font-light" style={{ color: "#F59E0B" }}>|</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// PROFESSIONAL EXCEL (.XLS) SPREADSHEET EXPORTER WITH MODERN HEADER
// ---------------------------------------------------------------------------
function exportToExcel({ filename, reportTitle, timeframeLabel, headersMap, data }) {
  if (!data || !data.length) {
    alert("No records found within the selected timeframe to export.");
    return;
  }

  const keys = Object.keys(headersMap);
  const labels = Object.values(headersMap);

  const tableHeaderCells = labels
    .map(
      (l) =>
        `<th style="background-color: #1E3A8A; color: #FFFFFF; font-weight: bold; border: 1px solid #0F172A; padding: 10px 12px; font-size: 11pt; text-align: left;">${escapeHtml(
          l
        )}</th>`
    )
    .join("");

  const tableBodyRows = data
    .map((row, idx) => {
      const bg = idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
      const cells = keys
        .map((k) => {
          const val = row[k] !== null && row[k] !== undefined ? String(row[k]) : "";
          return `<td style="background-color: ${bg}; border: 1px solid #E2E8F0; padding: 8px 12px; font-size: 10pt; color: #111827;">${escapeHtml(
            val
          )}</td>`;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const excelTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${escapeHtml(reportTitle.slice(0, 30))}</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
      <style>
        body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; }
      </style>
    </head>
    <body>
      <table style="width: 100%; border-collapse: collapse; font-family: Calibri, Arial, sans-serif;">
        <!-- MODERN INSTITUTIONAL HEADER -->
        <tr>
          <td colspan="${keys.length}" style="background-color: #1E3A8A; color: #FFFFFF; font-size: 20pt; font-weight: bold; padding: 18px; text-align: center; letter-spacing: 1px;">
            ETHIO TECHBRIDGE ACADEMY
          </td>
        </tr>
        <tr>
          <td colspan="${keys.length}" style="background-color: #F59E0B; color: #111827; font-size: 13pt; font-weight: bold; padding: 10px; text-align: center;">
            ${escapeHtml(reportTitle.toUpperCase())}
          </td>
        </tr>
        <tr>
          <td colspan="${keys.length}" style="background-color: #F1F5F9; color: #334155; font-size: 10pt; padding: 10px 14px; border-bottom: 2px solid #CBD5E1;">
            <strong>Generated Date:</strong> ${new Date().toLocaleString()} &nbsp;|&nbsp; 
            <strong>Timeframe Scope:</strong> ${escapeHtml(timeframeLabel)} &nbsp;|&nbsp; 
            <strong>Total Records:</strong> ${data.length} &nbsp;|&nbsp; 
            <strong>Campus:</strong> Addis Ababa (CMC, Summit, Semit, Ayat)
          </td>
        </tr>
        <tr><td colspan="${keys.length}" style="height: 14px;"></td></tr>
        <thead>
          <tr>${tableHeaderCells}</tr>
        </thead>
        <tbody>
          ${tableBodyRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(["\uFEFF" + excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// BRAND IDENTITY (Navy #1E3A8A & Gold #F59E0B)
// ---------------------------------------------------------------------------
function Brand({ light = false }) {
  return (
    <a href="#home" className="flex items-center gap-3 no-underline group">
      <img
        src="/logo.png"
        alt="Ethio Techbridge Academy Logo"
        className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-contain bg-white p-0.5 border border-slate-200 transition-transform duration-200 group-hover:scale-105"
      />
      <div>
        <span className={`block text-base sm:text-lg font-black tracking-tight font-serif leading-tight ${
          light ? "text-white" : "text-[#111827] group-hover:text-[#1E3A8A]"
        }`}>
          Ethio Techbridge<span className="text-[#F59E0B]">.</span>
        </span>
        <span className={`block text-[10px] font-bold uppercase tracking-[0.22em] ${
          light ? "text-slate-300" : "text-[#1E3A8A]"
        }`}>
          Academy
        </span>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// APPLICATION & REGISTRATION MODAL (WITH PROMINENT GREEN SUCCESS BOX)
// ---------------------------------------------------------------------------
function RegistrationModal({ onClose, initialSubjects = "", initialNotes = "", defaultMethod = "inapp", lang = "en" }) {
  const t = translations[lang] || translations.en;
  const [method, setMethod] = useState(defaultMethod);
  const [form, setForm] = useState({
    studentName: "",
    grade: "1",
    parentName: "",
    phone: "",
    email: "",
    preferredSubjects: initialSubjects,
    notes: initialNotes
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [regId, setRegId] = useState(null);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api("/registrations", {
        method: "POST",
        body: JSON.stringify({ ...form, grade: Number(form.grade) })
      });
      setRegId(result.registrationId);
      setMessage(
        `Application received! Reference number: #${result.registrationId}. ${
          result.emailStatus === "sent"
            ? "A confirmation email has been dispatched."
            : "Our admissions department will follow up with you promptly."
        }`
      );
      setForm({ studentName: "", grade: "1", parentName: "", phone: "", email: "", preferredSubjects: "", notes: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="my-6 w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
              {t.modalHeaderBadge}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#111827] font-serif">
              {t.modalHeaderTitle}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              {t.modalHeaderSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* PROMINENT GREEN SUCCESS STATUS BOX */}
        {message && (
          <div
            role="status"
            className="mb-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6 text-emerald-950 shadow-md animate-fadeIn"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-md">
                <CheckCircle2 size={30} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-emerald-600 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-white">
                    Confirmed
                  </span>
                  {regId && (
                    <span className="rounded bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                      Ref #{regId}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 text-lg font-bold font-serif text-emerald-950">
                  {t.registrationSuccessTitle}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-emerald-900 font-medium">
                  {message}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-200">
                  <button
                    onClick={() => setMessage("")}
                    className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
                  >
                    {t.btnRegisterAnother}
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-emerald-400 bg-white hover:bg-emerald-100 text-emerald-900 px-4 py-2 text-xs font-bold transition"
                  >
                    {t.btnCloseWindow}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab switch */}
        <div className="mb-6 flex rounded-lg bg-slate-100 p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setMethod("inapp")}
            className={`flex-1 rounded-md py-2 transition ${
              method === "inapp"
                ? "bg-white text-[#1E3A8A] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.modalTabInApp}
          </button>
          <button
            type="button"
            onClick={() => setMethod("googleform")}
            className={`flex-1 rounded-md py-2 transition flex items-center justify-center gap-1.5 ${
              method === "googleform"
                ? "bg-white text-[#1E3A8A] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.modalTabGoogle} <ExternalLink size={14} />
          </button>
        </div>

        {method === "googleform" ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#1E3A8A] mb-3">
              <FileText size={24} />
            </div>
            <h3 className="text-base font-bold text-[#111827] font-serif">
              {t.modalGoogleTitle}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {t.modalGoogleDesc}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#172554] transition"
              >
                {t.modalGoogleBtn} <ExternalLink size={15} />
              </a>
              <button
                type="button"
                onClick={() => setMethod("inapp")}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                {t.modalUseFastTrack}
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={submit} className="grid gap-3.5 sm:grid-cols-2">
              <Field label={t.fieldStudentName}>
                <input
                  required
                  name="studentName"
                  value={form.studentName}
                  onChange={update}
                  maxLength="150"
                  className={inputClass}
                  placeholder="e.g. Samuel Bekele"
                />
              </Field>
              <Field label={t.fieldGrade}>
                <select
                  required
                  name="grade"
                  value={form.grade}
                  onChange={update}
                  className={inputClass}
                >
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.fieldParentName}>
                <input
                  required
                  name="parentName"
                  value={form.parentName}
                  onChange={update}
                  maxLength="150"
                  className={inputClass}
                  placeholder="Parent or guardian"
                />
              </Field>
              <Field label={t.fieldPhone}>
                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={update}
                  maxLength="30"
                  className={inputClass}
                  placeholder="+251 9..."
                />
              </Field>
              <Field label={t.fieldEmail}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  maxLength="190"
                  className={inputClass}
                  placeholder="parent@example.com"
                />
              </Field>
              <Field label={t.fieldSubjects}>
                <input
                  name="preferredSubjects"
                  value={form.preferredSubjects}
                  onChange={update}
                  maxLength="500"
                  className={inputClass}
                  placeholder="Mathematics, Physics, Web Development"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label={t.fieldNotes}>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={update}
                    maxLength="1000"
                    rows="2"
                    className={inputClass}
                    placeholder="Tell us about the student's background, campus visit requests, or timing preferences..."
                  />
                </Field>
              </div>
              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#172554] transition disabled:opacity-60"
                >
                  {busy ? t.btnSubmitting : t.btnSubmit} <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-100";

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold text-[#111827]">
      {label}
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// PROFESSIONAL ADMIN PANEL WITH ANNOUNCEMENT CONTROLS, TIME-FRAMED EXCEL EXPORTS, & PAGINATION
// ---------------------------------------------------------------------------
function AdminPanel({ onExit }) {
  const [token, setToken] = useState(sessionStorage.getItem("school_admin_token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("students"); // "students" | "schedules" | "announcements" | "reports"
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ total: 0, statuses: [], grades: [] });
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  // Timeframe filter state for exports & analysis
  const [timeframe, setTimeframe] = useState("all"); // "all" | "today" | "week" | "month" | "custom"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Table pagination state: Students
  const [studentPage, setStudentPage] = useState(1);
  const [studentPageSize, setStudentPageSize] = useState(10);

  // Table pagination state: Schedules
  const [schedulePage, setSchedulePage] = useState(1);
  const [schedulePageSize, setSchedulePageSize] = useState(10);

  // Announcements state
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem("eta_admin_announcements");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 1,
        title: "Student Enrollment 2026/27 Now Open!",
        content: "Grade 1-12 Academic Support & Coding Track registrations are actively being processed for Addis Ababa families.",
        badge: "Enrollment",
        active: true,
        date: "2026-10-21"
      },
      {
        id: 2,
        title: "Weekend Coding & Web Development Lab",
        content: "Saturday tech bootcamps launching for junior students at our CMC and Ayat facilities.",
        badge: "Tech Track",
        active: true,
        date: "2026-10-20"
      },
      {
        id: 3,
        title: "Campus Diagnostic & Assessment Days",
        content: "Visit our campus quads across CMC, Summit, and Semit for complimentary student evaluations.",
        badge: "Campus",
        active: true,
        date: "2026-10-18"
      }
    ];
  });

  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", badge: "News" });

  useEffect(() => {
    localStorage.setItem("eta_admin_announcements", JSON.stringify(announcements));
  }, [announcements]);

  // Modals inside Admin
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [scheduleForStudent, setScheduleForStudent] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    studentId: "",
    subjectName: "",
    classDate: "",
    startTime: "",
    endTime: "",
    teacherName: "",
    meetingUrl: ""
  });

  async function loadData(currentToken = token) {
    if (!currentToken) return;
    setLoading(true);
    setNotice("");
    try {
      const [s, st, sc] = await Promise.all([
        api("/admin/summary", {}, currentToken),
        api(
          `/admin/students?search=${encodeURIComponent(search)}&status=${encodeURIComponent(statusFilter)}`,
          {},
          currentToken
        ),
        api("/admin/schedules", {}, currentToken)
      ]);
      setSummary(s);
      setStudents(st.students || []);
      setSchedules(sc.schedules || []);
      setStudentPage(1);
      setSchedulePage(1);
    } catch (err) {
      setNotice(err.message);
      if (/session|sign in|login/i.test(err.message)) {
        sessionStorage.removeItem("school_admin_token");
        setToken("");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadData(token);
  }, [token, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function login(e) {
    e.preventDefault();
    setLoginError("");
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      sessionStorage.setItem("school_admin_token", result.token);
      setToken(result.token);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  async function assignGrade(studentId, assignedGrade) {
    try {
      await api(
        `/admin/students/${studentId}/assign`,
        { method: "PATCH", body: JSON.stringify({ assignedGrade: Number(assignedGrade) }) },
        token
      );
      setNotice("Grade placement updated successfully.");
      await loadData();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function handleCreateSchedule(e) {
    e.preventDefault();
    setNotice("");
    try {
      await api(
        "/admin/schedules",
        {
          method: "POST",
          body: JSON.stringify({ ...newSchedule, studentId: Number(newSchedule.studentId) })
        },
        token
      );
      setNotice("Class schedule saved and notification dispatched.");
      setScheduleForStudent(null);
      setNewSchedule({
        studentId: "",
        subjectName: "",
        classDate: "",
        startTime: "",
        endTime: "",
        teacherName: "",
        meetingUrl: ""
      });
      await loadData();
    } catch (err) {
      setNotice(err.message);
    }
  }

  function handleAddAnnouncement(e) {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    const item = {
      id: Date.now(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      badge: newAnnouncement.badge || "News",
      active: true,
      date: new Date().toISOString().slice(0, 10)
    };
    setAnnouncements([item, ...announcements]);
    setNewAnnouncement({ title: "", content: "", badge: "News" });
    setNotice("New announcement published successfully.");
  }

  function toggleAnnouncement(id) {
    setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  }

  function deleteAnnouncement(id) {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  }

  // Filter students based on grade filter
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (gradeFilter && String(s.assigned_grade || s.grade) !== String(gradeFilter)) {
        return false;
      }
      return true;
    });
  }, [students, gradeFilter]);

  // Apply timeframe filter helper
  function applyTimeframe(list) {
    if (timeframe === "all") return list;
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    return list.filter((item) => {
      const d = new Date(item.created_at || item.class_date || now);
      if (isNaN(d.getTime())) return true;
      if (timeframe === "today") return d >= startOfDay(now);
      if (timeframe === "week") return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (timeframe === "month") return d >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (timeframe === "custom") {
        const s = startDate ? new Date(startDate) : new Date(0);
        const e = endDate ? new Date(endDate + "T23:59:59") : new Date(8640000000000000);
        return d >= s && d <= e;
      }
      return true;
    });
  }

  const timeframeLabel = useMemo(() => {
    if (timeframe === "today") return "Today";
    if (timeframe === "week") return "Last 7 Days (This Week)";
    if (timeframe === "month") return "Last 30 Days (This Month)";
    if (timeframe === "custom") return `Custom Range (${startDate || "Start"} to ${endDate || "End"})`;
    return "All Time (Full Archive)";
  }, [timeframe, startDate, endDate]);

  // Pagination slicing for Students
  const totalStudentPages = Math.max(1, Math.ceil(filteredStudents.length / studentPageSize));
  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentPageSize;
    return filteredStudents.slice(start, start + studentPageSize);
  }, [filteredStudents, studentPage, studentPageSize]);

  // Pagination slicing for Schedules
  const totalSchedulePages = Math.max(1, Math.ceil(schedules.length / schedulePageSize));
  const paginatedSchedules = useMemo(() => {
    const start = (schedulePage - 1) * schedulePageSize;
    return schedules.slice(start, start + schedulePageSize);
  }, [schedules, schedulePage, schedulePageSize]);

  // Time-framed Excel Export handlers
  function handleExportStudentsExcel() {
    const timeframedData = applyTimeframe(filteredStudents);
    const headers = {
      id: "Registration ID",
      student_name: "Student Full Name",
      grade: "Target Grade",
      assigned_grade: "Assigned Grade",
      parent_name: "Parent / Guardian",
      phone: "Phone / WhatsApp",
      email: "Email Address",
      preferred_subjects: "Preferred Subjects",
      status: "Application Status",
      created_at: "Registered Date",
      notes: "Notes / Special Requests"
    };
    exportToExcel({
      filename: `Ethio_Techbridge_Students_${timeframe}`,
      reportTitle: "Official Student Registration Roster",
      timeframeLabel,
      headersMap: headers,
      data: timeframedData
    });
  }

  function handleExportSchedulesExcel() {
    const timeframedData = applyTimeframe(schedules);
    const headers = {
      id: "Schedule ID",
      student_id: "Student ID",
      student_name: "Student Name",
      parent_name: "Parent Name",
      subject_name: "Subject / Program",
      class_date: "Class Date",
      start_time: "Start Time",
      end_time: "End Time",
      teacher_name: "Instructor / Tutor",
      meeting_url: "Online Meeting Link"
    };
    exportToExcel({
      filename: `Ethio_Techbridge_Schedules_${timeframe}`,
      reportTitle: "Class Schedules & Timetable Masterlist",
      timeframeLabel,
      headersMap: headers,
      data: timeframedData
    });
  }

  function handleExportExecutiveReportExcel() {
    const timeframedStudents = applyTimeframe(filteredStudents);
    const timeframedSchedules = applyTimeframe(schedules);

    const reportData = [
      { Metric: "Total Registered Applicants in Timeframe", Value: timeframedStudents.length },
      { Metric: "Pending Applications", Value: timeframedStudents.filter((s) => s.status === "pending").length },
      { Metric: "Assigned Grade Placements", Value: timeframedStudents.filter((s) => s.status === "assigned").length },
      { Metric: "Approved Registrations", Value: timeframedStudents.filter((s) => s.status === "approved").length },
      { Metric: "Class Sessions in Timeframe", Value: timeframedSchedules.length }
    ];

    exportToExcel({
      filename: `Ethio_Techbridge_Executive_Summary_${timeframe}`,
      reportTitle: "Executive Summary & Performance Metrics",
      timeframeLabel,
      headersMap: { Metric: "Institutional Metric", Value: "Calculated Value" },
      data: reportData
    });
  }

  // Login view
  if (!token) {
    return (
      <main className="min-h-screen bg-slate-50 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <button
            onClick={onExit}
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
          >
            ← Back to School Website
          </button>
          <div className="mb-6 flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold font-serif text-[#111827]">Executive Admin Portal</h1>
              <p className="text-xs text-slate-500">Ethio Techbridge Academy</p>
            </div>
          </div>
          {loginError && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 font-medium">
              {loginError}
            </p>
          )}
          <form onSubmit={login} className="space-y-4">
            <Field label="Admin email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@school.com"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#1E3A8A] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#172554] transition"
            >
              Sign In to Management Console
            </button>
          </form>
        </div>
      </main>
    );
  }

  const pendingCount = summary.statuses.find((x) => x.status === "pending")?.count || 0;
  const assignedCount = summary.statuses.find((x) => x.status === "assigned")?.count || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* Professional Admin Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Brand />
            <span className="hidden md:inline-flex items-center gap-1.5 rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1E3A8A]">
              <ShieldCheck size={14} className="text-[#F59E0B]" />
              Executive Admin Console
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleExportExecutiveReportExcel()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
              title="Download Executive Summary to Excel"
            >
              <FileSpreadsheet size={14} className="text-[#1E3A8A]" />
              Export to Excel
            </button>
            <button
              onClick={() => loadData()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition"
              title="Refresh database records"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={onExit}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Exit to Website
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("school_admin_token");
                setToken("");
              }}
              className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs sm:text-sm font-medium text-[#1E3A8A]">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="text-slate-400 hover:text-slate-700">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Executive KPI Metrics Bar */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Registered</span>
              <Users size={16} className="text-[#1E3A8A]" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif text-[#111827]">{summary.total}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">All registered applicants</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pending Review</span>
              <Clock3 size={16} className="text-[#F59E0B]" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif text-[#F59E0B]">{pendingCount}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Awaiting grade placement</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Grades Placed</span>
              <GraduationCap size={16} className="text-[#1E3A8A]" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif text-[#1E3A8A]">{assignedCount}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Assigned official level</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Announcements</span>
              <Megaphone size={16} className="text-slate-700" />
            </div>
            <p className="mt-2 text-2xl font-bold font-serif text-slate-800">
              {announcements.filter((a) => a.active).length}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">Live on public site</p>
          </div>
        </div>

        {/* Global Timeframe Filter Bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
              <Filter size={14} /> Timeframe Scope:
            </span>
            {[
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" },
              { id: "custom", label: "Custom Range" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  timeframe === t.id
                    ? "bg-[#1E3A8A] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {timeframe === "custom" && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded border border-slate-200 px-2 py-1 outline-none"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded border border-slate-200 px-2 py-1 outline-none"
              />
            </div>
          )}

          <div className="text-xs font-medium text-slate-500">
            Active: <span className="font-bold text-slate-800">{timeframeLabel}</span>
          </div>
        </div>

        {/* Professional Navigation Tabs */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("students")}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "students"
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Users size={14} /> Registered Students ({filteredStudents.length})
            </button>
            <button
              onClick={() => setActiveTab("schedules")}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "schedules"
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <CalendarDays size={14} /> Class Schedules ({schedules.length})
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "announcements"
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Megaphone size={14} /> News & Announcements ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "reports"
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <BarChart3 size={14} /> Reports & Analytics
            </button>
          </div>

          {/* Quick Tab Actions */}
          <div className="flex items-center gap-2">
            {activeTab === "students" && (
              <button
                onClick={() => handleExportStudentsExcel()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                title="Export students within current timeframe to Excel"
              >
                <FileSpreadsheet size={14} className="text-[#1E3A8A]" /> Export to Excel (.XLS)
              </button>
            )}
            {activeTab === "schedules" && (
              <>
                <button
                  onClick={() => handleExportSchedulesExcel()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                  title="Export schedules within current timeframe to Excel"
                >
                  <FileSpreadsheet size={14} className="text-[#1E3A8A]" /> Export to Excel (.XLS)
                </button>
                <button
                  onClick={() => {
                    setScheduleForStudent({ id: "", student_name: "" });
                    setNewSchedule({
                      studentId: "",
                      subjectName: "",
                      classDate: "",
                      startTime: "",
                      endTime: "",
                      teacherName: "",
                      meetingUrl: ""
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#172554] transition shadow-xs"
                >
                  <Plus size={14} /> Schedule Class
                </button>
              </>
            )}
          </div>
        </div>

        {/* =========================================================================
            TAB 1: REGISTERED STUDENTS DIRECTORY (WITH PAGINATION)
           ========================================================================= */}
        {activeTab === "students" && (
          <section className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Filter toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex flex-wrap items-center gap-2">
                {["", "pending", "assigned", "approved"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setStudentPage(1);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                      statusFilter === st
                        ? "bg-[#1E3A8A] text-white font-bold"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {st === "" ? "All Statuses" : st}
                  </button>
                ))}

                <select
                  value={gradeFilter}
                  onChange={(e) => {
                    setGradeFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="">All Grades</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setStudentPage(1);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && loadData()}
                    placeholder="Search name, phone, email..."
                    className="w-56 sm:w-64 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#1E3A8A]"
                  />
                </div>
                <button
                  onClick={() => loadData()}
                  className="rounded-lg bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#172554] transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Parent & Contact</th>
                    <th className="px-4 py-3">Programs / Subjects</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#111827]">{s.student_name}</div>
                        <div className="text-[11px] text-slate-400">ID #{s.id} · {s.created_at?.slice(0, 10)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-700">
                          {s.assigned_grade ? `Grade ${s.assigned_grade}` : `Requested G-${s.grade}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{s.parent_name}</div>
                        <div className="text-[11px] text-slate-500">{s.phone}</div>
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-slate-600" title={s.preferred_subjects}>
                        {s.preferred_subjects || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          s.status === "assigned"
                            ? "bg-blue-50 text-[#1E3A8A]"
                            : s.status === "approved"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={s.assigned_grade || ""}
                            onChange={(e) => e.target.value && assignGrade(s.id, e.target.value)}
                            className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 focus:border-[#1E3A8A]"
                            title="Assign official grade"
                          >
                            <option value="">Grade...</option>
                            {grades.map((g) => (
                              <option key={g} value={g}>
                                G-{g}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              setScheduleForStudent(s);
                              setNewSchedule({
                                studentId: String(s.id),
                                subjectName: s.preferred_subjects?.split(",")[0] || "Mathematics",
                                classDate: "",
                                startTime: "",
                                endTime: "",
                                teacherName: "",
                                meetingUrl: ""
                              });
                            }}
                            className="rounded border border-slate-200 px-2 py-1 text-[11px] font-bold text-[#1E3A8A] hover:bg-blue-50 transition"
                            title="Schedule a class session"
                          >
                            Schedule
                          </button>
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="rounded border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition"
                            title="View student file details"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!paginatedStudents.length && (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-xs text-slate-500">
                        {loading ? "Loading applicant records..." : "No student records found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-bold text-slate-900">
                  {filteredStudents.length === 0
                    ? "0"
                    : `${(studentPage - 1) * studentPageSize + 1}–${Math.min(
                        studentPage * studentPageSize,
                        filteredStudents.length
                      )}`}
                </span>
                <span>of</span>
                <span className="font-bold text-slate-900">{filteredStudents.length}</span>
                <span>students</span>

                <div className="ml-4 flex items-center gap-1.5">
                  <span className="text-slate-400">Rows:</span>
                  <select
                    value={studentPageSize}
                    onChange={(e) => {
                      setStudentPageSize(Number(e.target.value));
                      setStudentPage(1);
                    }}
                    className="rounded border border-slate-200 bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setStudentPage(1)}
                  disabled={studentPage === 1}
                  className="rounded border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  title="First page"
                >
                  <ChevronsLeft size={15} />
                </button>
                <button
                  onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                  disabled={studentPage === 1}
                  className="rounded border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  title="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="px-3 py-1 font-semibold text-slate-800">
                  Page {studentPage} of {totalStudentPages}
                </span>
                <button
                  onClick={() => setStudentPage((p) => Math.min(totalStudentPages, p + 1))}
                  disabled={studentPage >= totalStudentPages}
                  className="rounded border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  title="Next page"
                >
                  <ChevronRight size={15} />
                </button>
                <button
                  onClick={() => setStudentPage(totalStudentPages)}
                  disabled={studentPage >= totalStudentPages}
                  className="rounded border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  title="Last page"
                >
                  <ChevronsRight size={15} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            TAB 2: CLASS SCHEDULES DIRECTORY (WITH PAGINATION)
           ========================================================================= */}
        {activeTab === "schedules" && (
          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedSchedules.map((sc) => (
                <div key={sc.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#111827]">{sc.subject_name}</h4>
                      <p className="mt-0.5 text-xs text-slate-600">Student: {sc.student_name}</p>
                      <p className="text-xs text-slate-500">Mentor: {sc.teacher_name || "Assigned Tutor"}</p>
                    </div>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#1E3A8A]">
                      {sc.class_date?.slice(0, 10)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock3 size={13} className="text-[#1E3A8A]" />
                      {String(sc.start_time).slice(0, 5)}
                      {sc.end_time ? ` – ${String(sc.end_time).slice(0, 5)}` : ""}
                    </span>
                    {sc.meeting_url ? (
                      <a
                        href={sc.meeting_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#1E3A8A] hover:underline"
                      >
                        Join Class <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">On Campus</span>
                    )}
                  </div>
                </div>
              ))}
              {!paginatedSchedules.length && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-slate-500">
                  No classes scheduled yet. Click "Schedule Class" above to create one.
                </div>
              )}
            </div>

            {/* Schedules Pagination Controls */}
            {schedules.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-2xs">
                <div>
                  Showing{" "}
                  <span className="font-bold text-slate-900">
                    {(schedulePage - 1) * schedulePageSize + 1}–{Math.min(
                      schedulePage * schedulePageSize,
                      schedules.length
                    )}
                  </span>{" "}
                  of <span className="font-bold text-slate-900">{schedules.length}</span> schedules
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSchedulePage((p) => Math.max(1, p - 1))}
                    disabled={schedulePage === 1}
                    className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="px-2 font-semibold">
                    Page {schedulePage} of {totalSchedulePages}
                  </span>
                  <button
                    onClick={() => setSchedulePage((p) => Math.min(totalSchedulePages, p + 1))}
                    disabled={schedulePage >= totalSchedulePages}
                    className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            TAB 3: NEWS & ANNOUNCEMENTS CONTROL PANEL
           ========================================================================= */}
        {activeTab === "announcements" && (
          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
              {/* Create Announcement Form */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone size={18} className="text-[#1E3A8A]" />
                  <h3 className="font-bold font-serif text-base text-[#111827]">
                    Create Public Announcement
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Active announcements appear dynamically on the public top banner and website notice tickers.
                </p>

                <form onSubmit={handleAddAnnouncement} className="space-y-3.5">
                  <Field label="Announcement Headline *">
                    <input
                      required
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      placeholder="e.g. Saturday Coding Bootcamp Open"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Category Badge">
                    <select
                      value={newAnnouncement.badge}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, badge: e.target.value })}
                      className={inputClass}
                    >
                      <option value="Enrollment">Enrollment</option>
                      <option value="News">News</option>
                      <option value="Event">Event</option>
                      <option value="Campus">Campus</option>
                      <option value="Tech Track">Tech Track</option>
                    </select>
                  </Field>
                  <Field label="Details / Message Content *">
                    <textarea
                      required
                      rows="3"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      placeholder="Write brief description for students and parents..."
                      className={inputClass}
                    />
                  </Field>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#1E3A8A] py-2.5 text-xs font-bold text-white hover:bg-[#172554] transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus size={15} /> Publish Announcement
                  </button>
                </form>
              </div>

              {/* Announcements List */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                <h3 className="font-bold font-serif text-base text-[#111827] mb-2">
                  Published Announcements ({announcements.length})
                </h3>

                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {announcements.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-4 transition ${
                        item.active
                          ? "border-blue-200 bg-blue-50/40"
                          : "border-slate-200 bg-slate-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-[#1E3A8A] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                              {item.badge}
                            </span>
                            <span className="text-[11px] text-slate-400">{item.date}</span>
                            {item.active ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-slate-400">Hidden</span>
                            )}
                          </div>
                          <h4 className="mt-1 font-bold text-sm text-[#111827]">{item.title}</h4>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.content}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleAnnouncement(item.id)}
                            className="rounded p-1.5 text-slate-500 hover:bg-white transition"
                            title={item.active ? "Hide announcement" : "Activate announcement"}
                          >
                            {item.active ? <Eye size={16} className="text-[#1E3A8A]" /> : <EyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => deleteAnnouncement(item.id)}
                            className="rounded p-1.5 text-red-500 hover:bg-white transition"
                            title="Delete announcement"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!announcements.length && (
                    <p className="py-8 text-center text-xs text-slate-400">
                      No announcements published yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            TAB 4: EXECUTIVE REPORTS & TIME-FRAMED EXPORTS
           ========================================================================= */}
        {activeTab === "reports" && (
          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Report Export Center Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A]">
                    <FileSpreadsheet size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold font-serif text-base text-[#111827]">
                      Export Institutional Reports to Excel
                    </h3>
                    <p className="text-xs text-slate-500">
                      Formatted with official modern institutional headers · Scope: {timeframeLabel}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                    <div>
                      <p className="font-bold text-xs text-slate-900">Registered Students Masterlist (.XLS)</p>
                      <p className="text-[11px] text-slate-500">
                        {applyTimeframe(filteredStudents).length} records within {timeframeLabel}
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportStudentsExcel()}
                      className="rounded-lg bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#172554] transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Download size={13} /> Export Excel
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                    <div>
                      <p className="font-bold text-xs text-slate-900">Class Schedules & Tutorials (.XLS)</p>
                      <p className="text-[11px] text-slate-500">
                        {applyTimeframe(schedules).length} sessions within {timeframeLabel}
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportSchedulesExcel()}
                      className="rounded-lg bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#172554] transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Download size={13} /> Export Excel
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                    <div>
                      <p className="font-bold text-xs text-slate-900">Executive Summary Metric Report (.XLS)</p>
                      <p className="text-[11px] text-slate-500">Official KPI summary and conversion rates</p>
                    </div>
                    <button
                      onClick={() => handleExportExecutiveReportExcel()}
                      className="rounded-lg bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#172554] transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Download size={13} /> Export Excel
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                    <div>
                      <p className="font-bold text-xs text-slate-900">Printable Executive Summary</p>
                      <p className="text-[11px] text-slate-500">Open clean print preview dialog for physical copy or PDF</p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
                    >
                      <Printer size={13} /> Print
                    </button>
                  </div>
                </div>
              </div>

              {/* Grade Breakdown & Status Summary */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="font-bold font-serif text-base text-[#111827] mb-4">
                  Grade Distribution Overview
                </h3>
                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                  {grades.map((g) => {
                    const count = students.filter((s) => Number(s.assigned_grade || s.grade) === g).length;
                    const pct = students.length ? Math.round((count / students.length) * 100) : 0;
                    return (
                      <div key={g} className="flex items-center gap-3">
                        <span className="w-16 font-semibold text-slate-700">Grade {g}:</span>
                        <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#1E3A8A] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-bold text-slate-900">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* MODAL: STUDENT DETAILS */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && setSelectedStudent(null)}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A]">
                  Student File #{selectedStudent.id}
                </span>
                <h3 className="text-lg font-bold font-serif text-[#111827]">
                  {selectedStudent.student_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3">
                <div>
                  <span className="text-slate-400">Target Grade:</span>
                  <p className="font-bold text-slate-900">Grade {selectedStudent.grade}</p>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Grade:</span>
                  <p className="font-bold text-[#1E3A8A]">
                    {selectedStudent.assigned_grade ? `Grade ${selectedStudent.assigned_grade}` : "Not Assigned"}
                  </p>
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Parent / Guardian:</span>
                <p className="font-bold text-slate-900">{selectedStudent.parent_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-slate-500">Telephone / WhatsApp:</span>
                  <p>
                    <a href={`tel:${selectedStudent.phone}`} className="font-bold text-[#1E3A8A] hover:underline">
                      {selectedStudent.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Email:</span>
                  <p>
                    {selectedStudent.email ? (
                      <a href={`mailto:${selectedStudent.email}`} className="text-[#1E3A8A] hover:underline">
                        {selectedStudent.email}
                      </a>
                    ) : (
                      "None provided"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Preferred Subjects:</span>
                <p className="mt-0.5 rounded bg-slate-50 p-2 font-medium">{selectedStudent.preferred_subjects || "—"}</p>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Applicant Notes:</span>
                <p className="mt-0.5 rounded bg-slate-50 p-2 text-slate-600">{selectedStudent.notes || "None provided"}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  setScheduleForStudent(selectedStudent);
                  setNewSchedule({
                    studentId: String(selectedStudent.id),
                    subjectName: selectedStudent.preferred_subjects?.split(",")[0] || "Mathematics",
                    classDate: "",
                    startTime: "",
                    endTime: "",
                    teacherName: "",
                    meetingUrl: ""
                  });
                  setSelectedStudent(null);
                }}
                className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-bold text-white hover:bg-[#172554] transition"
              >
                Schedule Class Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SCHEDULE */}
      {scheduleForStudent && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && setScheduleForStudent(null)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-[#111827]">
                  Schedule Class Session
                </h3>
                <p className="text-xs text-slate-500">
                  {scheduleForStudent.id
                    ? `Assign tutorial for ${scheduleForStudent.student_name}`
                    : "Create new class schedule"}
                </p>
              </div>
              <button
                onClick={() => setScheduleForStudent(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSchedule} className="mt-4 space-y-3">
              <Field label="Student *">
                <select
                  required
                  value={newSchedule.studentId}
                  onChange={(e) => setNewSchedule({ ...newSchedule, studentId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.student_name} (Grade {s.assigned_grade || s.grade})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Subject / Program *">
                <input
                  required
                  value={newSchedule.subjectName}
                  onChange={(e) => setNewSchedule({ ...newSchedule, subjectName: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Mathematics / Physics"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Date *">
                  <input
                    type="date"
                    required
                    value={newSchedule.classDate}
                    onChange={(e) => setNewSchedule({ ...newSchedule, classDate: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Start Time *">
                  <input
                    type="time"
                    required
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="End Time">
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Instructor / Tutor">
                  <input
                    value={newSchedule.teacherName}
                    onChange={(e) => setNewSchedule({ ...newSchedule, teacherName: e.target.value })}
                    className={inputClass}
                    placeholder="Instructor name"
                  />
                </Field>
              </div>
              <Field label="Online Class URL (Optional)">
                <input
                  type="url"
                  value={newSchedule.meetingUrl}
                  onChange={(e) => setNewSchedule({ ...newSchedule, meetingUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://meet.google.com/..."
                />
              </Field>
              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleForStudent(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-bold text-white hover:bg-[#172554] transition"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LANGUAGE DROPDOWN COMPONENT (CLEAN, ACCESSIBLE, MULTI-VARIANT)
// ---------------------------------------------------------------------------
const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", nativeName: "English", subtext: "International" },
  { code: "am", label: "Amharic", nativeName: "አማርኛ", subtext: "Amharic" },
  { code: "om", label: "Afaan Oromoo", nativeName: "Afaan Oromoo", subtext: "Oromoo" }
];

function LanguageDropdown({ lang, setLang, variant = "nav" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const current = LANGUAGE_OPTIONS.find((item) => item.code === lang) || LANGUAGE_OPTIONS[0];

  if (variant === "banner") {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="true"
          className="flex items-center gap-1.5 bg-blue-950/70 hover:bg-blue-900/90 text-white rounded-lg px-2.5 py-1 text-xs font-semibold border border-blue-700/60 transition shadow-xs focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
        >
          <Globe size={13} className="text-[#F59E0B]" />
          <span>{current.nativeName}</span>
          <ChevronDown
            size={12}
            className={`text-blue-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-1.5 z-50 focus:outline-none animate-in fade-in duration-100">
            <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Select Language
            </div>
            {LANGUAGE_OPTIONS.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition ${
                    isSelected
                      ? "bg-blue-50 text-[#1E3A8A] font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#1E3A8A]"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{item.nativeName}</span>
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-[#1E3A8A]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="relative w-full" ref={dropdownRef}>
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Globe size={15} className="text-[#1E3A8A]" />
            <span>Language / ቋንቋ:</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#1E3A8A] shadow-xs"
          >
            <span>{current.nativeName}</span>
            <ChevronDown
              size={13}
              className={`text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {open && (
          <div className="mt-2 w-full rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-50">
            {LANGUAGE_OPTIONS.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition ${
                    isSelected
                      ? "bg-blue-50 text-[#1E3A8A] font-bold border-l-2 border-[#F59E0B]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block text-slate-900">{item.nativeName}</span>
                    <span className="text-[11px] text-slate-400">{item.label}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-[#1E3A8A]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Default "nav" variant (Desktop Navbar)
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
      >
        <Globe size={14} className="text-[#1E3A8A]" />
        <span className="tracking-tight">{current.nativeName}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-white text-slate-800 shadow-xl border border-slate-200 py-1.5 z-50 focus:outline-none animate-in fade-in duration-100">
          <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            Language / ቋንቋ / Afaan
          </div>
          {LANGUAGE_OPTIONS.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLang(item.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition ${
                  isSelected
                    ? "bg-blue-50/80 text-[#1E3A8A] font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[#1E3A8A]"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">{item.nativeName}</span>
                  <span className="text-[11px] text-slate-500 font-normal">{item.label}</span>
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[#1E3A8A]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PUBLIC LANDING PAGE (WITH ACCURATE TRANSLATIONS, TYPEWRITER, & SLOW MOTION)
// ---------------------------------------------------------------------------
function LandingPage({ onOpenModal, onAdmin, lang, setLang }) {
  const t = translations[lang] || translations.en;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showFaq, setShowFaq] = useState(0);

  // Active state scroll spy
  useEffect(() => {
    const sectionIds = ["home", "about", "programs", "campus", "why-us", "faq", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: t.navHome },
    { id: "about", label: t.navAbout },
    { id: "programs", label: t.navPrograms },
    { id: "campus", label: t.navCampus },
    { id: "why-us", label: t.navWhyUs },
    { id: "faq", label: t.navFaq },
    { id: "contact", label: t.navContact }
  ];

  const faqData = useMemo(() => {
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* Top Banner Notice (Clean Navy & Gold) */}
      <div className="bg-[#1E3A8A] text-white py-2 px-4 text-xs font-medium text-center border-b border-blue-900/40">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mx-auto sm:mx-0">
            <span className="font-bold text-[#F59E0B]">
              {t.topBannerEnrollment}
            </span>
            <span className="hidden md:inline">{t.topBannerGrades}</span>
            <span className="hidden lg:inline text-blue-200">·</span>
            <span className="hidden lg:inline text-slate-200">
              {t.topBannerLocations}
            </span>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline text-[#F59E0B] hover:text-white transition"
            >
              {t.topBannerGoogleForm}
            </a>
          </div>

          {/* Top Banner Language Dropdown */}
          <LanguageDropdown lang={lang} setLang={setLang} variant="banner" />
        </div>
      </div>

      {/* Sticky Navbar with visible active states */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-xs">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Brand />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? "text-[#1E3A8A] bg-blue-50/80 font-bold"
                      : "text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#F59E0B] rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* Desktop Navbar Language Dropdown */}
            <LanguageDropdown lang={lang} setLang={setLang} variant="nav" />

            <button
              onClick={onAdmin}
              className="text-xs uppercase tracking-wider font-bold text-slate-500 hover:text-[#1E3A8A] px-2.5 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              {t.navAdmin}
            </button>
            <button
              onClick={() => onOpenModal()}
              className="rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#172554] transition flex items-center gap-1.5"
            >
              {t.navApply} <ArrowRight size={15} />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenModal()}
              className="rounded-lg bg-[#1E3A8A] px-3 py-1.5 text-xs font-bold text-white"
            >
              {t.navApply}
            </button>
            <button
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden shadow-lg space-y-1">
            {/* Mobile Drawer Language Dropdown */}
            <div className="py-2 border-b border-slate-100 mb-2">
              <LanguageDropdown lang={lang} setLang={setLang} variant="mobile" />
            </div>

            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  onClick={() => setMenuOpen(false)}
                  href={`#${item.id}`}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-[#1E3A8A] font-bold border-l-2 border-[#F59E0B]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenModal();
                }}
                className="w-full rounded-xl bg-[#1E3A8A] py-2.5 text-sm font-bold text-white"
              >
                {t.navApply}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onAdmin();
                }}
                className="w-full rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700"
              >
                {t.navAdmin}
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =========================================================================
            CAMPUS-FORWARD HERO SECTION WITH SLOW MOTION & AUTO-TYPING HEADLINE
           ========================================================================= */}
        <section
          id="home"
          className="relative min-h-[620px] lg:min-h-[700px] flex items-center overflow-hidden bg-[#070e22]"
        >
          {/* Background Image: Wide Campus Quad with SLOW SMOOTH MOTION */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/campus-quad.jpg"
              alt="Ethio Techbridge Academy Campus Quad"
              className="animate-slow-pan h-full w-full object-cover object-[center_35%] sm:object-center filter brightness-95"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070e22]/95 via-[#1E3A8A]/90 to-[#070e22]/75 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070e22] via-transparent to-[#070e22]/40" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 w-full">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                <span className="text-[#F59E0B] uppercase tracking-wider font-extrabold">
                  {t.heroBadgeAdmissions}
                </span>
                <span className="text-white/40">·</span>
                <span className="text-white/90">{t.heroBadgeScope}</span>
              </div>

              {/* Exact Headline: BOLD BRILLIANT WHITE TEXT & AUTO-TYPED SLOGANS */}
              <h1
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.18] tracking-tight"
                style={{ color: "#FFFFFF" }}
              >
                <span
                  className="block font-black tracking-tight"
                  style={{ color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {t.heroBrandTitle}
                </span>
                <span className="block mt-2 min-h-[1.3em]">
                  <TypewriterHeadline phrases={t.heroTypewriterPhrases} />
                </span>
              </h1>

              {/* Mission Statement (22 words, 65-75 chars line length) */}
              <p
                style={{ maxWidth: "68ch" }}
                className="mt-6 text-lg sm:text-xl font-normal leading-relaxed text-slate-100"
              >
                {t.heroMission}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenModal()}
                  className="rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#111827] px-8 py-4 text-base font-extrabold shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {t.heroBtnApply} <ArrowRight size={18} />
                </button>
                <a
                  href="#campus"
                  className="rounded-xl border border-white/60 bg-white/10 hover:bg-white text-white hover:text-[#1E3A8A] px-7 py-3.5 text-base font-bold backdrop-blur-sm transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Building2 size={18} />
                  {t.heroBtnCampus}
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 pt-6 border-t border-white/15 text-xs sm:text-sm font-semibold text-slate-200">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="text-[#F59E0B]" size={16} />
                  {t.heroTrustMastery}
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="text-[#F59E0B]" size={16} />
                  {t.heroTrustCoding}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="text-[#F59E0B]" size={16} />
                  {t.heroTrustLocations}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ABOUT THE SCHOOL CARD (HIGHLIGHTING MISSION AND ACCREDITATION)
           ========================================================================= */}
        <section id="about" className="relative -mt-10 z-20 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-center">
              <div>
                <span className="inline-block rounded bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                  {t.aboutBadge}
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-[#111827]">
                  {t.aboutTitle}
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
                  <button
                    onClick={() => onOpenModal({ subjects: "Grade 1-12 Academic Support & Technology" })}
                    className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#172554] transition flex items-center gap-1.5"
                  >
                    {t.aboutBtnEnroll} <ArrowRight size={14} />
                  </button>
                  <a
                    href="#campus"
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {t.aboutBtnTour}
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <h3 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
                  {t.aboutHighlightsTitle}
                </h3>
                <div className="divide-y divide-slate-200 text-xs text-slate-700">
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold">{t.aboutScope}</span>
                    <span className="font-bold text-[#1E3A8A]">{t.aboutScopeVal}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold">{t.aboutTrack}</span>
                    <span className="font-bold text-[#1E3A8A]">{t.aboutTrackVal}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold">{t.aboutFormat}</span>
                    <span className="font-bold">{t.aboutFormatVal}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold">{t.aboutAdmissionsLink}</span>
                    <a
                      href={GOOGLE_FORM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#1E3A8A] underline"
                    >
                      Google Form Link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PROGRAMS & CURRICULUM
           ========================================================================= */}
        <section id="programs" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
              {t.programsBadge}
            </span>
            <h2 className="mt-2 text-3xl font-bold font-serif text-[#111827]">
              {t.programsTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t.programsSubtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Academic Support */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#1E3A8A] transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <BookOpen size={20} />
                  </span>
                  <span className="rounded bg-blue-50 text-[#1E3A8A] px-2.5 py-1 text-xs font-bold">
                    {t.progAcademicBadge}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif text-[#111827]">
                  {t.progAcademicTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {t.progAcademicDesc}
                </p>
                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                  {t.progAcademicSubs.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <Check size={14} className="text-[#1E3A8A] shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() =>
                  onOpenModal({ subjects: "Grade 1-12 Academic Support (Math, Sciences, English)" })
                }
                className="mt-6 w-full rounded-xl bg-slate-50 hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {t.progAcademicBtn} <ChevronRight size={14} />
              </button>
            </article>

            {/* 2. Digital Skills */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#1E3A8A] transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <Laptop size={20} />
                  </span>
                  <span className="rounded bg-blue-50 text-[#1E3A8A] px-2.5 py-1 text-xs font-bold">
                    {t.progDigitalBadge}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif text-[#111827]">
                  {t.progDigitalTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {t.progDigitalDesc}
                </p>
                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                  {t.progDigitalSubs.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <Check size={14} className="text-[#1E3A8A] shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() =>
                  onOpenModal({ subjects: "Digital Skills & Technology (Office, Canva, Digital Literacy)" })
                }
                className="mt-6 w-full rounded-xl bg-slate-50 hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {t.progDigitalBtn} <ChevronRight size={14} />
              </button>
            </article>

            {/* 3. Web Development */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#1E3A8A] transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <Code2 size={20} />
                  </span>
                  <span className="rounded bg-blue-50 text-[#1E3A8A] px-2.5 py-1 text-xs font-bold">
                    {t.progWebBadge}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-serif text-[#111827]">
                  {t.progWebTitle}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {t.progWebDesc}
                </p>
                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                  {t.progWebSubs.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <Check size={14} className="text-[#1E3A8A] shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() =>
                  onOpenModal({ subjects: "Web Development & Programming (HTML, CSS, JavaScript)" })
                }
                className="mt-6 w-full rounded-xl bg-slate-50 hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {t.progWebBtn} <ChevronRight size={14} />
              </button>
            </article>
          </div>

          {/* Learning Options */}
          <div className="mt-12 rounded-2xl bg-[#1E3A8A] text-white p-6 sm:p-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                {t.learningFormatsBadge}
              </span>
              <h3 className="mt-1 text-xl font-bold font-serif">
                {t.learningFormatsTitle}
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {t.formats.map((opt) => (
                <div key={opt.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h4 className="font-bold text-sm font-serif text-white">{opt.title}</h4>
                  <p className="mt-1 text-xs text-blue-100 leading-relaxed">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            CAMPUS VISIT & LOCATIONS
           ========================================================================= */}
        <section id="campus" className="bg-white py-16 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
                  {t.campusBadge}
                </span>
                <h2 className="mt-2 text-3xl font-bold font-serif text-[#111827]">
                  {t.campusTitle}
                </h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {t.campusDesc}
                </p>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#1E3A8A] shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-sm text-[#111827]">
                        {t.campusLocationsTitle}
                      </h4>
                      <p className="text-xs text-slate-700 mt-0.5">
                        {t.campusLocationsList}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      onOpenModal({
                        subjects: "Campus Tour & Placement Assessment",
                        notes: "Interested in scheduling an in-person campus visit and tour."
                      })
                    }
                    className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#172554] transition"
                  >
                    {t.campusBtnSchedule}
                  </button>
                  <a
                    href="https://wa.me/251972755966?text=Hello%20Ethio%20Techbridge%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20campus%20tours%20and%20enrollment."
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
                  >
                    <Phone size={14} className="text-[#1E3A8A]" /> {t.campusBtnWhatsapp}
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
                    <p className="font-bold font-serif text-sm">{t.campusPhotoTitle}</p>
                    <p className="text-[11px] text-slate-400">{t.campusPhotoSubtitle}</p>
                  </div>
                  <span className="rounded bg-[#F59E0B] text-[#111827] px-2 py-0.5 text-xs font-bold">
                    Addis Ababa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            WHY CHOOSE US & OFFICIAL ENROLLMENT
           ========================================================================= */}
        <section id="why-us" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
              {t.whyUsBadge}
            </span>
            <h2 className="mt-2 text-3xl font-bold font-serif text-[#111827]">
              {t.whyUsTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t.whyUsSlogan}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {t.whyCards.map((c, idx) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 mb-4">
                  {idx === 0 ? <Sparkles className="text-[#1E3A8A]" size={24} /> : idx === 1 ? <BookOpen className="text-[#1E3A8A]" size={24} /> : <GraduationCap className="text-[#1E3A8A]" size={24} />}
                </div>
                <h3 className="text-base font-bold font-serif text-[#111827]">{c.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Enrollment Banner */}
          <div className="mt-12 rounded-2xl bg-[#1E3A8A] p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                  {t.readyBadge}
                </span>
                <h3 className="mt-1 text-2xl font-bold font-serif">
                  {t.readyTitle}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
                  {t.readySubtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenModal()}
                  className="rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#111827] px-6 py-3 text-xs font-extrabold shadow-sm transition"
                >
                  {t.readyBtnApply}
                </button>
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/30 bg-white/10 hover:bg-white hover:text-[#1E3A8A] px-5 py-3 text-xs font-bold text-white transition flex items-center gap-1.5"
                >
                  {t.readyBtnGoogle} <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FAQS
           ========================================================================= */}
        <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-blue-50 px-2.5 py-1 rounded">
              {t.faqBadge}
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-[#111827]">
              {t.faqTitle}
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {faqData.map(([q, a], i) => (
              <div
                key={q}
                className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden"
              >
                <button
                  onClick={() => setShowFaq(showFaq === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-bold text-sm text-[#111827] hover:text-[#1E3A8A] transition"
                >
                  <span className="font-serif">{q}</span>
                  <ChevronDown
                    className={`shrink-0 transition-transform duration-200 text-slate-400 ${
                      showFaq === i ? "rotate-180 text-[#1E3A8A]" : ""
                    }`}
                    size={18}
                  />
                </button>
                {showFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 bg-slate-50/50">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            CONTACT
           ========================================================================= */}
        <section id="contact" className="bg-slate-100 py-12 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <a
                href="#campus"
                className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-[#1E3A8A] transition no-underline"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] shrink-0">
                  <MapPin size={20} />
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">{t.contactCampus}</h4>
                  <p className="mt-0.5 text-xs text-slate-600">
                    CMC • Summit • Semit • 72 • Ayat
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/251972755966"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-[#1E3A8A] transition no-underline"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] shrink-0">
                  <Phone size={20} />
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">{t.contactPhone}</h4>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900">
                    +251 97 275 5966
                  </p>
                </div>
              </a>

              <a
                href="mailto:yilmatibarek99@gmail.com"
                className="rounded-xl bg-white p-5 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-[#1E3A8A] transition no-underline"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A] shrink-0">
                  <Mail size={20} />
                </span>
                <div>
                  <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">{t.contactEmail}</h4>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900 truncate max-w-[200px]">
                    yilmatibarek99@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <Brand />
            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-600">
              <a href="#home" className="hover:text-[#1E3A8A]">{t.navHome}</a>
              <a href="#about" className="hover:text-[#1E3A8A]">{t.navAbout}</a>
              <a href="#programs" className="hover:text-[#1E3A8A]">{t.navPrograms}</a>
              <a href="#campus" className="hover:text-[#1E3A8A]">{t.navCampus}</a>
              <a href="#faq" className="hover:text-[#1E3A8A]">{t.navFaq}</a>
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer" className="text-[#1E3A8A] underline">
                Google Form
              </a>
            </div>
            <button
              onClick={onAdmin}
              className="text-xs font-bold text-slate-500 hover:text-[#1E3A8A] transition"
            >
              {t.navAdmin}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            {t.footerCopy}
          </p>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ROOT APPLICATION COMPONENT
// ---------------------------------------------------------------------------
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("eta_lang") || "en");
  const [modalConfig, setModalConfig] = useState({
    open: false,
    subjects: "",
    notes: "",
    method: "inapp"
  });
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem("eta_lang", lang);
  }, [lang]);

  function openModal(options = {}) {
    setModalConfig({
      open: true,
      subjects: options.subjects || "",
      notes: options.notes || "",
      method: options.method || "inapp"
    });
  }

  function closeModal() {
    setModalConfig((prev) => ({ ...prev, open: false }));
  }

  return admin ? (
    <AdminPanel onExit={() => setAdmin(false)} />
  ) : (
    <>
      <LandingPage
        onOpenModal={openModal}
        onAdmin={() => setAdmin(true)}
        lang={lang}
        setLang={setLang}
      />
      {modalConfig.open && (
        <RegistrationModal
          onClose={closeModal}
          initialSubjects={modalConfig.subjects}
          initialNotes={modalConfig.notes}
          defaultMethod={modalConfig.method}
          lang={lang}
        />
      )}
    </>
  );
}
