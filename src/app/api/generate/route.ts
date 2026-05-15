import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, options } = body;

    if (!options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "At least two options are required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      // Mock response for development if no key is provided
      console.warn("GEMINI_API_KEY is not set. Returning mock criteria.");
      return NextResponse.json({
        criteria: [
          { id: "c1", name: "Cost", description: "Financial implications and total cost of ownership." },
          { id: "c2", name: "Time to MVP", description: "How quickly the solution can be deployed and validated." },
          { id: "c3", name: "Maintenance", description: "Long-term support, infrastructure, and upkeep requirements." },
          { id: "c4", name: "Scalability", description: "Ability to handle future growth and increased workload." }
        ]
      });
    }

    const prompt = `
      The user is trying to make a decision about: "${subject || 'a generic comparison'}".
      They are deciding between the following options: ${options.join(", ")}.
      
      Generate 4 to 6 critical decision criteria that the user should consider to make this decision.
      For each criterion, provide a short name (1-3 words) and a brief description (1 sentence).
      
      Return ONLY a valid JSON array of objects, where each object has a "name" string and a "description" string. Do not use markdown blocks like \`\`\`json.
      Example:
      [
        { "name": "Cost", "description": "Financial implications and total cost." },
        { "name": "Scalability", "description": "Ability to handle growth." }
      ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    const text = response.text || "";
    
    // Attempt to parse JSON safely
    let parsedCriteria = [];
    try {
      // Remove any potential markdown formatting the model might still add
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      parsedCriteria = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", text);
      return NextResponse.json({ error: "Failed to generate criteria" }, { status: 500 });
    }

    // Add unique IDs
    const criteriaWithIds = parsedCriteria.map((c: any, index: number) => ({
      id: `crit_${Date.now()}_${index}`,
      name: c.name,
      description: c.description
    }));

    return NextResponse.json({ criteria: criteriaWithIds });
    
  } catch (error) {
    console.error("Error generating criteria:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
