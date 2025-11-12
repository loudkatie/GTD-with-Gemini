// FIX: Import ReactNode to resolve the "Cannot find namespace 'React'" error.
import type { ReactNode } from 'react';

export interface Message {
    id: number | string;
    text: string;
    from: 'ai' | 'user' | 'system';
    component?: ReactNode;
    grounding?: { uri: string, title: string }[];
}

export interface User {
    id: string;
    firstName: string;
    email: string;
}

export interface GtdTask {
    id: string;
    name: string;
    context: string;
    location: {
        name: string;
        address: string;
    } | null;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export type Permission = 'google' | 'location' | 'notifications';

export type PermissionStatus = 'idle' | 'pending' | 'granted' | 'denied';

export interface SuggestedTask {
    name: string;
    address: string;
}

export interface ProactiveSuggestion {
    suggestionText: string;
    task: SuggestedTask;
}

export interface DocumentEdit {
    original_text: string;
    suggested_change: string;
    comment: string;
}

export interface DocumentReview {
    summary: string;
    edits: DocumentEdit[];
}
