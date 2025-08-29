import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard"; // Ensure this path is correct
import RegistrationForm from "./components/Registration/Registration";



const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-full">

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;