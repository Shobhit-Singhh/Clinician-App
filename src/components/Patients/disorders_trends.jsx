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
import patientsData from '/data/patient.json';
import { BarChart } from 'lucide-react';

const DisordersTrends = ({ patientId }) => {
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        const foundPatient = patientId
            ? patientsData.patients.find(p => p.id === patientId)
            : null;
        setPatient(foundPatient);
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

    if (!patient) {
        return (
            <div className="h-full bg-white/90 rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm">Select a patient</p>
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
        <div className=" rounded-lg h-full p-4">
            <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
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

                        {disorders.map(disorder => (
                            <Line
                                key={disorder.disorder}
                                type="monotone"
                                dataKey={disorder.disorder}
                                stroke={generateColorPalette[disorder.disorder]}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DisordersTrends;