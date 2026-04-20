"use client"
import * as React from 'react'
import {Header} from "@/components/ui/header";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Image from "next/image"
import {Search, PieChart, BarChart2, Users,X} from "lucide-react"
import {cn} from "@/lib/utils"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Stats} from "@/components/ui/stats";

const dashboardStats = [
    {value: "12", trend: "+12%", trendUp: true},
    {value: "2,412", trend: "-3%", trendUp: false},
    {value: "67.21%", trend: "-3%", trendUp: false},
    {value: "1,521", trend: "+12%", trendUp: true},
];

const AttendanceKpi = ({label, value, bgColor, icon: Icon}: any) => (
    <div
        className={cn("flex flex-1 flex-col items-center justify-center p-4 rounded-2xl text-white shadow-lg", bgColor)}>
        <span className="text-4xl font-black">{value}</span>
        <span className="text-sm font-bold opacity-80 uppercase tracking-tight">{label}</span>
    </div>
)

const FeedbackOption = ({index, label, percentage}: { index: number, label: string, percentage: number }) => (
    <div
        className="relative h-14 w-full rounded-full border-2 border-[#7B55A3] flex items-center px-4 overflow-hidden bg-white">
        {/* Progress Fill */}
        <div
            className="absolute left-0 top-0 bottom-0 bg-[#7B55A3]/80 rounded-full transition-all duration-1000 ease-out"
            style={{width: `${percentage}%`}}
        />
        {/* Content */}
        <div className="relative z-10 w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
        <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#261A36] text-white text-xs font-black">
          {index}
        </span>
                <span className="font-bold text-[#261A36] truncate max-w-[200px]">{label}</span>
            </div>
            <span className="font-black text-[#261A36]">{percentage}%</span>
        </div>
    </div>
)

export default function ReportsPage() {
    const [search, setSearch] = React.useState("")

    const participants = [
        {name: "Angela Cabrera", time: "Oct. 13, 2025 - 12:03 pm", status: "Present", color: "text-[#D1E9D2]"},
        {name: "Angela Cabrera", time: "Oct. 13, 2025 - 12:03 pm", status: "Absent", color: "text-[#820006]"},
        {name: "Angela Cabrera", time: "Oct. 13, 2025 - 12:03 pm", status: "Cancelled", color: "text-[#FF8C66]"},
        {name: "Angela Cabrera", time: "Oct. 13, 2025 - 12:03 pm", status: "Present", color: "text-[#D1E9D2]"},
        {name: "Angela Cabrera", time: "Oct. 13, 2025 - 12:03 pm", status: "Absent", color: "text-[#820006]"},
        {name: "Angela Cabrera", time: "Oct. 13, 2025 - 12:03 pm", status: "Present", color: "text-[#D1E9D2]"},
        {name: "Angela Cabrera", time: "Oct. 13, 2025 - 12:03 pm", status: "Absent", color: "text-[#820006]"},
    ]

    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <Header/>
            <div className="flex min-h-screen w-full flex-col bg-[#F9F7FD] px-10 py-6 space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Reports</h1>
                            <Select defaultValue="7d">
                                <SelectTrigger
                                    className="w-40 h-12 rounded-sm border-2 text-lg border-black bg-white font-display font-semibold text-black ">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">Overview of your events and
                            feedback</p>
                    </div>
                </div>

                <Stats data={dashboardStats}/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    <div
                        className="rounded-[32px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <div className="flex items-center gap-3 mb-8">
                            <BarChart2 className="text-[#FF8C66]" size={28}/>
                            <h2 className="text-2xl font-black text-[#261A36] uppercase tracking-tight">Attendance
                                Summary</h2>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <AttendanceKpi label="Present" value="789" bgColor="bg-[#5E338A]"/>
                            <AttendanceKpi label="Cancelled" value="192" bgColor="bg-[#F8B195]"/>
                            <AttendanceKpi label="Absent" value="201" bgColor="bg-[#820006]"/>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C5C]/50" size={20}/>
                            <Input
                                placeholder="Search in 1904 participants"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 rounded-2xl border-2 border-[#5C5C5C]/10 bg-[#F9F7FD] pl-12 pr-10 font-bold focus-visible:ring-0"
                            />
                            {search && <X className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" size={18}
                                          onClick={() => setSearch("")}/>}
                        </div>

                        <div
                            className="grid grid-cols-3 bg-[#5E338A] rounded-t-xl p-3 text-white text-sm font-black uppercase tracking-wider">
                            <span>Name</span>
                            <span className="text-center">Date & Time</span>
                            <span className="text-right">Status</span>
                        </div>

                        <ScrollArea className="h-[400px] border-x-2 border-b-2 border-[#5C5C5C]/10 rounded-b-xl">
                            {participants.map((p, i) => (
                                <div key={i}
                                     className="grid grid-cols-3 p-4 border-b border-[#5C5C5C]/5 text-sm font-bold items-center">
                                    <span className="text-[#261A36]">{p.name}</span>
                                    <span className="text-center text-[#5C5C5C]/70">{p.time}</span>
                                    <span className={cn("text-right font-black", p.color)}>{p.status}</span>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>

                    <div
                        className="rounded-[32px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <div className="flex items-center gap-3 mb-8">
                            <PieChart className="text-[#FF8C66]" size={28}/>
                            <h2 className="text-2xl font-black text-[#261A36] uppercase tracking-tight">Feedback
                                Summary</h2>
                        </div>

                        <div className="relative w-full rounded-3xl bg-[#5E338A] p-8 mb-8 overflow-hidden">
                            <div className="relative z-10 max-w-[60%]">
                                <h3 className="text-2xl font-black text-white uppercase leading-tight">Summary of
                                    Feedback
                                    for this event</h3>
                                <div className="flex items-center gap-2 mt-4 text-white/80 font-bold">
                                    <div className="bg-white rounded-full p-1">
                                        <Users className="text-[#5E338A]"
                                                                                      size={14}/>
                                    </div>
                                    Total Respondents: 234
                                </div>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 h-40">
                                <Image src="/svgs/feedback-hero-illus.svg" alt="Illustration" fill
                                       className="object-contain"/>
                            </div>
                        </div>

                        <p className="text-sm font-bold text-[#5C5C5C] leading-relaxed mb-8 italic">
                            "Lorem Ipsum Dolor Sit Amet! These are the feedbacks of this survey, helping the host to
                            improve
                            their services for everyone."
                        </p>

                        <div className="rounded-[32px] border-2 border-[#7B55A3] p-8 space-y-6">
                            <div>
                                <p className="text-xs font-black text-[#7B55A3] uppercase tracking-widest">Question 1 /
                                    10</p>
                                <h4 className="text-lg font-black text-[#261A36] mt-1">What are the things you observed
                                    during the event and lorem ipsum dolor sit amet?</h4>
                            </div>

                            <div className="space-y-4">
                                <FeedbackOption index={1} label="The Speakers are too" percentage={35}/>
                                <FeedbackOption index={2} label="Accommodation is Good" percentage={40}/>
                                <FeedbackOption index={3} label="The Lorem Ipsum is" percentage={35}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}