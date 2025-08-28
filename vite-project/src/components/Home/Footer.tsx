import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
        © {new Date().getFullYear()} SMEazy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
