// ./api.ts
const GEMINI_API_KEY = "AIzaSyB7TvNcWLOo5iLZv_xWWMxm9kcxegv3uQs"; // replace this with env for security

export async function chatWithGemini(
  userMessage: string,
  context: { scenarioId: string; patientName: string }
) {
  try {
    // Check if API key is valid
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API key");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: getPrompt(userMessage, context) }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      
      if (response.status === 404) {
        throw new Error("Gemini API endpoint not found. Please check your API key and model name.");
      } else if (response.status === 400) {
        throw new Error("Bad request to Gemini API. Please check your request format.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Please check your Gemini API key.");
      } else {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log("Gemini API Response:", data); // Debug log
    
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      console.error("No reply in response:", data);
      throw new Error("No response generated from Gemini");
    }
    
    return { reply };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

function getPrompt(userMessage: string, context: { scenarioId: string; patientName: string }) {
  const scenarioDescriptions = {
    "anxiety-disorder": "generalized anxiety disorder with panic attacks",
    "depression": "major depressive disorder",
    "grief-counseling": "grief and loss after losing a loved one",
    "relationship-conflict": "relationship problems and communication issues",
    "substance-use": "alcohol use disorder",
    "bipolar-disorder": "bipolar disorder with mood swings",
    "schizophrenia": "schizophrenia with psychotic symptoms",
    "borderline-personality": "borderline personality disorder"
  };

  const condition = scenarioDescriptions[context.scenarioId] || context.scenarioId.replace("-", " ");
  
  return `You are roleplaying as a mental health patient named ${context.patientName}, suffering from ${condition}. 

IMPORTANT: Respond naturally to the user's message in a realistic, conversational tone. You are the patient, not the therapist. Do not give advice or act as a therapist. Keep your response under 200 words and make it feel like a real person talking.

User: ${userMessage}

Reply as ${context.patientName}:`;
}

// Keep the old function name for backward compatibility
export async function chatWithOllama(userMessage: string, { scenarioId, patientName }: { scenarioId: string, patientName: string }) {
  return chatWithGemini(userMessage, { scenarioId, patientName });
}
