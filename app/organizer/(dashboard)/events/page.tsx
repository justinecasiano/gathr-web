"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/ui/event-card";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns/addDays";
import { cn, mapToSimpleEvent } from "@/lib/utils";
import { useOrganizerEvents } from "@/hooks/use-organizer-events";
import _my_events from "@/bones/my-events.bones.json";
import { Skeleton } from "boneyard-js/react";
import { ResponsiveBones } from "boneyard-js";
import { useSkeleton } from "@/hooks/use-skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { SimpleEvent } from "@/types/base-event";
import { useSearchStore } from "@/hooks/use-search-store";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";

export default function EventsPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -6),
        to: new Date(),
    });
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

    const { data: rawEvents, isLoading: isEventsLoading } = useOrganizerEvents(dateRange);

    const showSkeleton = useSkeleton(isEventsLoading, 400);

    const searchQuery = useSearchStore((state) => state.query);
    const events = useMemo(() => {
        if (!rawEvents) return [];
        const allEvents = rawEvents
            .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
            .map((event) => mapToSimpleEvent(event));

        if (searchQuery.trim() !== "") {
            return allEvents.filter(
                (event) =>
                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.attendees.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        return allEvents;
    }, [rawEvents, searchQuery]);

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        visiblePages,
        totalPages,
        paginationLabel,
        nextPage,
        prevPage,
        hasPrevPage,
        hasNextPage,
    } = usePagination<SimpleEvent>({ items: events, itemsPerPage: 8 });

    return (
        <div className="flex relative h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Header />
            <main className="relative flex-1 flex flex-col px-10 pt-6 max-w-[1600px] mx-auto w-full z-50 overflow-hidden">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">My Events</h1>
                            <DateRangePicker onDateChange={setDateRange} />
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">Create and manage your events</p>
                    </div>
                </div>

                <div className="flex-1 mt-2 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="mt-6"></div>
                    {searchQuery.trim() !== "" && currentItems.length === 0 && !showSkeleton && (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <h2 className="text-2xl font-bold text-[#261A36] font-display">No events found</h2>
                            <p className="text-[#676767] mt-2">
                                We couldn&apos;t find anything matching &quot;{searchQuery}&quot;
                            </p>
                        </div>
                    )}

                    {searchQuery.trim() === "" && currentItems.length === 0 && !showSkeleton && (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <h2 className="text-2xl font-bold text-[#261A36] font-display">No events yet</h2>
                            <p className="text-[#676767] mt-2">Get started by creating your first event!</p>
                        </div>
                    )}

                    {(currentItems.length > 0 || showSkeleton) &&
                        currentItems.map((event) => (
                            <Skeleton
                                key={event.id}
                                initialBones={_my_events as unknown as ResponsiveBones}
                                animate="shimmer"
                                name={`my-events-item-${event.id}`}
                                loading={showSkeleton}
                                className={cn(
                                    showSkeleton &&
                                        "rounded-[14px] bg-white/40 shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all",
                                )}
                                color="#574272"
                                boneClass="opacity-40"
                            >
                                <EventCard
                                    key={event.id}
                                    {...event}
                                    isExpanded={expandedEventId === event.id}
                                    onExpand={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                                />
                            </Skeleton>
                        ))}
                    <div className="mb-8"></div>
                </div>
            </main>

            {events.length > 8 && (
                <div className="bg-white border-t-2 border-[#5C5C5C] px-6 py-3 shrink-0 z-20">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="font-display text-base font-normal text-[#676767]">{paginationLabel}</p>

                        <div className="flex items-center gap-2">
                            <Button
                                disabled={!hasPrevPage}
                                onClick={prevPage}
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                            >
                                Previous
                            </Button>

                            {visiblePages.map((num) => (
                                <Button
                                    key={num}
                                    onClick={() => setCurrentPage(num)}
                                    className={cn(
                                        "h-11 w-11 rounded-xl font-bold transition-all",
                                        currentPage === num
                                            ? "bg-[#574272] text-white hover:bg-[#574272]"
                                            : "bg-white border-2 border-[#5C5C5C]/10 text-[#574272] hover:bg-[#574272] hover:text-white",
                                    )}
                                >
                                    {num}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                disabled={!hasNextPage}
                                onClick={nextPage}
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <BackgroundBubbles isEventsOrFeedbackPage={true} />
        </div>
    );
}
