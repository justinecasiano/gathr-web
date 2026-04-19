'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Calendar, User, Users, BarChart2, ChevronRight, Share2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
    title: string
    location: string
    date: string
    organizer: string
    attendees: string
    status: 'Approved' | 'Rejected' | 'Pending'
    hasFeedback: boolean
    image: string
}

export function EventCard({ title, location, date, organizer, attendees, status, hasFeedback, image }: EventCardProps) {
    const statusColors = {
        Approved: "bg-[#D1E9D2] text-[#2F5A30] hover:bg-[#D1E9D2]",
        Rejected: "bg-[#FAD2D2] text-[#820006] hover:bg-[#FAD2D2]",
        Pending: "bg-[#FFEB3B] text-[#000000] hover:bg-[#FFEB3B]"
    }

    return (
        <div className="group relative flex w-full flex-col sm:flex-row items-center gap-6 rounded-3xl bg-white p-6 shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all">
            <div className="relative h-32 w-44 shrink-0 overflow-hidden rounded-2xl shadow-md">
                <Image src={image} alt={title} fill className="object-cover" />
            </div>

            <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-[#261A36] truncate">{title}</h3>
                    <Badge className={cn("rounded-full font-bold px-4 py-0.5", statusColors[status])}>
                        {status}
                    </Badge>
                    <Badge variant="outline" className={cn(
                        "rounded-full border-[#5C5C5C]/30 bg-[#F3E8FF] text-[#574272] px-3 font-medium",
                        !hasFeedback && "bg-white text-[#5C5C5C]"
                    )}>
                        {hasFeedback ? 'With Feedback Form' : 'No Feedback Form'}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-y-1.5 text-sm font-medium text-[#5C5C5C]">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#FF8C66]" />
                        <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#FF8C66]" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-[#FF8C66]" />
                        <span>Organized by {organizer}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                        <Users size={16} className="text-[#FF8C66]" />
                        <span className="text-rose-500">{attendees}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {status === 'Rejected' ? (
                    <button className="p-2 text-[#5C5C5C] hover:bg-gray-100 rounded-full transition-colors">
                        <Share2 size={24} />
                    </button>
                ) : (
                    <>
                        <button className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors text-[#261A36]">
                            <BarChart2 size={24} />
                        </button>
                        <ChevronRight size={28} className="text-[#261A36] cursor-pointer" />
                    </>
                )}
            </div>
        </div>
    )
}