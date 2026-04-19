import React from 'react'
import {EventCard} from '@/components/ui/event-card'
import {Header} from '@/components/ui/header'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button"

const MOCK_EVENTS = [
    {
        id: 1,
        title: "4th IT Skills Olympics",
        location: "UMak Auditorium, University of Makati",
        date: "Oct. 7, 2025 | 9:00 AM to 5:00 PM",
        organizer: "Era Marie Gannaban",
        attendees: "23/500",
        status: "Approved",
        hasFeedback: true,
        image: "/images/event-placeholder.png"
    },
]

export default function EventsPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <Header name={"Angela Mae Cabrera"} email={"angelamaecabrera@gmail.com"}/>
            <main className="flex min-h-screen w-full flex-col bg-white px-10 py-6 space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">My Events</h1>
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
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">Create and manage your events</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {MOCK_EVENTS.map((event) => (
                        <EventCard key={event.id} {...event as any} />
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-10">
                    <p className="text-sm font-bold text-[#574272]">Showing 1-3 of 3 Events</p>

                    <div className="flex items-center gap-2">
                        <Button variant="outline"
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272]">
                            Previous
                        </Button>

                        <Button
                            className="h-11 w-11 rounded-xl bg-[#574272] font-bold text-white shadow-[4px_4px_0px_0px_rgba(38,26,54,1)]">
                            1
                        </Button>

                        <Button variant="outline"
                                className="h-11 w-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272]">
                            2
                        </Button>

                        <Button variant="outline"
                                className="h-11 w-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272]">
                            3
                        </Button>

                        <Button variant="outline"
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272]">
                            Next
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}