import React, { useState } from 'react';
import { Pin, Tag, ChevronRight, ChevronDown, Plus } from 'lucide-react';

const initialPatients = [
    { id: 1, name: 'Emily Johnson', image: '/api/placeholder/100/100', tags: ['Cardiology', 'High Risk'], pinned: false },
    { id: 2, name: 'Michael Chen', image: '/api/placeholder/100/100', tags: ['Neurology'], pinned: false },
    { id: 3, name: 'Sarah Rodriguez', image: '/api/placeholder/100/100', tags: ['Pediatrics', 'Rare Condition'], pinned: true },
    { id: 4, name: 'David Kim', image: '/api/placeholder/100/100', tags: ['Oncology'], pinned: false },
    { id: 5, name: 'Olivia Martinez', image: '/api/placeholder/100/100', tags: ['Dermatology'], pinned: false }
];

const tagCategories = ['Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Dermatology', 'High Risk', 'Chronic Condition', 'Rare Condition'];

const PatientList = () => {
    const [patients, setPatients] = useState(initialPatients);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newTag, setNewTag] = useState('');
    const [customTags, setCustomTags] = useState([]);
    const [isAddTagExpanded, setIsAddTagExpanded] = useState(false);

    const togglePin = (id) => {
        setPatients(patients.map(patient => patient.id === id ? { ...patient, pinned: !patient.pinned } : patient));
    };

    const toggleTag = (patientId, tag) => {
        setPatients(patients.map(patient => {
            if (patient.id === patientId) {
                const tags = patient.tags.includes(tag) ? patient.tags.filter(t => t !== tag) : [...patient.tags, tag];
                return { ...patient, tags };
            }
            return patient;
        }));
    };

    const addCustomTag = () => {
        if (newTag.trim() && !customTags.includes(newTag.trim())) {
            setCustomTags([...customTags, newTag.trim()]);
            setNewTag('');
        }
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col w-full relative">
            <div className="flex-grow overflow-y-auto p-2 pb-20">
                {patients.sort((a, b) => b.pinned - a.pinned).map(patient => (
                    <div
                        key={patient.id}
                        className={`flex items-center p-3 mb-2 rounded-lg ${selectedPatient?.id === patient.id ? 'bg-blue-100 shadow-md' : 'bg-white hover:bg-gray-100'}`}
                        onClick={() => setSelectedPatient(patient)}
                    >
                        <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                        <div className="flex-grow">
                            <div className="font-semibold text-gray-800">{patient.name}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {patient.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                                        {tag}
                                        <button onClick={(e) => { e.stopPropagation(); toggleTag(patient.id, tag); }} className="ml-1 hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); togglePin(patient.id); }}
                            className={`hover:bg-gray-200 p-1 rounded-full ${patient.pinned ? 'text-yellow-500' : 'text-gray-500'}`}
                        >
                            <Pin size={20} fill={patient.pinned ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Fixed Add Tag Section */}
            <div className="bottom-0 left-0 w-full bg-white border-t shadow-md p-4">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsAddTagExpanded(!isAddTagExpanded)}
                >
                    <h3 className="text-lg font-semibold">Add Tags</h3>
                    <button className="hover:bg-gray-200 p-1 rounded-full">
                        {isAddTagExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                {isAddTagExpanded && (
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Predefined Tags</h4>
                        <div className="flex flex-wrap gap-2">
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

                        <h4 className="text-sm font-medium mt-4 mb-2">Custom Tags</h4>
                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Enter custom tag"
                                className="flex-grow px-2 py-1 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={addCustomTag}
                                className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 disabled:opacity-50"
                                disabled={!newTag.trim()}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {customTags.map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center">
                                    {tag}
                                    <button onClick={() => setCustomTags(customTags.filter(t => t !== tag))} className="ml-1 hover:text-red-500">×</button>
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
