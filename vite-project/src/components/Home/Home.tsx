import React from "react";
import { FaCreditCard, FaChartBar, FaUsers } from "react-icons/fa";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Inline Custom CSS */}
      <style>
        {`
          .hero-text {
            animation: fadeIn 1s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hero-gradient {
            background: linear-gradient(90deg, #FF70A6, #4B5EAA);
            min-height: 100vh;
          }
          .custom-button {
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          .custom-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.3s ease;
            z-index: -1;
          }
          .custom-button:hover::before {
            left: 100%;
          }
          .dashboard-preview {
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            background: white;
            margin-top: -10rem;
            z-index: 10;
            position: relative;
          }
        `}
      </style>

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-pink-500 to-blue-600 text-white px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SMEazy</h1>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-gray-200 transition-colors duration-200">Features</a>
            <a href="#pricing" className="hover:text-gray-200 transition-colors duration-200">Pricing</a>
            <a href="#contact" className="hover:text-gray-200 transition-colors duration-200">Contact</a>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-200" aria-label="Sign in to your account">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient text-center py-20 px-6 flex items-center justify-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-extrabold text-white hero-text tracking-tight">
            Supercharge Your Business Billing
          </h2>
          <p className="mt-6 text-xl md:text-2xl text-white max-w-2xl mx-auto">
            Optimize payments, invoices, and analytics with our powerful billing tools. Unlock more with seamless integrations.
          </p>
          <div className="mt-10 space-x-6">
            <button
              className="px-8 py-3 rounded-full bg-white text-blue-600 custom-button hover:bg-gray-100 transition-all duration-300"
              aria-label="Get started with SMEazy"
            >
              Get Started
            </button>
            <button
              className="px-8 py-3 rounded-full bg-transparent border border-white text-white custom-button hover:bg-white hover:text-blue-600 transition-all duration-300"
              aria-label="View demo of SMEazy"
            >
              Demo
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="dashboard-preview p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Overview</h3>
            <div className="ml-auto flex space-x-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">+ Add New</button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600">👤</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-pink-100 p-4 rounded-lg">
              <p className="text-gray-600">Invoices</p>
              <p className="text-2xl font-bold text-gray-800">101</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <p className="text-gray-600">Payments</p>
              <p className="text-2xl font-bold text-gray-800">20</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-gray-600">New Clients</p>
              <p className="text-2xl font-bold text-gray-800">9</p>
            </div>
          </div>
          <div className="mt-6 bg-indigo-100 p-4 rounded-lg">
            <p className="text-gray-600">Latest Activity</p>
            <p className="text-sm text-gray-800">Payment Processed - Admin, Jun 15, 2023</p>
          </div>
          <div className="mt-6 bg-gray-100 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-gray-600">Attendance Self Service</p>
              <p className="text-sm text-gray-800">This Month</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">10:50 AM</p>
              <p className="text-sm text-gray-600">General Shift: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-green-600">Check-in Time: 8:40 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto bg-gray-50">
        <h3 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Why Choose Us
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <FaCreditCard className="text-6xl text-blue-600 mx-auto mb-6" />
            <h4 className="text-2xl font-semibold text-gray-900">Seamless Payments</h4>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Integrate mobile money, cards, and bank transfers with real-time tracking.
            </p>
          </div>
          <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <FaChartBar className="text-6xl text-blue-600 mx-auto mb-6" />
            <h4 className="text-2xl font-semibold text-gray-900">Powerful Analytics</h4>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Gain actionable insights with detailed reports to grow your business.
            </p>
          </div>
          <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <FaUsers className="text-6xl text-blue-600 mx-auto mb-6" />
            <h4 className="text-2xl font-semibold text-gray-900">Customer Management</h4>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Engage customers with personalized billing and payment experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 text-center border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          © 2025 SMEazy. All rights reserved.
        </p>
        <div className="mt-4 space-x-6 text-gray-600">
          <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;