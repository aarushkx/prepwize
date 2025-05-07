"use client";

import React from "react";
import { Check, ArrowRight, FileText, Star, Clipboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { features, steps } from "@/utils/constants";

const Guide = () => {
    const router = useRouter();

    return (
        <div className="container max-w-6xl px-4 py-12 mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    How Our Platform Works
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Learn how our interview preparation platform works and how
                    it can help you ace your next job interview.
                </p>
            </motion.div>

            {/* Key Features */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="border-2 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <CardHeader className="pb-2 pt-6">
                            <div className="flex justify-center">
                                {feature.icon}
                            </div>
                            <CardTitle className="text-xl text-center">
                                {feature.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Steps */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-16"
            >
                <h2 className="text-3xl font-bold mb-10 text-center">
                    Using the Platform in Three Simple Steps
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-primary">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-center text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[calc(100%-16px)] transform -translate-x-1/2">
                                    <ArrowRight className="text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Usage Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-16 bg-primary/5 rounded-xl p-8"
            >
                <h2 className="text-3xl font-bold mb-8 text-center">
                    What You Should Know
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                        <Clipboard className="text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                Interview Questions
                            </h3>
                            <p className="text-muted-foreground">
                                Each interview session contains{" "}
                                {process.env
                                    .NEXT_PUBLIC_NUM_OF_INTERVIEW_QUESTIONS ||
                                    5}{" "}
                                questions tailored to your job position. You can
                                end the interview at any time if needed.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <FileText className="text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                Detailed Feedback
                            </h3>
                            <p className="text-muted-foreground">
                                After completing your interview, you'll receive
                                a comprehensive feedback report with ratings and
                                suggested improvements for each question.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Check className="text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                Sample Answers
                            </h3>
                            <p className="text-muted-foreground">
                                Your feedback includes examples of strong
                                answers for each question, helping you
                                understand how to improve your responses.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Star className="text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                Free Plan Limit
                            </h3>
                            <p className="text-muted-foreground">
                                The free plan includes{" "}
                                {process.env
                                    .NEXT_PUBLIC_NUM_OF_FREE_INTERVIEWS ||
                                    3}{" "}
                                practice interviews. Upgrade to premium to
                                unlock additional sessions and features.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
            >
                <h2 className="text-3xl font-bold mb-4">Ready to Practice?</h2>
                <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Start preparing for your next interview and improve your
                    chances of landing your dream job.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        className="cursor-pointer"
                        onClick={() => router.push("/dashboard")}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default Guide;
