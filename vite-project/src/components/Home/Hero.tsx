import React from "react";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Smart Billing for SMEs
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Simplify your payments, invoices, and customer management in one place.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
            Start Free Trial
          </button>
        </motion.div>

        <motion.div
          className="flex-1 mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/illustrations/dashboard.svg"
            alt="Dashboard Preview"
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
