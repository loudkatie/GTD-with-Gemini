
import React from 'react';

interface TaskSuggestionProps {
    suggestion: string;
}

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

const SnoozeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TaskSuggestion: React.FC<TaskSuggestionProps> = ({ suggestion }) => {
    return (
        <div className="border-t border-gray-600 mt-4 pt-3 space-y-3">
            <p className="text-sm font-semibold">What would you like to do?</p>
            <div className="flex flex-col sm:flex-row gap-2">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors duration-200">
                    <MapPinIcon />
                    Walk me there
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors duration-200">
                    <SnoozeIcon />
                    Snooze
                </button>
            </div>
        </div>
    );
};

export default TaskSuggestion;
