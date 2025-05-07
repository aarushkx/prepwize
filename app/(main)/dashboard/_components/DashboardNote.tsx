"use client";

import React from "react";
import { Info } from "lucide-react";

const DashboardNote = () => {
    return (
        <div className="border rounded-lg p-4 bg-accent mt-4">
            <h2 className="flex gap-2 items-center text-primary">
                <Info />
                <strong>Free User Limitation</strong>
            </h2>
            <h2 className="text-left text-sm text-primary my-2">
                Free accounts are limited to{" "}
                {process.env.NEXT_PUBLIC_NUM_OF_FREE_INTERVIEWS || 3} interview
                sessions. Upgrade to Premium for unlimited interviews and
                advanced features.
            </h2>
        </div>
    );
};

export default DashboardNote;
