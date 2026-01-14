import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

interface StepCardProps {
  tag: string;
  title: string;
  description: string;
  cta: string;
  isActive: boolean;
  onCtaClick?: () => void;
}

export function StepCard({ tag, title, description, cta, isActive, onCtaClick }: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !contentRef.current) return;

    if (isActive) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
      );
    }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      className={`glass-card-dark rounded-2xl p-8 max-w-md transition-all duration-500 ${
        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}
    >
      <div ref={contentRef} className="space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary">
          {tag}
        </span>
        
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
          {title}
        </h2>
        
        <p className="text-lg text-white/70 leading-relaxed">
          {description}
        </p>
        
        <Button
          variant="hero"
          size="lg"
          className="group"
          onClick={onCtaClick}
        >
          {cta}
          <svg
            className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
