import React from "react";
import { Outlet } from "react-router-dom";
import PatientList from "../components/Patients/patient_list";
import PatientMessage from "../components/Patients/patient_message";
import Demographics from "../components/Patients/demographics";
import DisordersTrends from "../components/Patients/disorders_trends";
import KPI from "../components/Patients/kpi";
import Reports from "../components/Patients/reports";
import Followup from "../components/Patients/followup";

const Patients = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Patient List - 1/5 of the screen width */}
      <div className="w-1/5  h-full">
        <PatientList />
      </div>

      {/* Right Side - 4/5 of the screen width */}
      <div className="w-4/5 flex flex-col h-full">
        {/* Top Section - Divided into two parts */}
        <div className="flex h-1/2">
          {/* Demographics - Smaller section */}
          <div className="w-1/4   h-full">
            <Demographics />
          </div>

          {/* Larger section */}
          <div className="w-3/4 flex flex-col  h-full">
            {/* Top half of this section */}
            <div className="h-1/2 ">
              <KPI />
            </div>

            {/* Bottom half of this section */}
            <div className="h-1/2 flex">
              {/* Disorders Trends */}
              <div className="w-2/3 ">
                <DisordersTrends />
              </div>

              {/* Patient Message */}
              <div className="w-1/3">
                <PatientMessage />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex h-1/2">
          {/* Reports - 3/4 width */}
          <div className="w-3/4  h-full">
            <Reports />
          </div>

          {/* Followup - 1/4 width */}
          <div className="w-1/4 h-full">
            <Followup />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
