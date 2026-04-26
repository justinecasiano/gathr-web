"use client"

import React from "react"
import {cn} from "@/lib/utils"
import {motion } from "motion/react"
import {FeedbackQuestion, ChoiceQuestion } from "@/types/feedback"
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts"

const MOCK_QUESTIONS: FeedbackQuestion[] = [
    {
        id: "q1",
        type: "checkbox",
        questionText: "What are the things you observed during the event?",
        required: true,
        order: 1,
        options: [
            {id: "o1", label: "The Speakers are too informative"},
            {id: "o2", label: "The Venue is well-ventilated"},
            {id: "o3", label: "Technical issues were frequent"}
        ]
    },
    {
        id: "q2",
        type: "slider",
        questionText: "How satisfied are you with the event organization?",
        required: true,
        order: 2,
        maxRating: 5
    },
    {
        id: "q3",
        type: "radio",
        questionText: "Which part of the event did you prefer?",
        required: true,
        order: 3,
        options: [
            {id: "r1", label: "Morning Workshop"},
            {id: "r2", label: "Afternoon Keynote"}
        ]
    },
    {
        id: "q4",
        type: "text_input",
        questionText: "Any additional suggestions for improvement?",
        required: false,
        order: 4
    }
];

const MOCK_ANALYTICS: Record<string, any> = {
    "q1": {"o1": 35, "o2": 40, "o3": 25},
    "q2": {
        avg: 3.5,
        counts: {
            "Very Unsatisfied": 35,
            "Unsatisfied": 73,
            "Neutral": 27,
            "Satisfied": 65,
            "Very Satisfied": 33
        }
    },
    "q3": {"r1": 193, "r2": 19}, // Raw counts
    "q4": ["More hands-on sessions please.", "Better seating arrangements.", "The food was great but ran out early."]
};


