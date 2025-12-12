import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WeeklyPlanResponse, FileInput, UserProfile } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for Models
const MODEL_PRO = "gemini-3-pro-preview";
const MODEL_FLASH = "gemini-2.5-flash"; 
const MODEL_TTS = "gemini-2.5-flash-preview-tts";

// Helper to convert Blob/File to Base64
export const fileToGenerativePart = async (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        mimeType: file.type,
        data: base64Data,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const PLAN_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    // Structured Data for Dashboard
    today_focus_items: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 top priority task names for Today."
    },
    due_today_items: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of tasks explicitly due today or overdue."
    },
    week_glance: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day name (e.g., Mon)" },
          taskCount: { type: Type.NUMBER, description: "Estimated number of tasks/blocks for this day" }
        }
      },
      description: "High-level stats for the coming 7 days."
    },
    // Markdown Content
    tasks_deadlines_markdown: { 
        type: Type.STRING, 
        description: "Markdown formatted text for the 'Tasks & Deadlines' panel. Highlight deadlines and conflicts." 
    },
    today_focus_markdown: {
        type: Type.STRING, 
        description: "Markdown formatted text for the 'Today Focus' section. Prioritized items and time blocks."
    },
    week_schedule_markdown: { 
        type: Type.STRING, 
        description: "Markdown formatted text for the rest of the week (Tomorrow onwards)." 
    },
    action_generators_markdown: { 
        type: Type.STRING, 
        description: "Markdown formatted text containing draft emails, updates, or checklists." 
    },
    summary: { 
        type: Type.STRING, 
        description: "A short text summary of the plan." 
    }
  },
  required: [
    "today_focus_items", 
    "due_today_items", 
    "week_glance", 
    "tasks_deadlines_markdown", 
    "today_focus_markdown", 
    "week_schedule_markdown", 
    "action_generators_markdown", 
    "summary"
  ]
};

export const generateWeeklyPlan = async (
  files: FileInput[],
  textInput: string,
  profile: UserProfile
): Promise<WeeklyPlanResponse> => {
  try {
    console.log("Starting generation...");
    const fileParts = await Promise.all(files.map(f => fileToGenerativePart(f.file)));
    
    const prompt = `
      You are Admin-Killer, a calm executive assistant.
      
      CONTEXT:
      Role: ${profile.role}
      Timezone: ${profile.timezone}
      Working Hours: ${profile.workingHours}
      Hard Events: ${profile.hardEvents}
      User Notes: ${textInput}

      TASK:
      1. Analyze files and notes. Extract tasks, deadlines, and meetings.
      2. Group into projects, infer dependencies, estimate effort.
      3. Create a realistic weekly schedule fitting the working hours.
      4. Prioritize TODAY heavily.

      OUTPUT FORMAT:
      Return a JSON object with:
      1. Structured data arrays for the 'Today' dashboard (today_focus_items, due_today_items, week_glance).
      2. Markdown strings for the detailed workspace panels.
      
      Formatting:
      - Use Markdown for the text fields (headers, lists, bolding).
      - Be concise and clear.
    `;

    console.log("Calling Gemini API with model:", MODEL_PRO);
    
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            ...fileParts.map(part => ({
              inlineData: {
                mimeType: part.mimeType,
                data: part.data
              }
            }))
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: PLAN_SCHEMA,
        thinkingConfig: {
            thinkingBudget: 4096, 
        }
      }
    });

    if (!response.text) throw new Error("No response text from Gemini");

    const parsed = JSON.parse(response.text);

    return {
        today_focus_items: parsed.today_focus_items || [],
        due_today_items: parsed.due_today_items || [],
        week_glance: parsed.week_glance || [],
        tasks_deadlines_markdown: parsed.tasks_deadlines_markdown || "No tasks.",
        today_focus_markdown: parsed.today_focus_markdown || "No today focus.",
        week_schedule_markdown: parsed.week_schedule_markdown || "No schedule.",
        action_generators_markdown: parsed.action_generators_markdown || "No actions.",
        summary: parsed.summary || "Plan ready."
    } as WeeklyPlanResponse;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const refreshTodayPlan = async (
  files: FileInput[],
  textInput: string,
  profile: UserProfile
): Promise<string> => {
  try {
    const fileParts = await Promise.all(files.map(f => fileToGenerativePart(f.file)));
    
    const prompt = `
      You are Admin-Killer. 
      CONTEXT:
      Role: ${profile.role}
      Timezone: ${profile.timezone}
      Working Hours: ${profile.workingHours}
      User Notes: ${textInput}
      
      TASK:
      Refresh ONLY the "Today Focus" plan.
      Output pure Markdown for the Today section.
      
      OUTPUT:
      Return JSON with a single field 'today_focus_markdown'.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            ...fileParts.map(part => ({
              inlineData: {
                mimeType: part.mimeType,
                data: part.data
              }
            }))
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                today_focus_markdown: { type: Type.STRING }
            }
        }
      }
    });

    if (!response.text) throw new Error("No text returned");
    const parsed = JSON.parse(response.text);
    return parsed.today_focus_markdown || "";

  } catch (error) {
    console.error("Error refreshing today:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
        const audioFile = new File([audioBlob], "input.wav", { type: "audio/wav" });
        const part = await fileToGenerativePart(audioFile);

        const response = await ai.models.generateContent({
            model: MODEL_FLASH,
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: "Transcribe this audio exactly. Do not add any commentary." },
                        {
                            inlineData: {
                                mimeType: "audio/wav",
                                data: part.data
                            }
                        }
                    ]
                }
            ]
        });
        
        return response.text || "";
    } catch (e) {
        console.error("Transcription failed", e);
        return "";
    }
}

export const speakText = async (text: string): Promise<AudioBuffer | null> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_TTS,
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: "Puck" }
                    }
                }
            }
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        return await audioContext.decodeAudioData(bytes.buffer);

    } catch (e) {
        console.error("TTS failed", e);
        return null;
    }
}