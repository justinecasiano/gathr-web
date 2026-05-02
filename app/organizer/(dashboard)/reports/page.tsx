"use client";

import * as React from "react";
import {Circle} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {cn, generateOrganizerDashboardAnalyticsForReports} from "@/lib/utils";
import {useEffect, useMemo, useState} from "react";
import {Header} from "@/components/ui/header";
import {Stats} from "@/components/ui/stats";
import Image from "next/image";
import {useOrganizerEvents} from "@/hooks/use-organizer-events";
import {BackgroundBubbles} from "@/components/ui/background-bubbles";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const STATUS_COLORS: Record<string, string> = {
    APPROVED: "#94B983",
    PENDING: "#F6835E",
    REJECTED: "#CD4249",
};

export default function ReportsPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(() => {
        if (typeof window !== "undefined") return localStorage.getItem("reports_selected_event") || undefined;
        return undefined;
    });

    useEffect(() => {
        if (selectedEventId) localStorage.setItem("reports_selected_event", selectedEventId);
    }, [selectedEventId]);

    const {data: rawEvents, isLoading: isEventsLoading} = useOrganizerEvents();
    const events = useMemo(() => {
        if (!rawEvents) return [];
        const allEvents = rawEvents
            .filter((event) => event.status !== "REJECTED")
            .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
        return allEvents;
    }, [rawEvents]);

    const analytics = useMemo(() => {
        if (!rawEvents) return null;
        return generateOrganizerDashboardAnalyticsForReports(rawEvents, Number(selectedEventId));
    }, [rawEvents, selectedEventId]);

    const stats = analytics?.dashboardStats ?? [];
    const comparisonLabel = analytics?.comparisonLabel ?? "vs. latest event";

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="flex relative min-h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Header/>
            <main className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full z-40">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Reports</h1>
                            <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                                <SelectTrigger
                                    className="w-full md:w-64 h-12 rounded-sm border-2 text-lg border-black bg-white font-display font-semibold text-black  focus:ring-0 cursor-pointer">
                                    <SelectValue placeholder="Select Specific Event"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {events.map((event) => (
                                        <SelectItem
                                            key={event.id}
                                            value={event.id.toString()}
                                            className="font-display font-medium focus:bg-slate-100 cursor-pointer"
                                        >
                                            {event.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">
                            Oversee reports on events, feedback and attendee summary
                        </p>
                    </div>
                </div>

                <Stats data={stats} loading={isEventsLoading} comparisonLabel={comparisonLabel}/>

            </main>

            <BackgroundBubbles/>
        </div>
    );
}
