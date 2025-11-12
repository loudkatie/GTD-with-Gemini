import React from 'react';
import { SuggestedTask } from '../types';

interface DirectionsProps {
    task: SuggestedTask;
}

const DirectionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const Directions: React.FC<DirectionsProps> = ({ task }) => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.address)}&travelmode=walking`;
    
    return (
        <div className="border-t border-[#444] mt-4 pt-3">
            <a 
                href={directionsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-2 bg-[#007AFF] hover:bg-[#0056b3] text-white rounded-lg font-semibold transition-colors duration-200"
            >
                <DirectionsIcon />
                Open Walking Directions
            </a>
        </div>
    );
};

export default Directions;