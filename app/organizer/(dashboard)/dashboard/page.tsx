
"use client";

import Image from "next/image";
import {motion} from "motion/react";

export default function LoadingPage() {
    return (
        <main className="flex min-h-screen w-full bg-[#F7F0FF]">
            <div className="absolute inset-0 z-20 overflow-hidden">
                <motion.div
                    className="absolute top-1/2 left-1/2 h-50 w-50"
                    initial={{ x: "-50%", y: "-50%", scale: 1, opacity: 0.8 }}
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Image
                        src="/svgs/gathr-logo-initial.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 h-15 w-25">
                    <Image
                        src="/svgs/gathr-logo-full.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                <motion.div
                    className="absolute -top-20 -right-55 h-80 w-80 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: 50, scale: 1.1}}
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
