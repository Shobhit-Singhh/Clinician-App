import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SubjectiveTab = ({ patient, openSections, toggleSection }) => {
    // Update to correctly access subjective data within the SOAP object
    if (!patient?.soap?.subjective) return (
        <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No subjective data available</p>
        </div>
    );

    // Store the subjective data in a variable for easier access
    const subjectiveData = patient.soap.subjective;

    const formatValue = (value) => {
        if (value === null || value === undefined) return "None";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === "object") return null; // We'll handle objects separately
        return value.toString();
    };

    const renderNestedObject = (obj, indent = 0) => {
        if (!obj || typeof obj !== "object") return null;
        
        return (
            <div className={`ml-${indent}`}>
                {Object.entries(obj).map(([key, value]) => {
                    // Skip rendering if value is null or undefined
                    if (value === null || value === undefined) return null;
                    
                    // Format the key for display
                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                    
                    // If value is an object but not an array, render it recursively
                    if (typeof value === "object" && !Array.isArray(value)) {
                        return (
                            <div key={key} className="mt-2">
                                <strong className="text-blue-700">{formattedKey}:</strong>
                                {renderNestedObject(value, indent + 4)}
                            </div>
                        );
                    }
                    
                    // If value is an array of objects
                    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
                        return (
                            <div key={key} className="mt-2">
                                <strong className="text-blue-700">{formattedKey}:</strong>
                                <div className="ml-4">
                                    {value.map((item, idx) => (
                                        <div key={idx} className="mt-2 p-2 bg-gray-50 rounded">
                                            {renderNestedObject(item, 0)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    
                    // For simple values
                    const displayValue = formatValue(value);
                    if (displayValue !== null) {
                        return (
                            <div key={key} className="mt-1">
                                <strong className="text-blue-700">{formattedKey}:</strong>{" "}
                                <span className="text-gray-800">{displayValue}</span>
                            </div>
                        );
                    }
                    
                    return null;
                })}
            </div>
        );
    };

    // Main sections in the subjective data
    const sections = [
        { key: 'chiefComplaint', title: 'Chief Complaint' },
        { key: 'historyOfPresentIllness', title: 'History of Present Illness' },
        { key: 'psychiatricHistory', title: 'Psychiatric History' },
        { key: 'medicalHistory', title: 'Medical History' },
        { key: 'familyHistory', title: 'Family History' },
        { key: 'socialHistory', title: 'Social History' },
        { key: 'lifestyleFactors', title: 'Lifestyle Factors' },
        { key: 'patientReportedSymptoms', title: 'Patient Reported Symptoms' }
    ];

    return (
        <div className="space-y-4">
            {/* Display each main section */}
            {sections.filter(section => 
                section.key !== 'chiefComplaint' && // Skip Chief Complaint as we already displayed it
                subjectiveData[section.key]
            ).map(section => (
                <div
                    key={section.key}
                    className="border rounded-lg p-4 shadow-sm bg-white"
                >
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection(`subjective_${section.key}`)}
                    >
                        {openSections[`subjective_${section.key}`] ?
                            <ChevronDown size={16} className="text-blue-500" /> :
                            <ChevronRight size={16} className="text-blue-500" />
                        }
                        <h3 className="font-semibold text-gray-800 ml-2">
                            {section.title}
                        </h3>
                    </div>

                    {openSections[`subjective_${section.key}`] && (
                        <div className="mt-4 space-y-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                            {typeof subjectiveData[section.key] === 'string' ? (
                                <p>{subjectiveData[section.key]}</p>
                            ) : (
                                renderNestedObject(subjectiveData[section.key])
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SubjectiveTab;