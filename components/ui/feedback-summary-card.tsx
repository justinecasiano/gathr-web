"use client"

import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import {ChevronDown, Edit3, Eye, Plus} from 'lucide-react'
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {FeedbackEvent} from '@/types/base-event'
import {Button} from './button'
import {Switch} from "@/components/ui/switch";
import {FeedbackExpansion} from './feedback-expansion'
import {EventAnalytics} from "@/types/event-analytics";

const MOCK_EVENT_ANALYTICS: EventAnalytics[] = [
    {
        id: 101, // UMAK Tech Summit
        responseStatusSummary: {
            answered: 150,
            noResponse: 30,
            absent: 20
        },
        questions: [
            {
                questionId: "q_radio_01",
                questionText: "How did you hear about this event?",
                type: "radio",
                totalResponses: 150,
                choiceData: [
                    {optionLabel: "Social Media", count: 90, percentage: 60},
                    {optionLabel: "Email Invitation", count: 30, percentage: 20},
                    {optionLabel: "Friend/Colleague", count: 20, percentage: 13.3},
                    {optionLabel: "Posters/On-campus", count: 10, percentage: 6.7}
                ]
            },
            {
                questionId: "q_check_02",
                questionText: "Which topics did you find most interesting?",
                type: "checkbox",
                totalResponses: 150,
                choiceData: [
                    {optionLabel: "Web Development", count: 110, percentage: 73.3},
                    {optionLabel: "Cloud Computing", count: 85, percentage: 56.7},
                    {optionLabel: "AI", count: 130, percentage: 86.7}
                ]
            },
            {
                questionId: "q_slider_03",
                questionText: "Rate the overall organization:",
                type: "slider",
                totalResponses: 150,
                sliderData: [
                    {rating: 1, count: 2}, {rating: 2, count: 8},
                    {rating: 3, count: 25}, {rating: 4, count: 65}, {rating: 5, count: 50}
                ]
            },
            {
                questionId: "q_text_04",
                questionText: "What was your biggest takeaway?",
                type: "text_input",
                totalResponses: 150,
                textAnswers: [
                    "Networking was great.",
                    "AI is moving fast!",
                    "Loved the Google speaker."
                ]
            }
        ]
    },
    {
        id: 102,
        responseStatusSummary: {
            answered: 310,
            noResponse: 90,
            absent: 20
        },
        questions: [
            {
                questionId: "ah_q1",
                questionText: "Which decade did you graduate from UMAK?",
                type: "radio",
                totalResponses: 310,
                choiceData: [
                    {optionLabel: "1990s", count: 45, percentage: 14.5},
                    {optionLabel: "2000s", count: 115, percentage: 37.1},
                    {optionLabel: "2010s", count: 100, percentage: 32.3},
                    {optionLabel: "2020s", count: 50, percentage: 16.1}
                ]
            },
            {
                questionId: "ah_q2",
                questionText: "What motivated you to attend today?",
                type: "checkbox",
                totalResponses: 310,
                choiceData: [
                    {optionLabel: "Reuniting with friends", count: 280, percentage: 90.3},
                    {optionLabel: "Networking", count: 150, percentage: 48.4},
                    {optionLabel: "Visiting the campus", count: 200, percentage: 64.5},
                    {optionLabel: "The free food", count: 120, percentage: 38.7}
                ]
            },
            {
                questionId: "ah_q3",
                questionText: "Rate the venue (Heritage Hotel):",
                type: "slider",
                totalResponses: 310,
                sliderData: [
                    {rating: 1, count: 0}, {rating: 2, count: 10},
                    {rating: 3, count: 50}, {rating: 4, count: 120}, {rating: 5, count: 130}
                ]
            },
            {
                questionId: "ah_q4",
                questionText: "Share a favorite memory from your student days:",
                type: "text_input",
                totalResponses: 310,
                textAnswers: [
                    "Eating street food outside the main gate.",
                    "Late night study sessions at the library.",
                    "Winning the basketball championship in 2012!",
                    "The terror professors who actually taught me the most."
                ]
            }
        ]
    },
    {
        id: 103,
        responseStatusSummary: {
            answered: 150,
            noResponse: 30,
            absent: 20
        },
        questions: [
            {
                questionId: "q_radio_01",
                questionText: "How did you hear about this event?",
                type: "radio",
                totalResponses: 150,
                choiceData: [
                    {optionLabel: "Social Media", count: 90, percentage: 60},
                    {optionLabel: "Email Invitation", count: 30, percentage: 20},
                    {optionLabel: "Friend/Colleague", count: 20, percentage: 13.3},
                    {optionLabel: "Posters/On-campus", count: 10, percentage: 6.7}
                ]
            },
            {
                questionId: "q_check_02",
                questionText: "Which topics did you find most interesting?",
                type: "checkbox",
                totalResponses: 150,
                choiceData: [
                    {optionLabel: "Web Development", count: 110, percentage: 73.3},
                    {optionLabel: "Cloud Computing", count: 85, percentage: 56.7},
                    {optionLabel: "AI", count: 130, percentage: 86.7}
                ]
            },
            {
                questionId: "q_slider_03",
                questionText: "Rate the overall organization:",
                type: "slider",
                totalResponses: 150,
                sliderData: [
                    {rating: 1, count: 2}, {rating: 2, count: 8},
                    {rating: 3, count: 25}, {rating: 4, count: 65}, {rating: 5, count: 50}
                ]
            },
            {
                questionId: "q_text_04",
                questionText: "What was your biggest takeaway?",
                type: "text_input",
                totalResponses: 150,
                textAnswers: [
                    "Networking was great.",
                    "AI is moving fast!",
                    "Loved the Google speaker."
                ]
            }
        ]
    },
    {
        id: 104,
        responseStatusSummary: {
            answered: 310,
            noResponse: 90,
            absent: 20
        },
        questions: [
            {
                questionId: "ah_q1",
                questionText: "Which decade did you graduate from UMAK?",
                type: "radio",
                totalResponses: 310,
                choiceData: [
                    {optionLabel: "1990s", count: 45, percentage: 14.5},
                    {optionLabel: "2000s", count: 115, percentage: 37.1},
                    {optionLabel: "2010s", count: 100, percentage: 32.3},
                    {optionLabel: "2020s", count: 50, percentage: 16.1}
                ]
            },
            {
                questionId: "ah_q2",
                questionText: "What motivated you to attend today?",
                type: "checkbox",
                totalResponses: 310,
                choiceData: [
                    {optionLabel: "Reuniting with friends", count: 280, percentage: 90.3},
                    {optionLabel: "Networking", count: 150, percentage: 48.4},
                    {optionLabel: "Visiting the campus", count: 200, percentage: 64.5},
                    {optionLabel: "The free food", count: 120, percentage: 38.7}
                ]
            },
            {
                questionId: "ah_q3",
                questionText: "Rate the venue (Heritage Hotel):",
                type: "slider",
                totalResponses: 310,
                sliderData: [
                    {rating: 1, count: 0}, {rating: 2, count: 10},
                    {rating: 3, count: 50}, {rating: 4, count: 120}, {rating: 5, count: 130}
                ]
            },
            {
                questionId: "ah_q4",
                questionText: "Share a favorite memory from your student days:",
                type: "text_input",
                totalResponses: 310,
                textAnswers: [
                    "Eating street food outside the main gate.",
                    "Late night study sessions at the library.",
                    "Winning the basketball championship in 2012!",
                    "The terror professors who actually taught me the most."
                ]
            }
        ]
    }
];

