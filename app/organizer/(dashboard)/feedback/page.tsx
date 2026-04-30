"use client";

import * as React from "react";
import { cn, mapToFeedbackEvent, mapToIndividualSummary } from "@/lib/utils";
import { Header } from "@/components/ui/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabButton } from "@/components/ui/tab-button";
import { useEffect, useMemo, useState } from "react";
import { BaseEvent, FeedbackEvent, IndividualResponse } from "@/types/base-event";
import { FeedbackSummaryCard } from "@/components/ui/feedback-summary-card";
import { useOrganizerEvents } from "@/hooks/use-organizer-events";
import { usePagination } from "@/hooks/use-pagination";
import { NotificationToast, ToastVariant } from "@/components/ui/notification-toast";
import { useUpdateFormStatus } from "@/hooks/use-update-form-status";
import { useSearchStore } from "@/hooks/use-search-store";
import _my_feedback from "@/bones/my-feedback.bones.json";
import _my_individual_feedback from "@/bones/my-individual-feedback.bones.json";
import { ResponsiveBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import { useSkeleton } from "@/hooks/use-skeleton";
import FeedbackFormEditor from "@/components/ui/form-editor";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FormEditorValues } from "@/types/feedback";
import { VisuallyHidden } from "radix-ui";
import { useUpdateFeedbackForm } from "@/hooks/use-update-feedback-form";
import { useRouter, useSearchParams } from "next/navigation";
import { IndividualSummaryCard } from "@/components/ui/individual-summary-card";
import { useEventParticipants } from "@/hooks/use-event-participants";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";

