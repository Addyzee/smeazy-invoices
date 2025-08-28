// components/Features/FeaturesSection.tsx
import React from 'react';
import { FeatureCard } from './Cards';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title?: string;
  features: Feature[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ 
  title = "Why Choose Us", 
  features 
}) => {
  return (
    <section id="features" className="py-20 px-6 max-w-7xl mx-auto bg-gray-50">
      <h3 className="text-4xl font-bold text-center text-gray-900 mb-16">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

