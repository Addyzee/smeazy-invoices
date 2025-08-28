// DashboardPreview.tsx
import React from 'react';
import { Button } from '../UI/Button';
import { ActivityCard, AttendanceCard, StatCard } from './Cards';

interface DashboardData {
  invoices: number;
  payments: number;
  newClients: number;
  latestActivity: string;
  attendance: {
    currentTime: string;
    shift: string;
    checkInTime: string;
  };
}

interface DashboardPreviewProps {
  data: DashboardData;
  onAddNew?: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  data, 
  onAddNew 
}) => {
  return (
    <div className="max-w-6xl mx-auto px-6 mb-20 bg-white rounded-lg shadow-lg p-6 relative z-10">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 pr-4 border-r border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg">S</div>
            <span className="ml-2 text-lg font-semibold text-indigo-600">SMEazy</span>
          </div>
          <nav className="space-y-2 text-gray-600 text-sm">
            <a href="#" className="block hover:text-indigo-600">Overview</a>
            <a href="#" className="block hover:text-indigo-600">People</a>
            <a href="#" className="block hover:text-indigo-600">Leave</a>
            <a href="#" className="block hover:text-indigo-600">Attendance</a>
            <a href="#" className="block hover:text-indigo-600">Asset</a>
            <a href="#" className="block hover:text-indigo-600">Documents</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pl-6">
          <div className="flex items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Overview</h3>
            <div className="ml-auto flex items-center space-x-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={onAddNew}
              >
                + Add New
              </Button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">👤</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard title="Invoices" value={data.invoices} bgColor="bg-pink-100" />
            <StatCard title="Payments" value={data.payments} bgColor="bg-purple-100" />
            <StatCard title="New Clients" value={data.newClients} bgColor="bg-blue-100" />
          </div>
          
          <ActivityCard 
            title="Latest Activity" 
            content={data.latestActivity} 
          />
          
          <AttendanceCard
            title="Attendance Self Service"
            subtitle="This Month"
            attendance={data.attendance}
          />
        </main>
      </div>
    </div>
  );
};