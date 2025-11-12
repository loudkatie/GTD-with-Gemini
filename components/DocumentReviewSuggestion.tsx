import React from 'react';
import { DocumentReview } from '../types';

interface DocumentReviewSuggestionProps {
    review: DocumentReview;
}

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#007AFF] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const DocumentReviewSuggestion: React.FC<DocumentReviewSuggestionProps> = ({ review }) => {
    return (
        <div className="border-t border-[#444] mt-4 pt-3 space-y-4">
            <div>
                <h4 className="font-semibold text-sm mb-1 text-[#EAEAEA]">Summary</h4>
                <p className="text-sm text-gray-300">{review.summary}</p>
            </div>
            <div>
                <h4 className="font-semibold text-sm mb-2 text-[#EAEAEA]">Suggested Edits</h4>
                <ul className="space-y-3">
                    {review.edits.map((edit, index) => (
                        <li key={index} className="bg-[#2A2A2A] p-3 rounded-lg">
                           <div className="flex items-start">
                                <EditIcon />
                                <div>
                                    <p className="text-xs text-gray-400 italic">"{edit.original_text}"</p>
                                    <p className="text-sm my-1 text-green-400">→ "{edit.suggested_change}"</p>
                                    <p className="text-xs text-gray-500">{edit.comment}</p>
                                </div>
                           </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DocumentReviewSuggestion;
