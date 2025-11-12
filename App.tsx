import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, User, Coordinates, Permission, PermissionStatus, SuggestedTask, DocumentReview } from './types';
import { MOCK_USER, MOCK_TASKS, MOCK_CALENDAR_EVENTS } from './constants';
import { getProactiveSuggestion, getDocumentReviewSuggestion } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import PermissionFlow from './components/PermissionFlow';
import TaskSuggestion from './components/TaskSuggestion';
import Directions from './components/Directions';
import ChatInput from './components/ChatInput';
import DocumentReviewSuggestion from './components/DocumentReviewSuggestion';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user] = useState<User>(MOCK_USER);
    const [permissions, setPermissions] = useState<Record<Permission, PermissionStatus>>({
        google: 'idle',
        location: 'idle',
        notifications: 'idle',
    });
    const [coords, setCoords] = useState<Coordinates | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = useCallback((text: string, from: 'ai' | 'user' | 'system', component?: React.ReactNode, grounding?: { uri: string, title: string }[]) => {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, from, component, grounding }]);
    }, []);
    
    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;
    
        const userMessage = text.trim();
        addMessage(userMessage, 'user');
        setIsLoading(true);
    
        // Simple keyword-based routing for the new Document Review PCE
        if (userMessage.toLowerCase().includes('review')) {
            const queryMatch = userMessage.match(/'([^']*)'|"([^"]*)"/);
            const query = queryMatch ? (queryMatch[1] || queryMatch[2]) : "the document";
            
            try {
                const { review, systemMessages } = await getDocumentReviewSuggestion(query);
                
                for (let i = 0; i < systemMessages.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    addMessage(systemMessages[i], 'system');
                }
                
                await new Promise(resolve => setTimeout(resolve, 800));
                const reviewComponent = <DocumentReviewSuggestion review={review} />;
                addMessage("I've analyzed the document. Here's a summary and some suggested edits you can review while you walk.", 'ai', reviewComponent);
    
            } catch (error) {
                console.error(error);
                addMessage("Sorry, I couldn't process that document review request.", 'ai');
            } finally {
                setIsLoading(false);
            }
    
        } else {
            // Placeholder for general chat
            setTimeout(() => {
                addMessage("I can help with proactive tasks based on your location or review documents for you. How can I assist?", 'ai');
                setIsLoading(false);
            }, 1000);
        }
    }, [addMessage, isLoading]);

    const handlePermissionUpdate = useCallback((permission: Permission, status: PermissionStatus) => {
        setPermissions(prev => ({ ...prev, [permission]: status }));
        if (status === 'granted') {
            if (permission === 'google') {
                addMessage(`Great! I've connected to your Google account, ${user.firstName}.`, 'system');
            }
            if (permission === 'location') {
                 addMessage('Location access granted. Finding where you are...', 'system');
                 navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCoords({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        addMessage('I\'ve got your location!', 'system');
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        setPermissions(prev => ({ ...prev, location: 'denied' }));
                        addMessage('There was an issue getting your location. Please ensure location services are enabled.', 'system');
                    }
                );
            }
            if (permission === 'notifications') {
                 addMessage('I\'ll be able to "tap" you with suggestions now.', 'system');
            }
        } else if (status === 'denied') {
            addMessage(`I'll need ${permission} access to be most helpful. You can grant it in your settings later.`, 'system');
        }
    }, [addMessage, user.firstName]);


    const startOnboarding = useCallback(() => {
        setTimeout(() => {
            addMessage(`Hi, I'm your proactive GTD assistant, ready to help you get things done.`, 'ai');
        }, 1000);

        setTimeout(() => {
            addMessage(`To suggest relevant tasks, I need to connect to a few things. This will allow me to understand when you have free time and where you are.`, 'ai', <PermissionFlow onPermissionUpdate={handlePermissionUpdate} permissions={permissions} />);
        }, 2500);
    }, [addMessage, handlePermissionUpdate, permissions]);

    useEffect(() => {
        startOnboarding();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchSuggestion = useCallback(async (location: Coordinates) => {
        setIsLoading(true);
        addMessage("Checking your tasks, calendar, and location to find your next best action...", 'system');
        try {
            const { suggestion, grounding } = await getProactiveSuggestion(user.firstName, location, MOCK_TASKS, MOCK_CALENDAR_EVENTS);
            
            const handleAccept = (task: SuggestedTask) => {
                const directionsText = `Great. Here are your walking directions to ${task.name}.`;
                const directionsComponent = <Directions task={task} />;
                addMessage(directionsText, 'ai', directionsComponent);
            };
    
            const handleSnooze = () => {
                addMessage("Okay, not now. I'll keep it on your list.", 'ai');
            };

            const suggestionComponent = <TaskSuggestion suggestion={suggestion} grounding={grounding} onAccept={handleAccept} onSnooze={handleSnooze} />;
            addMessage(suggestion.suggestionText, 'ai', suggestionComponent, grounding);
        } catch (error) {
            console.error(error);
            addMessage("Sorry, I had trouble coming up with a suggestion. Please try again later.", 'ai');
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, user.firstName]);

    useEffect(() => {
        const allGranted = Object.values(permissions).every(status => status === 'granted');
        // FIX: Check if m.component is a valid React element before accessing its `type` property.
        const hasFetched = messages.some(m => m.from === 'ai' && React.isValidElement(m.component) && (m.component.type === TaskSuggestion || m.component.type === Directions));
        
        if (allGranted && coords && !isLoading && !hasFetched) {
           fetchSuggestion(coords);
        }
    }, [permissions, coords, isLoading, fetchSuggestion, messages]);
    

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#1C1C1C] font-sans">
            <div className="flex flex-col h-[95vh] md:h-[85vh] w-full max-w-md bg-[#2A2A2A] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#3A3A3A]">
                <header className="bg-[#1C1C1C] p-4 text-center border-b-2 border-[#3A3A3A] flex-shrink-0">
                    <h1 className="text-xl font-bold text-[#EAEAEA]">GTD with Gemini</h1>
                    <p className="text-sm text-[#A0A0A0]">Your Proactive Productivity Assistant</p>
                </header>
                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isLoading && <ChatMessage message={{ id: 'loading', text: '...', from: 'ai' }} />}
                    <div ref={chatEndRef} />
                </main>
                 <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default App;