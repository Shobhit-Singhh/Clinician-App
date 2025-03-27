import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import PatientList from "../components/Patients/patient_list";
import PatientMessage from "../components/Patients/patient_message";
import Demographics from "../components/Patients/demographics";
import DisordersTrends from "../components/Patients/disorders_trends";
import KPI from "../components/Patients/kpi";
import Reports from "../components/Patients/reports";
import Followup from "../components/Patients/followup";

const Patients = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
  };

  return (
    <div className="flex h-[calc(90vh+38px)] overflow-hidden bg-gray-100 p-4 gap-4">
      {/* Patient List - Sidebar */}
      <div className="w-1/5 h-full bg-white rounded-2xl shadow-lg p-4">
        <PatientList onPatientSelect={handlePatientSelect} />
      </div>

      {/* Right Side - Main Content */}
      <div className="w-4/5 flex flex-col h-full gap-4">
        {/* Top Section */}
        <div className="flex h-1/2 gap-4">
          {/* Demographics */}
          <div className="w-1/4 h-full bg-white rounded-2xl shadow-lg p-4">
            <Demographics patientId={selectedPatientId} />
          </div>

          {/* KPI & Disorders Trends */}
          <div className="w-3/4 flex flex-col h-full gap-4">
            {/* KPI */}
            <div className="h-2/5 bg-white rounded-2xl shadow-lg p-4">
              <KPI patientId={selectedPatientId} />
            </div>

            {/* Disorders Trends & Followup */}
            <div className="h-3/5 flex gap-4">
              <div className="w-2/3 bg-white rounded-2xl shadow-lg p-4">
                <DisordersTrends patientId={selectedPatientId} />
              </div>
              <div className="w-1/3 bg-white rounded-2xl shadow-lg p-4">
                <Followup patientId={selectedPatientId} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex h-1/2 gap-4">
          <div className="w-3/4 h-full bg-white rounded-2xl shadow-lg p-4">
            <Reports patientId={selectedPatientId} />
          </div>
          <div className="w-1/4 h-full bg-white rounded-2xl shadow-lg p-4">
            <PatientMessage patientId={selectedPatientId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
