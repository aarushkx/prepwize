"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import {
    WebcamIcon,
    Mic,
    MicOff,
    CircleArrowRight,
    CircleCheckBig,
    SquareX,
    ArrowRight,
    SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { feedbackPrompt } from "@/utils/promts";
import { chatSession } from "@/services/ai-service";
import { db } from "@/db/db";
import { userAnswer } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
    interviewQuestion: { question: string; answer: string }[];
    activeQuestionIndex: number;
    interviewData: any;
    goToNextQuestion: () => void;
}

const RecordAnswerSection = ({
    interviewQuestion,
    activeQuestionIndex,
    interviewData,
    goToNextQuestion,
}: Props) => {
    const [answer, setAnswer] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [openEndDialog, setOpenEndDialog] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [interimResult, setInterimResult] = useState<string>("");

    const recognitionRef = useRef<any>(null);
    const questionInstanceIdRef = useRef<string>(
        `question-${activeQuestionIndex}-${Date.now()}`
    );

    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        setAnswer("");
        setInterimResult("");
        setHasSubmitted(false);
        stopRecognition();

        questionInstanceIdRef.current = `question-${activeQuestionIndex}-${Date.now()}`;
    }, [activeQuestionIndex, interviewData.mockId]);

    const initRecognition = useCallback(() => {
        if (
            !("webkitSpeechRecognition" in window) &&
            !("SpeechRecognition" in window)
        ) {
            toast.error(
                "Speech recognition feature is not supported in this browser. We recommend updating your browser or switching to a supported platform."
            );
            return;
        }

        // Create a new instance each time
        const SpeechRecognition: any =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition: any = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            toast.error(`Speech recognition error: ${event.error}`);
            setIsRecording(false);
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + " ";
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                setAnswer((prev) => prev + finalTranscript);
            }

            setInterimResult(interimTranscript);
        };

        recognitionRef.current = recognition;
    }, []);

    const startRecognition = useCallback(() => {
        if (!recognitionRef.current) {
            initRecognition();
        }

        try {
            recognitionRef.current?.start();
        } catch (error) {
            console.error("Failed to start speech recognition", error);

            recognitionRef.current = null;
            initRecognition();
            recognitionRef.current?.start();
        }
    }, [initRecognition]);

    const stopRecognition = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error("Failed to stop speech recognition", error);
            }
        }
        setIsRecording(false);
    }, []);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecognition();
        } else {
            startRecognition();
        }
    }, [isRecording, startRecognition, stopRecognition]);

    const saveUserAnswer = useCallback(async () => {
        if (hasSubmitted) return;

        setIsLoading(true);
        try {
            if (isRecording) {
                stopRecognition();
            }

            const FEEDBACK_PROMPT = feedbackPrompt({
                userAnswer: answer,
                interviewQuestion,
                activeQuestionIndex,
            });

            const rawResponse = await chatSession.sendMessage(FEEDBACK_PROMPT);
            const aiFeedbackResponse = rawResponse.response
                .text()
                .replace("```json", "")
                .replace("```", "");

            console.log("aiResponse:", aiFeedbackResponse);
            const feedbackJsonResponse = JSON.parse(aiFeedbackResponse);

            const userAnswerRecord = await db.insert(userAnswer).values({
                mockIdRef: interviewData?.mockId ?? "",
                question: interviewQuestion[activeQuestionIndex]?.question,
                correctAnswer: interviewQuestion[activeQuestionIndex]?.answer,
                userAnswer: answer.trim() || "",
                feedback: feedbackJsonResponse?.feedback ?? "",
                rating: feedbackJsonResponse?.rating ?? "",
                userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
            });

            if (userAnswerRecord) {
                toast.success("Answer saved successfully");
                setHasSubmitted(true);
            }
        } catch (error: any) {
            toast.error("Failed to save answer");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [
        answer,
        hasSubmitted,
        interviewQuestion,
        activeQuestionIndex,
        interviewData,
        user,
        isRecording,
        stopRecognition,
    ]);

    const handleEndInterview = async () => {
        try {
            if (isRecording) {
                stopRecognition();
            }
            toast.success("Interview ended successfully");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error("Failed to end interview");
            console.log(error);
        }
    };

    const handleNavigation = () => {
        if (isRecording) {
            stopRecognition();
        }

        if (isLastQuestion) {
            router.push(
                `/dashboard/interview/${interviewData.mockId}/feedback`
            );
        } else {
            goToNextQuestion();
        }
    };

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (error: any) {
                    toast.error("Failed to stop speech recognition on unmount");
                }
            }
        };
    }, []);

    const isLastQuestion =
        interviewQuestion &&
        activeQuestionIndex >= interviewQuestion.length - 1;

    return (
        <div className="flex flex-col items-center justify-center w-full p-4 space-y-4">
            <Card className="w-full max-w-lg p-2 bg-secondary">
                <CardContent>
                    <div className="relative w-full flex items-center justify-center bg-secondary rounded-lg overflow-hidden h-64">
                        <WebcamIcon className="w-24 h-24 text-muted-foreground absolute" />
                        <Webcam mirrored className="w-full h-full z-10" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 w-full max-w-lg">
                <Button
                    onClick={toggleRecording}
                    disabled={isLoading}
                    className="cursor-pointer flex-1"
                    variant={isRecording ? "destructive" : "outline"}
                >
                    {isRecording ? (
                        <>
                            Stop Recording <MicOff />
                        </>
                    ) : (
                        <>
                            Start Recording <Mic />
                        </>
                    )}
                </Button>

                <Button
                    onClick={saveUserAnswer}
                    disabled={isLoading || hasSubmitted}
                    className="cursor-pointer flex-1"
                >
                    {hasSubmitted ? (
                        <>
                            Submitted <CircleCheckBig />
                        </>
                    ) : (
                        <>
                            Submit <CircleArrowRight />
                        </>
                    )}
                </Button>
            </div>

            <div className="flex gap-4 w-full max-w-lg">
                <Dialog open={openEndDialog} onOpenChange={setOpenEndDialog}>
                    <DialogTrigger asChild>
                        <Button
                            className="cursor-pointer flex-1"
                            variant="destructive"
                        >
                            End Interview <SquareX className="ml-2" />
                        </Button>
                    </DialogTrigger>
                    <DialogOverlay className="backdrop-blur-sm bg-black/30" />
                    <DialogContent className="[&>button]:cursor-pointer">
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                                This will end your current interview session.
                                Any unsaved progress will be lost.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                className="cursor-pointer"
                                variant="destructive"
                                onClick={handleEndInterview}
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button
                    className="cursor-pointer flex-1"
                    variant="outline"
                    onClick={handleNavigation}
                >
                    {isLastQuestion ? (
                        <>
                            See Result <SendHorizontal />
                        </>
                    ) : (
                        <>
                            Next Question <ArrowRight />
                        </>
                    )}
                </Button>
            </div>

            <Card className="w-full max-w-lg">
                <CardContent className="p-2 mx-2">
                    <h2 className="font-medium mb-2">Your Response:</h2>
                    <Textarea
                        className="p-2"
                        value={
                            interimResult
                                ? `${answer} ${interimResult}`
                                : answer
                        }
                        readOnly
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default RecordAnswerSection;
