"use client";

import * as React from "react";
import { Circle } from "lucide-react";
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

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, generateOrganizerDashboardAnalytics } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/ui/header";
import { Stats } from "@/components/ui/stats";
import Image from "next/image";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { motion } from "motion/react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns/addDays";
import { useOrganizerEvents } from "@/hooks/use-organizer-events";
import { differenceInDays, subDays } from "date-fns";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";

const STATUS_COLORS: Record<string, string> = {
    APPROVED: "#94B983",
    PENDING: "#F6835E",
    REJECTED: "#CD4249",
};

export default function ReportsPage() {
    const [mounted, setMounted] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -29),
        to: new Date(),
    });

    const activeFrom = dateRange?.from || addDays(new Date(), -29);
    const activeTo = dateRange?.to || new Date();
    const daysDiff = differenceInDays(activeTo, activeFrom) + 1;
    const fetchFrom = subDays(activeFrom, daysDiff);

    const { data: rawEvents, isLoading: isEventsLoading } = useOrganizerEvents({ from: fetchFrom, to: activeTo });

    const analytics = useMemo(() => {
        if (!rawEvents) return null;
        return generateOrganizerDashboardAnalytics(rawEvents, dateRange);
    }, [rawEvents, dateRange]);

    const stats = analytics?.dashboardStats ?? [];
    const barData = analytics?.eventAttendeeData ?? [];
    const pieData = analytics?.eventStatusData ?? [];
    const areaData = analytics?.feedbackTrendData ?? [];
    const comparisonLabel = analytics?.comparisonLabel ?? "last month";

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="flex relative min-h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Header />
            <main className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full z-40">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Dashboard</h1>
                            <DateRangePicker onDateChange={setDateRange} />
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">
                            Overview of your events and feedback
                        </p>
                    </div>
                </div>

                <Stats data={stats} loading={isEventsLoading} comparisonLabel={comparisonLabel} />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-2 border-[#5C5C5C] shadow-[8px_8px_0px_0px_rgba(87,66,114,1)] rounded-2xl p-6">
                        <CardHeader className="flex flex-row items-center gap-3 px-0 pt-0">
                            <Image src="/svgs/monthly-event-icon.svg" width="25" height="25" alt="Icon" />
                            <CardTitle className="text-xl font-bold font-display text-[#261A36]">
                                Monthly Events and Attendees
                            </CardTitle>
                        </CardHeader>
                        <div className="h-[300px] w-full mt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#261A36", fontWeight: 700, fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#261A36", fontWeight: 700, fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "#F1F5F9" }}
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                        }}
                                    />
                                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
                                    <Bar dataKey="Events" fill="#5E338A" radius={[6, 6, 0, 0]} barSize={20} />
                                    <Bar dataKey="Attendees" fill="#FF8C66" radius={[6, 6, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="border-2 border-[#5C5C5C] shadow-[8px_8px_0px_0px_rgba(87,66,114,1)] rounded-2xl p-6">
                        <CardHeader className="flex flex-row items-center gap-3 px-0 pt-0">
                            <Image src="/svgs/event-status-icon.svg" width="25" height="25" alt="Icon" />
                            <CardTitle className="text-xl font-bold font-display text-[#261A36]">Event Status</CardTitle>
                        </CardHeader>
                        <div className="h-[200px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="#261A36"
                                        strokeWidth={2}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                            {pieData.map((status) => (
                                <div key={status.name} className="flex items-center justify-between mx-auto w-[70%]">
                                    <div className="flex items-center gap-2">
                                        <Circle className="h-4 w-4" fill={status.color} stroke="none"></Circle>
                                        <span className="text-base font-normal font-display text-black">{status.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={cn(
                                                "text-base font-black",
                                                status.percentage.startsWith("+") ? "text-[#94B983]" : "text-[#820006]",
                                            )}
                                        >
                                            {status.percentage} {status.percentage.startsWith("+") ? "↑" : "↓"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card className="border-2 border-[#5C5C5C] shadow-[8px_8px_0px_0px_rgba(87,66,114,1)] rounded-2xl p-6 mb-5">
                    <CardHeader className="flex flex-row items-center gap-3 px-0 pt-0">
                        <Image src="/svgs/average-feedback-icon.svg" width="25" height="25" alt="Icon" />
                        <CardTitle className="text-xl font-bold font-display text-[#261A36]">
                            Average Feedback Rating Trend
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={areaData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={true}
                                    tickLine={true}
                                    tick={{ fill: "#261A36", fontWeight: 700 }}
                                />
                                <YAxis
                                    domain={[0, 5]}
                                    axisLine={true}
                                    tickLine={true}
                                    tick={{ fill: "#261A36", fontWeight: 700 }}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="rating"
                                    stroke="#38B2AC"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRating)"
                                    dot={{ r: 6, fill: "#38B2AC", strokeWidth: 3, stroke: "#fff" }}
                                    activeDot={{ r: 8 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </main>

            <BackgroundBubbles />
        </div>
    );
}
