
import { GoogleGenAI } from '@google/genai';
import { GtdTask, CalendarEvent, Coordinates } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getProactiveSuggestion(
    userName: string,
    location: Coordinates,
    tasks: GtdTask[],
    calendarEvents: CalendarEvent[]
): Promise<{ suggestion: string, grounding: { uri: string, title: string }[] }> {

    const model = 'gemini-2.5-pro';

    const now = new Date();
    const todayEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getFullYear() === now.getFullYear() &&
               eventDate.getMonth() === now.getMonth() &&
               eventDate.getDate() === now.getDate();
    });

    const prompt = `
        You are a proactive, helpful GTD (Getting Things Done) assistant. Your goal is to help the user, ${userName}, be more productive by suggesting the best "next action" based on their current context.

        **Current Context:**
        - User's Name: ${userName}
        - Current Time: ${now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
        - Current Location: Latitude ${location.latitude}, Longitude ${location.longitude}

        **User's Data:**
        - Google Tasks (only suggest tasks with a location):
        ${JSON.stringify(tasks.filter(t => t.location), null, 2)}

        - Google Calendar (today's events):
        ${JSON.stringify(todayEvents, null, 2)}

        **Your Task:**
        Analyze all the provided context. Find the single most logical and helpful location-based task for ${userName} to do right now or in the immediate future. Consider any free time between calendar appointments. Use your knowledge of maps to determine if a task is realistically nearby.

        **Response Requirements:**
        1. Start with a friendly and direct suggestion. For example: "Hi ${userName}! Now would be a great time to..."
        2. Briefly explain your reasoning, mentioning the user's location, proximity to the task, and their schedule.
        3. Include an estimated time to complete the task, including travel.
        4. Your response must be concise, encouraging, and written in a conversational, human-like tone.

        Example response for a user near a dry cleaner with a free time block:
        "Hi ${userName}! It looks like you have about an hour free before your next meeting. You're just a 5-minute walk from Sparkle Cleaners, so this would be a perfect time to pick up your dry cleaning. The whole errand should only take about 15 minutes."
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                }
            },
        });
        
        const suggestion = response.text;
        const rawGrounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        const grounding = (rawGrounding || []).map(chunk => ({
            uri: chunk.maps?.uri || '#',
            title: chunk.maps?.title || 'Location Details'
        }));

        return { suggestion, grounding };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get suggestion from Gemini API.");
    }
}
