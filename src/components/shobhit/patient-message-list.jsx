import React, { useState, useMemo } from 'react';
import {
  MessageCircle,
  Pin,
  Search,
  User,
  Bell,
  ChevronDown
} from 'lucide-react';
import mockData from '../../../data/doc.json';

const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    'High': 'bg-red-100 text-red-700 border border-red-200',
    'Medium': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'Low': 'bg-green-100 text-green-700 border border-green-200'
  };

  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[priority]}`}>
      {priority} Priority
    </div>
  );
};

const PatientMessageList = () => {
  // Get initial data from mockData
  const { patientMessageList: initialMessages } = mockData;

  // Use state to store and manage messages so we can update them
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Function to toggle pin status for a specific message
  const togglePinStatus = (patientId) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.patientId === patientId
          ? { ...message, isPinned: !message.isPinned }
          : message
      )
    );
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'All' || message.status === filter;
      const matchesPinned = !showPinnedOnly || message.isPinned;

      return matchesSearch && matchesFilter && matchesPinned;
    });
  }, [messages, searchTerm, filter, showPinnedOnly]);

  const sortedMessages = useMemo(() => {
    return [...filteredMessages].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
  }, [filteredMessages]);

  return (
    <div className="bg-white rounded-2xl  border-gray-100 overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageCircle size={28} className="text-blue-600" strokeWidth={2} />
          <h2 className="text-2xl font-bold text-gray-800">Patient Messages</h2>
        </div>
        <button
          onClick={() => setShowPinnedOnly(!showPinnedOnly)}
          className={`transition-all duration-300 p-2 rounded-full ${showPinnedOnly
            ? 'bg-blue-100 text-blue-600 shadow-md'
            : 'hover:bg-blue-50 text-gray-500'
            }`}
          title={showPinnedOnly ? 'Show All Messages' : 'Show Pinned Messages'}
        >
          <Pin size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="p-4 space-y-3 border-b">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="w-full appearance-none pl-4 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active Treatment">Active Treatment</option>
            <option value="Initial Consultation">Initial Consultation</option>
            <option value="Follow-up Care">Follow-up Care</option>
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Message List */}
      <div className="divide-y divide-gray-100 h-[720px] overflow-y-auto">
        {sortedMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 ">
            No messages found
          </div>
        ) : (
          sortedMessages.map((message) => (
            <div
              key={message.patientId}
              className=" hover:bg-blue-50/50 transition-colors duration-200 group cursor-pointer flex items-center space-x-4 py-2"
            >

              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                  <User size={24} className="text-blue-500" strokeWidth={2} />
                </div>
                {message.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow-md">
                    {message.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex-grow">
                <div className='flex items-center justify-between'>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {message.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click event
                      togglePinStatus(message.patientId);
                    }}
                    className="transition-all duration-200 p-2 rounded-full hover:bg-blue-100"
                    title={message.isPinned ? "Unpin" : "Pin"}
                  >
                    <Pin
                      size={15}
                      className={`${message.isPinned ? 'text-blue-500 fill-blue-500' : 'text-gray-400'} transition-colors`}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {message.lastMessage}
                </p>
                <div className='flex justify-between items-center mt-2'>
                  <div className="flex items-center justify-between mt-2">
                    <PriorityBadge priority={message.priority} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(message.lastMessageTime).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientMessageList;