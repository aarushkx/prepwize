"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/db/db";
import { interview } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WebcamIcon, Info } from "lucide-react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const InterviewPage = () => {
    const [interviewData, setInterviewData] = useState<any>(null);
    const [isWebcamEnabled, setIsWebcamEnabled] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const getInterviewData = async () => {
            try {
                setIsLoading(true);

                const result = await db
                    .select()
                    .from(interview)
                    .where(eq(interview.mockId, params?.interviewId as string));
                setInterviewData(result[0]);
            } catch (error: any) {
                toast.error(error.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };
        getInterviewData();
    }, [params?.interviewId]);

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-center mb-8">
                Let&apos;s get started
            </h2>

            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
                {/* Left Column - Job Info */}
                <div className="w-full lg:w-1/2 max-w-lg flex flex-col gap-4">
                    {isLoading ? (
                        <div className="rounded-lg border bg-background p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-8 w-1/2 rounded-md" />
                                <Skeleton className="h-6 w-1/4 rounded-full" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-1/3 rounded-md" />
                                <Skeleton className="h-16 w-full rounded-md" />
                                <Skeleton className="h-3 w-1/2 rounded-md" />
                            </div>
                        </div>
                    ) : (
                        interviewData && (
                            <>
                                {/* Interview Details Card */}
                                <div className="rounded-lg border bg-background shadow-sm p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <h3 className="text-xl font-semibold">
                                            {interviewData.jobPosition}
                                        </h3>
                                        <span className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                                            {Number(
                                                interviewData.jobExperience
                                            ) === 1
                                                ? "1 year experience"
                                                : `${interviewData.jobExperience} years experience`}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-sm mb-1">
                                                Job Description
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {interviewData.jobDescription}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-4">
                                            Created on{" "}
                                            {new Date(
                                                interviewData.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="rounded-lg border bg-yellow-50/80 p-4">
                                    <div className="flex items-start gap-2">
                                        <Info className="text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-900 mb-1">
                                                Your Privacy Matters
                                            </h4>
                                            <ul className="text-xs text-yellow-800 space-y-1.5 list-disc pl-4">
                                                <li>
                                                    This interview will consist
                                                    of{" "}
                                                    {process.env
                                                        .NEXT_PUBLIC_NUM_OF_INTERVIEW_QUESTIONS ||
                                                        5}{" "}
                                                    questions to assess your fit
                                                    for the{" "}
                                                    {interviewData?.jobPosition ||
                                                        "position"}
                                                </li>
                                                <li>
                                                    <span className="font-semibold">
                                                        Video/Microphone are
                                                        completely optional
                                                    </span>{" "}
                                                    - enable them only if you
                                                    want the most realistic
                                                    practice
                                                </li>
                                                <li>
                                                    <span className="font-semibold">
                                                        No data leaves your
                                                        browser
                                                    </span>{" "}
                                                    - we never record, store, or
                                                    process your video/audio
                                                </li>
                                                <li>
                                                    All processing happens
                                                    locally on your device in
                                                    real-time
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>

                {/* Right Column - Webcam */}
                <div className="w-full lg:w-1/2 max-w-lg flex flex-col items-center gap-6">
                    <div className="w-full text-center">
                        <h3 className="text-lg font-semibold mb-2">
                            Video Interview
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Webcam-enabled interviews are preferred but not
                            mandatory
                        </p>
                    </div>

                    {isWebcamEnabled ? (
                        <Webcam
                            onUserMedia={() => setIsWebcamEnabled(true)}
                            onUserMediaError={() => setIsWebcamEnabled(false)}
                            mirrored={true}
                            className="rounded-lg border w-full max-w-md aspect-video"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <WebcamIcon className="h-48 w-48 p-10 bg-secondary rounded-lg border" />
                            <Button
                                onClick={() => setIsWebcamEnabled(true)}
                                className="cursor-pointer w-full max-w-xs"
                                variant="outline"
                            >
                                Enable Webcam
                            </Button>
                        </div>
                    )}
                    <Button
                        className="cursor-pointer w-full max-w-xs"
                        onClick={() =>
                            router.push(
                                `/dashboard/interview/${params?.interviewId}/start`
                            )
                        }
                    >
                        Start Interview
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