export function FeedbackExpansion({eventId}: { eventId: number }) {
    return (
        <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ResponseStatCard label="Total Responses" value="233" bgColor="bg-[#F5F8F3]"/>
                <ResponseStatCard label="No Response" value="12" bgColor="bg-[#FCE0D6]"/>
                <ResponseStatCard label="Did not attend" value="5" bgColor="bg-[#F3E8FF]"/>
            </div>

            <div className="space-y-6">
                {MOCK_QUESTIONS.map((q, i) => (
                    <div key={q.id}
                         className="p-8 rounded-[32px] border-2 border-[#7B55A3] bg-white shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-xs font-black text-[#7B55A3] uppercase mb-1 tracking-widest">Question {i + 1} / {MOCK_QUESTIONS.length}</p>
                                <h3 className="text-xl font-bold text-[#261A36]">{q.questionText}</h3>
                            </div>
                        </div>

                        {q.type === 'checkbox' && renderCheckboxAnalytics(q as ChoiceQuestion, MOCK_ANALYTICS[q.id])}
                        {q.type === 'slider' && renderSliderAnalytics(MOCK_ANALYTICS[q.id])}
                        {q.type === 'radio' && renderRadioAnalytics(q as ChoiceQuestion, MOCK_ANALYTICS[q.id])}
                        {q.type === 'text_input' && renderTextAnalytics(MOCK_ANALYTICS[q.id])}
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderCheckboxAnalytics(q: ChoiceQuestion, data: Record<string, number>) {
    return (
        <div className="space-y-4">
            {q.options.map((opt) => (
                <div key={opt.id}
                     className="relative h-14 w-full rounded-2xl border-2 border-[#7B55A3]/20 flex items-center px-5 overflow-hidden group">
                    <motion.div
                        initial={{width: 0}}
                        animate={{width: `${data[opt.id]}%`}}
                        className="absolute left-0 top-0 bottom-0 bg-[#7B55A3] z-0"
                    />
                    <div className="relative z-10 w-full flex justify-between items-center text-sm font-bold">
                        <span className="flex items-center gap-3 text-white mix-blend-difference">
                             {opt.label}
                        </span>
                        <span className="text-[#261A36] font-black">{data[opt.id]}%</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function renderSliderAnalytics(data: { avg: number, counts: Record<string, number> }) {
    // We map the mock data to the chart structure
    const chartData = [
        { name: "Very Unsatisfied", value: data.counts["Very Unsatisfied"] || 0, color: "#5489F4" },
        { name: "Unsatisfied", value: data.counts["Unsatisfied"] || 0, color: "#F2B012" },
        { name: "Neutral", value: data.counts["Neutral"] || 0, color: "#E94285" },
        { name: "Satisfied", value: data.counts["Satisfied"] || 0, color: "#65CC44" },
        { name: "Very Satisfied", value: data.counts["Very Satisfied"] || 0, color: "#9A55FF" },
    ];

    return (
        <div className="flex flex-col xl:flex-row items-center justify-between px-12 w-full">
            <div className="flex-1 w-full max-w-md">
                <div className="relative h-4 bg-slate-100 rounded-full w-full mb-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.avg / 5) * 100}%` }}
                        className="absolute h-full bg-[#3C2457] rounded-full"
                    />
                    <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${(data.avg / 5) * 100}%` }}
                        className="absolute top-1/2 -translate-y-1/2 -ml-5 size-10 rounded-full border-4 border-white bg-[#7B55A3] shadow-lg flex items-center justify-center text-white text-xs font-black z-10"
                    >
                        {data.avg}
                    </motion.div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <span>1 Very Unsatisfied</span>
                    <span>5 Very Satisfied</span>
                </div>
            </div>

            {/* Right Side: The Donut Chart */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pr-4 h-full">
                {/* IMPORTANT: We use a fixed height div here (h-[200px]).
                   Without this, ResponsiveContainer will stay at 0px height.
                */}
                <div style={{ width: '200px', height: '200px' }} className="shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend Row */}
                <div className="flex flex-col gap-2">
                    {[...chartData].reverse().map((entry) => (
                        <div key={entry.name} className="flex items-center gap-3">
                            <div className="size-5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs font-bold text-[#5C5C5C] w-28">{entry.name}</span>
                            <span className="text-xs font-black text-[#261A36]">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function renderRadioAnalytics(q: ChoiceQuestion, data: Record<string, number>) {
    return (
        <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
                <div key={opt.id}
                     className="p-4 border-2 border-[#5C5C5C]/10 rounded-2xl flex justify-between items-center bg-slate-50/50 hover:border-[#7B55A3]/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div
                            className="size-6 rounded-full border-2 border-[#7B55A3] flex items-center justify-center text-[10px] font-bold text-[#7B55A3]">
                            {/* Just a visual index */}
                            {q.options.indexOf(opt) + 1}
                        </div>
                        <span className="font-bold text-[#261A36]">{opt.label}</span>
                    </div>
                    <span className="text-xl font-black text-[#7B55A3]">{data[opt.id] || 0}</span>
                </div>
            ))}
        </div>
    );
}

function renderTextAnalytics(responses: string[]) {
    return (
        <div className="flex flex-wrap gap-2">
            {responses.map((resp, i) => (
                <div
                    key={i}
                    className="px-3 py-3 bg-[#F1F3F5] rounded-full text-sm text-[#5C5C5C] font-semibold italic border-2 border-transparent hover:border-[#7B55A3]/20 transition-all cursor-default"
                >
                    &ldquo;{resp}&rdquo;
                </div>
            ))}
        </div>
    );
}

function ResponseStatCard({label, value, bgColor}: { label: string, value: string, bgColor: string }) {
    return (
        <div
            className={cn("p-6 rounded-3xl flex flex-col items-center justify-center border-2 border-[#5C5C5C]/5 shadow-sm", bgColor)}>
            <span className="text-3xl font-black text-[#261A36] mb-1">{value}</span>
            <span className="text-[10px] font-black text-[#5C5C5C]/60 uppercase tracking-widest">{label}</span>
        </div>
    )
}
