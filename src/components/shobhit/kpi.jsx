import React from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  Stethoscope, 
  TrendingUp 
} from 'lucide-react';
import mockData from '../../../data/doc.json';

const KPICard = ({ title, icon: Icon, color, value, subtext }) => {
  return (
    <div className={`flex-shrink-0 w-full max-w-[225px] h-full bg-white border rounded-lg p-4 text-xs shadow-sm hover:shadow-md transition-all`}>
      <div className={`flex items-baseline mb-2 text-${color}-600 font-bold`}>
        <Icon size={16} className="mr-2" />
        {title}
      </div>
      <div className="text-center">
        <div className={`text-3xl font-extrabold text-${color}-700 mb-1`}>
          {value}
        </div>
        <div className="text-sm text-gray-600">
          {subtext}
        </div>
      </div>
    </div>
  );
};

const KPIs = () => {
  const { kpis } = mockData;

  const kpiConfigs = [
    {
      title: "Total Patients",
      icon: Users,
      color: "blue",
      value: kpis.totalPatients,
      subtext: "Registered Patients"
    },
    {
      title: "Total Assessments",
      icon: FileText,
      color: "green",
      value: kpis.totalAssessments,
      subtext: "Completed Evaluations"
    },
    {
      title: "Appointments",
      icon: Calendar,
      color: "purple",
      value: kpis.totalAppointments,
      subtext: "Scheduled This Month"
    },
    {
      title: "Active Therapists",
      icon: Stethoscope,
      color: "red",
      value: kpis.activeTherapists,
      subtext: "Providing Care"
    },
    {
      title: "Completed Treatments",
      icon: TrendingUp,
      color: "indigo",
      value: kpis.completedTreatments,
      subtext: "Success Stories"
    }
  ];

  return (
    <div className="bg-white rounded-lg">
      <div className="flex space-x-4 overflow-x-auto">
        {kpiConfigs.map((config, index) => (
          <KPICard 
            key={index}
            title={config.title}
            icon={config.icon}
            color={config.color}
            value={config.value}
            subtext={config.subtext}
          />
        ))}
      </div>
    </div>
  );
};

export default KPIs;