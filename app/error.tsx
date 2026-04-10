"use client"

import { useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage({
                                      error,
                                      reset,
                                  }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <main className="relative flex min-h-screen items-center justify-center w-full bg-brand-dark p-6">
            <div className="max-w-4xl flex flex-col md:flex-row gap-8 items-center">
                <div className="relative h-80 w-80 md:h-100 md:w-100">
                    <Image
                        src="/svgs/error-image.svg"
                        alt="Error Illustration"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="relative z-10 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                    <h1 className="text-8xl font-black text-brand-accent select-none pointer-events-none mb-2">
                        OOPS!
                    </h1>

                    <h2 className="relative text-3xl md:text-4xl font-display text-white font-black uppercase mb-2">
                        System Malfunction
                    </h2>
                    <p className="text-gray-400 font-bold text-lg mb-8 font-heading max-w-md">
                        Something went wrong while processing your request. Don&apos;t worry, it&apos;s not your fault.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
                        <Button
                            type="button"
                            onClick={() => reset()}
                            variant="elevated"
                            className="h-16 px-10 rounded-3xl bg-brand-accent border-[#C44E52] font-display text-xl font-black uppercase text-white shadow-lg"
                        >
                            TRY AGAIN
                        </Button>

                        <Button
                            type="button"
                            onClick={() => router.push("dashboard")}
                            variant="elevated"
                            className="h-16 px-10 rounded-3xl bg-brand border-[#4C2576] font-display text-xl font-black uppercase text-white shadow-lg"
                        >
                            GO TO DASHBOARD
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute flex mt-5 ml-6">
                    <div className="relative h-16 w-16">
                        <Image
                            src="/svgs/gathr-logo-initial.svg"
                            alt="Gathr Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="relative h-15 w-25">
                        <Image
                            src="/svgs/gathr-logo-full.svg"
                            alt="Gathr Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <motion.div
                    className="absolute -top-20 -right-55 h-80 w-80 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute -top-25 left-1/2 h-40 w-40 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ y: -40, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute top-55 -left-55 h-110 w-110 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: -60, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />

                <motion.div
                    className="absolute -bottom-45 right-120 h-100 w-100 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ y: 50, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
            </div>
        </main>
    );
}
