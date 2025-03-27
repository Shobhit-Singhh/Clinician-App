import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Calendar, ClipboardList, BarChart2, Bell } from 'lucide-react';
import patientsData from '/data/patient.json';

// Predefined DSM-5-like Assessment Criteria
const DSM5_CRITERIA = [
    { id: 'mood_assessment', category: 'Mood', name: 'Mood Assessment' },
    { id: 'anxiety_screening', category: 'Anxiety', name: 'Anxiety Screening' },
    { id: 'depression_evaluation', category: 'Depression', name: 'Depression Evaluation' },
    { id: 'ptsd_assessment', category: 'Trauma', name: 'PTSD Screening' },
    { id: 'substance_use', category: 'Substance', name: 'Substance Use Assessment' },
    { id: 'sleep_patterns', category: 'General', name: 'Sleep Pattern Evaluation' },
    { id: 'cognitive_function', category: 'Cognitive', name: 'Cognitive Function Test' },
    { id: 'social_interaction', category: 'Social', name: 'Social Interaction Assessment' },
    { id: 'trauma_history', category: 'Trauma', name: 'Trauma History Review' },
    { id: 'medication_review', category: 'General', name: 'Medication Efficacy Review' }
];

const Followup = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [showCriteriaModal, setShowCriteriaModal] = useState(false);

    useEffect(() => {
        if (patientId) {
            const foundPatient = patientsData.patients.find(p => p.id === patientId);
            setPatient(foundPatient);
            
            // Use existing assessments from patient data or initialize empty
            setAssessments(foundPatient.assessments || []);
        }
    }, [patientId]);

    const getStatusColor = (status, completionPercentage) => {
        switch(status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': 
                return completionPercentage > 50 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAddAssessment = (criteria) => {
        const newAssessment = {
            id: `${criteria.id}_${Date.now()}`,
            type: criteria.name,
            category: criteria.category,
            status: 'in_progress',
            assignedDate: new Date().toISOString(),
            completedDate: null,
            completionPercentage: 0,
            notes: '',
            assignedBy: 'Current User' // Replace with actual user context
        };

        const updatedAssessments = [...assessments, newAssessment];
        setAssessments(updatedAssessments);
        
        // In a real app, you would save this to backend/database
        // For now, we'll just update local state
        setShowCriteriaModal(false);
    };

    const updateAssessmentStatus = (assessmentId) => {
        const updatedAssessments = assessments.map(assessment => {
            if (assessment.id === assessmentId) {
                const isCompleting = assessment.status !== 'completed';
                return {
                    ...assessment,
                    status: isCompleting ? 'completed' : 'in_progress',
                    completedDate: isCompleting ? new Date().toISOString() : null,
                    completionPercentage: isCompleting ? 100 : 0
                };
            }
            return assessment;
        });

        setAssessments(updatedAssessments);
    };

    if (!patient) {
        return (
            <div className="h-full bg-white/90 rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm">Select a patient</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg h-full p-4 flex flex-col ">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-sm font-semibold text-gray-700">Follow-up Assessments</h3>
                <button 
                    onClick={() => setShowCriteriaModal(true)}
                    className="text-blue-500 hover:bg-blue-100 p-1 rounded-full"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* DSM-5 Criteria Modal */}
            {showCriteriaModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">Select Assessment</h4>
                            <button 
                                onClick={() => setShowCriteriaModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2">
                            {DSM5_CRITERIA.map((criteria) => (
                                <button
                                    key={criteria.id}
                                    onClick={() => handleAddAssessment(criteria)}
                                    className="w-full text-left p-3 rounded hover:bg-blue-50 flex justify-between items-center"
                                >
                                    <div>
                                        <span className="font-medium">{criteria.name}</span>
                                        <p className="text-xs text-gray-500">{criteria.category} Assessment</p>
                                    </div>
                                    <ClipboardList size={16} className="text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto space-y-2 ">
                {assessments.map((assessment) => (
                    <div 
                        key={assessment.id} 
                        className={`
                            flex items-center justify-between p-2 rounded 
                            ${getStatusColor(assessment.status, assessment.completionPercentage)}
                        `}
                    >
                        <div className="flex items-center">
                            <button 
                                onClick={() => updateAssessmentStatus(assessment.id)}
                                className={`mr-2 ${
                                    assessment.status === 'completed' 
                                        ? 'text-green-600' 
                                        : 'text-gray-400 hover:text-green-600'
                                }`}
                            >
                                <Check size={16} />
                            </button>
                            <div className="text-sm">
                                {assessment.type}
                                <div className="text-xs text-gray-600 flex items-center space-x-2">
                                    <div className="flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {new Date(assessment.assignedDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <BarChart2 size={12} className="mr-1" />
                                        {assessment.completionPercentage}%
                                    </div>
                                    <span className="bg-blue-200 text-blue-800 px-1 rounded text-[0.6rem]">
                                        {assessment.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => alert('Alert the patient')}
                            className=" text-gray-400 hover:text-red-600 pr-2"
                        >
                            <Bell size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Followup;