"use client"

import {useEffect} from "react";
import {motion} from "motion/react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {usePathname, useRouter} from "next/navigation";

export default function ErrorPage({error, reset}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const currentUserType = pathname.includes('moderator') ? 'moderator' : 'organizer';

    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <main
            className="relative flex min-h-screen w-full items-start sm:items-center justify-center bg-brand-dark p-6 overflow-hidden">
            <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-center z-20 mt-[15vh] sm:mt-0">

                <div className="relative h-64 w-64 md:h-100 md:w-100 shrink-0 hidden sm:block">
                    <Image
                        src="/svgs/error-image.svg"
                        alt="Error Illustration"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div
                    className="relative flex flex-col justify-center items-center md:items-start text-center md:text-left w-full">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-brand-accent select-none pointer-events-none mb-2 leading-none">
                        OOPS!
                    </h1>

                    <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-display text-white font-black uppercase mb-4 leading-tight">
                        System Malfunction
                    </h2>

                    <p className="text-gray-400 font-bold text-base md:text-lg mb-8 font-heading max-w-md">
                        Something went wrong while processing your request. Don&apos;t worry, it&apos;s not your fault.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none justify-center md:justify-start">
                        <Button
                            type="button"
                            onClick={() => reset()}
                            variant="elevated"
                            className="h-14 md:h-16 px-8 rounded-3xl bg-brand-accent border-[#C44E52] font-display text-lg md:text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                        >
                            TRY AGAIN
                        </Button>

                        <Button
                            type="button"
                            onClick={() => router.push(`/${currentUserType}/dashboard`)}
                            variant="elevated"
                            className="h-14 md:h-16 px-8 rounded-3xl bg-brand border-[#4C2576] font-display text-lg md:text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                        >
                            DASHBOARD
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div className="absolute flex top-5 left-6 gap-2">
                    <div className="relative h-10 w-10 md:h-16 md:w-16">
                        <Image src="/svgs/gathr-logo-initial.svg" alt="Logo" fill
                               className="object-contain opacity-80"/>
                    </div>
                    <div className="relative h-10 w-20 md:h-15 md:w-25">
                        <Image src="/svgs/gathr-logo-full.svg" alt="Logo" fill className="object-contain opacity-80"/>
                    </div>
                </div>

                <motion.div
                    className="absolute -top-20 -right-40 h-80 w-80 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: 50, scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                />

                <motion.div
                    className="absolute -top-25 left-1/4 h-40 w-40 rounded-full bg-[#7B55A3]/10 pointer-events-auto hidden lg:block"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: -30, scale: 1.1}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                />

                <motion.div
                    className="absolute top-1/2 -left-40 h-110 w-110 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 20}}
                />

                <motion.div
                    className="absolute -bottom-45 right-1/4 h-100 w-100 rounded-full bg-[#7B55A3]/10 pointer-events-auto hidden md:block"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: 50, scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 20}}
                />
            </div>
        </main>
    );
}
