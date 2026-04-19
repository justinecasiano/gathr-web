'use client';

import * as React from "react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Menu, X } from "lucide-react";
import { Icon, IconName } from "@/components/icons";
import { signOut } from '@/app/actions'
import { useState, useEffect } from "react";

interface SidebarItem {
    href: string;
    label: string;
    icon: IconName;
}

const navigationConfig: Record<'moderator' | 'organizer', SidebarItem[]> = {
    moderator: [
        { href: 'dashboard', label: 'Dashboard', icon: "dashboard" },
        { href: 'reports', label: 'Reports', icon: "reports" },
        { href: 'settings', label: 'Settings', icon: "settings" },
    ],
    organizer: [
        { href: 'dashboard', label: 'Dashboard', icon: "dashboard" },
        { href: 'events', label: 'My Events', icon: "events" },
        { href: 'feedback', label: 'Feedback Forms', icon: "feedback" },
        { href: 'reports', label: 'Reports', icon: "reports" },
        { href: 'settings', label: 'Settings', icon: "settings" },
    ]
};

type ThemeStyles = {
    background: string;
    text: string;
    activeColor: string;
    hoverColor: string;
    innerBorderColor: string;
    outerBorderColor: string;
}

const ThemeConfig: Record<'moderator' | 'organizer', ThemeStyles> = {
    moderator: {
        background: "bg-[#261A36]",
        text: "text-[#FFFFFF]",
        activeColor: "border-[#FFFFFF] ring-1 ring-white/10",
        hoverColor: "hover:bg-white/5 hover:text-white",
        innerBorderColor: "border-[#7B55A3]/50",
        outerBorderColor: "border-r-2 border-[#7B55A3]"
    },
    organizer: {
        background: "bg-[#FFFFFF]",
        text: "text-[#261A36]",
        activeColor: "border-[#261A36] ring-1 ring-white/10",
        hoverColor: "hover:!bg-[#261A36]/20 hover:!text-[#261A36]",
        innerBorderColor: "border-[#5C5C5C]/30",
        outerBorderColor: "border-r-2 border-[#5C5C5C]"
    }
}

const sidebarVariants: Variants = {
    open: {
        width: "16rem",
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
            staggerChildren: 0.08,
        }
    },
    closed: {
        width: "5.2rem",
        x: typeof window !== 'undefined' && window.innerWidth < 1024 ? "-100%" : 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        }
    },
};

