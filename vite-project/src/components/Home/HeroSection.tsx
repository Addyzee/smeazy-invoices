// HeroSection.tsx
import React from 'react';
import { Button } from '../UI/Button';

interface HeroProps {
  title: string;
  subtitle: string;
  onGetStarted?: () => void;
  onViewDemo?: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
  onGetStarted, 
  onViewDemo 
}) => {
  return (
    <section className="text-center py-20 px-6 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-6 text-xl md:text-2xl text-white max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-10 space-x-6">
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            ariaLabel="Get started with SMEazy"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onViewDemo}
            ariaLabel="View demo of SMEazy"
          >
            Demo
          </Button>
        </div>
      </div>
    </section>
  );
};