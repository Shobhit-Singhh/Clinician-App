import React, { useState, useEffect } from 'react';
import { MoveVertical, X, Save, PlusCircle, FileEdit, ChevronUp, ChevronDown, CheckCircle, AlertCircle, Copy } from 'lucide-react';

const Customization = ({ customAssessment, onRemoveSection, onReorderSections, onSaveAssessment, onDuplicateAssessment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [assessmentName, setAssessmentName] = useState(customAssessment.name);
    const [draggedSectionId, setDraggedSectionId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [expandedSectionId, setExpandedSectionId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Update local state when customAssessment changes from props
    useEffect(() => {
        setAssessmentName(customAssessment.name);
    }, [customAssessment.name]);

    const handleNameChange = () => {
        if (assessmentName.trim() !== '') {
            // Logic to update the assessment name
            onSaveAssessment({ ...customAssessment, name: assessmentName });
            setIsEditing(false);
            showSuccessMessage(`Assessment renamed to "${assessmentName}"`);
        }
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    const handleDragStart = (e, sectionId) => {
        setDraggedSectionId(sectionId);
        e.dataTransfer.effectAllowed = 'move';
        // Add a subtle effect to indicate the item is being dragged
        setTimeout(() => {
            const element = document.getElementById(`section-${sectionId}`);
            if (element) element.classList.add('opacity-50');
        }, 0);
    };

    const handleDragEnd = (e) => {
        // Remove the opacity effect when drag ends
        const element = document.getElementById(`section-${draggedSectionId}`);
        if (element) element.classList.remove('opacity-50');
        setDraggedSectionId(null);
    };

    const handleDragOver = (e, targetSectionId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Visual feedback for valid drop targets
        const element = document.getElementById(`section-${targetSectionId}`);
        if (element && draggedSectionId !== targetSectionId) {
            element.classList.add('border-blue-400', 'bg-blue-50');
        }
    };

    const handleDragLeave = (e, targetSectionId) => {
        // Remove visual feedback when drag leaves
        const element = document.getElementById(`section-${targetSectionId}`);
        if (element) {
            element.classList.remove('border-blue-400', 'bg-blue-50');
        }
    };

    const handleDrop = (e, targetSectionId) => {
        e.preventDefault();

        // Remove visual feedback
        const targetElement = document.getElementById(`section-${targetSectionId}`);
        if (targetElement) {
            targetElement.classList.remove('border-blue-400', 'bg-blue-50');
        }

        if (draggedSectionId === targetSectionId) return;

        const sourceIndex = customAssessment.sections.findIndex(section => section.id === draggedSectionId);
        const targetIndex = customAssessment.sections.findIndex(section => section.id === targetSectionId);

        if (sourceIndex !== -1 && targetIndex !== -1) {
            const newSections = [...customAssessment.sections];
            const [movedSection] = newSections.splice(sourceIndex, 1);
            newSections.splice(targetIndex, 0, movedSection);

            onReorderSections(newSections);
            showSuccessMessage(`"${movedSection.title}" moved successfully`);
        }

        setDraggedSectionId(null);
    };

    const moveSection = (sectionId, direction) => {
        const sectionIndex = customAssessment.sections.findIndex(section => section.id === sectionId);
        const section = customAssessment.sections[sectionIndex];

        if ((direction === 'up' && sectionIndex === 0) ||
            (direction === 'down' && sectionIndex === customAssessment.sections.length - 1)) {
            return; // Can't move outside bounds
        }

        const newSections = [...customAssessment.sections];
        const [movedSection] = newSections.splice(sectionIndex, 1);
        const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
        newSections.splice(newIndex, 0, movedSection);

        onReorderSections(newSections);
        showSuccessMessage(`"${section.title}" moved ${direction}`);
    };

    const handleRemoveSection = (sectionId) => {
        const section = customAssessment.sections.find(s => s.id === sectionId);
        onRemoveSection(sectionId);
        showSuccessMessage(`"${section.title}" removed from assessment`);
    };

    const handleSaveAssessment = () => {
        setIsSaving(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            onSaveAssessment(customAssessment);
            setIsSaving(false);
            showSuccessMessage("Assessment saved successfully");
        }, 800);
    };

    const handleDuplicateAssessment = () => {
        // Create a duplicate with a new name
        const duplicateName = `${customAssessment.name} (Copy)`;
        onDuplicateAssessment({
            ...customAssessment,
            name: duplicateName,
            id: `${customAssessment.id}-copy-${Date.now()}`
        });
        showSuccessMessage(`Duplicated as "${duplicateName}"`);
    };

    const toggleSectionExpand = (sectionId) => {
        setExpandedSectionId(expandedSectionId === sectionId ? null : sectionId);
    };

    const getTotalQuestions = () => {
        return customAssessment.sections.reduce((total, section) => total + section.questionCount, 0);
    };

    const getEstimatedTime = () => {
        let minTime = 0;
        let maxTime = 0;

        customAssessment.sections.forEach(section => {
            const timeRange = section.timeEstimate.split('-');
            minTime += parseInt(timeRange[0], 10);
            maxTime += parseInt(timeRange[1], 10);
        });

        return { minTime, maxTime };
    };

    const { minTime, maxTime } = getEstimatedTime();

    // Generate tags based on assessment content
    const generateTags = () => {
        const tags = new Set();
        
        // Add tag based on total question count
        if (getTotalQuestions() > 15) tags.add("Comprehensive");
        else if (getTotalQuestions() < 8) tags.add("Brief");
        
        // Add tags based on section types
        customAssessment.sections.forEach(section => {
            if (section.title.toLowerCase().includes("mood")) tags.add("Mood");
            if (section.title.toLowerCase().includes("anxiety")) tags.add("Anxiety");
            if (section.title.toLowerCase().includes("trauma")) tags.add("Trauma");
            if (section.title.toLowerCase().includes("behavior")) tags.add("Behavioral");
        });
        
        return Array.from(tags);
    };

    const tags = generateTags();

    return (
        <div className="h-full flex flex-col relative">
            {/* Success message toast notification */}
            {successMessage && (
                <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-md">
                        <div className="flex items-center">
                            <CheckCircle size={16} className="mr-2" />
                            <span>{successMessage}</span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex-grow">
                        {isEditing ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={assessmentName}
                                    onChange={(e) => setAssessmentName(e.target.value)}
                                    className="mr-2 flex-grow p-1.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    autoFocus
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleNameChange();
                                    }}
                                />
                                <button
                                    onClick={handleNameChange}
                                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50"
                                >
                                    <Save size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <h2 className="text-xl font-bold text-gray-800">{customAssessment.name}</h2>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="ml-2 text-gray-500 hover:text-blue-600 p-1 rounded hover:bg-blue-50"
                                    title="Edit assessment name"
                                >
                                    <FileEdit size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={handleDuplicateAssessment}
                            className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center text-sm"
                            title="Create a copy of this assessment"
                        >
                            <Copy size={16} className="mr-1" />
                            Duplicate
                        </button>
                        <button 
                            onClick={handleSaveAssessment} 
                            disabled={isSaving}
                            className={`px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center text-sm ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
                        >
                            <Save size={16} className="mr-1" />
                            {isSaving ? 'Saving...' : 'Save Assessment'}
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center mb-1">
                    <p className="text-sm text-gray-600">
                        {customAssessment.sections.length} sections • {getTotalQuestions()} questions • {minTime}-{maxTime} min
                    </p>
                </div>
                
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Assessment Sections */}
            <div className="overflow-y-auto flex-grow">
                {customAssessment.sections.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center p-6">
                            <PlusCircle size={48} className="mx-auto mb-4 text-gray-300" />
                            <h3 className="font-medium text-gray-700 mb-2">No sections added yet</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Select an assessment and add sections to create your custom assessment
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {customAssessment.sections.map((section, index) => (
                            <div
                                id={`section-${section.id}`}
                                key={section.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, section.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, section.id)}
                                onDragLeave={(e) => handleDragLeave(e, section.id)}
                                onDrop={(e) => handleDrop(e, section.id)}
                                className={`p-3 rounded-lg border ${draggedSectionId === section.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    } relative transition-all hover:border-gray-300`}
                            >
                                <div className="flex items-start">
                                    <div className="flex-grow ml-4">
                                        <h3 className="font-medium text-gray-800">
                                            <span 
                                                className="cursor-pointer flex items-center" 
                                                onClick={() => toggleSectionExpand(section.id)}
                                            >
                                                {section.title}
                                                {expandedSectionId === section.id ? 
                                                    <ChevronUp size={16} className="ml-1 text-gray-500" /> : 
                                                    <ChevronDown size={16} className="ml-1 text-gray-500" />
                                                }
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                                        <div className="text-xs text-gray-500 mt-2">
                                            {section.questionCount} questions • {section.timeEstimate} to complete
                                        </div>
                                    </div>

                                    <div className="flex items-start ml-2">
                                        <div className="flex flex-col mr-2">
                                            <button
                                                onClick={() => moveSection(section.id, 'up')}
                                                disabled={index === 0}
                                                className={`p-1 mb-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                title="Move up"
                                            >
                                                <ChevronUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveSection(section.id, 'down')}
                                                disabled={index === customAssessment.sections.length - 1}
                                                className={`p-1 rounded ${index === customAssessment.sections.length - 1
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                title="Move down"
                                            >
                                                <ChevronDown size={16} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveSection(section.id)}
                                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Remove section"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                {expandedSectionId === section.id && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <div className="text-sm text-gray-700 mb-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">Section Details</span>
                                                <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                                                    Edit section
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded text-xs">
                                                <p className="mb-1"><span className="font-medium">ID:</span> {section.id}</p>
                                                <p className="mb-1"><span className="font-medium">Position:</span> {index + 1} of {customAssessment.sections.length}</p>
                                                <p><span className="font-medium">Source:</span> DSM-5 Standardized Assessment</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute left-0 top-0 bottom-0 flex items-center cursor-grab active:cursor-grabbing">
                                    <div className="h-full flex flex-col justify-center px-1">
                                        <MoveVertical size={14} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center">
                        <CheckCircle size={16} className="mr-1 text-green-500" />
                        <span>DSM-5 Compliant</span>
                    </div>
                    <span>Last modified: {new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default Customization;