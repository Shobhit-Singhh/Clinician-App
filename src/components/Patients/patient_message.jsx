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
            <div className="h-full bg-white rounded-lg shadow-sm flex items-center justify-center">
                <p className="text-gray-500 text-sm font-semibold">Select a patient</p>
            </div>
        );
    }

    return (
        <div className=" rounded-lg h-[410px] mb-3 flex flex-col">
            <div className="flex justify-between items-center border-b py-3">
                <h3 className="text-sm font-semibold text-gray-700">
                    Chat with {patient.name}
                </h3>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 ">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
                    >
                        {/* Patient Avatar (Only for Patient Messages) */}
                        {msg.sender !== "doctor" && (
                            <img
                                src={patient.image}
                                alt={patient.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        )}

                        {/* Message Bubble */}
                        <div
                            className={`max-w-[100%] p-2 rounded-lg text-sm shadow-md break-words ${msg.sender === "doctor"
                                    ? "bg-blue-500 text-white rounded-br-none"
                                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                                }`}
                        >
                            {msg.text}
                            {/* Timestamp */}
                            <div className="text-xs opacity-70 text-right mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
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