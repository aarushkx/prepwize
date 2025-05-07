"use client";

import React from "react";
import { Crown } from "lucide-react";
import { Card } from "@/components/ui/card";

const Premium = () => {
    return (
        <div className="container mx-auto p-4 max-w-md text-center">
            <div className="mx-auto mb-6">
                <div className="inline-flex items-center justify-center rounded-full bg-amber-50 p-4">
                    <Crown
                        size={40}
                        className="text-amber-500 fill-amber-400/20"
                    />
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-3">Unlock Premium Features</h1>

            <Card className="p-6 mb-6">
                <p className="text-muted-foreground">
                    Premium content is not available at this time. Check back
                    later for updates.
                </p>
            </Card>

            <p className="text-muted-foreground mt-4 max-w-md">
                We're working on enhancing your experience. In the meantime,
                please continue enjoying our currently available features.
            </p>
        </div>
    );
};

export default Premium;
