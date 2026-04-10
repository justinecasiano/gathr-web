"use client"

import {motion} from "motion/react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="relative flex min-h-screen items-center justify-center w-full bg-brand-dark">
            <div className="max-w-3xl flex gap-8">
                <div className="relative h-100 w-100">
                    <Image
                        src="/svgs/error-image.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center text-center">
                    <h1 className="text-9xl mb-2 font-black text-brand-accent select-none pointer-events-none">
                       404
                    </h1>

                    <h2 className="relative text-4xl font-display text-white font-black uppercase mb-2">
                        Lost in Space?
                    </h2>
                    <p className="text-gray-400 font-bold text-lg mb-4 font-heading">
                        The page you are looking for doesn't exist.
                    </p>

                    <Button
                        type="button"
                        onClick={() => router.push("dashboard")}
                        variant="elevated"
                        className="h-16 w-full rounded-3xl bg-brand border-[#4C2576] font-display text-xl font-black uppercase text-white shadow-lg"
                    >
                        BACK
                    </Button>
                </div>
            </div>

            <div className="absolute inset-0 overflow-hidden">
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
                    initial={{x: 0, y: 0}}
                    whileHover={{x: 50}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                />

                <motion.div
                    className="absolute -top-25 left-1/2 h-40 w-40 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: -40, scale: 1.1}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                />

                <motion.div
                    className="absolute top-55 -left-55 h-110 w-110 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />

                <motion.div
                    className="absolute -bottom-45 right-120 h-100 w-100 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: 50, scale: 1.05}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />
            </div>
        </main>
    );
}