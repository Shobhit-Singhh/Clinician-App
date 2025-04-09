import React, { useState, useEffect } from 'react';
import {
    ChevronDown, ChevronRight, Check, X, Plus, Edit, Save,
    Medal, Dumbbell, Utensils, Moon, Droplet, Briefcase, Users,
    Heart, BookOpen, PiggyBank, Brain, Music, Globe, ShoppingCart,
    Leaf, Smile, Target, Timer, Home, ClipboardCheck, Handshake, Lightbulb
} from 'lucide-react';
const ActivityDropdown = ({ activity, day, category, handleAssignToDay }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleDayClick = (e, selectedDay) => {
        e.stopPropagation();
        handleAssignToDay(activity, selectedDay, category);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative">
            
        </div>
    );
};


// Map category names to their respective icons
const categoryIcons = {
    exercise: Dumbbell,
    diet: Utensils,
    sleep: Moon,
    hydration: Droplet,
    work: Briefcase,
    family: Users,
    relationships: Heart,
    learning: BookOpen,
    finance: PiggyBank,
    mindfulness: Brain,
    music: Music,
    travel: Globe,
    spending: ShoppingCart,
    sustainability: Leaf,
    gratitude: Smile,
    goals: Target,
    timeManagement: Timer,
    homeOrganization: Home,
    taskCompletion: ClipboardCheck,
    networking: Handshake,
    creativity: Lightbulb
};

