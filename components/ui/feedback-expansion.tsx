"use client";

import React from "react";
import {cn} from "@/lib/utils";
import {motion} from "motion/react";
import {ChoiceSummary, SliderSummary, EventAnalytics} from "@/types/event-analytics";
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";
import Image from "next/image";
import {Skeleton} from "boneyard-js/react";
import {useSkeleton} from "@/hooks/use-skeleton";
import _my_response_summary from "@/bones/my-response-summary.bones.json";
import _my_response_summary_question from "@/bones/my-response-summary-question.bones.json";
import {ResponsiveBones} from "boneyard-js";
import {useEventAnalytics} from "@/hooks/use-event-analytics";

const MOCK_EVENT_ANALYTICS: EventAnalytics = {
    id: 101,
    responseStatusSummary: {
        answered: 233,
        noResponse: 12,
        absent: 5,
    },
    questions: [
        {
            questionId: "q1",
            questionText:
                "What are the things you observed during the event? asdasd ad asd ads sad asd sada sdasdasdasdasd asdasdasdasdas asdasdasdas asdasdadasd asdasdasdasd asdasd asdasdas",
            type: "checkbox",
            totalResponses: 233,
            choiceData: [
                {
                    optionId: "o1",
                    optionLabel:
                        "The Speakers are too informative asdasd ad asd ads sad asd sada sdasdasdasdasd asdasdasdasdas asdasdasdas asdasdadasd asdasdasdasd asdasd asdasdas",
                    count: 81,
                    percentage: 35,
                },
                {optionId: "o2", optionLabel: "The Venue is well-ventilated", count: 93, percentage: 40},
                {optionId: "o3", optionLabel: "Technical issues were frequent", count: 58, percentage: 25},
            ],
        },
        {
            questionId: "q2",
            questionText: "How satisfied are you with the event organization?",
            type: "slider",
            totalResponses: 233,
            averageRating: 3.5, // Calculated: (weighted sum / total responses)
            sliderData: [
                {ratingLabel: "Very Unsatisfied", ratingValue: 1, count: 35},
                {ratingLabel: "Unsatisfied", ratingValue: 2, count: 73},
                {ratingLabel: "Neutral", ratingValue: 3, count: 27},
                {ratingLabel: "Satisfied", ratingValue: 4, count: 65},
                {ratingLabel: "Very Satisfied", ratingValue: 5, count: 33},
            ],
        },
        {
            questionId: "q3",
            questionText: "Which part of the event did you prefer?",
            type: "radio",
            totalResponses: 233,
            choiceData: [
                {optionId: "r1", optionLabel: "Morning Workshop", count: 193, percentage: 83},
                {optionId: "r2", optionLabel: "Afternoon Keynote", count: 40, percentage: 17},
            ],
        },
        {
            questionId: "q4",
            questionText: "Any additional suggestions for improvement?",
            type: "text_input",
            totalResponses: 233,
            textAnswers: [
                "More hands-on sessions please.",
                "Better seating arrangements.",
                "The food was great but ran out early.",
                "Loved the networking mixer at the end!",
                "The registration process was smooth, but the air conditioning was too cold.",
                "Provide digital copies of the slides next time.",
            ],
        },
    ],
};

const BLANK_EVENT_ANALYTICS: EventAnalytics = {
    id: 0,
    responseStatusSummary: {
        answered: 0,
        noResponse: 0,
        absent: 0,
    },
    questions: [
        {
            questionId: "mandatory-rating",
            questionText: "How would you rate your overall experience today? (1-Very Unsatisfied to 5-Very Satisfied)",
            type: "slider",
            totalResponses: 0,
            averageRating: 0,
            sliderData: [
                {ratingLabel: "Very Unsatisfied", ratingValue: 1, count: 0},
                {ratingLabel: "Unsatisfied", ratingValue: 2, count: 0},
                {ratingLabel: "Neutral", ratingValue: 3, count: 0},
                {ratingLabel: "Satisfied", ratingValue: 4, count: 0},
                {ratingLabel: "Very Satisfied", ratingValue: 5, count: 0},
            ],
        },
        {
            questionId: "mandatory-comment",
            questionText: "Please share any additional feedback or suggestions you have for us.",
            type: "text_input",
            totalResponses: 0,
            textAnswers: [],
        },
    ],
};

