import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  bgColor = 'bg-blue-100' 
}) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <p className="text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};


interface ActivityCardProps {
  title: string;
  content: string;
  bgColor?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ 
  title, 
  content, 
  bgColor = 'bg-indigo-100' 
}) => {
  return (
    <div className={`mt-6 ${bgColor} p-4 rounded-lg`}>
      <p className="text-gray-600">{title}</p>
      <p className="text-sm text-gray-800">{content}</p>
    </div>
  );
};


interface AttendanceData {
  currentTime: string;
  shift: string;
  checkInTime: string;
}

interface AttendanceCardProps {
  title: string;
  subtitle: string;
  attendance: AttendanceData;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ 
  title, 
  subtitle, 
  attendance 
}) => {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg flex justify-between items-center">
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-sm text-gray-800">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-indigo-600">{attendance.currentTime}</p>
        <p className="text-sm text-gray-600">{attendance.shift}</p>
        <p className="text-sm text-green-600">{attendance.checkInTime}</p>
      </div>
    </div>
  );
};




interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description 
}) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 text-center hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="text-6xl text-blue-600 mx-auto mb-6 flex justify-center">
        {icon}
      </div>
      <h4 className="text-2xl font-semibold text-gray-900">{title}</h4>
      <p className="mt-4 text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

