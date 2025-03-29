import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Phone,
  Stethoscope
} from 'lucide-react';
import mockData from '../../../data/doc.json';

const SeverityBadge = ({ level }) => {
  const severityStyles = {
    'High': 'bg-red-100 text-red-600',
    'Medium': 'bg-yellow-100 text-yellow-600',
    'Low': 'bg-green-100 text-green-600'
  };

  return (
    <div className={`px-2 py-1 rounded text-xs font-semibold ${severityStyles[level] || 'bg-gray-100 text-gray-600'}`}>
      {level} Risk
    </div>
  );
};

const HighRiskAlertCard = ({ alert, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border rounded-lg mb-4 shadow-sm hover:shadow-md transition-all">
      <div
        className="p-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4 w-full">
          <AlertTriangle size={20} className="text-red-500" />
          <div className="flex-grow">
            <div className="font-semibold text-gray-800">
              {alert.patientName}
            </div>
            <div className="text-xs text-gray-500">
              {alert.riskCategory}
            </div>
          </div>

          <SeverityBadge level={alert.severityLevel} />

          <div className="text-xs text-gray-500">
            {new Date(alert.dateIdentified).toLocaleDateString()}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(alert.alertId);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>

          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <FileText size={16} className="mr-2 text-blue-500" />
                Last Assessment
              </h3>
              <div className="text-xs space-y-1">
                <p><strong>Type:</strong> {alert.lastAssessment.assessmentType}</p>
                <p><strong>Score:</strong> {alert.lastAssessment.score}</p>
                <p><strong>Interpretation:</strong> {alert.lastAssessment.interpretation}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <Stethoscope size={16} className="mr-2 text-green-500" />
                Diagnosis
              </h3>
              <div className="text-xs space-y-1">
                <p><strong>Primary Condition:</strong> {alert.diagnosis.primaryCondition}</p>
                <p className="text-red-600 font-semibold">
                  {alert.diagnosis.detailedObservation}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <Phone size={16} className="mr-2 text-purple-500" />
              Recommendations
            </h3>
            <div className="text-xs space-y-2">
              <div><strong>Immediate Action:</strong> {alert.recommendations.immediateAction}</div>
              <div><strong>Therapy Referral:</strong> {alert.recommendations.therapyReferral}</div>
              <div><strong>Medication Review:</strong> {alert.recommendations.medicationReview}</div>

              <div className="mt-2">
                <strong>Support Resources:</strong>
                <ul className="list-disc pl-4 mt-1">
                  {alert.recommendations.supportResources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HighRiskAlerts = () => {
  const [alerts, setAlerts] = useState(mockData.highRiskAlerts);

  const handleDismissAlert = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.filter(alert => alert.alertId !== alertId)
    );
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center pb-2">
        <AlertTriangle size={24} className="mr-2 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-800">High-Risk Alerts</h2>
        <div className="ml-auto text-xs text-gray-500">
          Total Alerts: {alerts.length}
        </div>
      </div>

      <div className="h-[315px] overflow-y-auto border-y">
        {alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No high-risk alerts at the moment
          </div>
        ) : (
          alerts.map((alert) => (
            <HighRiskAlertCard
              key={alert.alertId}
              alert={alert}
              onDismiss={handleDismissAlert}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HighRiskAlerts;