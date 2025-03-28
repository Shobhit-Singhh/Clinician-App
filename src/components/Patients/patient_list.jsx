import React, { useState } from 'react';
import { Pin, Tag, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import patientsData from '/data/patient.json';

// Predefined tag categories
const tagCategories = [
    'Cardiology', 'Neurology', 'Pediatrics', 
    'Oncology', 'Dermatology', 'High Risk', 
    'Chronic Condition', 'Rare Condition'
];

const PatientList = ({ onPatientSelect }) => {
    const [patients, setPatients] = useState(patientsData.patients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [filter, setFilter] = useState('');
    const [newTag, setNewTag] = useState('');
    const [customTags, setCustomTags] = useState([]);
    const [isAddTagExpanded, setIsAddTagExpanded] = useState(false);

    const filteredPatients = patients
        .filter(patient =>
            patient.name.toLowerCase().includes(filter.toLowerCase()) ||
            patient.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
        )
        .sort((a, b) => b.pinned - a.pinned);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        onPatientSelect(patient.id);
    };

    const toggleTag = (patientId, tag) => {
        setPatients(patients.map(patient => {
            if (patient.id === patientId) {
                const tags = patient.tags.includes(tag) 
                    ? patient.tags.filter(t => t !== tag) 
                    : [...patient.tags, tag];
                return { ...patient, tags };
            }
            return patient;
        }));
    };

    const addCustomTag = () => {
        if (newTag.trim() && !customTags.includes(newTag.trim())) {
            setCustomTags([...customTags, newTag.trim()]);
            if (selectedPatient) {
                toggleTag(selectedPatient.id, newTag.trim());
            }
            setNewTag('');
        }
    };

    return (
        <div className="rounded-lg h-full flex flex-col relative">
            <div className="p-2 border-b">
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
            </div>
            <div className="flex-grow overflow-y-auto">
                {filteredPatients.map(patient => (
                    <div
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className={`
                            flex items-center p-2 cursor-pointer
                            ${selectedPatient?.id === patient.id
                                ? 'bg-blue-50 border-l-4 border-blue-500'
                                : 'hover:bg-gray-50'}
                        `}
                    >
                        <img src={patient.image} alt={patient.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                        <div className="flex-grow">
                            <div className="text-sm font-medium truncate">{patient.name}</div>
                            <div className="flex space-x-1 mt-1">
                                {patient.tags.slice(0, 2).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-1 text-xs bg-blue-100 text-blue-700 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setPatients(patients.map(p =>
                                    p.id === patient.id
                                        ? {...p, pinned: !p.pinned}
                                        : p
                                ));
                            }}
                            className={`
                                p-1 rounded-full
                                ${patient.pinned ? 'text-yellow-500' : 'text-gray-300'}
                            `}
                        >
                            <Pin size={16} fill={patient.pinned ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Tag Section */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t shadow-md p-2 rounded-md">
                <div
                    className="flex items-center justify-between cursor-pointer "
                    onClick={() => setIsAddTagExpanded(!isAddTagExpanded)}
                >
                    <h3 className="text-sm font-semibold">Add Tags</h3>
                    <button className="hover:bg-gray-200 p-1 rounded-full">
                        {isAddTagExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                </div>

                {isAddTagExpanded && (
                    <div className="mt-2">
                        <h4 className="text-xs font-medium mb-1">Predefined Tags</h4>
                        <div className="flex flex-wrap gap-1">
                            {tagCategories.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => selectedPatient && toggleTag(selectedPatient.id, tag)}
                                    className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                                    disabled={!selectedPatient}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <h4 className="text-xs font-medium mt-2 mb-1">Custom Tags</h4>
                        <div className="flex mb-1">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Enter custom tag"
                                className="flex-grow px-2 py-1 text-xs border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                onClick={addCustomTag}
                                className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 disabled:opacity-50"
                                disabled={!newTag.trim() || !selectedPatient}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {customTags.map(tag => (
                                <span 
                                    key={tag} 
                                    className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center"
                                >
                                    {tag}
                                    <button 
                                        onClick={() => setCustomTags(customTags.filter(t => t !== tag))} 
                                        className="ml-1 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientList;