"use client";

import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Interview {
    id: number;
    mockId: string;
    createdAt: Date;
    createdBy: string;
    jobPosition: string;
    jobDescription: string;
    jobExperience: string;
    jsonResponse: string;
}

const InterviewItemCard = ({ interview }: { interview: Interview }) => {
    const router = useRouter();

    return (
        <Card className="hover:shadow-md transition-shadow w-full max-w-lg">
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="flex justify-end sm:hidden w-full mb-1">
                        <Badge variant="outline" className="text-sm">
                            Mock Interview
                        </Badge>
                    </div>

                    <div className="flex-1">
                        <CardTitle className="text-left text-lg">
                            <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 mt-1">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>{interview.jobPosition}</div>
                            </div>
                        </CardTitle>

                        <div className="text-left text-sm text-muted-foreground mt-1 whitespace-nowrap">
                            {Number(interview.jobExperience) === 1
                                ? "1 year experience"
                                : `${interview.jobExperience} years experience`}
                        </div>
                    </div>

                    <div className="hidden sm:block flex-shrink-0">
                        <Badge variant="outline" className="text-sm">
                            Mock Interview
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>
                            {format(interview.createdAt, "dd MMM, yyyy")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{interview.createdBy}</span>
                    </div>
                </div>
                <div className="mt-8">
                    <h4 className="text-left text-sm font-medium mb-2">
                        Job Description
                    </h4>
                    <div className="text-left text-sm">
                        {interview.jobDescription}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    onClick={() =>
                        router.push(
                            `dashboard/interview/${interview.mockId}/feedback`
                        )
                    }
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                >
                    View Details
                </Button>
                <Button
                    onClick={() =>
                        router.push(
                            `/dashboard/interview/${interview.mockId}/start`
                        )
                    }
                    className="cursor-pointer"
                    size="sm"
                >
                    Start Interview
                </Button>
            </CardFooter>
        </Card>
    );
};

export default InterviewItemCard;
