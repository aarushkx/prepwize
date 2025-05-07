"use client";

import React from "react";
import { APP_NAME } from "@/utils/constants";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-4">
                <p className="text-sm text-muted-foreground text-center">
                    &copy; {currentYear} {APP_NAME}. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