export function FeedbackExpansion({eventId, showText = false}: { eventId: number; showText?: boolean }) {
    const {data: analytics, isLoading: isEventAnalyticsLoading} = useEventAnalytics(eventId);
    const showSkeleton = useSkeleton(isEventAnalyticsLoading, 400);

    const data = analytics ?? BLANK_EVENT_ANALYTICS;

    return (
        <div>
            <div className={`h-[1.5px] w-full bg-[#979797] ${showText ? "mb-5" : "mb-7"} mt-5`}></div>
            {showText && (
                <div
                    className="flex items-center gap-5 text-[#261A36] font-bold font-heading uppercase tracking-wider text-lg">
                    Feedback Summary
                </div>
            )}
            <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton
                        initialBones={_my_response_summary as unknown as ResponsiveBones}
                        animate="shimmer"
                        name="my-response-summary"
                        loading={showSkeleton}
                        className={cn(
                            showSkeleton &&
                            "px-6 py-3 rounded-[14px] flex flex-col gap-1 items-center justify-center border-3 border-[#5C5C5C] shadow-sm",
                        )}
                        color="#574272"
                        boneClass="opacity-40"
                    >
                        <ResponseStatCard
                            label="Responses"
                            value={data.responseStatusSummary.answered.toString()}
                            bgColor="bg-[#F5F8F3]"
                        />
                    </Skeleton>
                    <Skeleton
                        initialBones={_my_response_summary as unknown as ResponsiveBones}
                        animate="shimmer"
                        name="my-response-summary"
                        loading={showSkeleton}
                        className={cn(
                            showSkeleton &&
                            "px-6 py-3 rounded-[14px] flex flex-col gap-1 items-center justify-center border-3 border-[#5C5C5C] shadow-sm",
                        )}
                        color="#574272"
                        boneClass="opacity-40"
                    >
                        <ResponseStatCard
                            label="No Response"
                            value={data.responseStatusSummary.noResponse.toString()}
                            bgColor="bg-[#FCE0D6]"
                        />
                    </Skeleton>
                    <Skeleton
                        initialBones={_my_response_summary as unknown as ResponsiveBones}
                        animate="shimmer"
                        name="my-response-summary"
                        loading={showSkeleton}
                        className={cn(
                            showSkeleton &&
                            "px-6 py-3 rounded-[14px] flex flex-col gap-1 items-center justify-center border-3 border-[#5C5C5C] shadow-sm",
                        )}
                        color="#574272"
                        boneClass="opacity-40"
                    >
                        <ResponseStatCard
                            label="Did not attend"
                            value={data.responseStatusSummary.absent.toString()}
                            bgColor="bg-[#FAD2E6]"
                        />
                    </Skeleton>
                </div>

                <div className="space-y-6">
                    {data.questions.map((q, i) => (
                        <Skeleton
                            key={i}
                            initialBones={_my_response_summary_question as unknown as ResponsiveBones}
                            animate="shimmer"
                            name={`my-response-summary-question-${i}`}
                            loading={showSkeleton}
                            className={cn(
                                showSkeleton &&
                                "p-5 rounded-[14px] border-3 border-[#7B55A3] bg-white shadow-sm relative overflow-hidden",
                            )}
                            color="#574272"
                            boneClass="opacity-40"
                        >
                            <div
                                key={q.questionId}
                                className="p-5 rounded-[14px] border-3 border-[#7B55A3] bg-white shadow-sm relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-base font-bold  font-heading text-[#3C2457] mb-3">
                                            Question {i + 1} / {data.questions.length}
                                        </p>
                                        <h3 className="text-xl font-bold font-heading text-black whitespace-normal break-words">
                                            {q.questionText}
                                        </h3>
                                    </div>
                                </div>

                                {q.type === "checkbox" && renderRadioAnalytics(q.choiceData || [])}
                                {q.type === "slider" && renderSliderAnalytics(q.sliderData || [])}
                                {q.type === "radio" && renderRadioAnalytics(q.choiceData || [])}
                                {q.type === "text_input" && renderTextAnalytics(q.textAnswers || [])}
                            </div>
                        </Skeleton>
                    ))}
                </div>
            </div>
        </div>
    );
}

