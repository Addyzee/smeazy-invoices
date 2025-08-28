

// components/Navigation/Navbar.tsx
import React from 'react';
import { Button } from '../UI/Button';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  brand: string;
  navItems?: NavItem[];
  onSignIn?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  brand, 
  navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' }
  ],
  onSignIn
}) => {
  return (
    <nav className="bg-gradient-to-r from-pink-500 to-blue-600 text-white px-6 py-4 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">{brand}</h1>
        <div className="hidden md:flex w-1/2 justify-center">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="hover:text-gray-200 transition-colors duration-200 w-20"
            >
              {item.label}
            </a>
          ))}
        </div>
        <Button 
          variant="primary"
          size="sm"
          onClick={onSignIn}
          ariaLabel="Sign in to your account"
        >
          Sign In
        </Button>
      </div>
    </nav>
  );
};