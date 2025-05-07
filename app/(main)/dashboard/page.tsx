"use client";

import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PlusCircle, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import DashboardNote from "./_components/DashboardNote";

const Dashboard = () => {
    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <div className="space-y-4 sm:space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Dashboard
                            </h1>
                        </div>
                        <p className="text-left text-muted-foreground text-sm sm:text-base">
                            Prepare for your next interview with AI-powered
                            simulation
                        </p>
                    </div>

                    <Separator className="my-4 sm:my-6" />

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                        {/* Start New Interview Section */}
                        <Card className="col-span-1 lg:col-span-4 h-fit">
                            <CardHeader className="pb-2 sm:pb-3">
                                <div className="flex items-center gap-2">
                                    <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    <CardTitle className="text-lg sm:text-xl">
                                        Start New Interview
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-left text-xs sm:text-sm">
                                    Choose a role and begin your AI interview
                                    simulation
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AddNewInterview />
                                <DashboardNote />
                            </CardContent>
                        </Card>

                        {/* Interview History Section */}
                        <div className="col-span-1 lg:col-span-8 space-y-4">
                            <Card>
                                <CardHeader className="pb-2 sm:pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            <CardTitle className="text-lg sm:text-xl">
                                                Interview History
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription className="text-left text-xs sm:text-sm">
                                        Review and continue your past interview
                                        sessions
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <div className="bg-background border rounded-lg px-2 sm:px-4 py-2 sm:py-3">
                                <InterviewList />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
