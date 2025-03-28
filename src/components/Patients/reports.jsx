import React, { useState, useEffect } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Check,
    X,
    Pin,
    FileText,
    BookOpen,
    Paperclip
} from 'lucide-react';
import patientsData from '/data/patient.json';

const Reports = ({ patientId }) => {
    const suggestedStrategies = [
        "Cognitive Behavioral Therapy",
        "Mindfulness Meditation",
        "Regular Exercise",
        "Sleep Hygiene",
        "Support Group Therapy",
        "Stress Management Techniques",
        "Psychotherapy",
        "Medication Adjustment",
        "Nutritional Counseling",
        "Art Therapy",
        "Exposure Therapy",
        "Dialectical Behavior Therapy"
    ];
    const randomStrategies = suggestedStrategies
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    // State for selected and approved strategies
    const [selectedStrategies, setSelectedStrategies] = useState([]);
    const [approvedStrategies, setApprovedStrategies] = useState([]);
    const [newStrategy, setNewStrategy] = useState('');

    // Add a new custom strategy
    const handleAddCustomStrategy = () => {
        if (newStrategy.trim() && !selectedStrategies.includes(newStrategy.trim())) {
            setSelectedStrategies([...selectedStrategies, newStrategy.trim()]);
            setNewStrategy('');
        }
    };

    // Approve a suggested strategy
    const handleApproveStrategy = (strategy) => {
        // Add to approved strategies if not already there
        if (!approvedStrategies.includes(strategy)) {
            setApprovedStrategies([...approvedStrategies, strategy]);

            // Also add to selected strategies
            if (!selectedStrategies.includes(strategy)) {
                setSelectedStrategies([...selectedStrategies, strategy]);
            }
        }
    };

    // Remove a strategy
    const handleRemoveStrategy = (strategyToRemove) => {
        setSelectedStrategies(selectedStrategies.filter(strategy => strategy !== strategyToRemove));
        setApprovedStrategies(approvedStrategies.filter(strategy => strategy !== strategyToRemove));
    };

    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('diagnosis');
    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
        if (patientId) {
            const foundPatient = patientsData.patients.find(p => p.id === patientId);
            setPatient(foundPatient);
        }
    }, [patientId]);

    const toggleSection = (sectionKey) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    const renderDiagnosisTab = () => {
        if (!patient?.reports?.diagnosis?.mentalHealthDisorders) return null;

        return (
            <div className="space-y-4">
                {patient.reports.diagnosis.mentalHealthDisorders.map((disorder, index) => (
                    <div
                        key={index}
                        className="max-h-[500px] overflow-y-auto border rounded-lg px-2 py-4 "
                    >
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection(`disorder_${index}`)} >
                            <div className="flex items-center space-x-2">
                                {openSections[`disorder_${index}`] ?
                                    <ChevronDown size={16} /> :
                                    <ChevronRight size={16} />
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
                            </div>
                            <div className="flex space-x-2">

                                <button
                                    className="hover:bg-blue-100 p-1 rounded-full"
                                    title="Pin Disorder"
                                >
                                    <Pin size={16} className="text-blue-600" />
                                </button>
                            </div>
                        </div>

                        {openSections[`disorder_${index}`] && (
                            <div className="my-4 p-4  rounded-lg">
                                {/* Basic Disorder Information */}
                                <div className=" grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <strong className="text-gray-600">DSM-5 Code:</strong>
                                        <span className="ml-2 text-gray-800">{disorder.dsm5Code}</span>
                                    </div>
                                    <div>
                                        <strong className="text-gray-600">Diagnostic Date:</strong>
                                        <span className="ml-2 text-gray-800">{disorder.diagnosticDate}</span>
                                    </div>
                                    <div>
                                        <strong className="text-gray-600">Diagnostic Method:</strong>
                                        <span className="ml-2 text-gray-800">{disorder.diagnosticMethod}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="w-full space-y-4">
                                        <div>
                                            <strong className="text-gray-600">Approved Coping Strategies:</strong>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {selectedStrategies.map((strategy) => (
                                                    <div
                                                        key={strategy}
                                                        className={`flex items-center rounded-full px-3 py-1 text-sm ${approvedStrategies.includes(strategy)
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {strategy}
                                                        <button
                                                            onClick={() => handleRemoveStrategy(strategy)}
                                                            className="ml-2 hover:text-red-600"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                        <strong className="text-gray-600">Suggested Strategies:</strong>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {randomStrategies
                                                    .filter(strategy => !selectedStrategies.includes(strategy))
                                                    .map((strategy) => (
                                                        <button
                                                            key={strategy}
                                                            onClick={() => handleApproveStrategy(strategy)}
                                                            className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm hover:bg-blue-200 transition-colors"
                                                        >
                                                            {strategy}
                                                            <Check size={16} className="ml-2" />
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className='flex justify-between items-center'>
                                            <strong className="text-gray-600">Add Custom Strategy:</strong>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={newStrategy}
                                                    onChange={(e) => setNewStrategy(e.target.value)}
                                                    placeholder="Enter a new coping strategy"
                                                    className="flex-grow p-2 border rounded-md text-sm w-60"
                                                />
                                                <button
                                                    onClick={handleAddCustomStrategy}
                                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                                >
                                                    Add Strategy
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <strong className="text-gray-600">Follow-Up:</strong>
                                        <span className="ml-2 text-gray-800">{disorder.recommendedFollowup}</span>
                                    </div>
                                </div>

                                {/* Assessment Log with Scrollable Container */}
                                {disorder.assessmentLog && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Assessment Log</h3>
                                        <div className="max-h-[400px] overflow-y-auto space-y-4  bg-gray-90 rounded-lg">
                                            {disorder.assessmentLog.map((log, logIndex) => (
                                                <div
                                                    key={logIndex}
                                                    className=" px-4 py-2 rounded-lg shadow-sm border border-gray-200"
                                                >
                                                    {/* Log Header */}
                                                    <div className="">
                                                        <div className="flex justify-between items-center ">
                                                            <p className="text-gray-700 mt-1">{log.interpretation}</p>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    className="hover:bg-green-100 p-2 rounded-full transition-all"
                                                                    title="Approve Diagnosis"
                                                                >
                                                                    <Check size={18} className="text-green-600" />
                                                                </button>
                                                                <button
                                                                    className="hover:bg-red-100 p-2 rounded-full transition-all"
                                                                    title="Disapprove Diagnosis"
                                                                >
                                                                    <X size={18} className="text-red-600" />
                                                                </button>
                                                                <button
                                                                    className="text-sm text-blue-500 hover:bg-gray-100 p-2 rounded-full transition-all"
                                                                    onClick={() => toggleSection(logIndex)}
                                                                    title={openSections[logIndex] ? "Hide Details" : "Show Details"}
                                                                >
                                                                    {openSections[logIndex] ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {openSections[logIndex] && (
                                                        <>
                                                            {/* Conversation Log with Scrollable Messages */}
                                                            <div className="max-h-[300px] overflow-y-auto border-t pt-3">
                                                                {log.conversation.map((message) => (
                                                                    <div
                                                                        key={message.id}
                                                                        className={`flex mb-2 ${message.sender === "AI" ? "justify-start" : "justify-end"}`}
                                                                    >
                                                                        <div
                                                                            className={`p-2 rounded-lg ${message.sender === "AI" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}
                                                                        >
                                                                            {message.text}
                                                                            <div className="text-xs text-gray-500 mt-1">
                                                                                {new Date(message.timestamp).toLocaleString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderMedicalHistoryTab = () => {
        if (!patient?.reports?.medicalHistory) return null;

        return (
            <div className="space-y-4">
                {Object.entries(patient.reports.medicalHistory).map(([historyType, historyData]) => (
                    <div
                        key={historyType}
                        className="border rounded-lg p-4  shadow-sm"
                    >
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => toggleSection(historyType)}
                        >
                            {openSections[historyType] ?
                                <ChevronDown size={16} /> :
                                <ChevronRight size={16} />
                            }
                            <h3 className="font-semibold text-gray-800 ml-2">
                                {historyType.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
                            </h3>
                        </div>

                        {openSections[historyType] && (
                            <div className="mt-4 space-y-2 text-sm text-gray-700">
                                {historyData.map((entry, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-2 rounded"
                                    >
                                        {Object.entries(entry).map(([key, value]) => (
                                            <div key={key}>
                                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                                {Array.isArray(value) ? value.join(', ') : value}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderMiscellaneousTab = () => {
        if (!patient?.reports?.miscellaneous) return null;

        return (
            <div className="space-y-4">
                {Object.entries(patient.reports.miscellaneous).map(([infoType, infoData]) => (
                    <div
                        key={infoType}
                        className="border rounded-lg p-4  shadow-sm"
                    >
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => toggleSection(infoType)}
                        >
                            {openSections[infoType] ?
                                <ChevronDown size={16} /> :
                                <ChevronRight size={16} />
                            }
                            <h3 className="font-semibold text-gray-800 ml-2">
                                {infoType.charAt(0).toUpperCase() + infoType.slice(1)}
                            </h3>
                        </div>

                        {openSections[infoType] && (
                            <div className="mt-4 space-y-2 text-sm text-gray-700">
                                {typeof infoData === 'object' ? (
                                    Object.entries(infoData).map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 p-2 rounded">
                                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                            {typeof value === 'object' ? JSON.stringify(value) : value}
                                        </div>
                                    ))
                                ) : (
                                    <div>{infoData}</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (!patient) {
        return (
            <div className="h-full bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm font-semibold">Select a patient</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg h-[400px]">
            <div className=" rounded-lg p-2">
                <div className="border-b flex">
                    <button
                        className={`
                            px-4 py-2 flex items-center 
                            ${activeTab === 'diagnosis'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }
                        `}
                        onClick={() => setActiveTab('diagnosis')}
                    >
                        <FileText size={16} className="mr-2" />
                        Diagnosis
                    </button>
                    <button
                        className={`
                            px-4 py-2 flex items-center 
                            ${activeTab === 'medicalHistory'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }
                        `}
                        onClick={() => setActiveTab('medicalHistory')}
                    >
                        <BookOpen size={16} className="mr-2" />
                        Medical History
                    </button>
                    <button
                        className={`
                            px-4 py-2 flex items-center 
                            ${activeTab === 'miscellaneous'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }
                        `}
                        onClick={() => setActiveTab('miscellaneous')}
                    >
                        <Paperclip size={16} className="mr-2" />
                        Miscellaneous
                    </button>
                </div>

                <div className="flex flex-col space-y-4 overflow-y-auto max-h-[390px] py-2">

                    {activeTab === 'diagnosis' && renderDiagnosisTab()}
                    {activeTab === 'medicalHistory' && renderMedicalHistoryTab()}
                    {activeTab === 'miscellaneous' && renderMiscellaneousTab()}
                </div>
            </div>
        </div>
    );
};

export default Reports;