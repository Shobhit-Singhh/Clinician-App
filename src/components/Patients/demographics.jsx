import React, { useState, useEffect } from 'react';
import { 
    User, Clipboard, HeartPulse, 
    ChevronLeft, ChevronRight 
} from 'lucide-react';
import patientsData from '/data/patient.json';

const Demographics = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [activePage, setActivePage] = useState(0);

    useEffect(() => {
        if (patientId) {
            const foundPatient = patientsData.patients.find(p => p.id === patientId);
            setPatient(foundPatient);
            setActivePage(0);
        }
    }, [patientId]);

    if (!patient) {
        return (
            <div className="h-full bg-white/90 rounded-lg shadow-sm flex items-center justify-center p-6">
                <p className="text-gray-500 text-base">Select a patient</p>
            </div>
        );
    }

    const pages = [
        {
            title: 'Personal',
            icon: <User className="w-6 h-6" />, 
            content: (
                <div className="flex flex-col gap-3 text-md text-gray-700 ">
                    <div><strong className="text-blue-600 ">Age:</strong> {patient.age}</div>
                    <div><strong className="text-blue-600">Gender:</strong> {patient.gender}</div>
                    <div className="col-span-2"><strong className="text-blue-600">Contact:</strong> {patient.contactNumber}</div>
                    <div className="col-span-2"><strong className="text-blue-600">Email:</strong> {patient.email}</div>
                </div>
            )
        },
        {
            title: 'Medical',
            icon: <Clipboard className="w-6 h-6" />, 
            content: (
                <div className="space-y-4 text-sm text-gray-700">
                    <div>
                        <strong className="text-blue-600 block mb-2">Primary Condition</strong>
                        <p className="bg-blue-50 p-3 rounded-md">{patient.primaryCondition}</p>
                    </div>
                    {patient.secondaryConditions.length > 0 && 
                        <div>
                            <strong className="text-blue-600 block mb-2">Secondary Conditions</strong>
                            <p className="bg-blue-50 p-3 rounded-md">
                                {patient.secondaryConditions.join(', ')}
                            </p>
                        </div>
                    }
                </div>
            )
        },
        {
            title: 'Vitals',
            icon: <HeartPulse className="w-6 h-6" />, 
            content: (
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    {Object.entries(patient.vitals).map(([key, value]) => (
                        <div key={key} className="bg-blue-50 p-3 rounded-lg text-center">
                            <strong className="text-blue-600 block mb-1 text-xs uppercase">
                                {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                            </strong>
                            <p>{value} {key === 'heartRate' ? 'bpm' : key === 'weight' ? 'kg' : 'cm'}</p>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    const navigatePage = (direction) => {
        const newPage = (activePage + direction + pages.length) % pages.length;
        setActivePage(newPage);
    };

    return (
        <div className="rounded-lg h-full p-4 flex flex-col max-w-xl mx-auto">
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <img
                        src={patient.image}
                        alt={patient.name}
                        className="w-36 h-36 rounded-full object-cover border-4 border-blue-100"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {patient.id}
                    </div>
                </div>
            </div>
            <div className="text-center text-lg font-semibold text-gray-800">{patient.name}</div>

            <div className="flex items-center justify-between">
                <button onClick={() => navigatePage(-1)} className="text-blue-600 p-2 hover:bg-blue-100 rounded-full">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex space-x-2">
                    {pages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActivePage(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                activePage === index ? 'bg-blue-500 w-5' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
                <button onClick={() => navigatePage(1)} className="text-blue-600 p-2 hover:bg-blue-100 rounded-full">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="relative flex-grow overflow-hidden">
                {pages.map((page, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                            activePage === index 
                                ? 'opacity-100 translate-x-0' 
                                : 'opacity-0 translate-x-full'
                        }`}
                    >
                        <div className="flex items-center mb-3 text-blue-600">
                            {page.icon}
                            <span className="ml-2 text-lg font-medium">{page.title}</span>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(100%-40px)] pr-3">
                            {page.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Demographics;
