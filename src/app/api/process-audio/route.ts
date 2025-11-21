import { NextRequest, NextResponse } from "next/server";
import { genAI } from "../../../lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get("audio") as File;

        if (!audioFile) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      You are an expert meeting note taker. Listen to this audio recording of a meeting and provide the following:
      1. A concise summary of the meeting.
      2. Key insights in bullet points.
      3. Actionable items or tasks that can be done right away.
      4. A detailed description of what the meeting was about.

      Return the response in the following JSON format:
      {
        "summary": "...",
        "insights": ["...", "..."],
        "actions": ["...", "..."],
        "description": "..."
      }
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: audioFile.type || "audio/webm",
                    data: base64Audio
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up the text to ensure it's valid JSON (sometimes Gemini adds markdown code blocks)
        const jsonString = text.replace(/```json\n|\n```/g, "").trim();

        let data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse JSON:", text);
            // Fallback if JSON parsing fails
            data = {
                summary: "Could not parse structured output.",
                insights: [],
                actions: [],
                description: text
            };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error processing audio:", error);
        return NextResponse.json(
            { error: "Failed to process audio", details: (error as Error).message },
            { status: 500 }
        );
    }
}
