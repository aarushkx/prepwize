"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NotFound = () => {
    const router = useRouter();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
            <div
                className={cn(
                    "absolute inset-0 -z-10",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                )}
            />
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl mx-auto"
            >
                <div className="text-7xl font-bold text-primary mb-4">404</div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Page Not Found!
                </h1>

                <p className="text-xl text-muted-foreground mb-8">
                    Hmm... Looks like this page got nervous and left the
                    interview early. Don't worry - we'll get you ready.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        className="cursor-pointer gap-2"
                        variant="outline"
                        size="lg"
                        onClick={() => router.push("/dashboard")}
                    >
                        Go to Dashboard
                        <ArrowRight />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
