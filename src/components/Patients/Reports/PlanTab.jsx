import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Check, X, Plus } from 'lucide-react';
import LifestyleInterventionsSection from "./LifestyleInterventions";

const PlanTab = ({ patient, openSections, toggleSection }) => {
    // State for strategies section
    const [selectedStrategies, setSelectedStrategies] = useState([]);
    const [approvedStrategies, setApprovedStrategies] = useState(
        patient?.soap?.plan?.approvedCopingStrategies || []
    );
    const [newStrategy, setNewStrategy] = useState('');

    // State for medications section
    const [selectedMedications, setSelectedMedications] = useState([]);
    const [newMedication, setNewMedication] = useState({
        name: '',
        dosage: '',
        frequency: '',
        purpose: ''
    });

    // State for treatment goals section
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({
        goal: '',
        timeframe: '',
        interventions: []
    });
    const [newIntervention, setNewIntervention] = useState('');

    // Initialize with data from patient record if available
    React.useEffect(() => {
        if (patient?.soap?.plan) {
            const plan = patient.soap.plan;

            // Initialize coping strategies
            if (plan.approvedCopingStrategies) {
                setSelectedStrategies(plan.approvedCopingStrategies);
                setApprovedStrategies(plan.approvedCopingStrategies);
            }

            // Initialize approved medications
            if (plan.medications) {
                setSelectedMedications(plan.medications.filter(med => med.approved));
            }

            // Initialize treatment goals
            if (plan.treatmentGoals) {
                setSelectedGoals(plan.treatmentGoals.filter(goal => goal.approved));
            }
        }
    }, [patient]);

    // Suggested coping strategies - mix of fixed and random from original list
    const suggestedStrategies = patient?.soap?.plan?.suggestedCopingStrategies || [
        "Cognitive Behavioral Therapy",
        "Mindfulness Meditation",
        "Regular Exercise",
        "Sleep Hygiene",
        "Support Group Therapy",
        "Stress Management Techniques",
        "Psychotherapy",
        "Medication Adjustment",
        "Nutritional Counseling",
        "Art Therapy",
        "Exposure Therapy",
        "Dialectical Behavior Therapy"
    ];

    const randomStrategies = suggestedStrategies
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    // Coping Strategies Functions
    const handleAddCustomStrategy = () => {
        if (newStrategy.trim() && !selectedStrategies.includes(newStrategy.trim())) {
            setSelectedStrategies([...selectedStrategies, newStrategy.trim()]);
            setNewStrategy('');
        }
    };

    const handleApproveStrategy = (strategy) => {
        if (!approvedStrategies.includes(strategy)) {
            setApprovedStrategies([...approvedStrategies, strategy]);

            if (!selectedStrategies.includes(strategy)) {
                setSelectedStrategies([...selectedStrategies, strategy]);
            }
        }
    };

    const handleRemoveStrategy = (strategyToRemove) => {
        setSelectedStrategies(selectedStrategies.filter(strategy => strategy !== strategyToRemove));
        setApprovedStrategies(approvedStrategies.filter(strategy => strategy !== strategyToRemove));
    };

    // Medication Functions
    const handleAddMedication = () => {
        if (newMedication.name.trim() && newMedication.dosage.trim()) {
            const medicationToAdd = {
                ...newMedication,
                approved: true
            };
            setSelectedMedications([...selectedMedications, medicationToAdd]);
            setNewMedication({
                name: '',
                dosage: '',
                frequency: '',
                purpose: ''
            });
        }
    };

    const handleApproveSuggestedMedication = (medication) => {
        const medicationToAdd = {
            ...medication,
            approved: true,
            startDate: new Date().toISOString().split('T')[0]
        };

        setSelectedMedications([...selectedMedications, medicationToAdd]);
    };

    const handleRemoveMedication = (medicationName) => {
        setSelectedMedications(selectedMedications.filter(med => med.name !== medicationName));
    };

    // Treatment Goals Functions
    const handleAddIntervention = () => {
        if (newIntervention.trim() && !newGoal.interventions.includes(newIntervention.trim())) {
            setNewGoal({
                ...newGoal,
                interventions: [...newGoal.interventions, newIntervention.trim()]
            });
            setNewIntervention('');
        }
    };

    if (!patient?.soap?.plan) return (
        <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No plan data available</p>
        </div>
    );

    const { plan } = patient.soap;

    return (
        <div className="space-y-4">
            {/* Coping Strategies Section */}
            <div className="border rounded-lg p-4 shadow-sm bg-white">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleSection('plan_strategies')}
                >
                    {openSections['plan_strategies'] ?
                        <ChevronDown size={16} className="text-amber-500" /> :
                        <ChevronRight size={16} className="text-amber-500" />
                    }
                    <h3 className="font-semibold text-gray-800 ml-2">
                        Coping Strategies
                    </h3>
                </div>

                {openSections['plan_strategies'] && (
                    <div className="mt-4">
                        {/* Selected Strategies */}
                        <div className="mb-6">
                            <strong className="text-amber-700 block mb-2">Approved Coping Strategies:</strong>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedStrategies.length > 0 ? (
                                    selectedStrategies.map((strategy) => (
                                        <div
                                            key={strategy}
                                            className={`flex items-center rounded-full px-3 py-1 text-sm ${approvedStrategies.includes(strategy)
                                                ? 'bg-green-100 text-green-800 border border-green-300'
                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                                }`}
                                        >
                                            {strategy}
                                            <button
                                                onClick={() => handleRemoveStrategy(strategy)}
                                                className="ml-2 hover:text-red-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No strategies selected yet</p>
                                )}
                            </div>
                        </div>

                        {/* Suggested Strategies */}
                        <div className="mb-6">
                            <strong className="text-amber-700 block mb-2">Suggested Strategies:</strong>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {randomStrategies
                                    .filter(strategy => !selectedStrategies.includes(strategy))
                                    .map((strategy) => (
                                        <button
                                            key={strategy}
                                            onClick={() => handleApproveStrategy(strategy)}
                                            className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                                        >
                                            {strategy}
                                            <Plus size={14} className="ml-2" />
                                        </button>
                                    ))}
                                {randomStrategies.every(strategy => selectedStrategies.includes(strategy)) && (
                                    <p className="text-gray-500 text-sm italic">All suggested strategies have been selected</p>
                                )}
                            </div>
                        </div>

                        {/* Add Custom Strategy */}
                        <div className="mb-4">
                            <strong className="text-amber-700 block mb-2">Add Custom Strategy:</strong>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newStrategy}
                                    onChange={(e) => setNewStrategy(e.target.value)}
                                    placeholder="Enter a new coping strategy"
                                    className="flex-grow p-2 border rounded-md text-sm"
                                />
                                <button
                                    onClick={handleAddCustomStrategy}
                                    className="bg-amber-500 text-white p-2 rounded-md hover:bg-amber-600 flex items-center"
                                    disabled={!newStrategy.trim()}
                                >
                                    <Plus size={16} className="mr-1" /> Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Medications Section */}
            <div className="border rounded-lg p-4 shadow-sm bg-white">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleSection('plan_medications')}
                >
                    {openSections['plan_medications'] ?
                        <ChevronDown size={16} className="text-amber-500" /> :
                        <ChevronRight size={16} className="text-amber-500" />
                    }
                    <h3 className="font-semibold text-gray-800 ml-2">
                        Medications
                    </h3>
                </div>

                {openSections['plan_medications'] && (
                    <div className="mt-4">
                        {/* Selected Medications */}
                        <div className="mb-6">
                            <strong className="text-amber-700 block mb-2">Approved Medications:</strong>
                            <div className="overflow-x-auto">
                                {selectedMedications.length > 0 ? (
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-amber-50 text-amber-700">
                                            <tr>
                                                <th className="py-2 px-4 text-left">Medication</th>
                                                <th className="py-2 px-4 text-left">Dosage(mg)</th>
                                                <th className="py-2 px-4 text-left">Frequency</th>
                                                <th className="py-2 px-4 text-left">Purpose</th>
                                                <th className="py-2 px-4 text-left">Instructions</th>
                                                <th className="py-2 px-4 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedMedications.map((med, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                    <td className="py-2 px-4 border-t">{med.name}</td>
                                                    <td className="py-2 px-4 border-t">{med.dosage}</td>
                                                    <td className="py-2 px-4 border-t">{med.frequency}</td>
                                                    <td className="py-2 px-4 border-t">{med.purpose}</td>
                                                    <td className="py-2 px-4 border-t">{med.instructions || 'Not specified'}</td>
                                                    <td className="py-2 px-4 border-t">
                                                        <button
                                                            onClick={() => handleRemoveMedication(med.name)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No medications approved yet</p>
                                )}
                            </div>
                        </div>

                        {/* Suggested Medications */}
                        {plan.suggestedMedications && plan.suggestedMedications.length > 0 && (
                            <div className="mb-6">
                                <strong className="text-amber-700 block mb-2">Suggested Medications:</strong>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-blue-50 text-blue-700">
                                            <tr>
                                                <th className="py-2 px-4 text-left">Medication</th>
                                                <th className="py-2 px-4 text-left">Dosage(mg)</th>
                                                <th className="py-2 px-4 text-left">Frequency</th>
                                                <th className="py-2 px-4 text-left">Purpose</th>
                                                <th className="py-2 px-4 text-left">Side Effects</th>
                                                <th className="py-2 px-4 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plan.suggestedMedications
                                                .filter(med => !selectedMedications.some(sm => sm.name === med.name))
                                                .map((med, idx) => (
                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                        <td className="py-2 px-4 border-t">{med.name}</td>
                                                        <td className="py-2 px-4 border-t">{med.dosage}</td>
                                                        <td className="py-2 px-4 border-t">{med.frequency}</td>
                                                        <td className="py-2 px-4 border-t">{med.purpose}</td>
                                                        <td className="py-2 px-4 border-t">
                                                            {med.potentialSideEffects && med.potentialSideEffects.join(', ')}
                                                        </td>
                                                        <td className="py-2 px-4 border-t">
                                                            <button
                                                                onClick={() => handleApproveSuggestedMedication(med)}
                                                                className="text-green-500 hover:text-green-700"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Add Custom Medication */}
                        <div className="mb-4">
                            <strong className="text-amber-700 block mb-2">Add Custom Medication:</strong>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm mb-1">Medication Name</label>
                                    <input
                                        type="text"
                                        value={newMedication.name}
                                        onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                                        placeholder="Enter medication name"
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Dosage</label>
                                    <input
                                        type="text"
                                        value={newMedication.dosage}
                                        onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                        placeholder="Enter dosage"
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Frequency</label>
                                    <input
                                        type="text"
                                        value={newMedication.frequency}
                                        onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                                        placeholder="Enter frequency"
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Purpose</label>
                                    <input
                                        type="text"
                                        value={newMedication.purpose}
                                        onChange={(e) => setNewMedication({ ...newMedication, purpose: e.target.value })}
                                        placeholder="Enter purpose"
                                        className="w-full p-2 border rounded-md text-sm"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddMedication}
                                className="bg-amber-500 text-white p-2 rounded-md hover:bg-amber-600 flex items-center"
                                disabled={!newMedication.name.trim() || !newMedication.dosage.trim()}
                            >
                                <Plus size={16} className="mr-1" /> Add Medication
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Lifestyle Interventions */}
            <LifestyleInterventionsSection
                plan={patient?.soap?.plan}
                openSections={openSections}
                toggleSection={toggleSection}
            />


            {/* Safety Plan */}
            {plan.safetyPlan && (
                <div className="border rounded-lg p-4 shadow-sm bg-white">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('plan_safety')}
                    >
                        {openSections['plan_safety'] ?
                            <ChevronDown size={16} className="text-amber-500" /> :
                            <ChevronRight size={16} className="text-amber-500" />
                        }
                        <h3 className="font-semibold text-gray-800 ml-2">
                            Safety Plan
                        </h3>
                    </div>

                    {openSections['plan_safety'] && (
                        <div className="mt-4 space-y-3">
                            {/* Editable Safety Plan */}
                            <h4 className="font-medium text-amber-700 mb-1">
                                Edit Safety Plan:
                            </h4>
                            {Object.entries(plan.safetyPlan)
                                .filter(([key]) => key !== 'approved')
                                .map(([key, value]) => {
                                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

                                    if (key === 'supportContacts' || key === 'professionalResources') {
                                        return (
                                            <div key={key} className="p-3 bg-amber-50 rounded-lg mb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-medium text-amber-700">{formattedKey}:</h4>
                                                    <button
                                                        className="text-xs text-amber-600 hover:underline"
                                                        onClick={() => console.log('Add contact/resource')}
                                                    >
                                                        + Add
                                                    </button>
                                                </div>
                                                {value.map((contact, idx) => (
                                                    <div key={idx} className="bg-white p-3 rounded border border-amber-200 mb-2 relative">
                                                        <div className="flex gap-2 items-center">
                                                            <input
                                                                type="text"
                                                                className="w-1/2 text-sm border rounded p-2"
                                                                defaultValue={contact.name}
                                                                placeholder="Name"
                                                            />
                                                            <input
                                                                type="text"
                                                                className="w-1/2 text-sm border rounded p-2"
                                                                defaultValue={contact.phone || contact.contact || contact.address}
                                                                placeholder="Phone / Contact / Address"
                                                            />
                                                            <button
                                                                className="text-xs text-red-500 hover:underline whitespace-nowrap"
                                                                onClick={() => console.log('Remove contact/resource')}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={key} className="p-3 bg-amber-50 rounded-lg mb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-medium text-amber-700">{formattedKey}:</h4>
                                                    <button
                                                        className="text-xs text-amber-600 hover:underline"
                                                        onClick={() => console.log('Add item')}
                                                    >
                                                        + Add
                                                    </button>
                                                </div>
                                                <div className="bg-white p-3 rounded border border-amber-200">
                                                    {typeof value === 'string' ? (
                                                        <textarea
                                                            className="w-full border rounded p-2 text-sm"
                                                            rows={3}
                                                            defaultValue={value}
                                                        />
                                                    ) : Array.isArray(value) ? (
                                                        value.map((item, idx) => (
                                                            <div key={idx} className="relative">
                                                                <input
                                                                    type="text"
                                                                    className="w-full border rounded p-2 text-sm mb-2"
                                                                    defaultValue={item}
                                                                />
                                                                <button
                                                                    className="absolute right-2 top-2 text-xs text-red-500 hover:underline"
                                                                    onClick={() => console.log('Remove item')}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <textarea
                                                            className="w-full border rounded p-2 text-sm"
                                                            rows={4}
                                                            defaultValue={JSON.stringify(value, null, 2)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                })}

                            {/* Save Button */}
                            <div className="px-3">
                            </div>
                        </div>
                    )}


                </div>
            )}
        </div>
    );
};

export default PlanTab;