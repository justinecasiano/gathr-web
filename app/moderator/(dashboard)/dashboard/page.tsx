'use client'

import * as React from 'react'
import {
    Circle,
} from "lucide-react"
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
} from 'recharts'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Stats } from "@/components/ui/stats";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import { DashboardDatePicker } from "@/components/ui/dashboard-date-picker";
import {motion} from "motion/react";
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns/addDays'
import { useDashboard } from '@/hooks/use-dashboard'

// const dashboardStats = [
//     { value: "12,256", trend: "+12%", trendUp: true },
//     { value: "1,234", trend: "-3%", trendUp: false },
//     { value: "67.21%", trend: "-3%", trendUp: false },
//     { value: "1,234,521", trend: "+12%", trendUp: true },
// ];
//
// const eventAttendeeData = [
//     { name: 'Mon', Events: 800, Attendees: 700 },
//     { name: 'Tue', Events: 1000, Attendees: 650 },
//     { name: 'Wed', Events: 300, Attendees: 1200 },
//     { name: 'Thu', Events: 900, Attendees: 400 },
//     { name: 'Fri', Events: 700, Attendees: 600 },
//     { name: 'Sat', Events: 950, Attendees: 750 },
//     { name: 'Sun', Events: 1100, Attendees: 600 },
// ]
//
// const eventStatusData = [
//     { name: 'Approved', value: 35, percentage: '+5.5%', color: '#94B983' },
//     { name: 'Pending', value: 45, percentage: '+5.5%', color: '#F6835E' },
//     { name: 'Rejected', value: 20, percentage: '-5.5%', color: '#CD4249' },
// ]
//
// const feedbackTrendData = [
//     { name: 'Jul', rating: 3.8 },
//     { name: 'Aug', rating: 4.1 },
//     { name: 'Sep', rating: 3.9 },
//     { name: 'Oct', rating: 4.3 },
//     { name: 'Nov', rating: 4.5 },
//     { name: 'Dec', rating: 4.2 },
//     { name: 'Jan', rating: 4.6 },
// ]

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: new Date(),
    });

    const { data: user, isLoading: isUserLoading } = useUser();
    const { data, isLoading: isDashboardLoading } = useDashboard(dateRange);

    const dashboardStats = [
        data?.stats?.total_events,
        data?.stats?.pending_events,
        data?.stats?.avg_rating,
        data?.stats?.capacity
    ].filter(Boolean);

    const eventAttendeeData = data?.trend_data || [];

    const eventStatusData = data?.status_data || [];

    const feedbackTrendData = data?.feedback_data || [];

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="flex relative min-h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Header />
            <main className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full z-50">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Dashboard</h1>
                            <DashboardDatePicker onDateChange={setDateRange}/>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">Overview of your events and feedback</p>
                    </div>
                </div>

                <Stats data={dashboardStats} />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-2 border-[#5C5C5C] shadow-[8px_8px_0px_0px_rgba(87,66,114,1)] rounded-2xl p-6">
                        <CardHeader className="flex flex-row items-center gap-3 px-0 pt-0">
                            <Image src="/svgs/monthly-event-icon.svg" width="25" height="25" alt="Icon" />
                            <CardTitle className="text-xl font-bold font-display text-[#261A36]">Monthly Events and Attendees</CardTitle>
                        </CardHeader>
                        <div className="h-[300px] w-full mt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventAttendeeData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                                           tick={{ fill: '#261A36', fontWeight: 700, fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false}
                                           tick={{ fill: '#261A36', fontWeight: 700, fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}/>
                                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{paddingTop: '20px'}}/>
                                    <Bar dataKey="Events" fill="#5E338A" radius={[6, 6, 0, 0]} barSize={20}/>
                                    <Bar dataKey="Attendees" fill="#FF8C66" radius={[6, 6, 0, 0]} barSize={20}/>
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
                                        data={eventStatusData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="#261A36"
                                        strokeWidth={2}
                                    >
                                        {eventStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                            {eventStatusData.map((status) => (
                                <div key={status.name} className="flex items-center justify-between mx-auto w-[70%]">
                                    <div className="flex items-center gap-2">
                                        <Circle className="h-4 w-4" fill={status.color} stroke="none"></Circle>
                                        <span className="text-base font-normal font-display text-black">{status.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={cn("text-base font-black", status.percentage.startsWith('+') ? "text-[#94B983]" : "text-[#820006]")}>
                                            {status.percentage} {status.percentage.startsWith('+') ? '↑' : '↓'}
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
                        <CardTitle className="text-xl font-bold font-display text-[#261A36]">Average Feedback Rating Trend</CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={feedbackTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={true} tickLine={true}
                                       tick={{ fill: '#261A36', fontWeight: 700 }} />
                                <YAxis domain={[0, 5]} axisLine={true} tickLine={true}
                                       tick={{ fill: '#261A36', fontWeight: 700 }} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="rating"
                                    stroke="#38B2AC"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRating)"
                                    dot={{ r: 6, fill: '#38B2AC', strokeWidth: 3, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </main>

            <div className="hidden lg:block absolute inset-0 pointer-events-none h-full">
                <motion.div
                    className="absolute -top-5 -right-55 h-90 w-90 rounded-full bg-[#7B55A3]/10"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute -top-22 left-90 h-40 w-40 rounded-full bg-[#7B55A3]/10"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ y: -40, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute top-35 left-10 h-130 w-130 rounded-full bg-[#7B55A3]/10"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: -60, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />

                <motion.div
                    className="absolute -bottom-25 -right-20 h-160 w-160 rounded-full bg-[#7B55A3]/10"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: -60, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
            </div>
        </div>
    )
}
