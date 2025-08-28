// components/Dashboard/DashboardPreview.tsx
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
    <div className="max-w-6xl mx-auto px-6 mb-20">
      <div className="dashboard-preview p-6">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Overview</h3>
          <div className="ml-auto flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={onAddNew}
            >
              + Add New
            </Button>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600">👤</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
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
      </div>
    </div>
  );
};