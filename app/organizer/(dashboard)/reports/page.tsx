"use client";

import { AttendanceSummary } from "@/components/ui/attendance-summary";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";
import { FeedbackSummary } from "@/components/ui/feedback-summary";
import { Header } from "@/components/ui/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stats } from "@/components/ui/stats";
import { useEventAnalytics } from "@/hooks/use-event-analytics";
import { useEventParticipantReport } from "@/hooks/use-event-participant-report";
import { useOrganizerEvents } from "@/hooks/use-organizer-events";
import { generateOrganizerDashboardAnalyticsForReports } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

export default function ReportsPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [selectedEventId, setSelectedEventId] = useState<string | undefined>(() => {
        if (typeof window !== "undefined") return localStorage.getItem("reports_selected_event") || undefined;
        return undefined;
    });

    useEffect(() => {
        if (selectedEventId) localStorage.setItem("reports_selected_event", selectedEventId);
    }, [selectedEventId]);

    const { data: rawEvents, isLoading: isEventsLoading } = useOrganizerEvents();
    const events = useMemo(() => {
        if (!rawEvents) return [];
        const allEvents = rawEvents
            .filter((event) => event.status !== "REJECTED")
            .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        return allEvents;
    }, [rawEvents]);

    const analytics = useMemo(() => {
        if (!rawEvents) return null;
        return generateOrganizerDashboardAnalyticsForReports(rawEvents, Number(selectedEventId));
    }, [rawEvents, selectedEventId]);

    const stats = analytics?.dashboardStats ?? [];
    const comparisonLabel = analytics?.comparisonLabel ?? "vs. latest event";

    const reportRef = useRef<HTMLDivElement>(null);
    const currentEvent = useMemo(() => {
        return events.find((e) => e.id.toString() === selectedEventId);
    }, [events, selectedEventId]);

    const documentTitle = useMemo(() => {
        if (!currentEvent) return "Event_Report";
        const datePart = format(new Date(currentEvent.start_time), "MMM_d_yyyy");
        return `Report_${currentEvent.title.replace(/\s+/g, "_")}_${datePart}`;
    }, [currentEvent]);

    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: documentTitle,
    });

    const { data: reportData } = useEventParticipantReport(Number(selectedEventId));
    const { data: analyticsData } = useEventAnalytics(Number(selectedEventId));
    const handleExportCSV = () => {
        if (!reportData?.participants || !analyticsData?.questions) {
            alert("Report data is still loading or unavailable.");
            return;
        }

        const rows = [
            ["EVENT REPORT"],
            ["Event Title", currentEvent?.title || "N/A"],
            ["Export Date", format(new Date(), "MMM. d, yyyy - h:mm b")],
            [""],
            ["DASHBOARD KEY PERFORMANCE INDICATORS"],
            ["Metric", "Value", "Trend"],
            ...stats.map((s) => [s.label, s.value, s.trend]),
            [""],
            ["ATTENDANCE SUMMARY"],
            ["Status", "Total Count"],
            ["Present", reportData.stats.present],
            ["Cancelled", reportData.stats.cancelled],
            ["Absent", reportData.stats.absent],
            [""],
            ["PARTICIPANT LIST"],
            ["Name", "Check-in Date", "Status"],
            ...reportData.participants.map((p) => [p.name, p.date, p.status]),
            [""],
            ["FEEDBACK & SURVEY RESPONSES SUMMARY"],
            ["Question", "Type", "Option/Answer", "Response Count/Value"],
        ];

        analyticsData.questions.forEach((q, idx) => {
            const questionNum = `Q${idx + 1}: ${q.questionText}`;

            if (q.type === "radio" || q.type === "checkbox") {
                q.choiceData?.forEach((choice) => {
                    rows.push([questionNum, q.type, choice.optionLabel, choice.count]);
                });
            } else if (q.type === "slider") {
                q.sliderData?.forEach((item) => {
                    rows.push([questionNum, "slider", `Rating: ${item.ratingValue}`, item.count]);
                });
            } else if (q.type === "text_input") {
                q.textAnswers?.forEach((answer) => {
                    rows.push([questionNum, "text", "Response", answer]);
                });
            }
            rows.push([""]);
        });

        const csvString = rows
            .map((row) =>
                row
                    .map((value) => {
                        const str = String(value ?? "");
                        return `"${str.replace(/"/g, '""')}"`;
                    })
                    .join(","),
            )
            .join("\n");

        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${documentTitle}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!mounted) return null;

    return (
        <div className="flex relative min-h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Header />
            <main ref={reportRef} className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full z-40">
                <div className="flex w-full items-start justify-between">
                    <div className="flex flex-col w-full">
                        <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-6">
                                <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Reports</h1>
                                <div className="print:hidden">
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
                                <div className="hidden print:block">
                                    <span className="text-2xl font-bold font-display text-black border-b-2 border-black pb-1">
                                        Event: {events.find((e) => e.id.toString() === selectedEventId)?.title || "All Events"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 print:hidden">
                                <button
                                    onClick={() => handlePrint()}
                                    className="flex items-center gap-2 bg-[#F6835E] hover:bg-[#F6835E]/80 border-2 border-black px-10 py-1 rounded-md transition-all font-display font-semibold text-white text-lg cursor-pointer"
                                >
                                    <Image src="/svgs/export-csv-icon.svg" alt="Card Icon" width={24} height={24} />
                                    Print
                                </button>
                                <button
                                    onClick={() => handleExportCSV()}
                                    className="flex items-center gap-2 bg-[#CADDC2] hover:bg-[#CADDC2]/80 border-2 border-black px-5 py-1 rounded-md transition-all font-display font-semibold text-black text-lg cursor-pointer"
                                >
                                    <Image src="/svgs/export-excel-icon.svg" alt="Card Icon" width={24} height={24} />
                                    Export as CSV
                                </button>
                            </div>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">
                            Oversee reports on events, feedback and attendee summary
                        </p>
                    </div>
                </div>

                <Stats data={stats} loading={isEventsLoading} comparisonLabel={comparisonLabel} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px] print:display-block">
                    <AttendanceSummary eventId={Number(selectedEventId)} />
                    <FeedbackSummary eventId={Number(selectedEventId)} />
                </div>
            </main>

            <BackgroundBubbles />
        </div>
    );
}
