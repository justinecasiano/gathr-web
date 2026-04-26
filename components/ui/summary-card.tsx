"use client"

import React from 'react'
import Image from 'next/image'
import {ChevronRight, Edit3, Eye, Plus} from 'lucide-react'
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {FeedbackEvent} from '@/types/event'
import { Button } from './button'
import {Switch} from "@/components/ui/switch";

interface SummaryCardProps {
    title: string
    location: string
    date: string
    organizer: string
    attendees: string
    status: 'Approved' | 'Rejected' | 'Pending'
    hasFeedback: boolean
    image?: string
}

export function SummaryCard({
                                title,
                                location,
                                status,
                                isFormActive,
                                hasFeedback,
                                questionCount,
                                responseCount,
                                image = "/images/placeholder_small.png"
                            }: FeedbackEvent) {

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

    return (
        <div
            className="bg-white rounded-[32px] border-2 border-[#5C5C5C]/10 p-6 shadow-sm overflow-hidden transition-all">
            <div className="flex items-start gap-6">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[15px] shadow-md">
                    <Image src={image} alt={title} fill
                           className={cn("transition-all",
                               image.includes('placeholder_small') ? "object-contain" : "object-cover")}
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-heading font-bold text-black truncate max-w-[300px] lg:max-w-[500px] shrink-0">{title}</h3>
                            <div className="flex items-center gap-3 min-w-0 shrink-0">
                                <Badge
                                    className={cn("rounded-full font-bold font-display text-sm px-6 py-1.5 whitespace-nowrap", formStatusColors[status as keyof typeof formStatusColors])}>
                                    {formStatus}
                                </Badge>
                                <Badge
                                    className={cn("rounded-full font-bold font-display text-sm px-6 py-1.5 whitespace-nowrap", statusColors[status as keyof typeof statusColors])}>
                                    {status}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm"
                                    className="rounded-xl border-2 bg-purple-50/50"><Plus size={16}
                                                                                          className="mr-2"/> New</Button>
                            <Button variant="outline" size="sm"
                                    className="rounded-xl border-2 bg-purple-50/50"><Eye size={16}
                                                                                         className="mr-2"/> Preview</Button>
                            <Button variant="outline" size="sm"
                                    className="rounded-xl border-2 bg-purple-50/50"><Edit3 size={16}
                                                                                           className="mr-2"/> Edit</Button>
                            <Switch checked={isFormActive}
                                    className="data-[state=checked]:bg-[#574272] border-1 border-[#574272] ml-2"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-3 font-heading font-normal text-black">
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-location.svg" width="15" height="15" alt="Icon"/>
                            <span className="text-lg truncate max-w-[700px] inline-block align-bottom">{location}</span>
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

            <button
                onClick={() => setExpandedEvent(expandedEvent === id ? null : id)}
                className="w-full mt-6 pt-4 border-t-2 border-[#5C5C5C]/10 flex items-center justify-between group"
            >
                <div className="flex items-center gap-3 text-[#261A36] font-black uppercase">
                    <BarChart2 size={20}/> View Feedback Summary
                </div>
                <ChevronDown
                    className={cn("transition-transform", expandedEvent === id && "rotate-180")}/>
            </button>

            {expandedEvent === id && (
                <div className="mt-6 space-y-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex gap-4">
                        <SummaryCard label="Responses" value="15" bgColor="bg-[#F5F8F3]"/>
                        <SummaryCard label="No Response" value="5" bgColor="bg-[#FCE0D6]"/>
                        <SummaryCard label="Did not attend" value="3" bgColor="bg-[#F3E8FF]"/>
                    </div>

                    <div className="p-6 rounded-[32px] border-2 border-[#7B55A3] bg-white">
                        <p className="text-xs font-black text-[#7B55A3] uppercase mb-1">Question 1 /
                            10</p>
                        <p className="font-bold text-[#261A36] mb-6">What are the things you
                            observed during the event...?</p>
                        <div className="space-y-4">
                            {[35, 40, 35].map((val, i) => (
                                <div key={i}
                                     className="relative h-12 w-full rounded-full border-2 border-[#7B55A3] flex items-center px-4">
                                    <div
                                        className="absolute left-0 top-0 bottom-0 bg-[#7B55A3]/70 rounded-full z-0 transition-all"
                                        style={{width: `${val}%`}}/>
                                    <div
                                        className="relative z-10 w-full flex justify-between items-center text-sm font-black">
                            <span className="flex items-center gap-2">
                              <span
                                  className="w-6 h-6 rounded-full bg-[#7B55A3] text-white flex items-center justify-center text-[10px]">{i + 1}</span>
                              The Speakers are too Lorem Ipsum
                            </span>
                                        <span>{val}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}