import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard"; // Ensure this path is correct

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-full">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-pink-500 to-blue-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">SMEazy</h1>
            <div className="space-x-6">
              <Link to="/" className="hover:text-gray-200 transition-colors duration-200">Home</Link>
              <Link to="/dashboard" className="hover:text-gray-200 transition-colors duration-200">Dashboard</Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;