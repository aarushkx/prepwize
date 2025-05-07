"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/app/_components/Logo";
import { cn } from "@/lib/utils";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Analytics", path: "/dashboard/analytics" },
        { name: "Guide", path: "/dashboard/guide" },
        { name: "Premium", path: "/dashboard/premium" },
    ];

    const handleNavigation = (path: string) => {
        if (path === pathname) {
            setMobileMenuOpen(false);
            return;
        }
        router.push(path);
        setMobileMenuOpen(false);
    };

    const isActive = (path: string) => {
        if (pathname === path) return true;
        const lastSegment = path.split("/").pop();
        return pathname.endsWith(`/${lastSegment}`);
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container flex items-center justify-between h-16 px-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation("/");
                            }}
                        >
                            <div>
                                <Logo />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.path}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                isActive(item.path) &&
                                                    "bg-accent text-accent-foreground"
                                            )}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleNavigation(item.path);
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <UserButton />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="transition-transform duration-300" />
                            ) : (
                                <Menu className="transition-transform duration-300" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t overflow-hidden"
                        >
                            <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                exit={{ y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="container px-4 py-2 space-y-2"
                            >
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className={cn(
                                            "block w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                                            isActive(item.path) &&
                                                "bg-accent text-accent-foreground"
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation(item.path);
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;
