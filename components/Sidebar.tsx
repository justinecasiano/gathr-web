'use client';

import * as React from "react";
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {motion, Variants} from "motion/react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Icon, IconName} from "@/components/icons";
import { signOut } from '@/app/actions'

interface SidebarItem {
    href: string;
    label: string;
    icon: IconName;
}

const navigationConfig: Record<'moderator' | 'organizer', SidebarItem[]> = {
    moderator: [
        {href: 'dashboard', label: 'Dashboard', icon: "dashboard"},
        {href: 'reports', label: 'Reports', icon: "reports"},
        {href: 'settings', label: 'Settings', icon: "settings"},
    ],
    organizer: [
        {href: 'dashboard', label: 'Dashboard', icon: "dashboard"},
        {href: 'events', label: 'My Events', icon: "events"},
        {href: 'feedback', label: 'Feedback Forms', icon: "feedback"},
        {href: 'reports', label: 'Reports', icon: "reports"},
        {href: 'settings', label: 'Settings', icon: "settings"},
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
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
            staggerChildren: 0.08,
            delayChildren: 0.2
        }
    },
    closed: {
        width: "5.2rem",
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
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 100);
        return () => clearTimeout(timer);
    }, []);

    let currentRole: 'moderator' | 'organizer' = 'organizer';
    if (pathname.startsWith('/moderator')) currentRole = 'moderator';
    else if (pathname.startsWith('/organizer')) currentRole = 'organizer';

    const items = navigationConfig[currentRole];
    const colors = ThemeConfig[currentRole];

    return (
        <motion.aside
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={sidebarVariants}
            className={`relative flex h-screen flex-col ${colors.background} text-white ${colors.outerBorderColor} overflow-hidden`}
        >
            <div className={`flex h-[85px] items-center p-5 border-b-2 ${colors.innerBorderColor}`}>
                <div className="relative flex flex-1 items-center h-full">
                    <div className={cn(
                        "absolute left-0 flex items-end transition-opacity duration-300",
                        isOpen ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
                    )}>
                        <Image
                            src='/svgs/gathr-logo-sidebar.svg'
                            alt={`Sidebar icon`}
                            width={120}
                            height={40}
                            className="shrink-0"
                        />
                        {currentRole === 'moderator' && (
                            <div className={cn(
                                "overflow-hidden transition-all duration-300 ml-2 mb-0.5",
                                isOpen ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0"
                            )}>
                                <span className="font-heading font-bold text-xl text-white leading-none">
                                    Mod.
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        className={cn(
                            "min-w-[55px] absolute -left-1 transition-opacity duration-300",
                            !isOpen ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
                        )}
                    >
                        <Image
                            src='/svgs/gathr-logo-initial.svg'
                            alt={`Open sidebar`}
                            width={55}
                            height={55}
                        />
                    </button>
                </div>

                <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-w-[40px] opacity-100" : "max-w-0 opacity-0"
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className={`${currentRole === 'moderator' ? 'hover:text-white hover:!bg-white/5' : 'hover:text-[#261A36] hover:!bg-[#261A36]/20'} ${colors.text} min-w-[40px] `}
                    >
                        <Icon name="arrow" size={25}
                              className={`${currentRole === 'moderator' ? 'color-white' : 'color-[#261A36]'}`}/>
                    </Button>
                </div>
            </div>

            <nav className="flex-1 space-y-2 p-4 pt-6">
                {items.map((item) => {
                    const isActive = pathname.endsWith(`/${item.href}`);
                    return (
                        <motion.div key={item.href} variants={itemVariants}>
                            <Link href={item.href}>
                                <div className={cn(
                                    "flex items-center rounded-xl px-3 py-3 border-2 border-transparent transition-all duration-200  mb-1 group overflow-hidden whitespace-nowrap",
                                    isActive ? " border-white ring-white/10" : `${colors.hoverColor} ${colors.text}`
                                )}>
                                    <div className="shrink-0 min-w-[25px] flex items-center justify-center">
                                        <Icon name={item.icon} size={25} className={`${colors.text}`}/>
                                    </div>
                                    <span
                                        className={cn(
                                            "text-lg font-bold font-heading overflow-hidden transition-all duration-300 ease-in-out",
                                            isOpen ? "max-w-[200px] opacity-100 ml-4" : "max-w-0 opacity-0 ml-0"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            <div className={`p-4 pt-5 pb-8 border-t-2 ${colors.background} ${colors.innerBorderColor}`}>
                <motion.div variants={itemVariants} className="flex items-center px-2 py-3 overflow-hidden whitespace-nowrap">
                    <div className="shrink-0 min-w-[40px] flex items-center justify-center">
                        <Image src="/svgs/moderator-profile-icon.svg" alt="Profile" width={40} height={40}/>
                    </div>
                    <div className={cn(
                        "transition-all duration-300 ease-in-out flex flex-col justify-center",
                        isOpen ? "max-w-[150px] opacity-100 ml-3" : "max-w-0 opacity-0 ml-0"
                    )}>
                        <p className={`text-sm font-display font-medium truncate ${colors.text}`}>Angela Mae Z. Cabrera</p>
                        <span
                            className={`text-[11px] border-1 px-3 py-0.5 rounded-xl font-display font-bold w-fit mt-0.5 ${currentRole === "moderator" ? "text-white border-white" : "text-[#261A36] border-[#261A36]"}`}>{currentRole === "moderator" ? "Moderator" : "Event Organizer"}</span>
                    </div>
                </motion.div>

                <motion.form action={signOut} className="w-full" variants={itemVariants}>
                    <button
                        type="submit"
                        className={cn(
                            "flex w-full items-center rounded-xl px-3 py-3 transition-colors overflow-hidden whitespace-nowrap text-left",
                            `${colors.text} hover:bg-red-500/20 hover:text-red-500`
                        )}
                    >
                        <div className="shrink-0 min-w-[25px] flex items-center justify-center">
                            <Icon name="logout" size={25} />
                        </div>

                        <span className={cn(
                            "text-lg font-bold font-heading overflow-hidden transition-all duration-300 ease-in-out",
                            isOpen ? "max-w-[200px] opacity-100 ml-4" : "max-w-0 opacity-0 ml-0"
                        )}>
                            Log Out
                        </span>
                    </button>
                </motion.form>
            </div>
        </motion.aside>
    );
}
