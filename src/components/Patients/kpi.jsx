import React, { useState, useEffect } from 'react';
import { Calendar, Pill, PlusCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import patientsData from '../../../data/patient.json';

const KPICard = ({ title, icon: Icon, color: color, children, onRemove }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1;

    // Ensure children is an array
    const childrenArray = React.Children.toArray(children);
    const totalPages = Math.ceil(childrenArray.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <div className={`flex-shrink-0 w-full max-w-48 h-full bg-${color}-100  border-${color} rounded-lg p-4 text-xs shadow-md relative`}>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                    <X size={14} />
                </button>
            )}

            <div className={`flex items-center mb-2 text-${color}-700 font-bold`}>
                <Icon size={16} className="mr-2" />
                {title}
            </div>

            {childrenArray.length > 1 ? (
                <div className="relative">
                    {/* Pagination buttons */}
                    {totalPages > 1 && (
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between">
                            <button
                                onClick={handlePrevPage}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={handleNextPage}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Current page content */}
                    <div className="text-center">
                        {childrenArray.slice(
                            currentPage * itemsPerPage,
                            (currentPage + 1) * itemsPerPage
                        )}
                    </div>

                    {/* Dot pagination */}

                </div>
            ) : (
                <div className="text-center">
                    {childrenArray}
                </div>
            )}
        </div>
    );
};

const KPI = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [selectedLabResults, setSelectedLabResults] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);

    useEffect(() => {
        if (patientId) {
            const foundPatient = patientsData.patients.find(p => p.id === patientId);
            setPatient(foundPatient);
        }
    }, [patientId]);

    const handleAddResult = () => {
        if (selectedResult) {
            const updatedResults = {
                ...selectedLabResults,
                [patientId]: [...(selectedLabResults[patientId] || []), selectedResult]
            };
            setSelectedLabResults(updatedResults);
            setIsModalOpen(false);
            setSelectedResult(null);
        }
    };

    const handleRemoveResult = (categoryToRemove) => {
        const updatedResults = {
            ...selectedLabResults,
            [patientId]: (selectedLabResults[patientId] || []).filter(result => result.category !== categoryToRemove)
        };
        setSelectedLabResults(updatedResults);
    };

    if (!patient) {
        return (
            <div className="h-full bg-white rounded-lg shadow-md flex items-center justify-center">
                <p className="text-gray-500 text-sm font-semibold">Select a patient</p>
            </div>
        );
    }

    const currentResults = selectedLabResults[patientId] || [];
    const availableResults = Object.entries(patient.laboratoryResults || {});

    return (
        <div className="rounded-lg h-full ">
            <div className="flex space-x-4 p-4 h-full overflow-x-auto">
                {/* Appointments Card */}
                <KPICard title="Appointments" icon={Calendar} color="blue">
                    {patient.lastVisitDate && (
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-extrabold text-blue-800">
                                {new Date(patient.lastVisitDate).getDate()}
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                                {new Date(patient.lastVisitDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="text-sm text-gray-500">Last Visit</div>
                        </div>
                    )}
                    {patient.nextAppointmentDate && (
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-extrabold text-blue-800">
                                {new Date(patient.nextAppointmentDate).getDate()}
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                                {new Date(patient.nextAppointmentDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="text-sm text-gray-500">Next Appointment</div>
                        </div>
                    )}
                </KPICard>

                {/* Medications Card */}
                <KPICard title="Medications" icon={Pill} color="red">
                    {patient.medications.map((med, index) => (
                        <div key={index} className="space-y-1">
                            <div className="text-2xl py-2 font-extrabold text-purple-800 mb-1">
                                {med.dosage}
                            </div>
                            <strong className="text-sm font-medium">{med.name}</strong>
                            <div className="text-xs text-gray-600">{med.frequency}</div>
                        </div>
                    ))}
                </KPICard>

                {/* Dynamic Lab Results Cards */}
                {currentResults.map((result, index) => (
                    <KPICard
                        key={index}
                        title={result.category}
                        icon={PlusCircle}
                        color="green"
                        onRemove={() => handleRemoveResult(result.category)}
                    >
                        {typeof result.results === 'object' ? (
                            Object.entries(result.results).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                    <div className="text-3xl py-3 font-extrabold text-green-800 mb-1">
                                        {value}
                                    </div>
                                    <div className="text-xl font-medium">{key}</div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="text-3xl py-3 font-extrabold text-green-800">{result.results}</div>
                                <div className="text-xl font-medium">Result</div>
                            </>
                        )}
                    </KPICard>
                ))}

                {/* Add Lab Result Card */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-shrink-0 w-full max-w-48 h-full flex items-center justify-center text-xs bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg p-4 hover:from-gray-300 hover:to-gray-400 shadow-md font-semibold"
                >
                    <PlusCircle size={16} className="mr-2 text-gray-700" /> Add Lab Result
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-gray-700">Add Lab Result</h2>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <select
                                className="w-full p-2 text-xs border rounded"
                                onChange={(e) => {
                                    const [category] = e.target.value.split('|');
                                    if (category) {
                                        const result = {
                                            category,
                                            results: patient.laboratoryResults[category]
                                        };
                                        setSelectedResult(result);
                                    }
                                }}
                            >
                                <option value="">Select Lab Result</option>
                                {availableResults.map(([category]) => (
                                    <option key={category} value={`${category}|full`}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddResult}
                                className="w-full p-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                disabled={!selectedResult}
                            >
                                Add Result
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KPI;