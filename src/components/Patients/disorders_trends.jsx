import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { ChevronDown, Check } from 'lucide-react';
import patientsData from '/data/patient.json';

const DisordersTrends = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [selectedDisorders, setSelectedDisorders] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const foundPatient = patientId
            ? patientsData.patients.find(p => p.id === patientId)
            : null;
        setPatient(foundPatient);
        
        // Initially select all disorders
        if (foundPatient && foundPatient.disorders) {
            setSelectedDisorders(
                foundPatient.disorders.map(disorder => disorder.disorder)
            );
        }
    }, [patientId]);

    const disorders = patient?.disorders || [];

    const generateColorPalette = useMemo(() => {
        const baseColors = [
            '#3B82F6', '#10B981', '#EF4444',
            '#8B5CF6', '#F59E0B', '#6366F1'
        ];

        const colorMap = {};
        disorders.forEach((disorder, index) => {
            colorMap[disorder.disorder] = baseColors[index % baseColors.length];
        });

        return colorMap;
    }, [disorders]);

    const chartData = useMemo(() => {
        if (!disorders.length) return [];

        const maxLength = Math.max(...disorders.map(d => d.severity_trend.length));

        return Array.from({ length: maxLength }, (_, index) => {
            const dataPoint = { week: `W ${index + 1}` };
            disorders.forEach(disorder => {
                dataPoint[disorder.disorder] = disorder.severity_trend[index];
            });
            return dataPoint;
        });
    }, [disorders]);

    const toggleDisorderSelection = (disorder) => {
        setSelectedDisorders(prev => 
            prev.includes(disorder)
                ? prev.filter(d => d !== disorder)
                : [...prev, disorder]
        );
    };

    const isAllSelected = selectedDisorders.length === disorders.length;
    const toggleSelectAll = () => {
        setSelectedDisorders(
            isAllSelected 
                ? [] 
                : disorders.map(disorder => disorder.disorder)
        );
    };

    if (!patient) {
        return (
            <div className="h-full bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm font-semibold">Select a patient</p>
            </div>
        );
    }

    if (!disorders.length) {
        return (
            <div className="h-full bg-white/90 rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm">No disorder data</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg">
            <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-sm font-semibold text-gray-700">Primary Disorder Trends</h3>
                
                {/* Multi-Select Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-48 px-3 py-1 border rounded-md text-sm"
                    >
                        <span>
                            {selectedDisorders.length === disorders.length 
                                ? 'All Disorders' 
                                : `${selectedDisorders.length} Selected`}
                        </span>
                        <ChevronDown size={16} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                            {/* Select All Option */}
                            <div 
                                onClick={toggleSelectAll}
                                className="px-3 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                            >
                                <input 
                                    type="checkbox" 
                                    checked={isAllSelected}
                                    readOnly
                                    className="mr-2"
                                />
                                <span>Select All</span>
                            </div>

                            {/* Individual Disorder Options */}
                            {disorders.map(disorder => (
                                <div 
                                    key={disorder.disorder}
                                    onClick={() => toggleDisorderSelection(disorder.disorder)}
                                    className="px-3 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={selectedDisorders.includes(disorder.disorder)}
                                        readOnly
                                        className="mr-2"
                                    />
                                    <span>{disorder.disorder}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="130%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="week"
                            stroke=""
                            tickLine={false}
                            fontSize={12}
                        />
                        <YAxis
                            domain={[0, 10]}
                            stroke=""
                            tickLine={false}
                            fontSize={12}
                            tickCount={8}
                            label={{
                                value: "Severity Level",
                                angle: -90,
                                position: "insideLeft",
                                style: { textAnchor: "middle", fontSize: 12 },
                                dx: 20
                            }}
                        />

                        <Tooltip
                            contentStyle={{
                                fontSize: '15px',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                border: 'none'
                            }}
                        />

                        {disorders
                            .filter(disorder => selectedDisorders.includes(disorder.disorder))
                            .map(disorder => (
                                <Line
                                    key={disorder.disorder}
                                    type="monotone"
                                    dataKey={disorder.disorder}
                                    stroke={generateColorPalette[disorder.disorder]}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            ))
                        }
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DisordersTrends;