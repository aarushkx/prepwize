"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/db/db";
import { interview } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

const StartPage = () => {
    const [interviewData, setInterviewData] = useState<any>(null);
    const [interviewQuestion, setInterviewQuestion] = useState<any>(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const params = useParams();

    useEffect(() => {
        getInterviewData();
    }, []);

    const getInterviewData = async () => {
        try {
            setIsLoading(true);
            const result = await db
                .select()
                .from(interview)
                .where(eq(interview.mockId, params?.interviewId as string));

            if (!result.length) throw new Error("Interview not found");

            const jsonResponse = JSON.parse(result[0].jsonResponse);
            setInterviewQuestion(jsonResponse);
            setInterviewData(result[0]);
        } catch (error: any) {
            toast.error(error.message || "Failed to load interview");
        } finally {
            setIsLoading(false);
        }
    };

    const goToNextQuestion = () => {
        if (
            interviewQuestion &&
            activeQuestionIndex < interviewQuestion.length - 1
        ) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
        }
    };

    if (isLoading || !interviewData) {
        return <div className="p-4 text-center">Loading interview...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <QuestionSection
                    interviewQuestion={interviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />
                <RecordAnswerSection
                    interviewQuestion={interviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                    goToNextQuestion={goToNextQuestion}
                />
            </div>
        </div>
    );
};

export default StartPage;
