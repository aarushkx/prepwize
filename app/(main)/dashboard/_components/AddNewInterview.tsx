"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { interviewPrompt } from "@/utils/promts";
import { chatSession } from "@/services/ai-service";
import { Loader2 } from "lucide-react";
import { db } from "@/db/db";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { interview } from "@/db/schema";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";

const formSchema = z.object({
    jobPosition: z.string().min(2, {
        message: "Job position must be at least 2 characters",
    }),
    jobDescription: z.string().min(10, {
        message: "Job description must be at least 10 characters",
    }),
    jobExperience: z
        .union([z.number().nonnegative(), z.nan()])
        .refine((val) => !isNaN(val), {
            message: "Job experience must be a positive number",
        })
        .default(0),
});

const MAX_INTERVIEWS =
    Number(process.env.NEXT_PUBLIC_NUM_OF_FREE_INTERVIEWS) || 3;

const AddNewInterview = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [interviewCount, setInterviewCount] = useState<number>(0);
    const [isCheckingLimit, setIsCheckingLimit] = useState<boolean>(false);

    const router = useRouter();
    const { user } = useUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    useEffect(() => {
        const fetchInterviewCount = async () => {
            if (!userEmail) return;
            try {
                const result = await db
                    .select()
                    .from(interview)
                    .where(eq(interview.createdBy, userEmail));

                setInterviewCount(result.length);
            } catch (error: any) {
                toast.error("Error fetching interview count");
            }
        };

        fetchInterviewCount();
    }, [userEmail]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jobPosition: "",
            jobDescription: "",
            jobExperience: 0,
        },
    });

    const checkInterviewLimit = async () => {
        if (!userEmail) return false;
        setIsCheckingLimit(true);

        try {
            const result = await db
                .select()
                .from(interview)
                .where(eq(interview.createdBy, userEmail));

            return result.length < MAX_INTERVIEWS;
        } catch (error: any) {
            toast.error("Error checking interview limit");
            return false;
        } finally {
            setIsCheckingLimit(false);
        }
    };

    const handleAddClick = async () => {
        if (!userEmail) {
            toast.error("Please sign in to create interviews");
            return;
        }

        const canCreate = await checkInterviewLimit();
        if (!canCreate) {
            toast.error(
                `You've reached your limit of ${MAX_INTERVIEWS} interviews`
            );
            return;
        }
        setIsDialogOpen(true);
    };

    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        if (!userEmail) {
            toast.error("Please sign in to create interviews");
            return;
        }

        const canCreate = await checkInterviewLimit();
        if (!canCreate) {
            toast.error(
                `You've reached your limit of ${MAX_INTERVIEWS} interviews`
            );
            return;
        }

        try {
            setIsLoading(true);
            const { jobPosition, jobDescription, jobExperience } = formData;
            const numOfQuestions =
                Number(process.env.NEXT_PUBLIC_NUM_OF_INTERVIEW_QUESTIONS) || 5;

            const INPUT_PROMPT = interviewPrompt({
                jobPosition,
                jobDescription,
                jobExperience,
                numOfQuestions,
            });

            const rawResponse = await chatSession.sendMessage(INPUT_PROMPT);
            const aiResponse = rawResponse.response
                .text()
                .replace("```json", "")
                .replace("```", "");

            if (aiResponse) {
                const newInterview = await db
                    .insert(interview)
                    .values({
                        jsonResponse: aiResponse,
                        jobPosition,
                        jobDescription,
                        jobExperience: jobExperience.toString(),
                        createdBy: userEmail,
                        mockId: uuidv4(),
                    })
                    .returning({
                        mockId: interview.mockId,
                    });

                if (newInterview) {
                    setInterviewCount((prev) => prev + 1);
                    router.push(
                        `dashboard/interview/${newInterview[0]?.mockId}`
                    );
                }
            } else {
                toast.error("Failed to start interview");
            }

            setIsDialogOpen(false);
            form.reset();
        } catch (error: any) {
            toast.error("Failed to start interview", {
                description: error.message || "Please try again later",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Add New Interview */}
            <div
                className="p-8 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={handleAddClick}
            >
                <h1 className="font-bold text-2xl">+ Add New Interview</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    {interviewCount}/{MAX_INTERVIEWS} interviews used
                </p>
            </div>

            {/* Dialog with Blur Effect */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) form.reset();
                }}
            >
                <DialogOverlay className="backdrop-blur-sm bg-black/30" />
                <DialogContent className="[&>button]:cursor-pointer">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle className="font-bold">
                                    Provide Insight Into Your Interview
                                </DialogTitle>
                                <DialogDescription asChild>
                                    <div>
                                        <h2 className="mt-1">
                                            Share the job specifics for
                                            personalized interview prep
                                        </h2>
                                        <div className="mt-8 my-2 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="jobPosition"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Job Position
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Full Stack Web Developer"
                                                                className="w-full"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="jobDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Job Description
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="MongoDB, Express, React, Node.js"
                                                                className="w-full"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="jobExperience"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Job Experience
                                                            (years)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="2"
                                                                className="w-full"
                                                                {...field}
                                                                value={
                                                                    isNaN(
                                                                        field.value
                                                                    )
                                                                        ? ""
                                                                        : field.value
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const value =
                                                                        e.target
                                                                            .value;
                                                                    field.onChange(
                                                                        value ===
                                                                            ""
                                                                            ? NaN
                                                                            : Number(
                                                                                  value
                                                                              )
                                                                    );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </DialogDescription>
                                <div className="flex gap-4 justify-end mt-6">
                                    <Button
                                        className="cursor-pointer"
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            form.reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="cursor-pointer"
                                        type="submit"
                                        variant="outline"
                                        disabled={isLoading || isCheckingLimit}
                                    >
                                        {isLoading || isCheckingLimit ? (
                                            <span className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                                                {isLoading
                                                    ? "Starting"
                                                    : "Checking"}
                                            </span>
                                        ) : (
                                            "Start Interview"
                                        )}
                                    </Button>
                                </div>
                            </DialogHeader>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewInterview;
