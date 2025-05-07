"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/db/db";
import { userAnswer } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    ChevronDown,
    ChevronUp,
    Award,
    CheckCircle,
    AlertCircle,
    MessageCircle,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FeedbackItem {
    id: number;
    mockIdRef: string;
    question: string;
    userAnswer: string | null;
    correctAnswer: string | null;
    feedback: string | null;
    rating: string | null;
    userEmail: string;
    createdAt: Date;
}

const Feedback = ({ params }: { params: Promise<{ interviewId: string }> }) => {
    const resolvedParams = use(params);

    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [overallRating, setOverallRating] = useState<number>(0);
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        getFeedback();
    }, []);

    const getFeedback = async () => {
        setIsLoading(true);
        try {
            const result = await db
                .select()
                .from(userAnswer)
                .where(
                    eq(
                        userAnswer.mockIdRef,
                        resolvedParams?.interviewId as string
                    )
                )
                .orderBy(userAnswer.id);

            setFeedback(result);
            setOpenItems(
                result.reduce(
                    (acc, _, index) => ({ ...acc, [index]: false }),
                    {}
                )
            );

            if (result.length > 0) {
                const totalRating = result.reduce((sum, item) => {
                    const numRating = item.rating ? parseFloat(item.rating) : 0;
                    return isNaN(numRating) ? sum : sum + numRating;
                }, 0);

                setOverallRating(
                    Math.round((totalRating / result.length) * 10) / 10
                );
            }
        } catch (error: any) {
            toast.error(error.message || "Could not fetch feedback");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleItem = (index: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const getRatingColor = (rating: string | null): string => {
        const numRating = rating ? parseFloat(rating) : 0;
        if (numRating >= 8) return "text-green-600";
        if (numRating >= 6) return "text-yellow-600";
        return "text-red-600";
    };

    const getRatingValue = (rating: string | null): string => {
        if (!rating) return "N/A";
        const numRating = parseFloat(rating);
        return isNaN(numRating) ? "N/A" : `${numRating}/10`;
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Card className="mb-8">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        Interview Completed!
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-md">
                        Congratulations on completing your mock interview
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="text-yellow-500" />
                            <h2 className="text-xl font-bold">
                                Your Overall Rating
                            </h2>
                        </div>

                        <div
                            className={`text-2xl font-bold ${
                                overallRating >= 8
                                    ? "text-green-600"
                                    : overallRating >= 6
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                        >
                            {overallRating}/10
                        </div>

                        <Progress
                            value={overallRating * 10}
                            className="w-1/2 mt-2"
                        />
                    </div>

                    <p className="text-center text-gray-400 mb-2">
                        Review your performance on each question below. Click on
                        a question to see detailed feedback.
                    </p>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 size={64} className="animate-spin" />
                </div>
            ) : (
                <div className="space-y-4">
                    {feedback.length === 0 ? (
                        <Card>
                            <CardContent className="p-6 text-center text-gray-400">
                                No feedback available for this interview
                            </CardContent>
                        </Card>
                    ) : (
                        feedback.map((item: FeedbackItem, index: number) => (
                            <Collapsible
                                key={item.id}
                                open={openItems[index]}
                                onOpenChange={() => toggleItem(index)}
                                className="border rounded-lg"
                            >
                                <CollapsibleTrigger className="w-full cursor-pointer p-4 flex items-center justify-between text-left">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex items-center justify-center ${getRatingColor(
                                                item.rating
                                            )}`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="font-medium text-gray-300">
                                            {item.question}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`font-semibold ${getRatingColor(
                                                item.rating
                                            )}`}
                                        >
                                            {getRatingValue(item.rating)}
                                        </span>
                                        {openItems[index] ? (
                                            <ChevronUp
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={18}
                                                className="text-gray-400"
                                            />
                                        )}
                                    </div>
                                </CollapsibleTrigger>

                                <AnimatePresence>
                                    {openItems[index] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CollapsibleContent
                                                forceMount
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 pt-0 space-y-2 rounded-b-lg">
                                                    <div className="bg-zinc-800 border rounded-lg p-4 space-y-1">
                                                        <div className="flex items-center gap-2 text-gray-200 font-semibold">
                                                            <AlertCircle
                                                                size={18}
                                                                className="text-red-500"
                                                            />
                                                            Your Answer
                                                        </div>
                                                        <p className="text-gray-400">
                                                            {item.userAnswer ||
                                                                "No answer provided"}
                                                        </p>
                                                    </div>

                                                    <div className="bg-zinc-800 border rounded-lg p-4 space-y-1">
                                                        <div className="flex items-center gap-2 text-gray-200 font-semibold">
                                                            <CheckCircle
                                                                size={18}
                                                                className="text-green-500"
                                                            />
                                                            Correct Answer
                                                        </div>

                                                        <div className="prose prose-invert text-gray-400">
                                                            <ReactMarkdown
                                                                remarkPlugins={[
                                                                    remarkGfm,
                                                                ]}
                                                            >
                                                                {item.correctAnswer ||
                                                                    "No correct answer available"}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>

                                                    <div className="bg-zinc-800 border rounded-lg p-4 space-y-1">
                                                        <div className="flex items-center gap-2 text-gray-200 font-semibold">
                                                            <MessageCircle
                                                                size={18}
                                                                className="text-blue-500"
                                                            />
                                                            Feedback
                                                        </div>

                                                        <div className="prose prose-invert text-gray-400">
                                                            <ReactMarkdown
                                                                remarkPlugins={[
                                                                    remarkGfm,
                                                                ]}
                                                            >
                                                                {item.feedback ||
                                                                    "No feedback available"}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Collapsible>
                        ))
                    )}
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <Button
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer"
                >
                    Return to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default Feedback;
