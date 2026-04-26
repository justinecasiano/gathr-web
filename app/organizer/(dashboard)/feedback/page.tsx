"use client"

import * as React from "react"
import {
    ChevronDown, MapPin, BarChart2, CheckCircle2
} from "lucide-react"
import {cn, mapToFeedbackEvent} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Header} from "@/components/ui/header";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {motion} from "motion/react";
import {TabButton} from "@/components/ui/tab-button"
import {useMemo, useState} from "react"
import {FeedbackEvent} from "@/types/base-event";
import {FeedbackSummaryCard} from "@/components/ui/feedback-summary-card";
import {useOrganizerEvents} from "@/hooks/use-organizer-events";
import {usePagination} from "@/hooks/use-pagination";
import {NotificationToast, ToastVariant} from "@/components/ui/notification-toast"
import {useUpdateFormStatus} from "@/hooks/use-update-form-status";
import {useSearchStore} from "@/hooks/use-search-store";
import _my_feedback from "@/bones/my-feedback.bones.json";
import {ResponsiveBones} from "boneyard-js";
import {Skeleton} from "boneyard-js/react";
import {useSkeleton} from "@/hooks/use-skeleton";
import FeedbackFormEditor from "@/components/ui/form-editor";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog"
import {FormEditorValues} from "@/types/feedback";
import { VisuallyHidden } from "radix-ui"

