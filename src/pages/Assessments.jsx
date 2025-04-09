import React, { useState } from "react";
import AssessmentList from "../components/Assessments/assessment-list";
import AssessmentDetails from "../components/Assessments/assessment-details";
import PatientList from "../components/Assessments/patient-list";
import Customization from "../components/Assessments/customization";

const Assessment = () => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [selectedPatientIds, setSelectedPatientIds] = useState([]);
  const [customAssessment, setCustomAssessment] = useState({
    id: 'custom-1',
    name: 'Custom DSM-5 Assessment',
    sections: []
  });

  const handleAssessmentSelect = (assessmentId) => {
    setSelectedAssessmentId(assessmentId);
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientIds(prevSelected => {
      if (prevSelected.includes(patientId)) {
        return prevSelected.filter(id => id !== patientId);
      } else {
        return [...prevSelected, patientId];
      }
    });
  };

  const handleAddSection = (section) => {
    setCustomAssessment(prevAssessment => ({
      ...prevAssessment,
      sections: [...prevAssessment.sections, section]
    }));
  };

  const handleRemoveSection = (sectionId) => {
    setCustomAssessment(prevAssessment => ({
      ...prevAssessment,
      sections: prevAssessment.sections.filter(section => section.id !== sectionId)
    }));
  };

  const handleReorderSections = (newSections) => {
    setCustomAssessment(prevAssessment => ({
      ...prevAssessment,
      sections: newSections
    }));
  };

  return (
    <div className="flex h-[calc(90vh+38px)] overflow-hidden bg-gray-100 p-4 gap-4">
      {/* Left Column - Assessment List */}
      <div className="w-1/4 h-full bg-white rounded-2xl shadow-lg p-4">
        <AssessmentList 
          onAssessmentSelect={handleAssessmentSelect}
          selectedAssessmentId={selectedAssessmentId}
        />
      </div>

      {/* Middle Column - Assessment Details and Customization */}
      <div className="w-2/4 flex flex-col h-full gap-4">
        {/* Assessment Details */}
        <div className="h-1/2 bg-white rounded-2xl shadow-lg p-4">
          <AssessmentDetails 
            assessmentId={selectedAssessmentId}
            onAddSection={handleAddSection}
          />
        </div>

        {/* Customization */}
        <div className="h-1/2 bg-white rounded-2xl shadow-lg p-4">
          <Customization 
            customAssessment={customAssessment}
            onRemoveSection={handleRemoveSection}
            onReorderSections={handleReorderSections}
          />
        </div>
      </div>

      {/* Right Column - Patient List */}
      <div className="w-1/4 h-full bg-white rounded-2xl shadow-lg p-4">
        <PatientList 
          selectedPatientIds={selectedPatientIds}
          onPatientSelect={handlePatientSelect}
          assessmentId={selectedAssessmentId || customAssessment.id}
        />
      </div>
    </div>
  );
};

export default Assessment;