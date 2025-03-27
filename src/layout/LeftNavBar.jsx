import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  User,
  Settings,
  Stethoscope,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const LeftNavBar = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/'
    },
    {
      id: 'assessment',
      label: 'Assessments',
      icon: ClipboardList,
      path: '/Assessments'
    },
    {
      id: 'patient',
      label: 'Patients',
      icon: User,
      path: '/Patients'
    }
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed left-0 top-0 h-full 
        bg-gradient-to-b from-neutral-900 to-neutral-800 
        text-neutral-200 
        flex flex-col 
        shadow-lg
        z-50
        overflow-hidden
      `}
    >
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-left p-3 border-b border-neutral-700 w-full "
      >
        <div className="flex items-center">
          <img src="/data/assets/logo_1.png" className="w-10 h-10" />
          {!isCollapsed && (
            <span className="ml-2 text-3xl font-display font-bold text-white">Neoptio</span>
          )}
        </div>
      </button>

      <nav className="flex-grow py-4 overflow-y-auto">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => navigate(item.path)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center p-3 px-6 my-4
              ${location.pathname === item.path
                ? 'bg-primary text-white'
                : 'hover:bg-neutral-800 text-neutral-400'}
              transition-colors duration-200
              text-body
              group
              relative
            `}
          >
            <item.icon
              className={`mr-3 ${location.pathname === item.path
                ? 'text-white'
                : 'text-neutral-400'}`}
              size={30}
            />
            {!isCollapsed && (
              <span className="flex-grow text-left">{item.label}</span>
            )}
            {isCollapsed && (
              <div className="
                absolute left-full ml-2 
                bg-neutral-800 text-neutral-200 
                px-3 py-1 rounded-md 
                text-xs 
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                pointer-events-none
                shadow-md
              ">
                {item.label}
              </div>
            )}
          </motion.button>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-700">
        <motion.button
          onClick={() => navigate('/Settings')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full flex items-center p-3
            ${location.pathname === '/Settings'
              ? 'bg-primary text-white'
              : 'hover:bg-neutral-800 text-neutral-400'}
            transition-colors duration-200
            text-body
            group
            relative
          `}
        >
          <Settings
            className={` ${location.pathname === '/Settings'
              ? 'text-white'
              : 'text-neutral-400'} ${isCollapsed ? 'mx-auto' : ''}`}
            size={20}
          />
          {!isCollapsed && (
            <span className="flex-grow text-left ml-3">Settings</span>
          )}
          {isCollapsed && (
            <div className="
              absolute left-full ml-2 
              bg-neutral-800 text-neutral-200 
              px-3 py-1 rounded-md 
              text-xs 
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
              shadow-md
            ">
              Settings
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LeftNavBar;