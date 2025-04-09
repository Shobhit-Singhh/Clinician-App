import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, Trash2, Calendar, ClipboardList, BarChart2, Bell, Clipboard, MessageCircle, Users } from 'lucide-react';
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
                    style={tooltipStyles}
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

// Assessment approach variations
const ASSESSMENT_VARIATIONS = {
    direct: {
        name: 'Direct',
        icon: Clipboard,
        description: 'Structured, formal assessment with direct questions',
        color: 'text-blue-600'
    },
    therapeutic: {
        name: 'Therapeutic',
        icon: Users,
        description: 'Guided therapeutic approach with supportive framework',
        color: 'text-green-600'
    },
    conversational: {
        name: 'Conversational',
        icon: MessageCircle,
        description: 'Natural dialogue-based assessment approach',
        color: 'text-purple-600'
    }
};

const Followup = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [showCriteriaModal, setShowCriteriaModal] = useState(false);
    const [selectedCriteria, setSelectedCriteria] = useState(null);
    const [showVariationsModal, setShowVariationsModal] = useState(false);

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

    const handleCriteriaSelection = (criteria) => {
        setSelectedCriteria(criteria);
        setShowCriteriaModal(false);
        setShowVariationsModal(true);
    };

    const handleAddAssessment = (variation) => {
        // Generate sequential ID based on existing assessments of this type
        const baseId = selectedCriteria.id;
        const existingCount = assessments.filter(a => a.id.startsWith(baseId)).length;
        const newSequence = existingCount + 1;

        const newAssessment = {
            id: `${baseId}_${newSequence}`,
            type: selectedCriteria.name,
            category: selectedCriteria.category,
            variation: variation,
            variationName: ASSESSMENT_VARIATIONS[variation].name,
            status: 'in_progress',
            assignedDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
            completedDate: null,
            completionPercentage: 0,
            notes: `${ASSESSMENT_VARIATIONS[variation].name} approach: Initial assessment pending`
        };

        const updatedAssessments = [...assessments, newAssessment];
        setAssessments(updatedAssessments);
        setShowVariationsModal(false);
        setSelectedCriteria(null);
    };

    const updateAssessmentStatus = (assessmentId) => {
        const updatedAssessments = assessments.map(assessment => {
            if (assessment.id === assessmentId) {
                const isCompleting = assessment.status !== 'completed';
                return {
                    ...assessment,
                    status: isCompleting ? 'completed' : 'in_progress',
                    completedDate: isCompleting ? new Date().toISOString().split('T')[0] : null,
                    completionPercentage: isCompleting ? 100 : 0
                };
            }
            return assessment;
        });

        setAssessments(updatedAssessments);
    };

    const getVariationIcon = (variation) => {
        const IconComponent = ASSESSMENT_VARIATIONS[variation]?.icon || ClipboardList;
        const colorClass = ASSESSMENT_VARIATIONS[variation]?.color || 'text-blue-500';
        return <IconComponent size={16} className={colorClass} />;
    };

    const deleteAssessment = (assessmentId) => {
        const updatedAssessments = assessments.filter(assessment => assessment.id !== assessmentId);
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
        <div className="rounded-lg h-[235px] flex flex-col">
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
                                    onClick={() => handleCriteriaSelection(criteria)}
                                    className="w-full text-left p-3 rounded hover:bg-blue-50 flex justify-between items-center"
                                >
                                    <div>
                                        <span className="font-medium">{criteria.name}</span>
                                        <div className="text-xs text-gray-500">{criteria.category}</div>
                                    </div>
                                    <ClipboardList size={16} className="text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Assessment Variations Modal */}
            {showVariationsModal && selectedCriteria && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">Select Approach</h4>
                            <button
                                onClick={() => {
                                    setShowVariationsModal(false);
                                    setSelectedCriteria(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            How would you like to conduct the {selectedCriteria.name}?
                        </p>
                        <div className="space-y-3">
                            {Object.entries(ASSESSMENT_VARIATIONS).map(([key, variation]) => {
                                const VariationIcon = variation.icon;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleAddAssessment(key)}
                                        className="w-full text-left p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                                    >
                                        <div className="flex items-center mb-1">
                                            <VariationIcon size={18} className={`mr-2 ${variation.color}`} />
                                            <span className="font-medium">{variation.name}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 pl-6">{variation.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto space-y-2">
                {assessments.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        <p>No assessments assigned yet</p>
                    </div>
                ) : (
                    assessments.map((assessment) => {
                        const { bgColor, progressColor, completionPercentage } = getProgressColor(
                            assessment.status,
                            assessment.completionPercentage
                        );

                        return (

                            <div
                                className={`relative w-full ${bgColor} rounded overflow-hidden group`}
                            >
                                {/* Progress Indicator */}
                                <div
                                    className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-300 ease-in-out`}
                                    style={{ width: `${assessment.completionPercentage}%` }}
                                />

                                <div
                                    className="relative z-10 flex items-center justify-between p-2 w-full"
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
                                            <div className="flex items-center">
                                                {assessment.variation && getVariationIcon(assessment.variation)}
                                                <span className="ml-1">{assessment.type}</span>
                                            </div>
                                            <div className="text-xs text-gray-600 flex items-center flex-wrap gap-1">
                                                <div className="flex items-center">
                                                    <Calendar size={12} className="mr-1" />
                                                    {new Date(assessment.assignedDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <BarChart2 size={12} className="mr-1" />
                                                    {assessment.completionPercentage}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => alert(`Remind patient about: ${assessment.type}`)}
                                            className="text-gray-400 hover:text-blue-600 p-1"
                                        >
                                            <Bell size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteAssessment(assessment.id)}
                                            className="text-gray-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Followup;