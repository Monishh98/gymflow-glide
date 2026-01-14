import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scene } from '@/components/3d/Scene';
import { StepCard } from '@/components/landing/StepCard';
import { NavigationPill } from '@/components/landing/NavigationPill';
import { Dumbbell, Users, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    tag: "Welcome",
    title: "Gym Management, Simplified",
    description: "The all-in-one platform that transforms how you run your gym. From memberships to scheduling, we've got you covered.",
    cta: "Get Started",
    camera: { x: 0.2, y: 0.15, z: 3.5 },
    rotation: { x: 0.0, y: 0.6, z: 0.0 },
    light: { intensity: 1.2 }
  },
  {
    tag: "Members",
    title: "Manage Members Effortlessly",
    description: "Track memberships, monitor attendance, and build lasting relationships with your gym community.",
    cta: "View Members",
    camera: { x: -0.3, y: 0.2, z: 2.8 },
    rotation: { x: 0.1, y: 1.8, z: 0.0 },
    light: { intensity: 1.4 }
  },
  {
    tag: "Schedule",
    title: "Smart Scheduling",
    description: "Create classes, book appointments, and manage your gym's calendar with intelligent scheduling tools.",
    cta: "See Schedule",
    camera: { x: 0.4, y: -0.1, z: 3.0 },
    rotation: { x: -0.1, y: 3.2, z: 0.0 },
    light: { intensity: 1.3 }
  },
  {
    tag: "Billing",
    title: "Seamless Payments",
    description: "Automate billing, track payments, and manage subscriptions with our integrated payment system.",
    cta: "Start Now",
    camera: { x: 0.0, y: 0.3, z: 2.5 },
    rotation: { x: 0.15, y: 4.5, z: 0.0 },
    light: { intensity: 1.5 }
  }
];

const features = [
  { icon: Dumbbell, title: "Equipment Tracking", desc: "Monitor all your gym equipment" },
  { icon: Users, title: "Member Portal", desc: "Self-service for members" },
  { icon: Calendar, title: "Class Booking", desc: "Easy online reservations" },
  { icon: CreditCard, title: "Auto Billing", desc: "Recurring payments made easy" },
];

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= steps.length || isScrolling) return;
    setIsScrolling(true);
    setCurrentStep(index);
    setTimeout(() => setIsScrolling(false), 800);
  }, [isScrolling]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      goToStep(currentStep + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (isScrolling) return;
    
    if (e.deltaY > 0) {
      goToStep(currentStep + 1);
    } else {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep, isScrolling]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleCtaClick = () => {
    if (currentStep === steps.length - 1) {
      navigate('/dashboard');
    } else {
      goToStep(currentStep + 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, 
          hsl(222 47% ${8 + currentStep * 2}%) 0%, 
          hsl(222 47% ${14 + currentStep * 1}%) 50%, 
          hsl(217 47% ${18 + currentStep * 2}%) 100%)`
      }}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Animated gradient orbs */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 60% / 0.4) 0%, transparent 70%)',
          top: `${20 + currentStep * 5}%`,
          left: `${10 + currentStep * 10}%`,
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, hsl(160 64% 52% / 0.4) 0%, transparent 70%)',
          bottom: `${20 - currentStep * 5}%`,
          right: `${15 + currentStep * 5}%`,
        }}
      />

      {/* Main content grid */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 gap-8 lg:gap-16">
        {/* Left side - Content card */}
        <div className="flex-1 flex items-center justify-center lg:justify-start max-w-xl">
          <StepCard
            key={currentStep}
            tag={currentStepData.tag}
            title={currentStepData.title}
            description={currentStepData.description}
            cta={currentStepData.cta}
            isActive={true}
            onCtaClick={handleCtaClick}
          />
        </div>

        {/* Right side - 3D Scene */}
        <div className="flex-1 h-[50vh] lg:h-[70vh] w-full max-w-2xl">
          <div className="glass-card-dark rounded-3xl h-full w-full overflow-hidden p-2">
            <div className="h-full w-full rounded-2xl overflow-hidden">
              <Scene
                cameraPosition={currentStepData.camera}
                targetRotation={currentStepData.rotation}
                lightIntensity={currentStepData.light.intensity}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation pill */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <NavigationPill
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrev={() => goToStep(currentStep - 1)}
          onNext={() => goToStep(currentStep + 1)}
          onDotClick={goToStep}
        />
      </div>

      {/* Skip to dashboard link */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="glass"
          onClick={() => navigate('/dashboard')}
          className="group"
        >
          Enter Dashboard
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-heading font-bold text-white">GymFlow</span>
      </div>

      {/* Feature indicators (visible on last step) */}
      {currentStep === steps.length - 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
          <div className="flex gap-4 opacity-0 animate-fade-in animation-delay-500">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="glass-card-dark rounded-xl p-4 text-center min-w-[120px]"
              >
                <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium text-white/80">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
