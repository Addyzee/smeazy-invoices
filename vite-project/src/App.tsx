// App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import { Navbar } from "./components/Navbar"; // Import the Navbar component

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state at app level

  // Check initial login status from localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('App initial login check, isLoggedIn:', loggedIn); // Debug log
    setIsLoggedIn(loggedIn);
  }, []);

  const handleSignIn = () => {
    console.log('App handleSignIn triggered, setting isLoggedIn to true');
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('App handleLogout triggered, setting isLoggedIn to false');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen w-full bg-gradient-to-r from-pink-500 to-blue-600">
        <Navbar 
          brand="SMEazy"
          isLoggedIn={isLoggedIn}
          onSignIn={handleSignIn}
          onLogout={handleLogout}
        />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;