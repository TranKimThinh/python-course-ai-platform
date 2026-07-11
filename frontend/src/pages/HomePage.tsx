import AILearningFlowSection from "../components/home/AILearningFlowSection";
import CourseHighlightSection from "../components/home/CourseHighlightSection";
import CTASection from "../components/home/CTASection";
import FeatureSection from "../components/home/FeatureSection";
import HeroSection from "../components/home/HeroSection";

function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <main>
        <HeroSection />
        <FeatureSection />
        <CourseHighlightSection />
        <AILearningFlowSection />
        <CTASection />
      </main>
    </div>
  );
}

export default HomePage;