function renderCheckboxAnalytics(data: ChoiceSummary[]) {
    return (
        <div className="space-y-4">
            {data.map((item, idx) => (
                <div
                    key={idx}
                    className="relative h-14 w-full rounded-[41px] border-2 border-[#7B55A3] flex items-center px-5 overflow-hidden group"
                >
                    <motion.div
                        initial={{width: 0}}
                        animate={{width: `${item.percentage}%`}}
                        transition={{duration: 1, ease: "easeOut"}}
                        className="absolute left-0 top-0 bottom-0 bg-[#7954AB] z-0"
                    />
                    <div className="relative z-10 w-full flex justify-between items-center text-sm font-bold">
                        <span
                            className="flex items-center gap-3 font-bold font-heading text-base text-[#1F2937] mix-blend-difference min-w-0 flex-1">
                            <div
                                className="size-6 rounded-full bg-white text-black flex items-center justify-center text-base font-heading font-bold shrink-0">
                                {idx + 1}
                            </div>
                            <span className="truncate block max-w-[200px] md:max-w-[400px] lg:max-w-[900px]">
                                {item.optionLabel}
                            </span>
                        </span>
                        <span className="text-[#261A36] font-black">{item.percentage}%</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function renderSliderAnalytics(data: SliderSummary[], shouldShowSlider: boolean = true) {
    const COLORS = ["#5687F2", "#EAB308", "#EA3A88", "#60CA3B", "#9151FF"];
    const LABELS = ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"];

    const totalWeight = data.reduce((acc, curr) => acc + curr.ratingValue * curr.count, 0);
    const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);
    const avg = totalCount > 0 ? Number((totalWeight / totalCount).toFixed(1)) : 0;

    const chartData = data.map((item, index) => ({
        name: LABELS[index] || `Rating ${item.ratingValue}`,
        value: item.count,
        color: COLORS[index] || "#CBD5E1",
    }));

    return (
        <div className="flex flex-col xl:flex-row items-center justify-between px-4 w-full gap-8">
            <div className="flex-1 w-full max-w-md">
                <div className="relative h-4 bg-[#E5E5E5] rounded-[8px] w-full mb-4">
                    <motion.div
                        initial={{width: 0}}
                        animate={{width: `${((avg - 1) / (5 - 1)) * 100}%`}}
                        className="absolute h-full bg-[#4C2D6C] rounded-[8px]"
                    />
                    <motion.div
                        initial={{left: 0}}
                        animate={{left: `${((avg - 1) / (5 - 1)) * 100}%`}}
                        className="relative top-1/2 -translate-y-1/2 -ml-5 size-7 rounded-full bg-gradient-to-b from-[#4C2D6C] to-[#784BA6] shadow-lg flex items-center justify-center z-10"
                    >
                        <span
                            className="absolute -top-7 left-1/2 -translate-x-1/2 text-[#312245] text-sm font-bold font-heading pointer-events-none whitespace-nowrap">
                            {avg}
                        </span>
                    </motion.div>
                    {shouldShowSlider && (
                        <div className="absolute inset-0 flex justify-between px-[2px] z-20 pointer-events-none">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className="relative h-full flex flex-col items-center">
                                <span
                                    className="absolute top-6 text-xs font-normal font-heading text-black">{num}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 pr-4">
                <div style={{width: "200px", height: "200px"}} className="shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color}/>
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-2">
                    {[...chartData].reverse().map((entry) => (
                        <div key={entry.name} className="flex items-center gap-3">
                            <div className="size-5 rounded-full shrink-0" style={{backgroundColor: entry.color}}/>
                            <span className="text-xs font-normal text-black w-28">{entry.name}</span>
                            <span className="text-xs font-bold text-black">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function renderRadioAnalytics(data: ChoiceSummary[], isReports: boolean = false) {
    const maxCount = Math.max(...data.map((item) => item.count));

    return (
        <div className="flex flex-col gap-3">
            {data.map((item, idx) => {
                const isHighest = item.count === maxCount && maxCount > 0;
                return (
                    <div
                        key={idx}
                        className={cn(
                            "px-4 py-2 border-2 rounded-2xl flex justify-between items-center transition-colors flex-shrink-0",
                            isHighest
                                ? "bg-[#7954AB] border-[#7954AB] shadow-md"
                                : "bg-slate-50/50 border-[#5C5C5C]/10 hover:border-[#7954AB]/20",
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "size-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                                    isHighest ? "bg-white text-black" : "border-black text-black",
                                )}
                            >
                                {idx + 1}
                            </div>
                            <span
                                className={cn(
                                    "font-bold block",
                                    "line-clamp-4 overflow-hidden",
                                    isReports ? "max-w-[350px]": "max-w-[800px]",
                                    isHighest ? "text-white" : "text-black"
                                )}
                                title={item.optionLabel}
                            >
                                {item.optionLabel}</span>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className={cn("text-xl font-black mr-2", isHighest ? "text-white" : "text-black")}>
                                {item.count}
                            </span>
                            <span
                                className={cn("text-sm font-bold uppercase", isHighest ? "text-white/80" : "text-[#5C5C5C]/50")}
                            >
                                {item.percentage}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function renderTextAnalytics(responses: string[]) {
    return (
        <div className="flex flex-wrap gap-2">
            {responses.map((resp, i) => (
                <div
                    key={i}
                    className="px-4 py-3 bg-[#F1F3F5] rounded-full text-sm text-[#5C5C5C] font-semibold italic border-2 border-transparent hover:border-[#7B55A3]/20 transition-all cursor-default"
                >
                    &ldquo;{resp}&rdquo;
                </div>
            ))}
        </div>
    );
}

function ResponseStatCard({label, value, bgColor}: { label: string; value: string; bgColor: string }) {
    return (
        <div
            className={cn(
                "px-6 py-3 rounded-[14px] flex flex-col gap-1 items-center justify-center border-3 border-[#5C5C5C] shadow-sm",
                bgColor,
            )}
        >
            <Image src="/svgs/feedbacks-responses-icon.svg" width="17" height="17" alt="Icon"/>
            <span className="text-xl font-heading font-bold text-[#261A36] mt-1">{value}</span>
            <span className="text-lg font-heading font-bold text-[#B7B7B7]">{label}</span>
        </div>
    );
}
