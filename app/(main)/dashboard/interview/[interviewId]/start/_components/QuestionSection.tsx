"use client";

import React, { useEffect, useState } from "react";
import { Info, VolumeOff, Volume2 } from "lucide-react";
import { QUESTION_SECTION_NOTE } from "@/utils/constants";
import { toast } from "sonner";

interface Question {
    question: string;
    answer?: string;
}

const QuestionSection = ({
    interviewQuestion,
    activeQuestionIndex,
}: {
    interviewQuestion: Question[] | null;
    activeQuestionIndex: number;
}) => {
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const textToSpeech = (text: string | undefined) => {
        if (!text) return;

        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 1.5;
            utterance.pitch = 1.5;

            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        } else {
            toast.error(
                "Text-to-speech feature is not supported in this browser. We recommend updating your browser or switching to a supported platform."
            );
        }
    };

    useEffect(() => {
        return () => {
            if (isSpeaking) {
                speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        };
    }, [isSpeaking]);

    return (
        <div className="p-4 border rounded-lg mt-4 mb-4">
            {/* Question List */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {interviewQuestion?.map((item: Question, index: number) => (
                    <div key={index}>
                        <h2
                            className={`font-medium bg-secondary p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
                                activeQuestionIndex === index
                                    ? "bg-secondary-foreground text-primary-foreground"
                                    : ""
                            }`}
                        >
                            Question #{index + 1}
                        </h2>
                    </div>
                ))}
            </div>

            {/* Question */}
            <h2 className="my-6 text-md md:text-lg ">
                {interviewQuestion?.[activeQuestionIndex]?.question}
            </h2>

            <button
                onClick={() =>
                    textToSpeech(
                        interviewQuestion?.[activeQuestionIndex]?.question
                    )
                }
                className="cursor-pointer"
            >
                {isSpeaking ? (
                    <Volume2 className="hover:text-primary/80" />
                ) : (
                    <VolumeOff className="hover:text-primary/80" />
                )}
            </button>

            {/* Note */}
            <div className="border rounded-lg p-4 bg-accent mt-16">
                <h2 className="flex gap-2 items-center text-primary">
                    <Info />
                    <strong>Note</strong>
                </h2>
                <h2 className="text-sm text-primary my-2">
                    {QUESTION_SECTION_NOTE}
                </h2>
            </div>
        </div>
    );
};

export default QuestionSection;
