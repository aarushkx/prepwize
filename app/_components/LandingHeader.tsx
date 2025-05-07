"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const LandingHeader = () => {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container flex items-center justify-between h-16 px-4">
                {/* Logo on the left */}
                <Link
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push("/");
                    }}
                >
                    <div>
                        <Logo />
                    </div>
                </Link>

                {/* Auth buttons on the right */}
                <div className="flex gap-4">
                    <Button
                        className="cursor-pointer"
                        onClick={() => router.push("/sign-up")}
                    >
                        Sign Up
                    </Button>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => router.push("/sign-in")}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default LandingHeader;