// Map reminder types to their respective icons
const reminderIcons = {
    water: Droplet,
    meditation: Brain,
    stretching: Dumbbell,
    eyeRelaxation: Moon,
    medication: ClipboardCheck,
    breathing: Brain,
    breaks: Timer
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const LifestyleInterventionsSection = ({ plan, openSections, toggleSection }) => {
    const [editMode, setEditMode] = useState(false);
    const [lifestyleData, setLifestyleData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newActivity, setNewActivity] = useState({
        name: '',
        description: '',
        frequency: '',
        duration: '',
        category: '',
        isCustom: true
    });
    const [newReminder, setNewReminder] = useState({
        name: '',
        type: '',
        frequency: '',
        time: '',
        isCustom: true
    });


    // Weekly planner state
    const [weeklyPlan, setWeeklyPlan] = useState({});

    useEffect(() => {
        if (plan?.lifestyleInterventions) {
            setLifestyleData(plan.lifestyleInterventions);

            // Initialize weekly plan if it exists
            if (plan.lifestyleInterventions.weeklyPlan) {
                setWeeklyPlan(plan.lifestyleInterventions.weeklyPlan);
            } else {
                // Create empty weekly plan structure
                const emptyWeeklyPlan = {};
                daysOfWeek.forEach(day => {
                    emptyWeeklyPlan[day] = [];
                });
                setWeeklyPlan(emptyWeeklyPlan);
            }
        }
    }, [plan]);

    const handleAddActivity = () => {
        if (newActivity.name.trim() && newActivity.category) {
            const updatedLifestyleData = { ...lifestyleData };

            if (!updatedLifestyleData.activities) {
                updatedLifestyleData.activities = {};
            }

            if (!updatedLifestyleData.activities[newActivity.category]) {
                updatedLifestyleData.activities[newActivity.category] = [];
            }

            updatedLifestyleData.activities[newActivity.category].push({
                ...newActivity,
                id: Date.now(),
                approved: false
            });

            setLifestyleData(updatedLifestyleData);
            setNewActivity({
                name: '',
                description: '',
                frequency: '',
                duration: '',
                category: newActivity.category,
                isCustom: true
            });
        }
    };

    const handleAddReminder = () => {
        if (newReminder.name.trim() && newReminder.type) {
            const updatedLifestyleData = { ...lifestyleData };

            if (!updatedLifestyleData.reminders) {
                updatedLifestyleData.reminders = [];
            }

            updatedLifestyleData.reminders.push({
                ...newReminder,
                id: Date.now(),
                approved: false
            });

            setLifestyleData(updatedLifestyleData);
            setNewReminder({
                name: '',
                type: '',
                frequency: '',
                time: '',
                isCustom: true
            });
        }
    };

    const handleApproveActivity = (category, activityId) => {
        const updatedLifestyleData = { ...lifestyleData };
        const activityIndex = updatedLifestyleData.activities[category].findIndex(
            activity => activity.id === activityId
        );

        if (activityIndex !== -1) {
            updatedLifestyleData.activities[category][activityIndex].approved = true;
            setLifestyleData(updatedLifestyleData);
        }
    };

    const handleApproveReminder = (reminderId) => {
        const updatedLifestyleData = { ...lifestyleData };
        const reminderIndex = updatedLifestyleData.reminders.findIndex(
            reminder => reminder.id === reminderId
        );

        if (reminderIndex !== -1) {
            updatedLifestyleData.reminders[reminderIndex].approved = true;
            setLifestyleData(updatedLifestyleData);
        }
    };

    const handleRemoveActivity = (category, activityId) => {
        const updatedLifestyleData = { ...lifestyleData };
        updatedLifestyleData.activities[category] = updatedLifestyleData.activities[category].filter(
            activity => activity.id !== activityId
        );
        setLifestyleData(updatedLifestyleData);
    };

    const handleRemoveReminder = (reminderId) => {
        const updatedLifestyleData = { ...lifestyleData };
        updatedLifestyleData.reminders = updatedLifestyleData.reminders.filter(
            reminder => reminder.id !== reminderId
        );
        setLifestyleData(updatedLifestyleData);
    };

    const handleAssignToDay = (item, day, category) => {
        const updatedWeeklyPlan = { ...weeklyPlan };

        if (!updatedWeeklyPlan[day]) {
            updatedWeeklyPlan[day] = [];
        }

        // Check if already assigned
        const isAlreadyAssigned = updatedWeeklyPlan[day].some(
            assignment => assignment.id === item.id && assignment.category === category
        );

        if (!isAlreadyAssigned) {
            updatedWeeklyPlan[day].push({
                id: item.id,
                name: item.name,
                category: category,
                duration: item.duration || '30 min'
            });
        }

        setWeeklyPlan(updatedWeeklyPlan);
    };

    const handleRemoveFromDay = (itemId, day) => {
        const updatedWeeklyPlan = { ...weeklyPlan };
        updatedWeeklyPlan[day] = updatedWeeklyPlan[day].filter(item => item.id !== itemId);
        setWeeklyPlan(updatedWeeklyPlan);
    };

    const handleSaveChanges = () => {
        // Here you would typically send the data to your backend
        console.log("Saving updated lifestyle data:", lifestyleData);
        console.log("Saving weekly plan:", weeklyPlan);
        setEditMode(false);
    };

    const renderCategories = () => {
        if (!lifestyleData.activities) return null;

        return Object.keys(categoryIcons).map(category => {
            const CategoryIcon = categoryIcons[category];
            const activities = lifestyleData.activities[category] || [];
            const approvedCount = activities.filter(activity => activity.approved).length;
            const totalCount = activities.length;

            return (
                <div
                    key={category}
                    className={`p-3 rounded-lg mb-3 cursor-pointer transition-all ${selectedCategory === category ? 'bg-amber-100 border-2 border-amber-500' : 'bg-white border border-gray-200 hover:border-amber-300'
                        }`}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <CategoryIcon size={18} className="text-amber-600 mr-2" />
                            <span className="font-medium capitalize">
                                {category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">
                                {approvedCount}/{totalCount}
                            </span>
                            {selectedCategory === category ?
                                <ChevronDown size={16} className="text-amber-600" /> :
                                <ChevronRight size={16} className="text-amber-600" />
                            }
                        </div>
                    </div>

                    {selectedCategory === category && activities.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {activities.map(activity => (
                                <div
                                    key={activity.id}
                                    className={`p-2 rounded-md ${activity.approved ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center">
                                                <span className="font-medium">{activity.name}</span>
                                                {activity.approved && (
                                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                                        Approved
                                                    </span>
                                                )}
                                                {activity.isCustom && (
                                                    <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                                                        AI Suggestion
                                                    </span>
                                                )}
                                            </div>
                                            {activity.description && (
                                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                            )}
                                            <div className="flex flex-wrap text-xs text-gray-500 mt-1 gap-2">
                                                {activity.frequency && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                                                        {activity.frequency}
                                                    </span>
                                                )}
                                                {activity.duration && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                                                        {activity.duration}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            {editMode && (
                                                <>
                                                    {!activity.approved && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleApproveActivity(category, activity.id);
                                                            }}
                                                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveActivity(category, activity.id);
                                                        }}
                                                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                            <ActivityDropdown
                                                activity={activity}
                                                day={activity.day}
                                                category={category}
                                                handleAssignToDay={handleAssignToDay}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedCategory === category && editMode && (
                        <div
                            className="mt-3 pt-3 border-t border-gray-200"
                            onClick={(e) => e.stopPropagation()} // Add this line to stop propagation
                        >
                            <input
                                type="text"
                                value={newActivity.name}
                                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value, category })}
                                placeholder="New activity name"
                                className="w-full p-2 border rounded-md text-sm mb-2"
                                onClick={(e) => e.stopPropagation()} // Add this line
                            />
                            <textarea
                                value={newActivity.description}
                                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                placeholder="Description (optional)"
                                className="w-full p-2 border rounded-md text-sm mb-2"
                                rows={2}
                                onClick={(e) => e.stopPropagation()} // Add this line
                            />
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newActivity.frequency}
                                    onChange={(e) => setNewActivity({ ...newActivity, frequency: e.target.value })}
                                    placeholder="Frequency (e.g. daily)"
                                    className="p-2 border rounded-md text-sm"
                                    onClick={(e) => e.stopPropagation()} // Add this line
                                />
                                <input
                                    type="text"
                                    value={newActivity.duration}
                                    onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                                    placeholder="Duration (e.g. 30 min)"
                                    className="p-2 border rounded-md text-sm"
                                    onClick={(e) => e.stopPropagation()} // Add this line
                                />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Add this line
                                    handleAddActivity();
                                }}
                                className="bg-amber-500 text-white p-2 rounded-md hover:bg-amber-600 w-full text-sm flex items-center justify-center"
                                disabled={!newActivity.name.trim()}
                            >
                                <Plus size={16} className="mr-1" /> Add Activity
                            </button>
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderReminders = () => {
        if (!lifestyleData.reminders) return null;

        return (
            <div className="space-y-3">
                <h4 className="font-medium text-amber-700 mb-1">Daily Reminders:</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lifestyleData.reminders.map(reminder => {
                        const ReminderIcon = reminderIcons[reminder.type] || Brain;

                        return (
                            <div
                                key={reminder.id}
                                className={`p-3 rounded-lg ${reminder.approved ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                        <ReminderIcon size={18} className="text-amber-600 mr-2 mt-1" />
                                        <div>
                                            <div className="flex items-center">
                                                <span className="font-medium">{reminder.name}</span>
                                                {reminder.approved && (
                                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                                        Approved
                                                    </span>
                                                )}
                                                {reminder.isCustom && (
                                                    <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                                                        AI Suggestion
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap text-xs text-gray-500 mt-1 gap-2">
                                                {reminder.frequency && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                                                        {reminder.frequency}
                                                    </span>
                                                )}
                                                {reminder.time && (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                                                        {reminder.time}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        {editMode && (
                                            <>
                                                {!reminder.approved && (
                                                    <button
                                                        onClick={() => handleApproveReminder(reminder.id)}
                                                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveReminder(reminder.id)}
                                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {editMode && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <input
                                type="text"
                                value={newReminder.name}
                                onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })}
                                placeholder="Reminder name"
                                className="p-2 border rounded-md text-sm"
                            />
                            <select
                                value={newReminder.type}
                                onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                                className="p-2 border rounded-md text-sm"
                            >
                                <option value="">Select type</option>
                                {Object.keys(reminderIcons).map(type => (
                                    <option key={type} value={type}>
                                        {type.replace(/([A-Z])/g, ' $1').trim()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <input
                                type="text"
                                value={newReminder.frequency}
                                onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                                placeholder="Frequency (e.g. hourly)"
                                className="p-2 border rounded-md text-sm"
                            />
                            <input
                                type="text"
                                value={newReminder.time}
                                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                placeholder="Time (e.g. 8:00 AM)"
                                className="p-2 border rounded-md text-sm"
                            />
                        </div>
                        <button
                            onClick={handleAddReminder}
                            className="bg-amber-500 text-white p-2 rounded-md hover:bg-amber-600 w-full text-sm flex items-center justify-center"
                            disabled={!newReminder.name.trim() || !newReminder.type}
                        >
                            <Plus size={16} className="mr-1" /> Add Reminder
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderWeeklyPlan = () => {
        return (
            <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-amber-700">Weekly Schedule:</h4>
                    {editMode && (
                        <button
                            onClick={handleSaveChanges}
                            className="flex items-center text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                            <Save size={14} className="mr-1" /> Save Changes
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-amber-50">
                                <th className="p-3 border-b text-left text-amber-700">Day</th>
                                <th className="p-3 border-b text-left text-amber-700">Activities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daysOfWeek.map(day => (
                                <tr key={day} className="border-b">
                                    <td className="p-3 font-medium">{day}</td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-2">
                                            {weeklyPlan[day]?.map(item => {
                                                const ItemIcon = categoryIcons[item.category] || Brain;

                                                return (
                                                    <div
                                                        key={`${day}-${item.id}`}
                                                        className="flex items-center bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-sm"
                                                    >
                                                        <ItemIcon size={14} className="text-amber-600 mr-1" />
                                                        <span>{item.name}</span>
                                                        {item.duration && (
                                                            <span className="ml-1 text-xs text-gray-500">({item.duration})</span>
                                                        )}
                                                        {editMode && (
                                                            <button
                                                                onClick={() => handleRemoveFromDay(item.id, day)}
                                                                className="ml-2 text-red-500 hover:text-red-700"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {(!weeklyPlan[day] || weeklyPlan[day].length === 0) && (
                                                <span className="text-sm text-gray-400 italic">No activities assigned</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (!plan?.lifestyleInterventions) return null;

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleSection('plan_lifestyle')}
                >
                    {openSections['plan_lifestyle'] ?
                        <ChevronDown size={16} className="text-amber-500" /> :
                        <ChevronRight size={16} className="text-amber-500" />
                    }
                    <h3 className="font-semibold text-gray-800 ml-2">
                        Lifestyle Interventions
                    </h3>
                </div>
                {openSections['plan_lifestyle'] && (
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className={`flex items-center text-sm ${editMode ? 'bg-gray-500' : 'bg-amber-500'
                            } text-white px-3 py-1 rounded hover:${editMode ? 'bg-gray-600' : 'bg-amber-600'
                            }`}
                    >
                        {editMode ? (
                            <>
                                <X size={14} className="mr-1" /> Cancel
                            </>
                        ) : (
                            <>
                                <Edit size={14} className="mr-1" /> Edit
                            </>
                        )}
                    </button>
                )}
            </div>

            {openSections['plan_lifestyle'] && (
                <div className="mt-4">
                    <div className="bg-amber-50 p-3 rounded-lg mb-6">
                        <div className="flex items-center mb-2">
                            <Medal size={18} className="text-amber-600 mr-2" />
                            <h4 className="font-medium text-amber-700">Progress & Activities</h4>
                        </div>
                        {renderWeeklyPlan()}
                    </div>
                    <div className="">
                        <div>
                            <h5 className="font-medium text-gray-700 mb-2">Activity Categories</h5>
                            <div className="max-h-96 overflow-y-auto pr-2">
                                {renderCategories()}
                            </div>
                        </div>

                        <div>
                            {renderReminders()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LifestyleInterventionsSection;