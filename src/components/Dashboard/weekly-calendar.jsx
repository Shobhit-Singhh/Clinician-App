import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import mockData from '../../../data/doc.json';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Scheduled': 'bg-blue-100 text-blue-600',
    'Pending Confirmation': 'bg-yellow-100 text-yellow-600',
    'Confirmed': 'bg-green-100 text-green-600'
  };

  const statusIcons = {
    'Scheduled': <Clock size={16} className="mr-1" />,
    'Pending Confirmation': <AlertCircle size={16} className="mr-1" />,
    'Confirmed': <CheckCircle2 size={16} className="mr-1" />
  };

  return (
    <div className={`flex items-center text-xs px-2 py-1 rounded ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
      {statusIcons[status]}
      {status}
    </div>
  );
};

const WeeklyCalendar = () => {
  const { weeklyCalendar } = mockData;
  const [selectedDate, setSelectedDate] = useState(null);

  const appointmentsByDate = useMemo(() => {
    return weeklyCalendar.reduce((acc, appointment) => {
      const date = appointment.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(appointment);
      return acc;
    }, {});
  }, [weeklyCalendar]);

  const sortedDates = useMemo(() => 
    Object.keys(appointmentsByDate).sort((a, b) => new Date(a) - new Date(b)), 
    [appointmentsByDate]
  );

  return (
    <div className="bg-white rounded-lg pb-4 h-[330px]">
      <div className="flex items-center pb-2">
        <Calendar size={24} className="mr-2 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
      </div>

      <div className="max-h-[330px] overflow-y-auto h-full border-y">
        {sortedDates.map((date) => {
          const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long', 
            month: 'long', 
            day: 'numeric'
          });

          return (
            <div key={date} className="mb-6">
              <div className="text-sm font-semibold text-gray-600 m-2 pb-2">
                {formattedDate}
              </div>

              {appointmentsByDate[date].map((appointment) => (
                <div 
                  key={appointment.appointmentId} 
                  className="bg-white border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all"
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-blue-500" />
                      <span className="font-semibold text-gray-800">
                        {appointment.patientName}
                      </span>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText size={14} className="mr-1" />
                      <span>{appointment.duration} mins</span>
                    </div>
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      <span>{appointment.therapist}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs">
                    <strong>Disorders:</strong>{' '}
                    {appointment.disorders.join(', ')}
                  </div>

                  {appointment.notes && (
                    <div className="mt-2 text-xs italic text-gray-500">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;