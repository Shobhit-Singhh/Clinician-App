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
  // State to track the selected patient ID
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Function to handle patient selection
  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
  };

  return (
    <div className="flex h-[calc(90vh+15px)] overflow-hidden">
      {/* Patient List - 1/5 of the screen width */}
      <div className="w-1/5 h-full">
        <PatientList onPatientSelect={handlePatientSelect} />
      </div>

      {/* Right Side - 4/5 of the screen width */}
      <div className="w-4/5 flex flex-col h-full">
        {/* Top Section - Divided into two parts */}
        <div className="flex h-1/2">
          {/* Demographics - Smaller section */}
          <div className="w-1/4 h-full">
            <Demographics patientId={selectedPatientId} />
          </div>

          {/* Larger section */}
          <div className="w-3/4 flex flex-col h-full">
            {/* Top half of this section */}
            <div className="h-2/5">
              <KPI patientId={selectedPatientId} />
            </div>

            {/* Bottom half of this section */}
            <div className="h-3/5 flex">
              {/* Disorders Trends */}
              <div className="w-2/3">
                <DisordersTrends patientId={selectedPatientId} />
              </div>

              {/* Patient Message */}
              <div className="w-1/3">
                <PatientMessage patientId={selectedPatientId} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex h-1/2">
          {/* Reports - 3/4 width */}
          <div className="w-3/4 h-full">
            <Reports patientId={selectedPatientId} />
          </div>

          {/* Followup - 1/4 width */}
          <div className="w-1/4 h-full">
            <Followup patientId={selectedPatientId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;