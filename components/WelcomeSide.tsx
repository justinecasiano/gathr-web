import Image from "next/image";
import { motion } from "motion/react";

export default function WelcomeSide() {
    return (
        <div className="relative w-[35%] h-screen bg-gradient-to-b from-brand to-brand-dark overflow-hidden">
            <div className="flex items-center justify-center p-6 ">

                <div className="relative h-20 w-20">
                    <Image
                        src="/svgs/gathr-logo-initial.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="flex flex-col items-start">
                        <span className="text-lg font-semibold tracking-wider font-display text-white">
         Event Management System
        </span>
                    <div className="relative h-8 w-28">
                        <Image
                            src="/svgs/gathr-logo-full.svg"
                            alt="Gathr Logo Full"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

            </div>

            <div className="relative flex items-center justify-center w-full">
                <div className="flex items-center justify-center w-100 h-100">
                    <Image
                        src="/svgs/auth-welcome.svg"
                        alt="Welcome SVG"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            <div className="mt-5 relative flex flex-col items-center justify-center w-full px-25 gap-2">
                <h1 className="font-display text-white text-3xl font-bold">WELCOME!</h1>
                <p className="mt-2 font-heading text-white text-base text-center">Gathr is a modern event management system that helps you organize, manage, and monitor events with ease.</p>
            </div>

            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute -top-42 right-25 h-50 w-50 rounded-full bg-white/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 40, y: -40, scale: 1.1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                />

                <motion.div
                    className="absolute top-45 -left-35 h-90 w-90 rounded-full bg-white/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: -60, scale: 1.05 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />

                <motion.div
                    className="absolute -bottom-30 -right-30 h-60 w-60 rounded-full bg-white/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 50, y: 50, scale: 1.2 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />
            </div>
        </div>
    )
}