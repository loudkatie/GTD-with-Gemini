
export interface Message {
    id: number | string;
    text: string;
    from: 'ai' | 'user' | 'system';
    component?: React.ReactNode;
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
