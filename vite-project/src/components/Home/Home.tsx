// Home.tsx
import React from "react";
import { FaCreditCard, FaChartBar, FaUsers } from "react-icons/fa";
import { HeroSection } from "./HeroSection";
import { DashboardPreview } from "./DashboardPreview";
import { FeaturesSection } from "./FeaturesSection";
import { Footer } from "./Footer";

const Home: React.FC = () => {
  const dashboardData = {
    invoices: 101,
    payments: 20,
    newClients: 9,
    latestActivity: "Payment Processed - Admin, Jun 15, 2023",
    attendance: {
      currentTime: "10:50 AM",
      shift: "General Shift: 9:00 AM - 6:00 PM",
      checkInTime: "Check-in Time: 8:40 AM"
    }
  };

  const features = [
    { icon: <FaCreditCard />, title: "Seamless Payments", description: "Integrate mobile money, cards, and bank transfers with real-time tracking." },
    { icon: <FaChartBar />, title: "Powerful Analytics", description: "Gain actionable insights with detailed reports to grow your business." },
    { icon: <FaUsers />, title: "Customer Management", description: "Engage customers with personalized billing and payment experiences." }
  ];

  const handleGetStarted = () => {
    console.log("Get started clicked");
  };

  const handleViewDemo = () => {
    console.log("Demo clicked");
  };

  const handleAddNew = () => {
    console.log("Add new clicked");
  };

  return (
    <div className="relative z-10">
      <HeroSection
        title="Supercharge Your Business Billing"
        subtitle="Optimize payments, invoices, and analytics with our powerful billing tools. Unlock more with seamless integrations."
        onGetStarted={handleGetStarted}
        onViewDemo={handleViewDemo}
      />
      <DashboardPreview 
        data={dashboardData}
        onAddNew={handleAddNew}
      />
      <FeaturesSection 
        features={features}
      />
      <Footer 
        companyName="SMEazy"
        year={2025}
      />
    </div>
  );
};

export default Home;