const itemVariants: Variants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 1, y: 0 }
};

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const currentRole: 'moderator' | 'organizer' = pathname.startsWith('/moderator') ? 'moderator' : 'organizer';
    const items = navigationConfig[currentRole];
    const colors = ThemeConfig[currentRole];

    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingOut(true);
        try { await signOut(); } catch (error) { setIsLoggingOut(false); }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "lg:hidden fixed top-5 left-5 z-[40] p-3 rounded-2xl shadow-xl border-2 transition-all active:scale-95",
                    colors.background,
                    colors.innerBorderColor,
                    isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
                <Menu className={colors.text} size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                className={cn(
                    `fixed lg:relative z-[50] flex h-screen flex-col ${colors.background} text-white ${colors.outerBorderColor} overflow-x-hidden shadow-2xl lg:shadow-none`,
                    "left-0 top-0 bottom-0"
                )}
            >
                <div className={`flex h-[85px] items-center p-5 border-b-2 ${colors.innerBorderColor} shrink-0 overflow-hidden`}>
                    <div className="relative flex flex-1 items-center h-full">
                        <div className={cn(
                            "absolute left-0 flex items-end transition-all duration-300",
                            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
                        )}>
                            <Image src='/svgs/gathr-logo-sidebar.svg' alt='Logo' width={120} height={40} className="shrink-0" />
                            {currentRole === 'moderator' && (
                                <span className="ml-2 mb-0.5 font-heading font-bold text-xl text-white">Mod.</span>
                            )}
                        </div>

                        <button
                            onClick={() => setIsOpen(true)}
                            className={cn(
                                "min-w-[45px] absolute transition-all duration-300",
                                !isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                            )}
                        >
                            <Image src='/svgs/gathr-logo-initial.svg' alt='Open' width={45} height={45} />
                        </button>
                    </div>

                    <div className={cn("transition-all duration-300 shrink-0", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "min-w-[40px]",
                                currentRole === 'moderator' ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-[#261A36]/20 hover:text-[#261A36]',
                                colors.text
                            )}
                        >
                            <div className="lg:hidden"><X size={25} /></div>
                            <div className="hidden lg:block"><Icon name="arrow" size={25} /></div>
                        </Button>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 p-4 pt-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {items.map((item) => {
                        const isActive = pathname.endsWith(`/${item.href}`);
                        return (
                            <motion.div key={item.href} variants={itemVariants}>
                                <Link href={item.href}>
                                    <div className={cn(
                                        "flex items-center rounded-xl px-3 py-3 border-2 border-transparent transition-all duration-200 group whitespace-nowrap",
                                        isActive
                                            ? (currentRole === 'moderator' ? "border-white bg-white/5" : "border-[#261A36] bg-[#261A36]/5")
                                            : `${colors.hoverColor} ${colors.text}`
                                    )}>
                                        <div className="shrink-0 min-w-[25px] flex items-center justify-center">
                                            <Icon name={item.icon} size={25} className={colors.text} />
                                        </div>
                                        <span className={cn(
                                            `text-lg font-bold font-heading transition-all duration-300 ease-in-out ${colors.text}`,
                                            isOpen ? "max-w-[200px] opacity-100 ml-4" : "max-w-0 opacity-0 ml-0 overflow-hidden"
                                        )}>
                                            {item.label}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                <div
                    className={`p-4 pt-5 border-t-2 ${colors.background} ${colors.innerBorderColor} shrink-0 overflow-hidden`}
                    style={{
                        paddingBottom: 'calc(env(safe-area-inset-bottom) + 3rem)',
                        marginBottom: 'env(safe-area-inset-bottom)'
                    }}
                >
                    <motion.div variants={itemVariants} className="flex items-center px-2 py-3 overflow-hidden whitespace-nowrap mb-2">
                        <div className="shrink-0 min-w-[40px] flex items-center justify-center">
                            <Image src="/svgs/moderator-profile-icon.svg" alt="Profile" width={40} height={40}/>
                        </div>
                        <div className={cn(
                            "transition-all duration-300 ease-in-out flex flex-col justify-center",
                            isOpen ? "max-w-[150px] opacity-100 ml-3" : "max-w-0 opacity-0 ml-0 overflow-hidden"
                        )}>
                            <p className={cn("text-sm font-display font-medium truncate", colors.text)}> Angela Mae Z. Cabrera </p>
                            <span className={cn(
                                "text-[11px] border px-3 py-0.5 rounded-xl font-display font-bold w-fit mt-0.5",
                                currentRole === "moderator" ? "text-white border-white" : "text-[#261A36] border-[#261A36]"
                            )}>
                                {currentRole === "moderator" ? "Moderator" : "Event Organizer"}
                            </span>
                        </div>
                    </motion.div>

                    <motion.form onSubmit={handleLogout} className="w-full" variants={itemVariants}>
                        <button
                            type="submit"
                            disabled={isLoggingOut}
                            className={cn(
                                "flex w-full items-center rounded-xl px-3 py-3 transition-colors whitespace-nowrap text-left cursor-pointer",
                                colors.text,
                                "hover:bg-red-500/20 hover:text-red-500 disabled:opacity-70 overflow-hidden"
                            )}
                        >
                            <div className="shrink-0 min-w-[25px] flex items-center justify-center">
                                {isLoggingOut ? <Loader2 size={25} className="animate-spin text-red-500" /> : <Icon name="logout" size={25} />}
                            </div>
                            <span className={cn(
                                "text-lg font-bold font-heading transition-all duration-300 ease-in-out",
                                isOpen ? "max-w-[200px] opacity-100 ml-4" : "max-w-0 opacity-0 ml-0 overflow-hidden"
                            )}>
                                {isLoggingOut ? "Logging out..." : "Log Out"}
                            </span>
                        </button>
                    </motion.form>
                </div>
            </motion.aside>
        </>
    );
}
