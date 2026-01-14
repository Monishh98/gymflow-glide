import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationPillProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

export function NavigationPill({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onDotClick,
}: NavigationPillProps) {
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="glass-card-dark rounded-full px-6 py-3 flex items-center gap-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
        aria-label="Previous step"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'bg-primary w-6'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>

      <span className="text-sm font-medium text-white/70 min-w-[80px] text-center font-heading">
        Progress <span className="text-white">{progress}%</span>
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
        aria-label="Next step"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
