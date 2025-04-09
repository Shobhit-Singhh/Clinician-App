import React, { useState, useEffect } from 'react';
import { PlusCircle, ChevronRight, AlertCircle, CheckCircle, Copy } from 'lucide-react';

// Mock data for assessment details
const assessmentDetailsData = {
  'dsm5-depression': {
    id: 'dsm5-depression',
    name: 'DSM-5 Depression Assessment',
    description: 'Comprehensive evaluation of depressive symptoms according to DSM-5 criteria',
    sections: [
      {
        id: 'dep-1',
        title: 'Depressed Mood',
        description: 'Assessment of persistent feelings of sadness, emptiness, or hopelessness',
        questionCount: 5,
        timeEstimate: '5-7 min'
      },
      {
        id: 'dep-2',
        title: 'Loss of Interest or Pleasure',
        description: 'Evaluation of diminished interest or pleasure in activities',
        questionCount: 4,
        timeEstimate: '4-6 min'
      },
      {
        id: 'dep-3',
        title: 'Weight and Appetite Changes',
        description: 'Assessment of significant weight loss/gain or appetite changes',
        questionCount: 3,
        timeEstimate: '3-4 min'
      },
      {
        id: 'dep-4',
        title: 'Sleep Disturbances',
        description: 'Evaluation of insomnia or hypersomnia patterns',
        questionCount: 4,
        timeEstimate: '4-5 min'
      },
      {
        id: 'dep-5',
        title: 'Fatigue and Energy Loss',
        description: 'Assessment of energy levels and persistent fatigue',
        questionCount: 3,
        timeEstimate: '3-4 min'
      }
    ]
  },
  'dsm5-anxiety': {
    id: 'dsm5-anxiety',
    name: 'DSM-5 Anxiety Assessment',
    description: 'Structured assessment for anxiety disorders following DSM-5 guidelines',
    sections: [
      {
        id: 'anx-1',
        title: 'Excessive Worry',
        description: 'Assessment of persistent and excessive anxiety and worry',
        questionCount: 5,
        timeEstimate: '5-7 min'
      },
      {
        id: 'anx-2',
        title: 'Physical Symptoms',
        description: 'Evaluation of restlessness, fatigue, muscle tension, etc.',
        questionCount: 6,
        timeEstimate: '6-8 min'
      },
      {
        id: 'anx-3',
        title: 'Avoidance Behaviors',
        description: 'Assessment of avoidance of anxiety-provoking situations',
        questionCount: 4,
        timeEstimate: '4-5 min'
      }
    ]
  },
  'dsm5-ptsd': {
    id: 'dsm5-ptsd',
    name: 'DSM-5 PTSD Evaluation',
    description: 'Trauma and stressor-related disorders assessment based on DSM-5',
    sections: [
      {
        id: 'ptsd-1',
        title: 'Trauma Exposure',
        description: 'Assessment of exposure to traumatic events',
        questionCount: 4,
        timeEstimate: '4-6 min'
      },
      {
        id: 'ptsd-2',
        title: 'Intrusion Symptoms',
        description: 'Evaluation of intrusive thoughts, memories and flashbacks',
        questionCount: 5,
        timeEstimate: '5-7 min'
      },
      {
        id: 'ptsd-3',
        title: 'Avoidance',
        description: 'Assessment of avoidance of trauma-related stimuli',
        questionCount: 3,
        timeEstimate: '3-4 min'
      },
      {
        id: 'ptsd-4',
        title: 'Negative Alterations in Cognition and Mood',
        description: 'Evaluation of negative thoughts and feelings',
        questionCount: 6,
        timeEstimate: '6-8 min'
      }
    ]
  },
  'dsm5-adhd': {
    id: 'dsm5-adhd',
    name: 'DSM-5 ADHD Screening',
    description: 'Attention-deficit/hyperactivity disorder assessment for children and adults',
    sections: [
      {
        id: 'adhd-1',
        title: 'Inattention',
        description: 'Assessment of attention difficulties and distractibility',
        questionCount: 6,
        timeEstimate: '6-8 min'
      },
      {
        id: 'adhd-2',
        title: 'Hyperactivity',
        description: 'Evaluation of excessive movement and restlessness',
        questionCount: 4,
        timeEstimate: '4-6 min'
      },
      {
        id: 'adhd-3',
        title: 'Impulsivity',
        description: 'Assessment of impulsive behaviors and decision-making',
        questionCount: 3,
        timeEstimate: '3-5 min'
      }
    ]
  },
  'dsm5-bipolar': {
    id: 'dsm5-bipolar',
    name: 'DSM-5 Bipolar Disorder Assessment',
    description: 'Evaluation for bipolar and related disorders according to DSM-5',
    sections: [
      {
        id: 'bipolar-1',
        title: 'Manic Episodes',
        description: 'Assessment of manic symptoms and episodes',
        questionCount: 7,
        timeEstimate: '7-9 min'
      },
      {
        id: 'bipolar-2',
        title: 'Hypomanic Episodes',
        description: 'Evaluation of hypomanic symptoms and episodes',
        questionCount: 5,
        timeEstimate: '5-7 min'
      },
      {
        id: 'bipolar-3',
        title: 'Depressive Episodes',
        description: 'Assessment of depressive symptoms in context of bipolar disorder',
        questionCount: 6,
        timeEstimate: '6-8 min'
      }
    ]
  },
  'dsm5-ocd': {
    id: 'dsm5-ocd',
    name: 'DSM-5 OCD Assessment',
    description: 'Obsessive-compulsive and related disorders screening based on DSM-5',
    sections: [
      {
        id: 'ocd-1',
        title: 'Obsessions',
        description: 'Assessment of persistent unwanted thoughts and images',
        questionCount: 5,
        timeEstimate: '5-7 min'
      },
      {
        id: 'ocd-2',
        title: 'Compulsions',
        description: 'Evaluation of repetitive behaviors or mental acts',
        questionCount: 5,
        timeEstimate: '5-7 min'
      },
      {
        id: 'ocd-3',
        title: 'Functional Impact',
        description: 'Assessment of impact on daily functioning',
        questionCount: 3,
        timeEstimate: '3-4 min'
      }
    ]
  }
};

