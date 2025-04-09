import React, { useState, useEffect } from 'react';
import { FileText, Stethoscope, ClipboardCheck, ListChecks } from 'lucide-react';
import patientsData from '/data/patient.json';
import SubjectiveTab from './Reports/SubjectiveTab';
import ObjectiveTab from './Reports/ObjectiveTab';
import AssessmentTab from './Reports/AssessmentTab';
import PlanTab from './Reports/PlanTab';

const Reports = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('subjective');
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

    if (!patient) {
        return (
            <div className="h-full bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm font-semibold">Select a patient</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg h-[400px]">
            <div className="rounded-lg p-2">
                <div className="border-b flex">
                    <button
                        className={`
                            px-4 py-2 flex items-center 
                            ${activeTab === 'subjective'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }
                        `}
                        onClick={() => setActiveTab('subjective')}
                    >
                        <FileText size={16} className="mr-2" />
                        Subjective
                    </button>
                    <button
                        className={`
                            px-4 py-2 flex items-center 
                            ${activeTab === 'objective'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }
                        `}
                        onClick={() => setActiveTab('objective')}
                    >
                        <Stethoscope size={16} className="mr-2" />
                        Objective
                    </button>
                    <button
                        className={`
                            px-4 py-2 flex items-center 
                            ${activeTab === 'assessment'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }
                        `}
                        onClick={() => setActiveTab('assessment')}
                    >
                        <ClipboardCheck size={16} className="mr-2" />
                        Assessment
                    </button>
                    <button
                        className={`
                            px-4 py-2 flex items-center 
                            ${activeTab === 'plan'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }
                        `}
                        onClick={() => setActiveTab('plan')}
                    >
                        <ListChecks size={16} className="mr-2" />
                        Plan
                    </button>
                </div>

                <div className="flex flex-col space-y-4 overflow-y-auto max-h-[390px] py-2">
                    {activeTab === 'subjective' && (
                        <SubjectiveTab 
                            patient={patient} 
                            openSections={openSections} 
                            toggleSection={toggleSection} 
                        />
                    )}
                    {activeTab === 'objective' && (
                        <ObjectiveTab 
                            patient={patient} 
                            openSections={openSections} 
                            toggleSection={toggleSection} 
                        />
                    )}
                    {activeTab === 'assessment' && (
                        <AssessmentTab 
                            patient={patient} 
                            openSections={openSections} 
                            toggleSection={toggleSection} 
                        />
                    )}
                    {activeTab === 'plan' && (
                        <PlanTab 
                            patient={patient} 
                            openSections={openSections} 
                            toggleSection={toggleSection} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;