interface ExtendedFeedbackEvent extends FeedbackEvent {
    onStatusToggle: (id: number, title: string, checked: boolean) => void;
    isUpdating: boolean;
    isExpanded: boolean;
    onExpand: () => void;
}

export function FeedbackSummaryCard({
                                        id,
                                        title,
                                        location,
                                        status,
                                        isFormActive,
                                        onStatusToggle,
                                        isExpanded,
                                        onExpand,
                                        isUpdating,
                                        hasFeedback,
                                        questionCount,
                                        responseCount,
                                        image = "/images/placeholder_small.png"
                                    }: ExtendedFeedbackEvent) {

    type EventStatus = 'Ongoing' | 'Ended' | 'Upcoming';
    const statusColors: Record<EventStatus, string> = {
        Ongoing: "bg-[#CADDC2] text-[#184D00] hover:bg-[#CADDC2]",
        Ended: "bg-[#FFC7B5] text-[#820006] hover:bg-[#FFC7B5]",
        Upcoming: "bg-[#FFD600] text-[#4B3F00] hover:bg-[#FFD600]"
    }

    type FormStatus = 'Active' | 'Inactive'
    const formStatusColors: Record<FormStatus, string> = {
        Active: "bg-[#CADDC2] text-[#184D00] hover:bg-[#CADDC2]",
        Inactive: "bg-[#FFC7B5] text-[#820006] hover:bg-[#FFC7B5]",
    }

    const formStatus = isFormActive ? "Active" : "Inactive"

    const [localActive, setLocalActive] = useState(isFormActive);

    useEffect(() => {
        setLocalActive(isFormActive);
    }, [isFormActive]);

    const handleChange = (checked: boolean) => {
        setLocalActive(checked);
        onStatusToggle(id, title, checked);
    }

    return (
        <div
            className="rounded-[14px] bg-white px-6 py-5 shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all">
            <div className="flex items-start gap-6">
                <div className={cn(
                    "relative h-40 w-40 shrink-0 overflow-hidden rounded-[15px]",
                    "shadow-[0_6px_10px_0_rgba(0,0,0,0.25)]"
                )}>
                    <Image src={image} alt={title} fill
                           className={cn("transition-all",
                               image.includes('placeholder_small') ? "object-contain" : "object-cover")}
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                            <h3 className="text-2xl font-heading font-bold text-black truncate max-w-[300px] lg:max-w-[650px] shrink-0">{title}</h3>
                            <div className="flex items-center gap-3 min-w-0 shrink-0">
                                <Badge
                                    className={cn(
                                        "rounded-full font-bold font-display text-sm px-6 py-1.5 whitespace-nowrap",
                                        "transition-all duration-300 ease-in-out",
                                        formStatusColors[formStatus as keyof typeof formStatusColors]
                                    )}
                                >
                                    {formStatus}
                                </Badge>

                                <Badge
                                    className={cn(
                                        "rounded-full font-bold font-display text-sm px-6 py-1.5 whitespace-nowrap",
                                        "transition-all duration-300 ease-in-out",
                                        statusColors[status as keyof typeof statusColors]
                                    )}
                                >
                                    {`Event ${status}`}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {hasFeedback ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-lg border-2 hover:bg-[#261A36]/20 transition-colors text-[#261A36] cursor-pointer"
                                    >
                                        <Eye size={16} className="mr-2"/>
                                        Preview
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-lg border-2 hover:bg-[#261A36]/20 transition-colors text-[#261A36] cursor-pointer"
                                    >
                                        <Edit3 size={16} className="mr-2"/>
                                        Edit
                                    </Button>

                                    <Switch
                                        checked={localActive}
                                        onCheckedChange={handleChange}
                                        disabled={isUpdating}
                                        className={cn(
                                            "cursor-pointer border-1 scale-140 ml-3",
                                            "data-[state=unchecked]:bg-[#ACACAC] data-[state=unchecked]:border-[#ACACAC]",
                                            "data-[state=checked]:bg-[#574272] data-[state=checked]:border-[#574272]",
                                            "transition-colors duration-200"
                                        )}
                                    />
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg border-2 hover:bg-[#261A36]/20 transition-colors text-[#261A36] cursor-pointer"
                                >
                                    <Plus size={16} className="mr-2"/>
                                    New
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-3 font-heading font-normal text-black">
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-location.svg" width="15" height="15" alt="Icon"/>
                            <span className="text-xl truncate max-w-[700px] inline-block align-bottom">{location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-date.svg" width="15" height="15" alt="Icon"/>
                            <span
                                className="text-base truncate max-w-[700px] inline-block align-bottom">{`${questionCount} Questions`}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-organizer.svg" width="15" height="15" alt="Icon"/>
                            <span
                                className="text-base truncate max-w-[700px] inline-block align-bottom">{`${responseCount} Responses`}</span>
                        </div>
                    </div>
                </div>
            </div>

            {
                hasFeedback && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onExpand();
                        }}
                        className="w-full mt-4 pt-4 border-t-2 border-[#5C5C5C]/10 flex items-center justify-between group cursor-pointer"
                    >
                        <div
                            className="flex items-center gap-5 text-[#261A36] font-bold font-heading uppercase tracking-wider text-lg">
                            <Image src="/svgs/feedbacks-summary-icon.svg" width="24" height="24" alt="Icon"/>
                            View Feedback Summary
                        </div>
                        <ChevronDown
                            className={cn("transition-transform duration-300", isExpanded && "rotate-180")}/>
                    </button>
                )
            }

            {
                isExpanded && <FeedbackExpansion responseCount={responseCount}/>
            }
        </div>
    )
}