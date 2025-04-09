import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Check, X, AlertTriangle, XCircle } from 'lucide-react';

const AssessmentTab = ({ patient, openSections, toggleSection }) => {
    // Add state for popup control
    const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);
    const [selectedAssessmentLog, setSelectedAssessmentLog] = useState(null);
    const [selectedDisorderIndex, setSelectedDisorderIndex] = useState(null);

    // Function to open popup with specific log
    const openAssessmentPopup = (disorderIndex, log) => {
        setSelectedAssessmentLog(log);
        setSelectedDisorderIndex(disorderIndex);
        setShowAssessmentPopup(true);
    };

    // Function to close popup
    const closeAssessmentPopup = () => {
        setShowAssessmentPopup(false);
        setSelectedAssessmentLog(null);
    };

    // Check if assessment data exists in the SOAP object
    const hasAssessmentData = patient?.soap?.assessment?.diagnoses?.length > 0;

    if (!hasAssessmentData) return (
        <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No assessment data available</p>
        </div>
    );

    const { diagnoses, formulation } = patient.soap.assessment;

    return (
        <div className="space-y-4">
            {/* Mental Health Disorders Section */}
            {diagnoses.map((disorder, index) => (
                <div
                    key={index}
                    className="border rounded-lg shadow-sm bg-white overflow-hidden"
                >
                    <div
                        className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50"
                        onClick={() => toggleSection(`assessment_disorder_${index}`)}
                    >
                        <div className="flex items-center space-x-2">
                            {openSections[`assessment_disorder_${index}`] ?
                                <ChevronDown size={16} className="text-purple-500" /> :
                                <ChevronRight size={16} className="text-purple-500" />
                            }
                            <h3 className="font-semibold text-gray-800">
                                {disorder.disorder}
                            </h3>
                            <span
                                className={`
                                    px-2 py-1 rounded-full text-xs 
                                    ${disorder.severityScore > 5
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                    }
                                `}
                            >
                                Severity: {disorder.severityScore}/10
                            </span>
                            {disorder.riskAssessment?.suicideRisk?.level === "Moderate" && (
                                <span className="flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                    <AlertTriangle size={12} className="mr-1" />
                                    Suicide Risk: {disorder.riskAssessment.suicideRisk.level}
                                </span>
                            )}
                        </div>
                    </div>

                    {openSections[`assessment_disorder_${index}`] && (
                        <div className="p-4 border-t border-gray-100">
                            {/* Basic Disorder Information */}
                            <div className="grid grid-cols-2 gap-4 mb-4 bg-purple-50 p-3 rounded-lg">
                                <div>
                                    <strong className="text-purple-700">DSM-5 Code:</strong>
                                    <span className="ml-2 text-gray-800">{disorder.dsm5Code}</span>
                                </div>
                                <div>
                                    <strong className="text-purple-700">Diagnostic Date:</strong>
                                    <span className="ml-2 text-gray-800">{disorder.diagnosticDate}</span>
                                </div>
                                <div>
                                    <strong className="text-purple-700">Diagnostic Method:</strong>
                                    <span className="ml-2 text-gray-800">{disorder.diagnosticMethod}</span>
                                </div>
                                <div>
                                    <strong className="text-purple-700">Clinician:</strong>
                                    <span className="ml-2 text-gray-800">{disorder.diagnosingClinician || "Not specified"}</span>
                                </div>
                                {disorder.specifiers && (
                                    <div className="col-span-2">
                                        <strong className="text-purple-700">Specifiers:</strong>
                                        <span className="ml-2 text-gray-800">{disorder.specifiers}</span>
                                    </div>
                                )}
                            </div>

                            {/* Diagnostic Criteria */}
                            {disorder.diagnosticCriteria && (
                                <div className="mt-4">
                                    <h3 className="text-md font-semibold text-purple-700 mb-2">Diagnostic Criteria</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        {disorder.diagnosticCriteria.symptomsPresent && (
                                            <div className="mb-3">
                                                <p className="font-medium text-gray-700 mb-1">Symptoms Present:</p>
                                                <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                                    {disorder.diagnosticCriteria.symptomsPresent.map((symptom, i) => (
                                                        <li key={i}>{symptom}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {disorder.diagnosticCriteria.duration && (
                                            <div className="mb-2">
                                                <p className="font-medium text-gray-700 mb-1">Duration:</p>
                                                <p className="text-sm text-gray-600 ml-2">{disorder.diagnosticCriteria.duration}</p>
                                            </div>
                                        )}
                                        {disorder.diagnosticCriteria.functionalImpairment && (
                                            <div>
                                                <p className="font-medium text-gray-700 mb-1">Functional Impairment:</p>
                                                <p className="text-sm text-gray-600 ml-2">{disorder.diagnosticCriteria.functionalImpairment}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Differential Diagnosis */}
                            {disorder.differentialDiagnosis && disorder.differentialDiagnosis.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-md font-semibold text-purple-700 mb-2">Differential Diagnosis</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <ul className="divide-y divide-gray-200">
                                            {disorder.differentialDiagnosis.map((diff, diffIndex) => (
                                                <li key={diffIndex} className="py-2">
                                                    <p className="font-medium text-gray-700">{diff.condition}</p>
                                                    <p className="text-sm text-gray-600">Reason for exclusion: {diff.reasonForExclusion}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Risk Assessment */}
                            {disorder.riskAssessment && (
                                <div className="mt-4">
                                    <h3 className="text-md font-semibold text-purple-700 mb-2">Risk Assessment</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        {disorder.riskAssessment.suicideRisk && (
                                            <div className="mb-3">
                                                <div className="flex items-center mb-1">
                                                    <p className="font-medium text-gray-700">Suicide Risk:</p>
                                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${disorder.riskAssessment.suicideRisk.level === "Moderate"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}>
                                                        {disorder.riskAssessment.suicideRisk.level}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Risk Factors:</p>
                                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                                            {disorder.riskAssessment.suicideRisk.riskFactors.map((factor, i) => (
                                                                <li key={i}>{factor}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Protective Factors:</p>
                                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                                            {disorder.riskAssessment.suicideRisk.protectiveFactors.map((factor, i) => (
                                                                <li key={i}>{factor}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {disorder.riskAssessment.dangerToOthers && (
                                            <div className="mb-2">
                                                <p className="font-medium text-gray-700">Danger to Others:</p>
                                                <p className="text-sm text-gray-600 ml-2">{disorder.riskAssessment.dangerToOthers}</p>
                                            </div>
                                        )}

                                        {disorder.riskAssessment.selfNeglect && (
                                            <div className="mb-2">
                                                <p className="font-medium text-gray-700">Self-Neglect:</p>
                                                <p className="text-sm text-gray-600 ml-2">{disorder.riskAssessment.selfNeglect}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Assessment History Preview (Just list items with clickable links) */}
                            {disorder.assessmentLog && disorder.assessmentLog.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-md font-semibold text-purple-700 mb-3">Assessment History</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <ul className="divide-y divide-gray-200">
                                            {disorder.assessmentLog.map((log, logIndex) => (
                                                <li key={logIndex} className="py-2">
                                                    <div 
                                                        className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                                                        onClick={() => openAssessmentPopup(index, log)}
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-700">
                                                                {new Date(log.date).toLocaleDateString()} - {log.assessmentMethod}
                                                            </p>
                                                            <p className="text-sm text-gray-600 truncate">{log.interpretation}</p>
                                                        </div>
                                                        <div className="ml-2 text-purple-500">
                                                            <ChevronRight size={16} />
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Clinical Formulation Section */}
            {formulation && (
                <div className="border rounded-lg shadow-sm bg-white overflow-hidden mt-6">
                    <div
                        className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50"
                        onClick={() => toggleSection('assessment_formulation')}
                    >
                        <div className="flex items-center space-x-2">
                            {openSections['assessment_formulation'] ?
                                <ChevronDown size={16} className="text-purple-500" /> :
                                <ChevronRight size={16} className="text-purple-500" />
                            }
                            <h3 className="font-semibold text-gray-800">Clinical Formulation</h3>
                        </div>
                    </div>

                    {openSections['assessment_formulation'] && (
                        <div className="p-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-purple-700 mb-2">Biological Factors</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {formulation.biologicalFactors.map((factor, i) => (
                                            <li key={i}>{factor}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-purple-700 mb-2">Psychological Factors</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {formulation.psychologicalFactors.map((factor, i) => (
                                            <li key={i}>{factor}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-purple-700 mb-2">Social Factors</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {formulation.socialFactors.map((factor, i) => (
                                            <li key={i}>{factor}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 bg-purple-50 p-3 rounded-lg">
                                <h4 className="font-medium text-purple-700 mb-2">Formation Hypothesis</h4>
                                <p className="text-sm text-gray-700">{formulation.formationHypothesis}</p>
                            </div>

                            <div className="mt-4 bg-green-50 p-3 rounded-lg">
                                <h4 className="font-medium text-green-700 mb-2">Treatment Implications</h4>
                                <p className="text-sm text-gray-700">{formulation.treatmentImplications}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Assessment History Popup */}
            {showAssessmentPopup && selectedAssessmentLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Popup Header */}
                        <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
                            <h3 className="font-semibold">
                                Assessment History - {diagnoses[selectedDisorderIndex]?.disorder}
                            </h3>
                            <button 
                                onClick={closeAssessmentPopup}
                                className="hover:bg-purple-700 p-1 rounded-full transition-all"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        
                        {/* Popup Content */}
                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="mb-4 bg-purple-50 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <div>
                                        <span className="font-medium">Date:</span> {new Date(selectedAssessmentLog.date).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span className="font-medium">Method:</span> {selectedAssessmentLog.assessmentMethod}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="font-medium">Interpretation:</span> {selectedAssessmentLog.interpretation}
                                </div>
                            </div>

                            {/* AI Assessment */}
                            {selectedAssessmentLog.aiAssessment && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-purple-700 mb-2">AI Assessment</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-700">{selectedAssessmentLog.aiAssessment}</p>
                                    </div>
                                </div>
                            )}

                            {/* Key Indicators */}
                            {selectedAssessmentLog.keyIndicators && selectedAssessmentLog.keyIndicators.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-purple-700 mb-2">Key Indicators</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAssessmentLog.keyIndicators.map((indicator, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                {indicator}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Conversation Log */}
                            <div className="mb-4">
                                <h4 className="font-medium text-purple-700 mb-2">Conversation Log</h4>
                                <div className="bg-gray-50 p-3 rounded-lg max-h-[400px] overflow-y-auto space-y-3">
                                    {selectedAssessmentLog.conversation.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === "AI" ? "justify-start" : "justify-end"}`}
                                        >
                                            <div
                                                className={`p-3 rounded-lg max-w-[80%] ${message.sender === "AI"
                                                        ? "bg-purple-100 text-purple-900"
                                                        : "bg-blue-100 text-blue-900"
                                                    }`}
                                            >
                                                {message.text}
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center">
                                    <Check size={16} className="mr-1" />
                                    Validate Assessment
                                </button>
                                <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center">
                                    <X size={16} className="mr-1" />
                                    Flag Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentTab;