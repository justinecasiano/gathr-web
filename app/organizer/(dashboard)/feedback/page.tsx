"use client"

import * as React from "react"
import Image from "next/image"
import {
    ChevronDown, MapPin, ClipboardList, Users, BarChart2,
    Eye, Edit3, Plus, CheckCircle2
} from "lucide-react"
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Header} from "@/components/ui/header";
import {Switch} from "@/components/ui/switch"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

const TabButton = ({active, label, icon: Icon, onClick}: any) => (
    <button
        onClick={onClick}
        className={cn(
            "flex flex-1 items-center justify-center gap-3 h-14 rounded-full border-2 border-[#5C5C5C] transition-all",
            active ? "bg-white shadow-[4px_4px_0px_0px_rgba(38,26,54,1)] z-10" : "bg-[#F3E8FF]/50 text-[#5C5C5C]/60"
        )}
    >
        <div className={cn("p-1.5 rounded-lg border-2 border-[#5C5C5C]", active ? "bg-[#FF8C66]" : "bg-white")}>
            <Icon size={18} className={active ? "text-white" : "text-[#5C5C5C]"}/>
        </div>
        <span className="font-black text-lg uppercase">{label}</span>
    </button>
)

const SummaryCard = ({label, value, bgColor}: any) => (
    <div
        className={cn("flex flex-1 flex-col items-center justify-center p-4 rounded-2xl border-2 border-[#5C5C5C]", bgColor)}>
        <span className="text-3xl font-black text-[#261A36]">{value}</span>
        <span className="text-sm font-bold text-[#5C5C5C]/70 uppercase">{label}</span>
    </div>
)

export default function FeedbackFormsPage() {
    const [activeTab, setActiveTab] = React.useState<'forms' | 'individual'>('forms')
    const [expandedEvent, setExpandedEvent] = React.useState<number | null>(null)
    const [selectedIndividual, setSelectedIndividual] = React.useState<number | null>(null)

    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <Header/>
            <div className="flex min-h-screen w-full flex-col bg-[#F9F7FD] px-10 py-6 space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-5xl font-black text-[#261A36] uppercase tracking-tight">Feedback Forms</h1>
                        <p className="text-[#574272] font-bold mt-1">Create and manage your feedback and responses</p>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex w-full gap-0 relative">
                    <TabButton
                        active={activeTab === 'forms'}
                        label="Feedback Forms"
                        icon={ClipboardList}
                        onClick={() => setActiveTab('forms')}
                    />
                    <TabButton
                        active={activeTab === 'individual'}
                        label="Individual Responses"
                        icon={Users}
                        onClick={() => setActiveTab('individual')}
                    />
                </div>

                {/* SUB-HEADER ACTIONS */}
                <div className="flex justify-end gap-4">
                    {activeTab === 'individual' && (
                        <Select>
                            <SelectTrigger
                                className="w-72 h-12 rounded-xl border-2 border-[#261A36] bg-white font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <SelectValue placeholder="Select Specific Event"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="it-olympics">4th IT Skills Olympics</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    <Button
                        className="bg-[#7B55A3] h-12 rounded-xl border-2 border-[#261A36] font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#6a4492]">
                        <Plus className="mr-2" size={20}/> New Form
                    </Button>
                </div>

                {/* CONTENT AREA */}
                <div className="space-y-6">
                    {activeTab === 'forms' ? (
                        // FEEDBACK FORMS LIST
                        [1, 2].map((id) => (
                            <div key={id}
                                 className="bg-white rounded-[32px] border-2 border-[#5C5C5C]/10 p-6 shadow-sm overflow-hidden transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="h-28 w-28 rounded-2xl bg-purple-100 overflow-hidden shrink-0">
                                        <Image src="/images/event-placeholder.png" alt="Event" width={112} height={112}
                                               className="object-cover"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-[#261A36]">4th IT Skills
                                                Olympics</h3>
                                            <Badge
                                                className={id === 1 ? "bg-[#D1E9D2] text-[#2F5A30]" : "bg-[#FAD2D2] text-[#820006]"}>
                                                {id === 1 ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <Badge className="bg-[#FCE0D6] text-[#824D3B]">Event Ended</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1 text-sm font-bold text-[#5C5C5C]/80">
                                            <div className="flex items-center gap-2"><MapPin size={14}
                                                                                             className="text-[#FF8C66]"/> UMak
                                                Auditorium
                                            </div>
                                            <div className="flex items-center gap-2"><ClipboardList size={14}
                                                                                                    className="text-[#FF8C66]"/> 10
                                                Questions
                                            </div>
                                            <div className="flex items-center gap-2"><Users size={14}
                                                                                            className="text-[#FF8C66]"/> 10
                                                Responses
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" className="rounded-xl border-2 bg-purple-50/50"><Eye
                                            size={18} className="mr-2"/> Preview</Button>
                                        <Button variant="outline" className="rounded-xl border-2 bg-purple-50/50"><Edit3
                                            size={18} className="mr-2"/> Edit</Button>
                                        <Switch checked={id === 1} className="data-[state=checked]:bg-[#5E338A]"/>
                                    </div>
                                </div>

                                {/* EXPANDABLE SUMMARY */}
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

                                        {/* QUESTION RESULT PREVIEW */}
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
                        ))
                    ) : (
                        // INDIVIDUAL RESPONSES VIEW
                        <div
                            className="bg-white rounded-[32px] border-2 border-[#5C5C5C]/10 p-6 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-6">
                                <div
                                    className="h-20 w-20 rounded-full border-4 border-[#261A36] bg-[#7B55A3] overflow-hidden flex items-end justify-center">
                                    <div
                                        className="w-10 h-10 bg-white rounded-full mb-[-5px] border-2 border-[#261A36]"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-[#261A36]">Angela Mae Cabrera</h3>
                                    <div className="flex items-center gap-2 text-sm font-bold text-[#5C5C5C]/80 mt-1">
                                        <MapPin size={14} className="text-[#FF8C66]"/> 4th IT Skills Olympics
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedIndividual(selectedIndividual === 1 ? null : 1)}
                                    className="flex items-center gap-3 text-[#261A36] font-black uppercase"
                                >
                                    <BarChart2 size={20}/> View Feedback
                                    <ChevronDown
                                        className={cn("transition-transform", selectedIndividual === 1 && "rotate-180")}/>
                                </button>
                            </div>

                            {selectedIndividual === 1 && (
                                <div
                                    className="mt-8 border-t-2 border-[#5C5C5C]/10 pt-8 space-y-8 animate-in fade-in duration-500">
                                    {/* QUESTION TYPE: MULTIPLE CHOICE */}
                                    <div className="p-6 rounded-[32px] border-2 border-[#7B55A3]">
                                        <p className="text-xs font-black text-[#7B55A3] uppercase mb-1">Question 1 /
                                            10</p>
                                        <p className="font-bold text-[#261A36] mb-4">What are the things you observed
                                            during the event...?</p>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i}
                                                     className={cn("h-12 border-2 rounded-xl flex items-center px-4 justify-between", i === 2 ? "border-[#7B55A3] bg-[#F3E8FF]/20" : "border-[#5C5C5C]/10 text-[#5C5C5C]/40")}>
                                                    <span>Option {i} Text</span>
                                                    <div
                                                        className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", i === 2 ? "border-[#7B55A3] bg-[#7B55A3]" : "border-[#5C5C5C]/20")}>
                                                        {i === 2 && <CheckCircle2 size={12} className="text-white"/>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* QUESTION TYPE: SLIDER/RATING */}
                                    <div className="p-6 rounded-[32px] border-2 border-[#7B55A3]">
                                        <p className="text-xs font-black text-[#7B55A3] uppercase mb-1">Question 2 /
                                            10</p>
                                        <p className="font-bold text-[#261A36] mb-8">How satisfied are you?</p>
                                        <div className="px-4">
                                            <div className="relative h-2 bg-[#5C5C5C]/10 rounded-full">
                                                <div className="absolute h-full w-1/2 bg-[#7B55A3] rounded-full"/>
                                                <div
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#7B55A3] rounded-full border-2 border-white shadow-lg"/>
                                            </div>
                                            <div
                                                className="flex justify-between mt-4 text-[10px] font-black text-[#5C5C5C]/50">
                                                <span>1</span><span>2</span><span
                                                className="text-[#7B55A3]">3</span><span>4</span><span>5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* FOOTER PAGINATION */}
                <div className="flex items-center justify-between pt-10">
                    <p className="text-sm font-bold text-[#574272]">Showing 1-3 of 3 Events</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl border-2">Previous</Button>
                        <Button className="rounded-xl bg-[#574272] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">1</Button>
                        <Button variant="outline" className="rounded-xl border-2">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
