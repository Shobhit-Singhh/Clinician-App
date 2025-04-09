import React, { useState } from 'react';
import { Search, BookOpen, ChevronDown, Info, Star } from 'lucide-react';

// Mock data for assessments
const assessmentData = [
  {
    id: 'dsm5-depression',
    name: 'DSM-5 Depression Assessment',
    description: 'Comprehensive evaluation of depressive symptoms according to DSM-5 criteria',
    category: 'Mood Disorders',
    isFavorite: true
  },
  {
    id: 'dsm5-anxiety',
    name: 'DSM-5 Anxiety Assessment',
    description: 'Structured assessment for anxiety disorders following DSM-5 guidelines',
    category: 'Anxiety Disorders',
    isFavorite: true
  },
  {
    id: 'dsm5-ptsd',
    name: 'DSM-5 PTSD Evaluation',
    description: 'Trauma and stressor-related disorders assessment based on DSM-5',
    category: 'Trauma-Related Disorders',
    isFavorite: false
  },
  {
    id: 'dsm5-adhd',
    name: 'DSM-5 ADHD Screening',
    description: 'Attention-deficit/hyperactivity disorder assessment for children and adults',
    category: 'Neurodevelopmental Disorders',
    isFavorite: false
  },
  {
    id: 'dsm5-bipolar',
    name: 'DSM-5 Bipolar Disorder Assessment',
    description: 'Evaluation for bipolar and related disorders according to DSM-5',
    category: 'Mood Disorders',
    isFavorite: false
  },
  {
    id: 'dsm5-ocd',
    name: 'DSM-5 OCD Assessment',
    description: 'Obsessive-compulsive and related disorders screening based on DSM-5',
    category: 'Obsessive-Compulsive Disorders',
    isFavorite: false
  },
  {
    id: 'dsm5-substance',
    name: 'DSM-5 Substance Use Disorder',
    description: 'Comprehensive evaluation of substance-related and addictive disorders',
    category: 'Substance-Related Disorders',
    isFavorite: false
  },
  {
    id: 'dsm5-eating',
    name: 'DSM-5 Eating Disorders',
    description: 'Assessment for various eating disorders according to DSM-5 criteria',
    category: 'Feeding and Eating Disorders',
    isFavorite: false
  }
];

const AssessmentList = ({ onAssessmentSelect, selectedAssessmentId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [favorites, setFavorites] = useState(assessmentData.filter(item => item.isFavorite).map(item => item.id));

  // Get unique categories for filter dropdown
  const categories = ['All Categories', ...new Set(assessmentData.map(item => item.category))];
  
  const toggleFavorite = (assessmentId, e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setFavorites(prev => {
      if (prev.includes(assessmentId)) {
        return prev.filter(id => id !== assessmentId);
      } else {
        return [...prev, assessmentId];
      }
    });
  };
  
  // Filter assessments based on search term and category
  const filteredAssessments = assessmentData.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || assessment.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
          <BookOpen className="mr-2 text-blue-600" size={24} />
          DSM-5 Assessments
        </h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search assessments..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <select
            className="w-full appearance-none pl-4 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>
      
      {/* Assessment List */}
      <div className="overflow-y-auto flex-grow">
        {filteredAssessments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No assessments found
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAssessments.map((assessment) => (
              <div
                key={assessment.id}
                onClick={() => onAssessmentSelect(assessment.id)}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer group hover:bg-blue-50 hover:border-blue-300 ${
                  selectedAssessmentId === assessment.id 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-medium ${
                    selectedAssessmentId === assessment.id ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-600'
                  }`}>
                    {assessment.name}
                  </h3>
                  <button
                    onClick={(e) => toggleFavorite(assessment.id, e)}
                    className="p-1 rounded-full hover:bg-blue-100"
                  >
                    <Star
                      size={18}
                      className={`${
                        favorites.includes(assessment.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
                      } transition-colors`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {assessment.category}
                  </span>
                  <button className="p-1 text-blue-600 hover:text-blue-800 flex items-center text-xs">
                    <Info size={14} className="mr-1" /> Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentList;