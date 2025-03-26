import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, User, Settings } from 'lucide-react';

const LeftNavBar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'assessment',
      label: 'Assessment',
      icon: ClipboardList
    },
    {
      id: 'patient',
      label: 'Patient',
      icon: User
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-neutral-900 text-neutral-200 flex flex-col font-sans">
      <div className="p-4 text-lg font-display font-bold border-b border-neutral-700">
        HealthSphere
      </div>

      <nav className="flex-grow pt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center p-3 px-6 
              ${activeTab === item.id
                ? 'bg-primary text-white'
                : 'hover:bg-neutral-800 text-neutral-400'}
              transition-colors duration-200
              text-body
            `}
          >
            <item.icon className="mr-3" size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-700">
        <button
          onClick={() => setActiveTab('settings')}
          className={`
            w-full flex items-center p-3 
            ${activeTab === 'settings'
              ? 'bg-primary text-white'
              : 'hover:bg-neutral-800 text-neutral-400'}
            transition-colors duration-200
            text-body
          `}
        >
          <Settings className="mr-3" size={20} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default LeftNavBar;