export default function FeedbackFormsPage() {
    const [activeTab, setActiveTab] = useState<'forms' | 'individual'>('forms')
    const [selectedIndividual, setSelectedIndividual] = useState<number | null>(null)
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>();
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

    const {data: rawEvents, isLoading: isEventsLoading} = useOrganizerEvents();

    const showSkeleton = useSkeleton(isEventsLoading, 500);

    const searchQuery = useSearchStore(state => state.query);
    const events = useMemo(() => {
        if (!rawEvents) return [];
        const allEvents = rawEvents.map(event => mapToFeedbackEvent(event));

        if (searchQuery.trim() !== '') {
            return allEvents.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.questionCount.toString().includes(searchQuery) ||
                event.responseCount.toString().includes(searchQuery)
            );
        }

        return allEvents;
    }, [rawEvents, searchQuery]);

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        visiblePages,
        totalPages,
        paginationLabel,
        nextPage,
        prevPage,
        hasPrevPage,
        hasNextPage
    } = usePagination<FeedbackEvent>({items: events, itemsPerPage: 8});

    const [toastConfig, setToastConfig] = useState({
        isOpen: false,
        title: "",
        description: "",
        variant: "success" as ToastVariant,
    });

    const {mutate: updateStatus, isPending} = useUpdateFormStatus();
    const [isDelaying, setIsDelaying] = useState<number | null>(null);
    const isCardUpdating = (eventId: number) => isPending || isDelaying === eventId;

    const handleStatusToggle = (eventId: number, title: string, isActive: boolean) => {
        setIsDelaying(eventId);

        updateStatus(
            {eventId, isActive},
            {
                onSuccess: () => {
                    setToastConfig({
                        isOpen: true,
                        title: "Form Updated",
                        description: `The feedback form for ${title} is now ${isActive ? 'active' : 'inactive'}.`,
                        variant: "success"
                    });

                    setTimeout(() => {
                        setIsDelaying(null);
                    }, 2200);
                },
                onError: (error: Error) => {
                    setToastConfig({
                        isOpen: true,
                        title: "Update Failed",
                        description: error.message,
                        variant: "error"
                    });
                    setIsDelaying(null);
                }
            }
        );
    };

    const [editorConfig, setEditorConfig] = useState<{
        isOpen: boolean;
        mode: 'new' | 'edit' | 'preview';
        initialData: FormEditorValues | null;
        eventId: number | null;
    }>({
        isOpen: false,
        mode: 'preview',
        initialData: null,
        eventId: null
    });

    const handleOpenEditor = (mode: 'new' | 'edit' | 'preview', event?: FeedbackEvent) => {
        setEditorConfig({
            isOpen: true,
            mode,
            initialData: event?.feedbackForm || null,
            eventId: event?.id || null
        });
    };

    const handleSaveForm = async (data: FormEditorValues) => {
        console.log("Saving form for Event ID:", editorConfig.eventId, data);
        setEditorConfig(prev => ({...prev, isOpen: false}));
    };

    return (
        <div className="flex relative h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Dialog
                open={editorConfig.isOpen}
                onOpenChange={(open) => setEditorConfig(prev => ({...prev, isOpen: open}))}
            >
                <DialogContent
                    className="!max-w-[96vw] w-[90vw] !h-[90vh] p-0 overflow-hidden border-none bg-white shadow-2xl z-[100] outline-none">
                    <VisuallyHidden.Root>
                        <DialogTitle>
                            {editorConfig.mode === 'new' ? 'Create New Feedback Form' :
                                editorConfig.mode === 'edit' ? 'Edit Feedback Form' : 'Preview Feedback Form'}
                        </DialogTitle>
                        <DialogDescription>
                            Interface for building and managing event feedback questions.
                        </DialogDescription>
                    </VisuallyHidden.Root>

                    <FeedbackFormEditor
                        initialData={editorConfig.initialData}
                        readOnly={editorConfig.mode === 'preview'}
                        onSave={handleSaveForm}
                    />
                </DialogContent>
            </Dialog>

            <NotificationToast
                duration={2000}
                {...toastConfig}
                onClose={() => setToastConfig(prev => ({...prev, isOpen: false}))}
            />
            <Header/>
            <main
                className="relative flex-1 flex flex-col px-10 pt-6 max-w-[1600px] mx-auto w-full z-50 overflow-hidden">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Feedback
                                Forms</h1>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">Create and manage your
                            feedback and responses</p>
                    </div>
                </div>

                <div className="flex w-full gap-3 mt-8 relative">
                    <TabButton
                        active={activeTab === 'forms'}
                        label="Feedback Forms"
                        icon="/svgs/feedbacks-form-icon.svg"
                        onClick={() => setActiveTab('forms')}
                    />
                    <TabButton
                        active={activeTab === 'individual'}
                        label="Individual Responses"
                        icon="/svgs/feedbacks-indiv-icon.svg"
                        onClick={() => setActiveTab('individual')}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-2">
                    {activeTab === 'individual' && (
                        <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                            <SelectTrigger
                                className="w-full md:w-64 h-12 rounded-sm border-2 text-lg border-black bg-white font-display font-semibold text-black  focus:ring-0"
                            >
                                <SelectValue placeholder="Select Specific Event"/>
                            </SelectTrigger>

                            <SelectContent>
                                {events.map((event) => (
                                    <SelectItem
                                        key={event.id}
                                        value={event.id.toString()}
                                        className="font-display font-medium focus:bg-slate-100 cursor-pointer"
                                    >
                                        {event.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div
                    className="space-y-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#7B55A3] scrollbar-track-transparent">
                    {activeTab === 'forms' ? (
                        <>
                            <div className="mt-4"></div>
                            {events.map((event) => (
                                <Skeleton key={event.id} initialBones={(_my_feedback as unknown) as ResponsiveBones}
                                          animate="shimmer" name={`my-feedback-item-${event.id}`} loading={showSkeleton}
                                          className={cn(showSkeleton && "h-[220px] rounded-[14px] bg-white/40 px-6 py-5 shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all")}
                                          color="#574272" boneClass="opacity-40"
                                >
                                    <FeedbackSummaryCard key={event.id} {...event}
                                                         onStatusToggle={handleStatusToggle}
                                                         isUpdating={isCardUpdating(event.id)}
                                                         isExpanded={expandedEventId === event.id}
                                                         onExpand={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                                                         onPreview={() => handleOpenEditor('preview', event)}
                                                         onEdit={() => handleOpenEditor('edit', event)}
                                                         onNew={() => handleOpenEditor('new', event)}
                                    />
                                </Skeleton>
                            ))}
                            <div className="mb-8"></div>
                        </>
                    ) : (
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
            </main>

            {events.length > 8 && (
                <div className="bg-white border-t-2 border-[#5C5C5C] px-6 py-3 shrink-0">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="font-display text-base font-normal text-[#676767]">
                            {paginationLabel}
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                disabled={!hasPrevPage}
                                onClick={prevPage}
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                            >
                                Previous
                            </Button>

                            {visiblePages.map((num) => (
                                <Button
                                    key={num}
                                    onClick={() => setCurrentPage(num)}
                                    className={cn(
                                        "h-11 w-11 rounded-xl font-bold transition-all",
                                        currentPage === num
                                            ? "bg-[#574272] text-white hover:bg-[#574272]"
                                            : "bg-white border-2 border-[#5C5C5C]/10 text-[#574272] hover:bg-[#574272] hover:text-white"
                                    )}
                                >
                                    {num}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                disabled={!hasNextPage}
                                onClick={nextPage}
                                className="h-11 rounded-xl border-2 border-[#5C5C5C]/10 bg-white font-bold text-[#574272] hover:bg-[#574272] hover:text-white transition-colors"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="hidden lg:block absolute inset-0 pointer-events-none h-full">
                <motion.div
                    className="absolute -top-5 -right-55 h-90 w-90 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: 50}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                />

                <motion.div
                    className="absolute -top-22 left-90 h-40 w-40 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: -40, scale: 1.1}}
                    transition={{type: "spring", stiffness: 200, damping: 15}}
                />

                <motion.div
                    className="absolute top-35 left-10 h-130 w-130 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 20}}
                />

                <motion.div
                    className="absolute -bottom-65 -right-20 h-160 w-160 rounded-full bg-[#7B55A3]/10"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{type: "spring", stiffness: 200, damping: 20}}
                />
            </div>
        </div>
    )
}
