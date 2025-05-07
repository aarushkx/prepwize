import { GoogleGenerativeAI } from "@google/generative-ai";
import { interviewPrompt } from "@/utils/promts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { jobPosition, jobDescription, jobExperience, numOfQuestions } =
            await request.json();

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

        const chatSession = model.startChat({ generationConfig });

        const prompt = interviewPrompt({
            jobPosition,
            jobDescription,
            jobExperience,
            numOfQuestions,
        });

        const rawResponse = await chatSession.sendMessage(prompt);
        const text = await rawResponse.response.text();

        const cleaned = text.replace("```json", "").replace("```", "");

        return NextResponse.json({ result: cleaned });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to generate interview" },
            { status: 500 }
        );
    }
}
