"use client";

import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ToastVariant = "success" | "error" | "warning" | "info" | "neutral";

interface NotificationToastProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    variant?: ToastVariant;
    icon?: string;
    duration?: number;
    position?: "top" | "bottom";
    colors?: {
        bg?: string;
        border?: string;
        progress?: string;
        bubbleColor?: string;
        textPrimary?: string;
        textSecondary?: string;
    };
}

const VARIANT_THEMES: Record<ToastVariant, {
    border: string;
    progress: string;
    icon: string;
    bubbleColor: string
}> = {
    success: {
        border: "border-[#9FC090]",
        progress: "bg-[#61924B]",
        bubbleColor: "bg-[#003F1F]",
        icon: "/svgs/success-icon-toast.svg",
    },
    error: {
        border: "border-[#FF979C]",
        progress: "bg-[#FF5C64]",
        bubbleColor: "bg-[#820006]",
        icon: "/svgs/error-icon-toast.svg",
    },
    warning: {
        border: "border-[#FFE6A3]",
        progress: "bg-[#FBBE1D]",
        bubbleColor: "bg-[#FFD600]",
        icon: "/svgs/warning-icon-toast.svg",
    },
    info: {
        border: "border-[#9ACAFF]",
        progress: "bg-[#358FF4]",
        bubbleColor: "bg-[#0E003F]",
        icon: "/svgs/info-icon-toast.svg",
    },
    neutral: {
        border: "border-[#7B55A3]",
        progress: "bg-[#574272]",
        bubbleColor: "bg-[#312245]",
        icon: "/svgs/neutral-icon-toast.svg",
    },
};

export function NotificationToast({
                                      isOpen,
                                      onClose,
                                      title,
                                      description,
                                      variant = "success",
                                      icon,
                                      duration = 4000,
                                      position = "top",
                                      colors,
                                  }: NotificationToastProps) {

    const theme = VARIANT_THEMES[variant];

    const activeColors = {
        bg: colors?.bg || "bg-white",
        border: colors?.border || theme.border,
        progress: colors?.progress || theme.progress,
        bubble: colors?.bubbleColor || theme.bubbleColor,
        textPrimary: colors?.textPrimary || "text-[#261A36]",
        textSecondary: colors?.textSecondary || "text-[#6B6B6B]",
    };

    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen && duration > 0) {
            timer = setTimeout(() => {
                onClose();
            }, duration);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isOpen, duration, onClose]);

    const positionClasses = position === "top" ? "top-4 md:top-10" : "bottom-4 md:bottom-10";
    const initialY = position === "top" ? -50 : 50;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key={`${title}-${description}`}
                    initial={{ opacity: 0, y: initialY, x: "-50%", scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={cn(
                        "fixed left-1/2 z-[100]",
                        "flex w-[90%] md:w-full md:max-w-[22rem] flex-col rounded-2xl border-4 md:border-6 shadow-2xl",
                        positionClasses,
                        activeColors.bg,
                        activeColors.border
                    )}
                >
                    <div className="relative flex items-center gap-2 md:gap-3 p-3 overflow-hidden rounded-xl">
                        <div className={cn("shrink-0 z-10 w-10 h-10 md:w-12 md:h-12 relative")}>
                            <Image
                                src={`${theme.icon}`}
                                alt="Toast Icon"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        <div className="flex flex-col gap-0.5 md:gap-1 pr-6 z-10">
                            <h3 className={cn("font-heading text-base md:text-lg font-bold leading-tight", activeColors.textPrimary)}>
                                {title}
                            </h3>
                            <p className={cn("font-heading text-xs md:text-sm font-normal leading-snug", activeColors.textSecondary)}>
                                {description}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-[#4E4E4E] hover:brightness-150 transition-all duration-200 cursor-pointer z-30 p-1"
                        >
                            <X size={20} className="md:w-[30px] md:h-[30px]" />
                        </button>

                        <div className="absolute inset-0 pointer-events-none z-0 opacity-10 md:opacity-15 hidden sm:block">
                            <div className={cn("h-12 w-12 rounded-full absolute right-4 top-1", activeColors.bubble)}/>
                            <div className={cn("h-9 w-9 rounded-full absolute right-4 -bottom-1", activeColors.bubble)}/>
                            <div className={cn("h-4 w-4 rounded-full absolute right-1 bottom-6.5", activeColors.bubble)}/>
                        </div>
                    </div>

                    <div className="absolute -bottom-1 pb-0.5 left-3 right-3 md:left-4 md:right-4 h-2.5 flex justify-center z-20 rounded-full">
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                            className={cn("h-full w-full origin-center rounded-full", activeColors.progress)}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
