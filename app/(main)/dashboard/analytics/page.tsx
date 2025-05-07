"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "./_components/MetricCard";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    CheckCircle,
    Award,
    Clock,
    BarChart3,
    LineChart as LineChartIcon,
    Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { db } from "@/db/db";
import { interview, userAnswer } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface MonthlyPerformance {
    month: string;
    correct: number;
    incorrect: number;
    monthIndex?: number; // Added for sorting
}

interface AnalyticsData {
    totalInterviews: number;
    totalQuestions: number;
    correctAnswers: number; // Based on rating >= 8
    averageRating: number;
    monthlyPerformance: MonthlyPerformance[];
    loading: boolean;
}

const Analytics = () => {
    const [data, setData] = useState<AnalyticsData>({
        totalInterviews: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageRating: 0,
        monthlyPerformance: [],
        loading: true,
    });

    const { user } = useUser();

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            fetchData(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);

    const fetchData = async (userEmail: string) => {
        try {
            const interviews = await db
                .select()
                .from(interview)
                .where(eq(interview.createdBy, userEmail));

            const answers = await db
                .select()
                .from(userAnswer)
                .where(eq(userAnswer.userEmail, userEmail));

            const totalInterviews = interviews.length;
            const totalQuestions = answers.length;

            const correctAnswers = answers.filter((a) => {
                const rating = parseFloat(a.rating || "0");
                return rating >= 8;
            }).length;

            const ratings = answers
                .map((a) => parseFloat(a.rating || "0"))
                .filter((r) => !isNaN(r));

            let sum = 0;
            for (const rating of ratings) {
                sum += rating;
            }

            const averageRating = ratings.length
                ? parseFloat((sum / ratings.length).toFixed(1))
                : 0;

            let minDate = new Date();
            let maxDate = new Date(0);

            for (const answer of answers) {
                const answerDate = new Date(answer.createdAt);
                if (answerDate < minDate) minDate = answerDate;
                if (answerDate > maxDate) maxDate = answerDate;
            }

            // Monthly performance tracking with proper chronological order
            const monthlyPerformanceMap = new Map<
                string,
                { correct: number; incorrect: number; monthIndex: number }
            >();

            const startMonth = new Date(
                minDate.getFullYear(),
                minDate.getMonth(),
                1
            );
            const endMonth = new Date(
                maxDate.getFullYear(),
                maxDate.getMonth(),
                1
            );

            if (answers.length > 0) {
                let currentMonth = new Date(startMonth);

                while (currentMonth <= endMonth) {
                    const monthName = currentMonth.toLocaleString("default", {
                        month: "short",
                    });
                    const yearMonthKey = `${monthName} ${currentMonth.getFullYear()}`;
                    const monthIndex =
                        currentMonth.getFullYear() * 12 +
                        currentMonth.getMonth();

                    monthlyPerformanceMap.set(yearMonthKey, {
                        correct: 0,
                        incorrect: 0,
                        monthIndex: monthIndex,
                    });

                    // Move to next month
                    currentMonth = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        1
                    );
                }

                // Count answers for each month
                for (const answer of answers) {
                    const answerDate = new Date(answer.createdAt);
                    const monthName = answerDate.toLocaleString("default", {
                        month: "short",
                    });
                    const yearMonthKey = `${monthName} ${answerDate.getFullYear()}`;
                    const rating = parseFloat(answer.rating || "0");
                    const isCorrect = rating >= 8;

                    const current = monthlyPerformanceMap.get(yearMonthKey);
                    if (current) {
                        if (isCorrect) {
                            current.correct++;
                        } else {
                            current.incorrect++;
                        }
                        monthlyPerformanceMap.set(yearMonthKey, current);
                    }
                }
            }

            const monthlyPerformance = Array.from(
                monthlyPerformanceMap.entries()
            )
                .map(([month, data]) => ({
                    month,
                    correct: data.correct,
                    incorrect: data.incorrect,
                    monthIndex: data.monthIndex,
                }))
                .sort((a, b) => a.monthIndex - b.monthIndex);

            const displayData = monthlyPerformance.map(
                ({ month, correct, incorrect }) => ({
                    month,
                    correct,
                    incorrect,
                })
            );

            setData({
                totalInterviews,
                totalQuestions,
                correctAnswers,
                averageRating,
                monthlyPerformance: displayData,
                loading: false,
            });
        } catch (error) {
            console.error("Analytics error:", error);
            toast.error("Failed to fetch analytics");
            setData((prev) => ({ ...prev, loading: false }));
        }
    };

    if (data.loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2
                    size={64}
                    className="animate-spin text-muted-foreground"
                />
            </div>
        );
    }

    const accuracyRate = (
        (data.correctAnswers / (data.totalQuestions || 1)) *
        100
    ).toFixed(1);

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <h1 className="text-2xl font-bold mb-6">Interview Analytics</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <MetricCard
                        icon={<Clock className="text-blue-600" />}
                        title="Interviews"
                        value={data.totalInterviews}
                        color="blue"
                    />
                    <MetricCard
                        icon={<BarChart3 className="text-purple-600" />}
                        title="Questions"
                        value={data.totalQuestions}
                        color="purple"
                    />
                    <MetricCard
                        icon={<CheckCircle className="text-green-600" />}
                        title="Correct"
                        value={data.correctAnswers}
                        color="green"
                    />
                    <MetricCard
                        icon={<Award className="text-amber-600" />}
                        title="Rating"
                        value={`${data.averageRating}/10`}
                        color="amber"
                    />
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">
                            Accuracy Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                            <div className="text-3xl sm:text-4xl font-bold">
                                {accuracyRate}%
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                                {data.correctAnswers} correct out of{" "}
                                {data.totalQuestions} questions
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Graph Section */}
                {data.monthlyPerformance.length > 0 ? (
                    <Tabs defaultValue="line">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                className="cursor-pointer"
                                value="line"
                            >
                                <LineChartIcon className="h-4 w-4 mr-2" />
                                Trend
                            </TabsTrigger>
                            <TabsTrigger
                                className="cursor-pointer"
                                value="area"
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Progress
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="line">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart
                                                data={data.monthlyPerformance}
                                            >
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line
                                                    type="linear"
                                                    dataKey="correct"
                                                    stroke="#10b981"
                                                    strokeWidth={2}
                                                    name="Correct (8+)"
                                                />
                                                <Line
                                                    type="linear"
                                                    dataKey="incorrect"
                                                    stroke="#ef4444"
                                                    strokeWidth={2}
                                                    name="Incorrect (<8)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="area">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Cumulative Progress (8+ rating)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart
                                                data={data.monthlyPerformance}
                                            >
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area
                                                    type="linear"
                                                    dataKey="correct"
                                                    stroke="#2563eb"
                                                    fill="#2563eb"
                                                    fillOpacity={0.2}
                                                    name="Correct (8+)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Performance Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                                <BarChart3 className="h-10 w-10 text-muted-foreground" />
                                <h3 className="text-lg font-medium text-muted-foreground">
                                    No interview data yet
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Complete your first interview to unlock
                                    detailed performance analytics and track
                                    your progress over time.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    );
};

export default Analytics;
