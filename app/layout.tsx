import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";
import Footer from "./_components/Footer";
import { APP_NAME } from "@/utils/constants";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: APP_NAME,
    description:
        "Master your next job interview with AI-powered mock interviews. Get realistic practice, instant feedback, and analytics to boost your confidence and performance.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <html lang="en" className="scroll-smooth dark">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
                >
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
