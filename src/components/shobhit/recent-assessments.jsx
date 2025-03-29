import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-react';
import mockData from '../../../data/doc.json';

const AssessmentCard = ({ assessment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getSeverityColor = (percentage) => {
    if (percentage < 30) return 'bg-green-100 text-green-600';
    if (percentage < 60) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };

  return (
    <div className="bg-white border rounded-lg mb-4 shadow-sm hover:shadow-md transition-all">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4 w-full">
          <User size={20} className="text-blue-500" />
          <div className="flex-grow">
            <div className="font-semibold text-gray-800">
              {assessment.name}
            </div>
            <div className="text-xs text-gray-500">
              {assessment.assignedPatient}
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded text-xs ${getSeverityColor(assessment.completionPercentage)}`}>
            {assessment.completionPercentage}%
          </div>
          
          <div className="text-xs text-gray-500">
            {new Date(assessment.dateOfCompletion).toLocaleDateString()}
          </div>
          
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <FileText size={16} className="mr-2 text-blue-500" />
                Assessment Details
              </h3>
              <div className="text-xs space-y-1">
                <p><strong>Category:</strong> {assessment.category}</p>
                <p><strong>Date of Appointment:</strong> {assessment.dateOfAppointment}</p>
                <p><strong>Therapist:</strong> {assessment.therapist}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <AlertTriangle size={16} className="mr-2 text-yellow-500" />
                Recommendations
              </h3>
              <ul className="text-xs space-y-1 list-disc pl-4">
                {assessment.recommendedInterventions.map((intervention, index) => (
                  <li key={index}>{intervention}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-xs">
              <CheckCircle size={16} className="mr-2 text-green-500" />
              <span>Risk Level: {assessment.riskLevel}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RecentAssessments = () => {
  const { recentAssessments } = mockData;

  return (
    <div className="bg-white rounded-lg shadow-sm h-[320px] ">
      <div className="flex items-center pb-2 ">
        <FileText size={24} className="mr-2 text-blue-500 " />
        <h2 className="text-xl font-semibold text-gray-800 ">Recent Assessments</h2>
      </div>

      <div className="h-[314px] overflow-y-auto border-y">
        {recentAssessments.map((assessment, index) => (
          <AssessmentCard 
            key={assessment.assessmentId || index} 
            assessment={assessment} 
          />
        ))}
      </div>
    </div>
  );
};

export default RecentAssessments;