"use client";

import React from "react";
import { APP_NAME } from "@/utils/constants";

const Logo = () => {
    return (
        <h1 className="font-bold text-2xl bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            {APP_NAME}
        </h1>
    );
};

export default Logo;
