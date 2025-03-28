import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, Trash2, Calendar, ClipboardList, BarChart2, Bell } from 'lucide-react';
import patientsData from '/data/patient.json';

const Tooltip = ({ children, text }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState("top");
    const [tooltipStyles, setTooltipStyles] = useState({});
    const tooltipRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isVisible && tooltipRef.current && containerRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const spaceAbove = containerRect.top;
            const spaceBelow = window.innerHeight - containerRect.bottom;
            const spaceLeft = containerRect.left;
            const spaceRight = window.innerWidth - containerRect.right;

            let newPosition = "top"; // Default position
            let newStyles = { left: "50%", transform: "translateX(-50%)" };

            // Move tooltip to bottom if there's not enough space above
            if (spaceAbove < tooltipRect.height + 10 && spaceBelow > spaceAbove) {
                newPosition = "bottom";
            }

            // Shift tooltip left if it's overflowing on the right
            if (tooltipRect.right > window.innerWidth - 10) {
                newStyles.left = "auto";
                newStyles.right = "0px";
                newStyles.transform = "none";
            }
            // Shift tooltip right if it's overflowing on the left
            else if (tooltipRect.left < 10) {
                newStyles.left = "0px";
                newStyles.transform = "none";
            }

            setPosition(newPosition);
            setTooltipStyles(newStyles);
        }
    }, [isVisible]);

    return (
        <div className="relative inline-block" ref={containerRef}>
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="w-full cursor-pointer"
            >
                {children}
            </div>
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`z-50 bg-white text-blue-700 text-sm font-medium rounded-lg border border-blue-500 py-2 px-4 shadow-lg absolute
                    ${position === "bottom" ? "bottom-full mb-2" : "top-full mt-2"}
                    whitespace-nowrap text-center transition-opacity duration-300 ease-out opacity-100`}
                >
                    {text}
                    <div
                        className={`absolute left-1/2 transform -translate-x-1/2 border-6 
                        ${position === "bottom" ? "top-full border-t-blue-500" : "bottom-full border-b-blue-500"}
                        border-x-transparent`}
                    />
                </div>
            )}
        </div>
    );
};

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
            setAssessments(foundPatient.assessments || []);
        }
    }, [patientId]);

    const getProgressColor = (status, completionPercentage) => {
        let bgColor, progressColor;

        // Determine base background color based on status
        if (status === 'completed') {
            bgColor = 'bg-green-50'; // Light green for completed
            progressColor = 'bg-green-300';
        } else if (status === 'in_progress') {
            bgColor = 'bg-blue-50'; // Light blue for in progress
            progressColor = 'bg-purple-300';
        } else {
            bgColor = 'bg-red-50'; // Light red for new/incomplete
            progressColor = 'bg-red-500';
        }

        return { bgColor, progressColor, completionPercentage };
    };

    const handleAddAssessment = (criteria) => {
        const newAssessment = {
            id: `${criteria.id}_${Date.now()}`,
            type: criteria.name,
            status: 'in_progress',
            assignedDate: new Date().toISOString(),
            completedDate: null,
            completionPercentage: 0,
            notes: 'More data required'
        };

        const updatedAssessments = [...assessments, newAssessment];
        setAssessments(updatedAssessments);
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
            <div className="h-full bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm font-semibold">Select a patient</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg h-[235px] flex flex-col ">
            <div className="flex justify-between items-center border-b pb-4 mb-1">
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
                                    </div>
                                    <ClipboardList size={16} className="text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto space-y-2 ">
                {assessments.map((assessment) => {
                    const { bgColor, progressColor, completionPercentage } = getProgressColor(
                        assessment.status,
                        assessment.completionPercentage
                    );

                    return (
                        <Tooltip
                            key={assessment.id}
                            text={assessment.notes || 'No additional notes'}
                        >
                            <div
                                className={`relative w-full ${bgColor} rounded overflow-hidden`}
                            >
                                {/* Progress Indicator */}
                                <div
                                    className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-300 ease-in-out`}
                                    style={{ width: `${completionPercentage}%` }}
                                />

                                <div
                                    className="relative z-10 flex items-center justify-between p-2 w-[270px]"
                                >
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => updateAssessmentStatus(assessment.id)}
                                            className={`mr-2 ${assessment.status === 'completed'
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
                                        className="text-gray-400 hover:text-red-600 pr-2"
                                    >
                                        <Bell size={18} />
                                    </button>
                                </div>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

export default Followup;