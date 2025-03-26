import React, { useState } from 'react';
import { Bell, AlertCircle, Search, Calendar } from 'lucide-react';

const TopNavbar = () => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isAlertHovered, setIsAlertHovered] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);

    // Placeholder for doctor profile image
    const doctorImage = "/api/placeholder/40/40";

    // Simple calendar component
    const CalendarDropdown = () => (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-md rounded-md p-4 border border-neutral-200">
            <div className="text-center font-bold mb-2 text-neutral-700">March 2025</div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="font-semibold text-small text-neutral-500">{day}</div>
                ))}
                {[...Array(31)].map((_, i) => (
                    <div
                        key={i}
                        className="p-1 hover:bg-primary-light rounded cursor-pointer text-small text-neutral-700"
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed top-0 left-64 right-0 bg-white shadow-sm h-16 flex items-center px-6 z-50 font-sans">
            {/* Patient Search Bar - Left */}
            <div className="flex-grow mr-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Patient name, ID, Date..."
                        className="w-full p-2 pl-10 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-body"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                </div>
            </div>

            {/* Right Side Elements */}
            <div className="flex items-center space-x-4">
                {/* Alert Icon */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAlertHovered(true)}
                    onMouseLeave={() => setIsAlertHovered(false)}
                >
                    <AlertCircle
                        className="text-accent-orange cursor-pointer"
                        size={24}
                    />
                    {isAlertHovered && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-md rounded-md p-3 border border-neutral-200">
                            <p className="text-small text-neutral-700">Important alerts and notifications</p>
                        </div>
                    )}
                </div>

                {/* Notification Icon */}
                <div className="relative">
                    <Bell className="text-neutral-600 cursor-pointer" size={24} />
                    {notificationCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full px-2 py-0.5 text-xs">
                            {notificationCount}
                        </span>
                    )}
                </div>

                {/* Date Button with Calendar */}
                <div className="relative">
                    <button
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="flex items-center bg-neutral-100 rounded-md px-3 py-1 text-small"
                    >
                        <Calendar size={20} className="mr-2 text-neutral-600" />
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </button>
                    {isCalendarOpen && <CalendarDropdown />}
                </div>

                {/* Doctor Profile */}
                <div className="flex items-center bg-neutral-100 rounded-md p-1 pl-3">
                    <span className="mr-2 text-small font-medium text-neutral-700">Dr. Smith</span>
                    <img
                        src={doctorImage}
                        alt="Doctor Profile"
                        className="w-10 h-10 rounded-md object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default TopNavbar;