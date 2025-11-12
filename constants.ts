
import { User, GtdTask, CalendarEvent } from './types';

export const MOCK_USER: User = {
    id: 'u1',
    firstName: 'Katie',
    email: 'katie@example.com',
};

export const MOCK_TASKS: GtdTask[] = [
    {
        id: 't1',
        name: 'Pick up dry cleaning',
        context: '@errands',
        location: {
            name: 'Sparkle Cleaners',
            address: '150 Geary St, San Francisco, CA 94108',
        }
    },
    {
        id: 't2',
        name: 'Buy groceries for dinner party',
        context: '@errands',
        location: {
            name: 'Whole Foods Market',
            address: '2001 Market St, San Francisco, CA 94114',
        }
    },
    {
        id: 't3',
        name: 'Return library books',
        context: '@errands',
        location: {
            name: 'SF Public Library - Main Branch',
            address: '100 Larkin St, San Francisco, CA 94102',
        }
    },
    {
        id: 't4',
        name: 'Finalize pitch deck slides',
        context: '@work',
        location: null
    },
    {
        id: 't5',
        name: 'Call Mom',
        context: '@home',
        location: null
    }
];

const now = new Date();

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    {
        id: 'c1',
        title: 'Team Sync',
        start: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        end: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
        id: 'c2',
        title: 'Design Review',
        start: new Date(now.getTime() + 1 * 60 * 60 * 1000), // In 1 hour
        end: new Date(now.getTime() + 2 * 60 * 60 * 1000), // Ends in 2 hours
    },
    {
        id: 'c3',
        title: 'Focus Time: Pitch Deck',
        start: new Date(now.getTime() + 4 * 60 * 60 * 1000), // In 4 hours
        end: new Date(now.getTime() + 5 * 60 * 60 * 1000), // Ends in 5 hours
    }
];
