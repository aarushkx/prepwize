import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseModalities: [],
            responseMimeType: "text/plain",
        };

        const { prompt } = await request.json();

        const chatSession = model.startChat({ generationConfig });

        const result = await chatSession.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        const cleaned = text.replace("```json", "").replace("```", "");

        return NextResponse.json({ response: cleaned });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to generate feedback" },
            { status: 500 }
        );
    }
}
