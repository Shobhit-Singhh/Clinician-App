import React, { useState } from 'react';
import { Search, ChevronDown, Users, UserCheck, Filter } from 'lucide-react';

// Mock data for patients
const patientData = [
    {
        id: 'p1',
        name: 'Emma Thompson',
        patientId: 'PT-78943',
        age: 34,
        diagnosis: 'Major Depressive Disorder',
        lastSeen: '2025-03-28',
        status: 'Active Treatment'
    },
    {
        id: 'p2',
        name: 'Michael Chen',
        patientId: 'PT-89234',
        age: 28,
        diagnosis: 'Generalized Anxiety Disorder',
        lastSeen: '2025-04-01',
        status: 'Initial Consultation'
    },
    {
        id: 'p3',
        name: 'Sarah Rodriguez',
        patientId: 'PT-67295',
        age: 42,
        diagnosis: 'PTSD',
        lastSeen: '2025-03-25',
        status: 'Follow-up Care'
    },
    {
        id: 'p4',
        name: 'David Kim',
        patientId: 'PT-91478',
        age: 19,
        diagnosis: 'Social Anxiety Disorder',
        lastSeen: '2025-04-03',
        status: 'Active Treatment'
    },
    {
        id: 'p5',
        name: 'Jennifer Miller',
        patientId: 'PT-45382',
        age: 51,
        diagnosis: 'Bipolar II Disorder',
        lastSeen: '2025-03-30',
        status: 'Follow-up Care'
    },
    {
        id: 'p6',
        name: 'Robert Washington',
        patientId: 'PT-23865',
        age: 37,
        diagnosis: 'OCD',
        lastSeen: '2025-04-02',
        status: 'Active Treatment'
    },
    {
        id: 'p7',
        name: 'Emily Parker',
        patientId: 'PT-58934',
        age: 25,
        diagnosis: 'Adjustment Disorder',
        lastSeen: '2025-03-29',
        status: 'Initial Consultation'
    },
    {
        id: 'p8',
        name: 'James Wilson',
        patientId: 'PT-34712',
        age: 45,
        diagnosis: 'Substance Use Disorder',
        lastSeen: '2025-04-05',
        status: 'Active Treatment'
    }
];

const PatientList = ({ selectedPatientIds, onPatientSelect, assessmentId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Filter patients based on search term and status filter
    const filteredPatients = patientData.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort patients based on selected sort criteria
    const sortedPatients = [...filteredPatients].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'recent':
                return new Date(b.lastSeen) - new Date(a.lastSeen);
            case 'age':
                return a.age - b.age;
            default:
                return 0;
        }
    });

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <div className='bg-gradient-to-r p-4 border-b border-gray-200 flex items-center justify-between'>

                    <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                        <Users className="mr-2 text-blue-600" size={24} />
                        Assign to Patients
                    </h2>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex mb-3 gap-2">
                    <div className="relative flex-grow">
                        <select
                            className="w-full appearance-none pl-4 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active Treatment">Active Treatment</option>
                            <option value="Initial Consultation">Initial Consultation</option>
                            <option value="Follow-up Care">Follow-up Care</option>
                        </select>
                        <ChevronDown
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>

                    <div className="relative">
                        <button
                            className="flex items-center justify-center px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                        >
                            <Filter size={18} />
                        </button>

                        {isFilterMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                                <div className="p-2">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Sort by</p>
                                    <div className="space-y-1">
                                        <button
                                            className={`w-full text-left px-3 py-1.5 rounded text-sm ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                            onClick={() => { setSortBy('name'); setIsFilterMenuOpen(false); }}
                                        >
                                            Name (A-Z)
                                        </button>
                                        <button
                                            className={`w-full text-left px-3 py-1.5 rounded text-sm ${sortBy === 'recent' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                            onClick={() => { setSortBy('recent'); setIsFilterMenuOpen(false); }}
                                        >
                                            Recently Seen
                                        </button>
                                        <button
                                            className={`w-full text-left px-3 py-1.5 rounded text-sm ${sortBy === 'age' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                            onClick={() => { setSortBy('age'); setIsFilterMenuOpen(false); }}
                                        >
                                            Age (Youngest First)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Count */}
                {selectedPatientIds.length > 0 && (
                    <div className="bg-blue-50 text-blue-700 text-sm py-2 px-3 rounded-lg mb-3">
                        {selectedPatientIds.length} patient{selectedPatientIds.length !== 1 ? 's' : ''} selected
                    </div>
                )}
            </div>

            {/* Patient List */}
            <div className="overflow-y-auto flex-grow">
                {sortedPatients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No patients found
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sortedPatients.map((patient) => (
                            <div
                                key={patient.id}
                                onClick={() => onPatientSelect(patient.id)}
                                className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedPatientIds.includes(patient.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{patient.name}</h3>
                                        <div className="text-xs text-gray-500 mt-1">
                                            ID: {patient.patientId} • Age: {patient.age}
                                        </div>
                                    </div>
                                    {selectedPatientIds.includes(patient.id) && (
                                        <UserCheck size={18} className="text-blue-600" />
                                    )}
                                </div>
                                <div className="mt-2">
                                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                        {patient.diagnosis}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2 text-xs">
                                    <span className="text-gray-500">
                                        Last seen: {new Date(patient.lastSeen).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full ${patient.status === 'Active Treatment' ? 'bg-green-100 text-green-700' :
                                            patient.status === 'Initial Consultation' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {patient.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                {assessmentId && selectedPatientIds.length > 0 && (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                        Assign Assessment to {selectedPatientIds.length} Patient{selectedPatientIds.length !== 1 ? 's' : ''}
                    </button>
                )}
                {(!assessmentId || selectedPatientIds.length === 0) && (
                    <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed">
                        {!assessmentId ? 'Select an assessment first' : 'Select at least one patient'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PatientList;