"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BackgroundBubblesProps {
    className?: string;
    circleColor?: string;
    isEventsOrFeedbackPage?: boolean;
}

export function BackgroundBubbles({
    className,
    circleColor = "bg-[#7B55A3]/10",
    isEventsOrFeedbackPage = false,
}: BackgroundBubblesProps) {
    return (
        <div className={cn("hidden lg:block absolute inset-0 pointer-events-none h-full overflow-hidden", className)}>
            {/* Top Right Circle */}
            <motion.div
                className={cn("absolute -top-5 -right-55 h-90 w-90 rounded-full pointer-events-auto", circleColor)}
                initial={{ x: 0, y: 0 }}
                whileHover={{ x: 50 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />

            {/* Top Mid-Left Circle */}
            <motion.div
                className={cn("absolute -top-22 left-90 h-40 w-40 rounded-full pointer-events-auto", circleColor)}
                initial={{ x: 0, y: 0 }}
                whileHover={{ y: -40, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />

            {/* Center Left Circle */}
            <motion.div
                className={cn("absolute top-35 left-10 h-130 w-130 rounded-full pointer-events-auto", circleColor)}
                initial={{ x: 0, y: 0 }}
                whileHover={{ x: -60, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* Bottom Right Circle */}
            <motion.div
                className={cn(
                    "absolute -right-20 h-160 w-160 rounded-full pointer-events-auto",
                    isEventsOrFeedbackPage ? "-bottom-65 " : "-bottom-25",
                    circleColor,
                )}
                initial={{ x: 0, y: 0 }}
                whileHover={{ x: -60, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
        </div>
    );
}
