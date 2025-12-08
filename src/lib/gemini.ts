const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';

interface Part {
  text: string;
}

interface Content {
  parts: Part[];
}

interface Candidate {
  content: Content;
}

interface GeminiResponse {
  candidates: Candidate[];
}

export async function analyzeProfile(profileData: any): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return "Please configure your Gemini API Key in .env.local (NEXT_PUBLIC_GEMINI_API_KEY) to use this feature.";
  }

  const prompt = `
    Analyze this professional profile and suggest why they might be a good connection. 
    Focus on mutual interests, career path compatibility, and potential networking value.
    Keep it concise (max 3-4 sentences).
    
    Profile Data:
    Name: ${profileData.name}
    Role: ${profileData.currentRole}
    Company: ${profileData.currentCompany}
    About: ${profileData.about || 'Not specific'}
    Skills: ${profileData.skills?.join(', ') || 'Not specified'}
  `;

  return callGemini(prompt);
}

export async function analyzeJobCompatibility(jobData: any, userProfile?: any): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return "Please configure your Gemini API Key in .env.local (NEXT_PUBLIC_GEMINI_API_KEY) to use this feature.";
  }

  const prompt = `
    Analyze the compatibility between a candidate and this job posting.
    Highlight key matching skills and potential gaps.
    Give a compatibility score out of 100.
    
    Job Details:
    Title: ${jobData.title}
    Company: ${jobData.company}
    Description: ${jobData.description}
    Required Skills: ${jobData.skillsRequired?.join(', ')}
    
    ${userProfile ? `Candidate Profile: \n${JSON.stringify(userProfile)}` : 'Candidate Profile: [Generic Analysis based on general fit for a student/alumni]'}
  `;

  return callGemini(prompt);
}

async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API Error:", errorData);
        return "Unable to generate analysis at the moment. Please check your API key and try again.";
    }

    const data: GeminiResponse = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis generated.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "An error occurred while communicating with the AI service.";
  }
}
