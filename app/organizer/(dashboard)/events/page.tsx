'use client';

import React, {useState} from 'react'
import {EventCard} from '@/components/ui/event-card'
import {Header} from '@/components/ui/header'
import {Button} from "@/components/ui/button"
import {motion} from "motion/react";
import { DashboardDatePicker } from '@/components/ui/dashboard-date-picker';
import {DateRange} from "react-day-picker";
import {addDays} from "date-fns/addDays";
import {cn} from "@/lib/utils";

const baseEvent = {
    location: "UMak Auditorium, University of Makati",
    date: "Oct. 7, 2025 | 9:00 AM to 5:00 PM",
    organizer: "Era Marie Gannaban",
    attendees: "23/500",
    status: "Approved",
    hasFeedback: true,
    // image: "/images/placeholder_small.png"
    image: "/images/infotech_placeholder_landscape.png"
};

const MOCK_EVENTS = Array.from({ length: 32 }, (_, i) => ({
    ...baseEvent,
    id: i + 1,
    title: `4th IT Skills Olympics ${i + 1}`
}));

export default function EventsPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -6),
        to: new Date(),
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.ceil(MOCK_EVENTS.length / itemsPerPage);

    const currentEvents = MOCK_EVENTS.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex relative h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Header />
            <main className="relative flex-1 flex flex-col px-10 pt-6 max-w-[1600px] mx-auto w-full z-50 overflow-hidden">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">My Events</h1>
                            <DashboardDatePicker onDateChange={setDateRange}/>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">Create and manage your events</p>
                    </div>
                </div>

                <div className="flex-1 mt-2 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="mt-6"></div>
                    {currentEvents.map((event) => (
                        <EventCard key={event.id} {...event as any} />
                    ))}
                    <div className="mb-8"></div>
                </div>
            </main>

            {MOCK_EVENTS.length > itemsPerPage && (
                <div className="bg-white border-t-2 border-[#5C5C5C] px-6 py-3 shrink-0">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="font-display text-base font-normal text-[#676767]">
                            Showing {((currentPage - 1) * itemsPerPage) + 1}-
                            {Math.min(currentPage * itemsPerPage, MOCK_EVENTS.length)} of {MOCK_EVENTS.length} Events
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                            >
                                Previous
                            </Button>

                            {pageNumbers.map((num) => (
                                <Button
                                    key={num}
                                    onClick={() => setCurrentPage(num)}
                                    className={cn(
                                        "h-11 w-11 rounded-xl font-bold transition-all",
                                        currentPage === num
                                            ? "bg-[#574272] text-white"
                                            : "bg-white border-2 border-[#5C5C5C]/10 text-[#574272] hover:bg-[#574272] hover:text-white"
                                    )}
                                >
                                    {num}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="hidden lg:block absolute inset-0 pointer-events-none h-full">
                <motion.div
                    className="absolute -top-5 -right-55 h-90 w-90 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: 50}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                />

                <motion.div
                    className="absolute -top-22 left-90 h-40 w-40 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: -40, scale: 1.1}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                />

                <motion.div
                    className="absolute top-35 left-10 h-130 w-130 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 20}}
                />

                <motion.div
                    className="absolute -bottom-65 -right-20 h-160 w-160 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 20}}
                />
            </div>
        </div>
    )
}