// Mock data for section previews
const sectionPreviewsData = {
  'dep-1': {
    questions: [
      "Over the past two weeks, how often have you felt sad, empty, or hopeless?",
      "How would you rate your mood most days?",
      "Have others noticed changes in your mood?",
      "Do you find yourself crying more often than usual?",
      "How long do these feelings typically last?"
    ]
  },
  'anx-1': {
    questions: [
      "How often do you find yourself worrying excessively?",
      "Do you find it difficult to control your worry?",
      "What topics do you tend to worry about most?",
      "How long have you been experiencing this level of worry?",
      "How does this worry impact your daily life?"
    ]
  }
  // Other section previews would be added here in a real implementation
};

const AssessmentDetails = ({ assessmentId, onAddSection }) => {
  const [assessment, setAssessment] = useState(null);
  const [previewSectionId, setPreviewSectionId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [addedSections, setAddedSections] = useState([]);
  
  useEffect(() => {
    if (assessmentId && assessmentDetailsData[assessmentId]) {
      setAssessment(assessmentDetailsData[assessmentId]);
      setPreviewSectionId(null);
      setSuccessMessage(null);
      setAddedSections([]);
    } else {
      setAssessment(null);
    }
  }, [assessmentId]);
  
  const handleAddSection = (section) => {
    // Check if section is already added to avoid duplicates
    if (!addedSections.includes(section.id)) {
      // Call the parent component's onAddSection handler
      onAddSection(section);
      
      // Update local state for UI feedback
      setAddedSections([...addedSections, section.id]);
      
      // Show success message
      setSuccessMessage(`Added "${section.title}" to your custom assessment`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } else {
      // Show already added message
      setSuccessMessage(`"${section.title}" is already in your custom assessment`);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };
  
  const handlePreviewSection = (sectionId) => {
    // Toggle preview - if already viewing this section, close it
    setPreviewSectionId(previewSectionId === sectionId ? null : sectionId);
  };
  
  const handleUseAsTemplate = () => {
    // Create a new assessment template based on the current assessment
    const templateName = `Custom ${assessment.name}`;
    
    // Show success message
    setSuccessMessage(`Created template: "${templateName}"`);
    
    // In a real app, you would save this template to state or backend
    console.log(`Created new template: ${templateName} based on ${assessment.id}`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  if (!assessment) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Select an assessment to view details</p>
        </div>
      </div>
    );
  }
  
  const totalQuestions = assessment.sections.reduce((sum, section) => sum + section.questionCount, 0);
  const totalTimeMin = assessment.sections.reduce((sum, section) => {
    const timeRange = section.timeEstimate.split('-');
    const minTime = parseInt(timeRange[0], 10);
    return sum + minTime;
  }, 0);
  const totalTimeMax = assessment.sections.reduce((sum, section) => {
    const timeRange = section.timeEstimate.split('-');
    const maxTime = parseInt(timeRange[1], 10);
    return sum + maxTime;
  }, 0);
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Success message toast notification */}
      {successMessage && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-md">
            <div className="flex items-center">
              <CheckCircle size={16} className="mr-2" />
              <span>{successMessage}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">{assessment.name}</h2>
        <p className="text-gray-600 text-sm mb-2">{assessment.description}</p>
        <div className="flex gap-4 text-sm mb-4">
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {assessment.sections.length} Sections
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
            {totalQuestions} Questions
          </div>
          <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
            {totalTimeMin}-{totalTimeMax} mins
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <h3 className="font-medium text-gray-700 mb-2">Assessment Sections</h3>
        <div className="space-y-3">
          {assessment.sections.map(section => (
            <div 
              key={section.id} 
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-800">{section.title}</h4>
                <button 
                  onClick={() => handleAddSection(section)}
                  className={`p-1 rounded transition-all ${
                    addedSections.includes(section.id) 
                      ? "text-green-600 hover:text-green-800 hover:bg-green-50" 
                      : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  }`}
                  title={addedSections.includes(section.id) ? "Already added" : "Add to Custom Assessment"}
                >
                  {addedSections.includes(section.id) ? (
                    <CheckCircle size={18} />
                  ) : (
                    <PlusCircle size={18} />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              <div className="flex mt-2 justify-between items-center text-xs">
                <span className="text-gray-500">{section.questionCount} questions • {section.timeEstimate} to complete</span>
                <button 
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => handlePreviewSection(section.id)}
                >
                  {previewSectionId === section.id ? "Hide Preview" : "Preview"} 
                  <ChevronRight size={14} className={`ml-1 transition-transform ${previewSectionId === section.id ? "transform rotate-90" : ""}`} />
                </button>
              </div>
              
              {/* Section Preview */}
              {previewSectionId === section.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Sample Questions:</h5>
                  <ul className="text-xs text-gray-600 space-y-2 pl-2">
                    {sectionPreviewsData[section.id] ? (
                      sectionPreviewsData[section.id].questions.slice(0, 3).map((question, idx) => (
                        <li key={idx} className="list-disc list-inside">{question}</li>
                      ))
                    ) : (
                      <li className="italic">Preview not available for this section</li>
                    )}
                    {sectionPreviewsData[section.id] && sectionPreviewsData[section.id].questions.length > 3 && (
                      <li className="text-blue-600 cursor-pointer hover:underline">
                        + {sectionPreviewsData[section.id].questions.length - 3} more questions...
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              <CheckCircle size={16} className="inline mr-1 text-green-500" />
              DSM-5 Compliant Assessment
            </p>
          </div>
          <button 
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm py-1 px-2 rounded-lg hover:bg-blue-50"
            onClick={handleUseAsTemplate}
          >
            <Copy size={16} className="mr-1" />
            Use as Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetails;