// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// Declare NavItem interface
interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  brand: string;
  isLoggedIn: boolean;
  onSignIn: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  brand, 
  isLoggedIn,
  onSignIn,
  onLogout
}) => {
  console.log('Navbar rendered, isLoggedIn:', isLoggedIn); // Debug log

  const navItems = isLoggedIn 
    ? [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' }
      ]
    : [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Contact', href: '#contact' }
      ];

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-blue-600 text-white px-6 py-4 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{brand}</h1>
        <div className="hidden md:flex space-x-8">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="hover:text-gray-200 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <button 
              style={{ backgroundColor: '#d1d5db', color: '#374151', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
              onClick={() => {
                console.log('Logout clicked, calling onLogout');
                onLogout();
              }}
              aria-label="Logout from your account"
            >
              Logout
            </button>
          ) : (
            <>
              <button 
                style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
                onClick={() => {
                  console.log('Sign In clicked, calling onSignIn');
                  onSignIn();
                }}
                aria-label="Sign in to your account"
              >
                Sign In
              </button>
              <Link to="/register">
                <button 
                  style={{ backgroundColor: '#d1d5db', color: '#374151', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}
                  aria-label="Register a new account"
                >
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};