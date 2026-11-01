import MotionHero from "../components/MotionHero.jsx";
import CoreStandardsSection from "../components/CoreStandardsSection.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";

export default function HomePage({ onOpenTutoringModal }) {
  return (
    <div
      className="pb-8"
      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" }}
    >
      {/* 1. FOUR-SCENE LIGHTWEIGHT ANIMATED HERO (20s Auto-Rotate + Golden Typewriter Effect) */}
      <MotionHero onOpenTutoringModal={onOpenTutoringModal} />

      {/* 2. CORE STANDARDS: BUILT FOR EXCELLENCE, INTEGRITY & PRACTICAL IMPACT */}
      <CoreStandardsSection />

      {/* 3. TESTIMONIALS SECTION (HORIZONTAL SLOW-MOTION MARQUEE) */}
      <TestimonialsSection />
    </div>
  );
}
