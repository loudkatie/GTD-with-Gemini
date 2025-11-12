// FIX: The `Type` import is no longer needed as `responseSchema` is removed.
import { GoogleGenAI } from '@google/genai';
import { GtdTask, CalendarEvent, Coordinates, ProactiveSuggestion, DocumentReview } from '../types';
import { documentReviewTools } from './geminiTools';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: The schema object is removed because `responseSchema` is not allowed with the `googleMaps` tool.
// The prompt itself instructs the model to return JSON.

export async function getProactiveSuggestion(
    userName: string,
    location: Coordinates,
    tasks: GtdTask[],
    calendarEvents: CalendarEvent[]
): Promise<{ suggestion: ProactiveSuggestion, grounding: { uri: string, title: string }[] }> {

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
        1. Analyze all the provided context to find the single most logical and helpful location-based task for ${userName} to do right now.
        2. Consider free time between calendar appointments and the user's proximity to the task location. Use your knowledge of maps to determine if a task is realistically nearby.
        3. Formulate a concise, friendly, and direct suggestion message.
        4. Your response MUST be a JSON object that matches the provided schema.

        **Example Output:**
        {
          "suggestionText": "Hi Katie. You have an hour free before your next meeting. You're just 2 blocks away from Sparkle Cleaners, want to pick up your dry cleaning?",
          "task": {
            "name": "Pick up dry cleaning",
            "address": "150 Geary St, San Francisco, CA 94108"
          }
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                // FIX: `responseMimeType` and `responseSchema` are not allowed when using the `googleMaps` tool.
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
        
        // FIX: The response text may not be a clean JSON string when not using `responseMimeType`.
        // It might be wrapped in markdown backticks, so we need to extract the JSON.
        let jsonString = response.text.trim();
        const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1];
        }

        const suggestion = JSON.parse(jsonString);
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

// New MOCKED function for Document Review PCE
export async function getDocumentReviewSuggestion(query: string): Promise<{ review: DocumentReview, systemMessages: string[] }> {
    console.log("Simulating document review for query:", query);
    console.log("Function declarations available for a real implementation:", documentReviewTools);

    // Simulate API calls and delays to mimic a real backend process
    const systemMessages = [
        `Searching Drive for files matching "${query}"...`,
        "Found 'Q3 Budget Proposal'. Reading document content...",
        "Analyzing content and preparing suggestions..."
    ];

    const mockReview: DocumentReview = {
        summary: "The Q3 budget proposal outlines a 15% increase in marketing spend, focusing on digital channels. Key risks include market volatility and competitor response. The overall tone is confident but could be more concise.",
        edits: [
            {
                original_text: "It is vitally important that we endeavour to increase our market share.",
                suggested_change: "Increasing market share is a key objective.",
                comment: "More direct and concise language."
            },
            {
                original_text: "The budget for the new campaign will be in the neighborhood of $250,000.",
                suggested_change: "The budget for the new campaign is approximately $250,000.",
                comment: "More professional and precise phrasing."
            },
            {
                original_text: "At this point in time, we can ascertain that the results are positive.",
                suggested_change: "Currently, the results are positive.",
                comment: "Removes unnecessary words."
            }
        ]
    };
    
    // In a real app, this would involve multiple calls to a model with the documentReviewTools
    // For now, we return a mocked response after a delay.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ review: mockReview, systemMessages });
        }, 500);
    });
}
