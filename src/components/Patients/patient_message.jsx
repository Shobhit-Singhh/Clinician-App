import React, { useState, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import patientsData from '/data/patient.json';

const PatientMessage = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (patientId) {
            const foundPatient = patientsData.patients.find(p => p.id === patientId);
            setPatient(foundPatient);
            
            // Check if patient has messages, if not, initialize with an empty array
            setMessages(foundPatient.messages || []);
        }
    }, [patientId]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message = {
            id: Date.now(),
            text: newMessage,
            sender: 'doctor',
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);
        
        // In a real application, you'd update the JSON file here
        // For this example, we'll just update the local state
    };

    if (!patient) {
        return (
            <div className="h-full bg-white/90 rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm">Select a patient</p>
            </div>
        );
    }

    return (
        <div className=" rounded-lg shadow-sm h-full flex flex-col p-2">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                    Chat with {patient.name}
                </h3>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex items-start ${
                            msg.sender === 'doctor' 
                                ? 'justify-end' 
                                : 'justify-start'
                        }`}
                    >
                        <div 
                            className={`
                                max-w-[70%] p-2 rounded-lg text-sm 
                                ${msg.sender === 'doctor' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-800'
                                }
                            `}
                        >
                            {msg.text}
                            <div className="text-xs mt-1 opacity-70 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                        {msg.sender === 'doctor' ? (<>  </>
                        ) : (
                            <img
                                src={patient.image}
                                alt={patient.name}
                                className="w-8 h-8 rounded-full ml-2 object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center">
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow mr-2 p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default PatientMessage;