// components/Footer/Footer.tsx
import React from 'react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  companyName: string;
  year: number;
  links?: FooterLink[];
}

export const Footer: React.FC<FooterProps> = ({ 
  companyName, 
  year, 
  links = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' }
  ]
}) => {
  return (
    <footer className="py-8 text-center border-t">
      <p className="text-white-500 text-sm">
        © {year} {companyName}. All rights reserved.
      </p>
      <div className="mt-4 space-x-6 text-white-600">
        {links.map((link, index) => (
          <a 
            key={index}
            href={link.href} 
            className="hover:text-blue-600 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};