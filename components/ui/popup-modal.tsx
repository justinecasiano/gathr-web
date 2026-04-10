"use client";

import * as React from "react";
import { LucideIcon, Loader2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PopupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: LucideIcon;
    isLoading?: boolean;
    colors?: {
        border?: string;
        bg?: string;
        circle?: string;
    };
}

export default function PopupModal({
                                       isOpen,
                                       onClose,
                                       onConfirm,
                                       title = "Popup Modal",
                                       confirmText = "Confirm",
                                       cancelText = "Cancel",
                                       isLoading = false,
                                       colors = {
                                           border: "border-[#7B55A3]",
                                           bg: "bg-[#F7F0FF]",
                                           circle: "bg-[#312245]/10",
                                       }
                                   }: PopupModalProps) {

    return (
        <AnimatePresence>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    className={cn(
                        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        "w-[92%] sm:w-full sm:max-w-sm overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-4 sm:border-6 p-0 shadow-2xl",
                        "hide-close-button [&>button]:hidden",
                        colors.bg,
                        colors.border
                    )}
                >
                    <div className="relative p-6 sm:p-8 flex flex-col items-center">

                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className={cn("absolute top-8 left-9 h-14 w-14 rounded-full", colors.circle)} />
                            <div className={cn("absolute top-2 right-3 h-26 w-26 rounded-full", colors.circle)} />
                            <div className={cn("absolute bottom-3 left-11 h-36 w-36 rounded-full", colors.circle)} />
                        </div>

                        <div className="relative z-10 flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6">
                            <Image
                                src="/svgs/neutral-icon-toast.svg"
                                alt="Toast Icon"
                                className="object-contain p-3"
                                priority
                                fill
                            />
                        </div>

                        <DialogHeader className="relative z-10 mb-6 sm:mb-8">
                            <DialogTitle className="text-xl sm:text-2xl font-display font-bold text-[#453A5F] text-center leading-tight">
                                {title}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="relative z-10 flex flex-col xs:flex-row w-full gap-3 sm:gap-4 px-0 xs:px-2">
                            <Button
                                onClick={onClose}
                                variant={"elevated"}
                                className="h-12 sm:h-14 flex-1 rounded-xl sm:rounded-2xl bg-brand border-[#4C2576] font-display text-lg sm:text-xl font-black text-white shadow-lg transition-all"
                            >
                                {cancelText}
                            </Button>

                            <Button
                                onClick={onConfirm}
                                variant={"elevated"}
                                disabled={isLoading}
                                className="h-12 sm:h-14 flex-1 rounded-xl sm:rounded-2xl bg-brand-accent font-display text-lg sm:text-xl font-black text-white shadow-lg transition-all"
                            >
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : confirmText}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AnimatePresence>
    );
}
