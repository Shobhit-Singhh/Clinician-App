import React, { useState, useRef, useEffect } from 'react';
import {
    Bell,
    AlertCircle,
    Search,
    Calendar,
    ChevronDown,
    LogOut,
    UserCircle,
    Settings,
    X,
    Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNavbar = ({ isNavCollapsed, onSearch }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isNotificationHovered, setIsNotificationHovered] = useState(false);
    const [isAlertHovered, setIsAlertHovered] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);
    const [searchQuery, setSearchQuery] = useState('');
    const profileDropdownRef = useRef(null);
    const calendarDropdownRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target) &&
                calendarDropdownRef.current &&
                !calendarDropdownRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const CalendarDropdown = () => (
        <motion.div
            ref={calendarDropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white shadow-2xl rounded-xl p-6 border border-neutral-200"
        >
            <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold text-neutral-800">March 2025</div>
                <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="font-semibold text-xs text-neutral-500">{day}</div>
                ))}
                {[...Array(31)].map((_, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ 
                            scale: 1.1, 
                            backgroundColor: '#F0F0F0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        className="p-2 hover:bg-neutral-100 rounded-md cursor-pointer text-sm text-neutral-700 transition-all"
                    >
                        {i + 1}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial={false}
            animate={{
                left: isNavCollapsed ? 80 : 256,
                width: `calc(100% - ${isNavCollapsed ? '80px' : '256px'})`
            }}
            transition={{ duration: 0.3 }}
            className={`
                fixed top-0 right-0 h-16 bg-white shadow-sm 
                flex items-center px-6 z-40 font-sans 
                border-b border-neutral-100
            `}
        >
            {/* Company Logo and Name - Only show when nav is collapsed */}
            {isNavCollapsed && (
                <div className="flex items-center mr-6 -ml-3 animate-fade-in">
                    <span className="text-[30px] font-display font-bold text-primary">Neoptio</span>
                </div>
            )}

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-grow mr-10">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search patients, records..."
                        className="
                            w-full p-2.5 pl-10 
                            border border-neutral-200 
                            rounded-lg 
                            focus:outline-none 
                            focus:ring-2 focus:ring-primary/50
                            text-body
                            transition-all
                            hover:border-neutral-300
                        "
                    />
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                        size={20}
                    />
                </div>
            </form>

            {/* Right Side Elements */}
            <div className="flex items-center space-x-4">
                {/* Alert Icon */}
                <div
                    className="relative group"
                    onMouseEnter={() => setIsAlertHovered(true)}
                    onMouseLeave={() => setIsAlertHovered(false)}
                >
                    <motion.div 
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, -10, 10, -10, 0]
                        }}
                        className="cursor-pointer"
                    >
                        <AlertCircle
                            className="text-accent-orange group-hover:text-accent-orange/80 transition-colors"
                            size={24}
                        />
                    </motion.div>
                    <AnimatePresence>
                        {isAlertHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-lg p-4 border border-neutral-200"
                            >
                                <p className="text-sm text-neutral-700 font-medium">Critical system alerts</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Notification Icon */}
                <div
                    className="relative group"
                    onMouseEnter={() => setIsNotificationHovered(true)}
                    onMouseLeave={() => setIsNotificationHovered(false)}
                >
                    <motion.div 
                        whileHover={{ 
                            scale: 1.1,
                            rotate: [0, -10, 10, -10, 0]
                        }} 
                        className="relative cursor-pointer"
                    >
                        <Bell className="text-neutral-600 group-hover:text-neutral-800 transition-colors" size={24} />
                        {notificationCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full px-2 py-0.5 text-xs animate-pulse">
                                {notificationCount}
                            </span>
                        )}
                    </motion.div>
                    <AnimatePresence>
                        {isNotificationHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-72 bg-white shadow-xl rounded-lg p-4 border border-neutral-200"
                            >
                                <div className="text-sm font-semibold text-neutral-800 mb-3">
                                    Recent Notifications
                                </div>
                                <div className="space-y-2">
                                    {[
                                        "New patient record added",
                                        "Pending assessment review",
                                        "Upcoming appointment"
                                    ].map((notification, index) => (
                                        <div 
                                            key={index} 
                                            className="text-sm text-neutral-600 hover:bg-neutral-50 p-2 rounded-md transition-colors"
                                        >
                                            {notification}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Date Button with Calendar */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="
                            flex items-center 
                            bg-neutral-100 
                            rounded-lg 
                            px-3 h-12
                            text-sm 
                            hover:bg-neutral-200 
                            transition-colors
                        "
                    >
                        <Calendar size={20} className="mr-2 text-neutral-600" />
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </motion.button>
                    <AnimatePresence>
                        {isCalendarOpen && <CalendarDropdown />}
                    </AnimatePresence>
                </div>

                {/* Doctor Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="
                            flex items-center 
                            bg-neutral-100 
                            rounded-lg 
                            p-1 pl-3 
                            hover:bg-neutral-200 
                            transition-colors
                        "
                    >
                        <span className="mr-2 text-sm font-medium text-neutral-700">Dr. Smith</span>
                        <img
                            src="src/assets/Doc.png"
                            className="w-10 h-10 rounded-md object-cover"
                        />
                        
                    </motion.button>
                    <AnimatePresence>
                        {isProfileDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-lg border border-neutral-200 overflow-hidden"
                            >
                                <div className="py-2">
                                    {[
                                        { 
                                            icon: <UserCircle size={20} />, 
                                            text: 'Profile', 
                                            color: 'text-neutral-700' 
                                        },
                                        { 
                                            icon: <Settings size={20} />, 
                                            text: 'Settings', 
                                            color: 'text-neutral-700' 
                                        },
                                        { 
                                            icon: <LogOut size={20} />, 
                                            text: 'Logout', 
                                            color: 'text-secondary' 
                                        }
                                    ].map((item, index) => (
                                        <button 
                                            key={index} 
                                            className={`
                                                flex items-center 
                                                w-full px-4 py-2.5 
                                                text-sm 
                                                ${item.color} 
                                                hover:bg-neutral-100 
                                                transition-colors
                                            `}
                                        >
                                            {React.cloneElement(item.icon, { className: 'mr-3' })}
                                            {item.text}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default TopNavbar;