export default function FeedbackFormsPage() {
    const searchQuery = useSearchStore((state) => state.query);
    const [activeTab, setActiveTab] = useState<"forms" | "individual">("forms");
    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(() => {
        if (typeof window !== "undefined") return localStorage.getItem("gathr_selected_event") || undefined;
        return undefined;
    });

    useEffect(() => {
        if (selectedEventId) localStorage.setItem("gathr_selected_event", selectedEventId);
    }, [selectedEventId]);

    const { data: rawEvents, isLoading: isEventsLoading } = useOrganizerEvents();
    const showEventSkeleton = useSkeleton(isEventsLoading, 500);
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
    const events = useMemo(() => {
        if (!rawEvents) return [];
        const allEvents = rawEvents
            .filter((event) => event.status !== "REJECTED")
            .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
            .map((event) => mapToFeedbackEvent(event));

        if (searchQuery.trim() !== "") {
            return allEvents.filter(
                (event) =>
                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.questionCount.toString().includes(searchQuery) ||
                    event.responseCount.toString().includes(searchQuery),
            );
        }

        return allEvents;
    }, [rawEvents, searchQuery]);

    const { data: participants, isLoading: isEventParticipantsLoading } = useEventParticipants(Number(selectedEventId));
    const showIndivSkeleton = useSkeleton(isEventParticipantsLoading, 400);
    const [expandedIndivId, setexpandedIndivId] = useState<string | null>(null);
    const selectedEvent = events.find((e) => e.id.toString() === selectedEventId);
    const individualResponses = useMemo(() => {
        if (!participants || !selectedEvent) return [];
        return mapToIndividualSummary(participants, selectedEvent.location);
    }, [participants, selectedEvent]);

    const formPagination = usePagination<FeedbackEvent>({
        items: events,
        itemsPerPage: 8,
    });

    const indivPagination = usePagination<IndividualResponse>({
        items: individualResponses,
        itemsPerPage: 8,
    });

    const activePagination = activeTab === "forms" ? formPagination : indivPagination;
    const totalItems = activeTab === "forms" ? events.length : individualResponses.length;

    useEffect(() => {
        if (selectedEventId) {
            indivPagination.setCurrentPage(1);
            setexpandedIndivId(null);
        }
    }, [selectedEventId]);

    const [toastConfig, setToastConfig] = useState({
        isOpen: false,
        title: "",
        description: "",
        variant: "success" as ToastVariant,
    });
    const { mutateAsync: updateFeedbackForm } = useUpdateFeedbackForm();
    const { mutate: updateStatus, isPending } = useUpdateFormStatus();
    const [isDelaying, setIsDelaying] = useState<number | null>(null);

    const isCardUpdating = (eventId: number) => isPending || isDelaying === eventId;
    const handleStatusToggle = (eventId: number, title: string, isActive: boolean) => {
        setIsDelaying(eventId);

        updateStatus(
            { eventId, isActive },
            {
                onSuccess: () => {
                    setToastConfig({
                        isOpen: true,
                        title: "Form Updated",
                        description: `The feedback form for ${title} is now ${isActive ? "active" : "inactive"}.`,
                        variant: "success",
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
                        variant: "error",
                    });
                    setIsDelaying(null);
                },
            },
        );
    };

    const router = useRouter();
    const searchParams = useSearchParams();
    const targetEventId = searchParams.get("eventId");

    const [editorConfig, setEditorConfig] = useState<{
        isOpen: boolean;
        mode: "new" | "edit" | "preview";
        initialData: FormEditorValues | null;
        eventId: number | null;
        eventTitle: string;
    }>({
        isOpen: false,
        mode: "preview",
        initialData: null,
        eventId: null,
        eventTitle: "",
    });

    const handleOpenEditor = (mode: "new" | "edit" | "preview", event?: FeedbackEvent) => {
        setEditorConfig({
            isOpen: true,
            mode,
            initialData: event?.feedbackForm || null,
            eventId: event?.id || null,
            eventTitle: event?.title || "",
        });
    };

    const handleSaveForm = async (data: FormEditorValues, isDirty: boolean) => {
        if (!isDirty) {
            setToastConfig({
                isOpen: true,
                title: "Action Failed",
                description: "No changes detected to save.",
                variant: "warning",
            });
            return;
        }

        if (!editorConfig.eventId) {
            setToastConfig({
                isOpen: true,
                title: "Error",
                description: "No event selected to update.",
                variant: "error",
            });
            return;
        }

        try {
            await updateFeedbackForm({
                eventId: editorConfig.eventId,
                formData: data,
            });

            setEditorConfig((prev) => ({ ...prev, isOpen: false }));

            setToastConfig({
                isOpen: true,
                title: "Form Saved",
                description: `The feedback form for ${editorConfig.eventTitle} has been updated successfully.`,
                variant: "success",
            });
        } catch (error: unknown) {
            setToastConfig({
                isOpen: true,
                title: "Save Failed",
                description: "There was an error saving the form.",
                variant: "error",
            });
        }
    };

    useEffect(() => {
        if (targetEventId && events) {
            const targetEvent = events.find((e) => e.id === Number(targetEventId));

            if (targetEvent) {
                setEditorConfig({
                    isOpen: true,
                    mode: "new",
                    initialData: null,
                    eventId: targetEvent.id,
                    eventTitle: targetEvent.title,
                });

                const newRelativePathQuery = window.location.pathname;
                router.replace(newRelativePathQuery, { scroll: false });
            }
        }
    }, [targetEventId, events, router]);

    return (
        <div className="flex relative h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Dialog open={editorConfig.isOpen} onOpenChange={(open) => setEditorConfig((prev) => ({ ...prev, isOpen: open }))}>
                <DialogContent className="!max-w-[96vw] w-[90vw] !h-[90vh] p-0 overflow-hidden border-none bg-white shadow-2xl z-[100] outline-none">
                    <VisuallyHidden.Root>
                        <DialogTitle>
                            {editorConfig.mode === "new"
                                ? "Create New Feedback Form"
                                : editorConfig.mode === "edit"
                                  ? "Edit Feedback Form"
                                  : "Preview Feedback Form"}
                        </DialogTitle>
                        <DialogDescription>Interface for building and managing event feedback questions.</DialogDescription>
                    </VisuallyHidden.Root>

                    <FeedbackFormEditor
                        initialData={editorConfig.initialData}
                        readOnly={editorConfig.mode === "preview"}
                        onSave={handleSaveForm}
                        onClose={() => setEditorConfig((prev) => ({ ...prev, isOpen: false }))}
                    />
                </DialogContent>
            </Dialog>

            <NotificationToast
                duration={2000}
                {...toastConfig}
                onClose={() => setToastConfig((prev) => ({ ...prev, isOpen: false }))}
            />
            <Header />
            <main className="relative flex-1 flex flex-col px-10 pt-6 max-w-[1600px] mx-auto w-full z-40 overflow-hidden">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Feedback Forms</h1>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">
                            Create and manage your feedback and responses
                        </p>
                    </div>
                </div>

                <div className="flex w-full gap-3 mt-8 relative">
                    <TabButton
                        active={activeTab === "forms"}
                        label="Feedback Forms"
                        icon="/svgs/feedbacks-form-icon.svg"
                        onClick={() => setActiveTab("forms")}
                    />
                    <TabButton
                        active={activeTab === "individual"}
                        label="Individual Responses"
                        icon="/svgs/feedbacks-indiv-icon.svg"
                        onClick={() => setActiveTab("individual")}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-2">
                    {activeTab === "individual" && (
                        <div className="my-2">
                            <Select onValueChange={setSelectedEventId} value={selectedEventId}>
                                <SelectTrigger className="w-full md:w-64 h-12 rounded-sm border-2 text-lg border-black bg-white font-display font-semibold text-black  focus:ring-0 cursor-pointer">
                                    <SelectValue placeholder="Select Specific Event" />
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
                        </div>
                    )}
                </div>

                <div className="space-y-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#7B55A3] scrollbar-track-transparent">
                    <div className="mt-4"></div>

                    {searchQuery.trim() !== "" &&
                        activePagination.currentItems.length === 0 &&
                        (!showEventSkeleton || !showIndivSkeleton) && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <h2 className="text-2xl font-bold text-[#261A36] font-display">
                                    {activeTab === "forms"
                                        ? `No event${events.length === 1 ? "" : "s"} found`
                                        : `No response${individualResponses.length === 1 ? "" : "s"} found`}
                                </h2>
                                <p className="text-[#676767] mt-2">
                                    We couldn&apos;t find anything matching &quot;{searchQuery}&quot;
                                </p>
                            </div>
                        )}

                    {searchQuery.trim() === "" &&
                        activePagination.currentItems.length === 0 &&
                        (!showEventSkeleton || !showIndivSkeleton) && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <h2 className="text-2xl font-bold text-[#261A36] font-display">
                                    {activeTab === "forms" ? "No events yet" : "No responses yet"}
                                </h2>
                                <p className="text-[#676767] mt-2">
                                    Get started by {activeTab === "forms" ? "creating" : "sharing"} your first event!
                                </p>
                            </div>
                        )}
                    {activeTab === "forms" ? (
                        <>
                            {(activePagination.currentItems as FeedbackEvent[]).map((event) => (
                                <Skeleton
                                    key={event.id}
                                    initialBones={_my_feedback as unknown as ResponsiveBones}
                                    animate="shimmer"
                                    name={`my-feedback-item-${event.id}`}
                                    loading={showEventSkeleton}
                                    className={cn(
                                        showEventSkeleton &&
                                            "h-[220px] rounded-[14px] bg-white/40 px-6 py-5 shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all",
                                    )}
                                    color="#574272"
                                    boneClass="opacity-40"
                                >
                                    <FeedbackSummaryCard
                                        key={event.id}
                                        {...event}
                                        onStatusToggle={handleStatusToggle}
                                        isUpdating={isCardUpdating(event.id)}
                                        isExpanded={expandedEventId === event.id}
                                        onExpand={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
                                        onPreview={() => handleOpenEditor("preview", event)}
                                        onEdit={() => handleOpenEditor("edit", event)}
                                        onNew={() => handleOpenEditor("new", event)}
                                    />
                                </Skeleton>
                            ))}
                        </>
                    ) : (
                        <>
                            {(activePagination.currentItems as IndividualResponse[]).map((indiv) => {
                                return (
                                    <Skeleton
                                        key={indiv.id}
                                        initialBones={_my_individual_feedback as unknown as ResponsiveBones}
                                        animate="shimmer"
                                        name={`my-individual-feedback-item-${indiv.id}`}
                                        loading={showIndivSkeleton}
                                        className={cn(
                                            showIndivSkeleton &&
                                                "rounded-[14px] bg-white/40 px-6 py-5 shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all",
                                        )}
                                        color="#574272"
                                        boneClass="opacity-40"
                                    >
                                        <IndividualSummaryCard
                                            key={indiv.id}
                                            {...indiv}
                                            isExpanded={expandedIndivId === indiv.id}
                                            onExpand={() => setexpandedIndivId(expandedIndivId === indiv.id ? null : indiv.id)}
                                        />
                                    </Skeleton>
                                );
                            })}
                        </>
                    )}
                    <div className="mb-8"></div>
                </div>
            </main>

            {totalItems > 8 && (
                <PaginationControls
                    currentPage={activePagination.currentPage}
                    totalPages={activePagination.totalPages}
                    visiblePages={activePagination.visiblePages}
                    paginationLabel={activePagination.paginationLabel + (activeTab === "forms" ? " Events" : " Responses")}
                    onPageChange={activePagination.setCurrentPage}
                    nextPage={activePagination.nextPage}
                    prevPage={activePagination.prevPage}
                    hasPrevPage={activePagination.hasPrevPage}
                    hasNextPage={activePagination.hasNextPage}
                    totalItems={totalItems}
                />
            )}

            <BackgroundBubbles isEventsOrFeedbackPage={true} />
        </div>
    );
}
