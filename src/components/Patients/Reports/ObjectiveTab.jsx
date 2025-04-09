import React from 'react';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';

const ObjectiveTab = ({ patient, openSections, toggleSection }) => {
    // Update to correctly access objective data within the SOAP object
    if (!patient?.soap?.objective) return (
        <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No objective data available</p>
        </div>
    );

    // Store the objective data in a variable for easier access
    const objectiveData = patient.soap.objective;

    // Helper function to render nested objects
    const renderNestedObject = (obj, indent = 0) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        return (
            <div className={`${indent > 0 ? 'ml-4 mt-2' : ''}`}>
                {Object.entries(obj).map(([nestedKey, nestedValue]) => (
                    <div key={nestedKey} className="mb-2">
                        <span className="font-medium text-green-700">
                            {nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1).replace(/([A-Z])/g, ' $1')}:
                        </span>{' '}
                        {typeof nestedValue === 'object' && nestedValue !== null 
                            ? renderNestedObject(nestedValue, indent + 1) 
                            : <span className="text-gray-800">{nestedValue}</span>}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Mental Status Exam Section */}
            {objectiveData.mentalStatusExam && (
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('objective_mentalStatus')}
                    >
                        {openSections['objective_mentalStatus'] ?
                            <ChevronDown size={16} className="text-green-500" /> :
                            <ChevronRight size={16} className="text-green-500" />
                        }
                        <h3 className="font-semibold text-gray-800 ml-2">
                            Mental Status Exam
                        </h3>
                    </div>

                    {openSections['objective_mentalStatus'] && (
                        <div className="mt-4 space-y-3">
                            {typeof objectiveData.mentalStatusExam === 'object' ? (
                                Object.entries(objectiveData.mentalStatusExam).map(([key, value]) => (
                                    <div key={key} className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                        <strong className="text-green-700">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong>&nbsp;
                                        <span className="text-gray-800">
                                            {typeof value === 'object' && value !== null 
                                                ? renderNestedObject(value) 
                                                : value}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                    {objectiveData.mentalStatusExam}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Patient Assessment Tools Section */}
            {objectiveData.patientAssessmentTools && (
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('objective_assessmentTools')}
                    >
                        {openSections['objective_assessmentTools'] ?
                            <ChevronDown size={16} className="text-green-500" /> :
                            <ChevronRight size={16} className="text-green-500" />
                        }
                        <h3 className="font-semibold text-gray-800 ml-2">
                            Assessment Tools
                        </h3>
                    </div>

                    {openSections['objective_assessmentTools'] && (
                        <div className="mt-4 space-y-3">
                            {Array.isArray(objectiveData.patientAssessmentTools) ? (
                                objectiveData.patientAssessmentTools.map((tool, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                        <div className="mb-2">
                                            <span className="font-semibold text-green-700">{tool.name}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-medium">Date:</span> {tool.date}
                                        </div>
                                        {tool.score && (
                                            <div className="mb-2">
                                                <span className="font-medium">Score:</span> {tool.score}
                                            </div>
                                        )}
                                        {tool.result && (
                                            <div className="mb-2">
                                                <span className="font-medium">Result:</span> {tool.result}
                                            </div>
                                        )}
                                        {tool.interpretation && (
                                            <div className="mb-2">
                                                <span className="font-medium">Interpretation:</span> {tool.interpretation}
                                            </div>
                                        )}
                                        {tool.responseDetails && (
                                            <div>
                                                <span className="font-medium">Response Details:</span>
                                                <div className="pl-4 mt-1 grid grid-cols-2 gap-2">
                                                    {Object.entries(tool.responseDetails).map(([key, value]) => (
                                                        <div key={key}>
                                                            <span className="italic">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</span> {value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                    <p>Assessment tools data structure is not in expected format.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Vitals Section */}
            {objectiveData.vitalSigns && (
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('objective_vitals')}
                    >
                        {openSections['objective_vitals'] ?
                            <ChevronDown size={16} className="text-green-500" /> :
                            <ChevronRight size={16} className="text-green-500" />
                        }
                        <h3 className="font-semibold text-gray-800 ml-2">
                            Vital Signs
                        </h3>
                        <Activity size={16} className="ml-2 text-green-500" />
                    </div>

                    {openSections['objective_vitals'] && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(objectiveData.vitalSigns).map(([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                        <span className="text-sm text-green-700 font-medium">
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </span>
                                        <span className="text-lg font-semibold">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Lab Reports Section */}
            {objectiveData.labReports && (
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('objective_labs')}
                    >
                        {openSections['objective_labs'] ?
                            <ChevronDown size={16} className="text-green-500" /> :
                            <ChevronRight size={16} className="text-green-500" />
                        }
                        <h3 className="font-semibold text-gray-800 ml-2">
                            Laboratory Reports
                        </h3>
                    </div>

                    {openSections['objective_labs'] && (
                        <div className="mt-4 space-y-3">
                            {Array.isArray(objectiveData.labReports) ? (
                                objectiveData.labReports.map((report, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                        <div className="mb-2">
                                            <span className="font-semibold">Test Date:</span> {report.date}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Test Type:</span> {report.testType}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold">Results:</span>
                                        </div>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-green-100 text-green-800">
                                                    <th className="p-2 text-left">Parameter</th>
                                                    <th className="p-2 text-left">Value</th>
                                                    <th className="p-2 text-left">Reference Range</th>
                                                    <th className="p-2 text-left">Flag</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {report.results.map((result, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200">
                                                        <td className="p-2">{result.parameter}</td>
                                                        <td className="p-2">{result.value}</td>
                                                        <td className="p-2">{result.referenceRange}</td>
                                                        <td className={`p-2 ${result.flag === 'high' ? 'text-red-600' : result.flag === 'low' ? 'text-amber-600' : 'text-green-600'}`}>
                                                            {result.flag}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                    <p>Lab report data structure is not in expected format.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Physical Examination */}
            {objectiveData.physicalExamination && (
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('objective_physical')}
                    >
                        {openSections['objective_physical'] ?
                            <ChevronDown size={16} className="text-green-500" /> :
                            <ChevronRight size={16} className="text-green-500" />
                        }
                        <h3 className="font-semibold text-gray-800 ml-2">
                            Physical Examination
                        </h3>
                    </div>

                    {openSections['objective_physical'] && (
                        <div className="mt-4 space-y-3">
                            {typeof objectiveData.physicalExamination === 'object' ? (
                                Object.entries(objectiveData.physicalExamination).map(([key, value]) => (
                                    <div key={key} className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                        <strong className="text-green-700">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong>&nbsp;
                                        <span className="text-gray-800">
                                            {typeof value === 'object' && value !== null 
                                                ? renderNestedObject(value) 
                                                : value}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-400">
                                    {objectiveData.physicalExamination}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ObjectiveTab;