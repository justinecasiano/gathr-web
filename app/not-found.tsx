"use client"

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="relative flex min-h-screen items-center justify-center w-full bg-brand-dark p-6 overflow-hidden">
            <div className="max-w-4xl w-full flex flex-col md:flex-row gap-10 items-center z-20">

                <div className="relative h-64 w-64 md:h-100 md:w-100 shrink-0 hidden sm:block">
                    <Image
                        src="/svgs/error-image.svg"
                        alt="404 Illustration"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="relative flex flex-col justify-center items-center md:items-start text-center md:text-left w-full">
                    <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-brand-accent select-none pointer-events-none mb-2 leading-none">
                        404
                    </h1>

                    <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-display text-white font-black uppercase mb-2">
                        Lost in Space?
                    </h2>
                    <p className="text-gray-400 font-bold text-base md:text-lg mb-6 font-heading max-w-md">
                        The page you are looking for doesn&apos;t exist.
                    </p>

                    <Button
                        type="button"
                        onClick={() => router.push("dashboard")}
                        variant="elevated"
                        className="h-14 md:h-16 w-full sm:w-[75%] md:w-[75%] rounded-3xl bg-brand border-[#4C2576] font-display text-lg md:text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                    >
                        BACK TO DASHBOARD
                    </Button>
                </div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div className="absolute flex top-5 left-6 gap-2">
                    <div className="relative h-10 w-10 md:h-16 md:w-16">
                        <Image src="/svgs/gathr-logo-initial.svg" alt="Logo" fill className="object-contain opacity-80" />
                    </div>
                    <div className="relative h-10 w-20 md:h-15 md:w-25">
                        <Image src="/svgs/gathr-logo-full.svg" alt="Logo" fill className="object-contain opacity-80" />
                    </div>
                </div>

                <motion.div
                    className="absolute -top-20 -right-40 h-80 w-80 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 50, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute -top-25 left-1/4 h-40 w-40 rounded-full bg-[#7B55A3]/10 pointer-events-auto hidden lg:block"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ y: -30, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute top-1/2 -left-40 h-110 w-110 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: -60, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />

                <motion.div
                    className="absolute -bottom-45 right-1/4 h-100 w-100 rounded-full bg-[#7B55A3]/10 pointer-events-auto hidden md:block"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ y: 50, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
            </div>
        </main>
    );
}
