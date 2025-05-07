"use client";

import React from "react";
import { ArrowRight, Mic, FileText, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LandingHeader from "./_components/LandingHeader";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/Spotlight";
import { FlipWords } from "@/components/ui/flip-words";
import { features, steps } from "@/utils/constants";

const LandingPage = () => {
    const router = useRouter();

    const words = ["Confidence", "Precision", "Ease", "Preparation"];

    return (
        <div className="relative">
            {/* Grid Background */}
            <div
                className={cn(
                    "absolute inset-0 -z-10",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                )}
            />
            {/* Radial gradient overlay */}
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            {/* Spotlight Effect */}
            <Spotlight
                className="absolute -top-[400px] left-0 md:-top-20 md:left-60"
                fill="white"
            />

            <LandingHeader />

            <div className="container max-w-6xl px-4 py-12 mx-auto space-y-32 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center pt-20"
                >
                    <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Ace Every Interview with
                        <span className="inline-flex items-baseline min-h-[2.5rem] align-baseline">
                            <FlipWords words={words} />
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Your personal AI interview coach, built to help you
                        practice, receive feedback, and succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                        <Button
                            className="cursor-pointer"
                            size="lg"
                            onClick={() => router.push("/sign-up")}
                        >
                            Get Started for Free
                        </Button>
                        <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="lg"
                            onClick={() => router.push("/sign-in")}
                        >
                            Sign In
                        </Button>
                    </div>
                    {/* Genuine value propositions */}
                    <div className="max-w-md mx-auto space-y-4 text-sm text-muted-foreground">
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <FileText className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
                            <p>Practice with realistic technical questions</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <Mic className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
                            <p>Record and review your answers</p>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <BarChart className="flex-shrink-0 mt-0.5 w-4 h-4 text-primary" />
                            <p>Track your preparation progress</p>
                        </div>
                    </div>
                </motion.div>

                {/* Feature Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-12"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">Key Features</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    </div>
                </motion.div>

                {/* Steps Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-12"
                >
                    <h2 className="text-3xl font-bold text-center">
                        Getting Started in Three Easy Steps
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                {/* Final CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center bg-primary/5 rounded-xl p-10"
                >
                    <h2 className="text-3xl font-bold mb-4">
                        Start Practicing Today
                    </h2>
                    <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Take control of your interview preparation and approach
                        every opportunity with confidence.
                    </p>
                    <Button
                        className="cursor-pointer"
                        size="lg"
                        onClick={() => router.push("/sign-up")}
                    >
                        Get Started for Free
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
