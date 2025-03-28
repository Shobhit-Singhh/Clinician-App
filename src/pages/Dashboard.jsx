import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import KPI from "../components/Dashboard/kpi.jsx";
import RecentAssessments from "../components/Dashboard/recent-assessments.jsx";
import WeeklyCalendar from "../components/Dashboard/weekly-calendar.jsx";
import PatientMessageList from "../components/Dashboard/patient-message-list.jsx";
import HighRiskAlerts from "../components/Dashboard/high-risk-alerts.jsx";

const Dashboard = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
  };

  return (
    <div className="flex h-[calc(90vh+38px)] overflow-hidden bg-gray-100 p-4">
      {/* Main Content Area - 4/5 width */}
      <div className="w-4/5 flex flex-col h-full pr-4">
        {/* KPI - Top Section h-1/5 */}
        <div className="h-1/6 mb-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 h-full">
            <KPI patientId={selectedPatientId} />
          </div>
        </div>

        {/* Middle Section - Recent Assessments and Weekly Calendar h-3/5 */}
        <div className="h-2/5 flex gap-4 mb-4">
          {/* Recent Assessments - 1/2 width */}
          <div className="w-1/2 bg-white rounded-2xl shadow-lg p-4">
            <RecentAssessments patientId={selectedPatientId} />
          </div>

          {/* Weekly Calendar - 1/2 width */}
          <div className="w-1/2 bg-white rounded-2xl shadow-lg p-4">
            <WeeklyCalendar patientId={selectedPatientId} />
          </div>
        </div>

        {/* High-Risk Alerts - Bottom Section h-1/5 */}
        <div className="h-2/5">
          <div className="bg-white rounded-2xl shadow-lg p-4 h-full">
            <HighRiskAlerts patientId={selectedPatientId} />
          </div>
        </div>
      </div>

      {/* Patient Message List - Vertical Column on Right w-1/5 */}
      <div className="w-1/5 h-full bg-white rounded-2xl shadow-lg p-4">
        <PatientMessageList 
          onPatientSelect={handlePatientSelect} 
          selectedPatientId={selectedPatientId}
        />
      </div>
    </div>
  );
};

export default Dashboard;