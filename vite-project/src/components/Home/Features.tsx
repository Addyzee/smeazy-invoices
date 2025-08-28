import React from "react";
import { CreditCard, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: <CreditCard className="h-10 w-10 text-blue-600" />,
    title: "Seamless Payments",
    description: "Integrate multiple payment options with real-time tracking."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-purple-600" />,
    title: "Powerful Analytics",
    description: "Understand your business with actionable insights and reports."
  },
  {
    icon: <Users className="h-10 w-10 text-green-600" />,
    title: "Customer Management",
    description: "Keep your customers engaged with personalized experiences."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Why Choose Us</h2>
        <p className="mt-4 text-gray-600">
          Everything you need to manage and grow your business efficiently.
        </p>

        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition"
            >
              {feature.icon}
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
