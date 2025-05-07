"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const MetricCard = ({
    icon,
    title,
    value,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
}) => (
    <Card className="min-w-0 overflow-hidden">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className={`bg-${color}-100 p-3 rounded-full mb-3`}>
                {icon}
            </div>
            <div className="w-full">
                <p className="text-sm text-muted-foreground mb-1">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </CardContent>
    </Card>
);

export default MetricCard;
