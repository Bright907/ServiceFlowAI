import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import TradesSection from '@/components/landing/TradesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <TradesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
