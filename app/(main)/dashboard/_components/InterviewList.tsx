"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/db/db";
import { interview } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { toast } from "sonner";
import InterviewItemCard from "./InterviewItemCard";
import { Loader2 } from "lucide-react";

const InterviewList = () => {
    const [interviewList, setInterviewList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user } = useUser();

    useEffect(() => {
        user && getInterviewList();
    }, [user]);

    const getInterviewList = async () => {
        try {
            setIsLoading(true);

            const result = await db
                .select()
                .from(interview)
                .where(
                    eq(
                        interview.createdBy,
                        user?.primaryEmailAddress?.emailAddress ?? ""
                    )
                )
                .orderBy(desc(interview.id));

            setInterviewList(result);
        } catch (error: any) {
            toast.error(
                error.message || "Could not fetch the previous interviews"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="font-medium text-xl">Previous taken Interviews</h2>

            <div>
                {isLoading && (
                    <div className="flex justify-center p-12">
                        <Loader2
                            size={64}
                            className="animate-spin text-muted-foreground"
                        />
                    </div>
                )}

                {interviewList?.length === 0 && !isLoading && (
                    <div className="flex justify-center p-12">
                        You have not taken any interviews yet.
                    </div>
                )}

                {interviewList &&
                    interviewList.map((item: any, index: number) => (
                        <div key={index} className="py-4">
                            <InterviewItemCard interview={item} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default InterviewList;
