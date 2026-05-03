"use client";

import _my_reports_item from "@/bones/my-reports-item.bones.json";
import { BackgroundBubbles } from "@/components/ui/background-bubbles";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Header } from "@/components/ui/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModeratorReportEvent, useModeratorReports } from "@/hooks/use-moderator-reports";
import { useSearchStore } from "@/hooks/use-search-store";
import { useSkeleton } from "@/hooks/use-skeleton";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { ResponsiveBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import { format } from "date-fns";
import { addDays } from "date-fns/addDays";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useReactToPrint } from "react-to-print";

const DUMMY_REPORTS: ModeratorReportEvent[] = [
    {
        id: 1098,
        parent_event_id: null,
        title: "Yabangan sa San Juan 2026",
        description: "A competitive showcase of local talent and community spirit.",
        roles: ["STUDENT", "FACULTY"],
        allowed_departments: ["CCIS", "COE"],
        allow_non_umak: false,
        allow_alumni: true,
        background_image: null,
        location: "TBD",
        start_time: "2026-05-04T16:17:22Z",
        end_time: "2026-05-04T18:17:22Z",
        capacity: 100,
        feedback_form: null,
        created_by: "04bcac2a-1072-451f-86a7-eeb330e812a1",
        creator: {
            id: "04bcac2a-1072-451f-86a7-eeb330e812a1",
            display_name: "Angela Mae Cabrera",
            role: "PARTICIPANT",
            school: "UNIVERSITY OF MAKATI",
        } as User,
        status: "APPROVED",
        submitted_at: "2026-05-03T16:17:22Z",
        updated_at: null,
        approved_by: null,
        comment: null,
        approved_at: "2026-05-03T20:00:00Z",
        is_archive: false,
        is_form_active: false,
        form_title: null,
        participants: [{ count: 0 }],
        response_count: [{ count: 0 }],
        event_status: "ONGOING",
        has_feedback_form: false,
        question_count: 0,
        present_count: [{ count: 0 }],
        avg_rating: 0,
    },
    {
        id: 1099,
        parent_event_id: null,
        title: "Tech Innovation Summit",
        description: "Exploring the future of AI in the local industry.",
        roles: ["STUDENT"],
        allowed_departments: ["CCIS"],
        allow_non_umak: true,
        allow_alumni: true,
        background_image: "https://example.com/tech.jpg",
        location: "HPSB Auditorium",
        start_time: "2026-06-10T09:00:00Z",
        end_time: "2026-06-10T16:00:00Z",
        capacity: 250,
        feedback_form: { title: "Feedback", questions: [] },
        created_by: "user-2",
        creator: {
            id: "user-2",
            display_name: "John Doe",
            role: "MODERATOR",
            school: "UNIVERSITY OF MAKATI",
        } as User,
        status: "PENDING",
        submitted_at: "2026-05-01T10:00:00Z",
        updated_at: null,
        approved_by: null,
        comment: "Waiting for venue confirmation.",
        approved_at: null,
        is_archive: false,
        is_form_active: true,
        form_title: "Tech Summit Feedback",
        participants: [{ count: 120 }],
        response_count: [{ count: 0 }],
        event_status: "UPCOMING",
        has_feedback_form: true,
        question_count: 10,
        present_count: [{ count: 0 }],
        avg_rating: 0,
    },
    {
        id: 1100,
        parent_event_id: null,
        title: "Foundation Day Concert",
        description: "Celebrating UMak's founding anniversary with live music.",
        roles: null,
        allowed_departments: null,
        allow_non_umak: false,
        allow_alumni: true,
        background_image: null,
        location: "UMak Track and Field",
        start_time: "2026-04-15T18:00:00Z",
        end_time: "2026-04-15T23:00:00Z",
        capacity: 1000,
        feedback_form: null,
        created_by: "user-3",
        creator: {
            id: "user-3",
            display_name: "Admin Office",
            role: "MODERATOR",
            school: "UNIVERSITY OF MAKATI",
        } as User,
        status: "APPROVED",
        submitted_at: "2026-04-01T08:00:00Z",
        updated_at: "2026-04-05T09:00:00Z",
        approved_by: "admin-1",
        comment: "Approved for full capacity.",
        approved_at: "2026-04-05T09:00:00Z",
        is_archive: false,
        is_form_active: false,
        form_title: null,
        participants: [{ count: 950 }],
        response_count: [{ count: 400 }],
        event_status: "ENDED",
        has_feedback_form: true,
        question_count: 5,
        present_count: [{ count: 900 }],
        avg_rating: 4.8,
    },
    {
        id: 1101,
        parent_event_id: null,
        title: "Career Fair 2026",
        description: "Networking opportunity with over 50 partner companies.",
        roles: ["STUDENT", "ALUMNI"],
        allowed_departments: null,
        allow_non_umak: false,
        allow_alumni: true,
        background_image: null,
        location: "Health and Physical Science Building",
        start_time: "2026-05-20T08:00:00Z",
        end_time: "2026-05-20T17:00:00Z",
        capacity: 500,
        feedback_form: null,
        created_by: "user-4",
        creator: {
            id: "user-4",
            display_name: "Career Center",
            role: "MODERATOR",
            school: "UNIVERSITY OF MAKATI",
        } as User,
        status: "REJECTED",
        submitted_at: "2026-05-01T14:00:00Z",
        updated_at: null,
        approved_by: "admin-1",
        comment: "Venue conflict with Graduation rehearsal.",
        approved_at: null,
        is_archive: false,
        is_form_active: false,
        form_title: null,
        participants: [{ count: 0 }],
        response_count: [{ count: 0 }],
        event_status: "UPCOMING",
        has_feedback_form: false,
        question_count: 0,
        present_count: [{ count: 0 }],
        avg_rating: 0,
    },
    {
        id: 1102,
        parent_event_id: null,
        title: "Photography Workshop",
        description: "Basic to advanced photography techniques with professional mentors.",
        roles: ["STUDENT"],
        allowed_departments: ["CAL"],
        allow_non_umak: true,
        allow_alumni: false,
        background_image: null,
        location: "Studio A",
        start_time: "2026-04-28T13:00:00Z",
        end_time: "2026-04-28T16:00:00Z",
        capacity: 30,
        feedback_form: null,
        created_by: "user-5",
        creator: {
            id: "user-5",
            display_name: "Arts Society",
            role: "MODERATOR",
            school: "UNIVERSITY OF MAKATI",
        } as User,
        status: "APPROVED",
        submitted_at: "2026-04-20T11:00:00Z",
        updated_at: null,
        approved_by: "admin-2",
        comment: null,
        approved_at: "2026-04-22T10:00:00Z",
        is_archive: false,
        is_form_active: true,
        form_title: "Workshop Feedback",
        participants: [{ count: 30 }],
        response_count: [{ count: 28 }],
        event_status: "ENDED",
        has_feedback_form: true,
        question_count: 8,
        present_count: [{ count: 29 }],
        avg_rating: 4.5,
    },
];

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -29),
        to: new Date(),
    });

    const [selectedStatus, setSelectedStatus] = useState("All Statuses");
    const [selectedOrganizer, setSelectedOrganizer] = useState("All Organizers");
    const [minParticipants, setMinParticipants] = useState<number | string>(0);
    const [maxParticipants, setMaxParticipants] = useState<number | string>(200);

    const { data: rawEvents, isLoading } = useModeratorReports(dateRange);
    const showSkeleton = useSkeleton(isLoading, 400);

    const filterOptions = useMemo(() => {
        if (!rawEvents) return { organizers: [], statuses: [] };
        const organizers = Array.from(new Set(rawEvents.map((e) => e.creator?.display_name).filter(Boolean)));
        const statuses = ["APPROVED", "PENDING", "REJECTED"];
        return { organizers, statuses };
    }, [rawEvents]);

    const searchQuery = useSearchStore((state) => state.query);
    const filteredEvents = useMemo(() => {
        if (!rawEvents) return [];

        const lowerQuery = searchQuery.toLowerCase().trim();

        return rawEvents.filter((event) => {
            const attendeeCount = event.participants?.[0]?.count || 0;
            const resCount = event.response_count?.[0]?.count || 0;

            const matchesStatus = selectedStatus === "All Statuses" || event.status === selectedStatus;
            const matchesOrganizer =
                selectedOrganizer === "All Organizers" || event.creator?.display_name === selectedOrganizer;

            const min = minParticipants === "" ? 0 : Number(minParticipants);
            const max = maxParticipants === "" ? Infinity : Number(maxParticipants);
            const matchesCount = attendeeCount >= min && attendeeCount <= max;

            const formattedDate = format(new Date(event.start_time), "MM/dd/yyyy");

            const matchesSearch =
                lowerQuery === "" ||
                [
                    event.title,
                    event.location,
                    event.creator?.display_name || "",
                    event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase(),
                    event.event_status.charAt(0).toUpperCase() + event.event_status.slice(1).toLowerCase(),
                    formattedDate,
                    attendeeCount.toString(),
                    event.capacity.toString(),
                    resCount.toString(),
                ].some((field) => field.toLowerCase().includes(lowerQuery));

            return matchesStatus && matchesOrganizer && matchesCount && matchesSearch;
        });
    }, [rawEvents, selectedStatus, selectedOrganizer, minParticipants, maxParticipants, searchQuery]);

    const reportRef = useRef<HTMLDivElement>(null);

    const documentTitle = useMemo(() => {
        const fromDate = dateRange?.from ? format(dateRange.from, "MMM_d") : "Start";
        const toDate = dateRange?.to ? format(dateRange.to, "MMM_d") : "End";
        return `Moderator_Report_${fromDate}_to_${toDate}`;
    }, [dateRange]);

    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: documentTitle,
        pageStyle: `
      @page { 
        size: landscape; 
        /* This removes the default browser margins and headers/footers */
        margin: 0; 
      }
      @media print {
        body { margin: 0; padding: 0; }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
    });

    const handleExportCSV = () => {
        const headers = [
            "Event Title",
            "Date",
            "Organizer",
            "Location",
            "Approval Status",
            "Event Status",
            "Attendees",
            "Capacity",
            "Feedback Responses",
        ];

        const rows = filteredEvents.map((event) => [
            `"${event.title.replace(/"/g, '""')}"`,
            format(new Date(event.start_time), "MM/dd/yyyy"),
            `"${event.creator?.display_name || "N/A"}"`,
            `"${event.location.replace(/"/g, '""')}"`,
            event.status,
            event.event_status,
            event.participants?.[0]?.count || 0,
            event.capacity,
            event.response_count?.[0]?.count || 0,
        ]);

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", `${documentTitle}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    type EventStatus = "APPROVED" | "REJECTED" | "PENDING";
    const statusColors: Record<EventStatus, string> = {
        APPROVED: "bg-[#CADDC2] text-[#184D00] hover:bg-[#CADDC2]",
        REJECTED: "bg-[#FFC7B5] text-[#820006] hover:bg-[#FFC7B5]",
        PENDING: "bg-[#FFD600] text-[#4B3F00] hover:bg-[#FFD600]",
    };

    type ComputedEventStatus = "UPCOMING" | "ONGOING" | "ENDED";
    const computedEventStatusColors: Record<ComputedEventStatus, string> = {
        ONGOING: "bg-[#CADDC2] text-[#184D00] hover:bg-[#CADDC2]",
        ENDED: "bg-[#FFC7B5] text-[#820006] hover:bg-[#FFC7B5]",
        UPCOMING: "bg-[#FFD600] text-[#4B3F00] hover:bg-[#FFD600]",
    };

    return (
        <div className="flex relative min-h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <Header />
            <main
                ref={reportRef}
                className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full z-40 print:p-0 print:m-0 print:max-w-none print:mb-8"
            >
                <div className="hidden print:flex flex-col gap-4 mb-6 w-full border-b-2 border-black pb-4">
                    <h1 className="text-3xl font-black font-display uppercase tracking-tight text-black">
                        Moderator Events Report
                    </h1>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-12 text-sm font-display">
                        <div className="flex gap-2">
                            <span className="font-bold uppercase text-slate-500">Date Range:</span>
                            <span className="font-semibold text-black">
                                {dateRange?.from ? format(dateRange.from, "LLL dd, yyyy") : "Start"}
                                {" — "}
                                {dateRange?.to ? format(dateRange.to, "LLL dd, yyyy") : "End"}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold uppercase text-slate-500">Status:</span>
                            <span className="font-semibold text-black">{selectedStatus}</span>
                        </div>

                        <div className="flex gap-2">
                            <span className="font-bold uppercase text-slate-500">Organizer:</span>
                            <span className="font-semibold text-black">{selectedOrganizer}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold uppercase text-slate-500">Attendee Range:</span>
                            <span className="font-semibold text-black">
                                {minParticipants === "" ? 0 : minParticipants} to{" "}
                                {maxParticipants === "" ? "∞" : maxParticipants}
                            </span>
                        </div>

                        <div className="flex gap-2 col-span-2 mt-2 pt-2 border-t border-slate-100">
                            <span className="font-bold uppercase text-slate-500 text-[10px]">Generated on:</span>
                            <span className="font-medium text-black text-[10px]">
                                {format(new Date(), "MMMM dd, yyyy 'at' hh:mm a")}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex w-full items-start justify-between print:hidden">
                    <div className="flex flex-col w-full">
                        <div className="flex w-full items-center justify-between ">
                            <div className="flex items-center gap-6">
                                <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Reports</h1>
                                <DateRangePicker onDateChange={setDateRange} />
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
                <Card className="border-2 border-[#5C5C5C] shadow-[0px_4px_20px_0px_rgba(238,238,238,0.5)] rounded-[14px] p-6 gap-3 bg-white print:hidden">
                    <div className="flex items-center gap-3 text-[#F6835E]">
                        <Image src="/svgs/average-feedback-icon.svg" width="25" height="25" alt="Icon" />
                        <h2 className="text-lg font-bold font-display text-[#261A36] ">Filter Options</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="space-y-2">
                            <label className="text-lg font-bold font-display text-[#261A36]">Status</label>
                            <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                                <SelectTrigger className="w-full mt-2 md:w-64 h-12 rounded-sm border-2 text-lg border-black bg-white font-display font-semibold text-black  focus:ring-0 cursor-pointer">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                                    {filterOptions.statuses.map((s) => (
                                        <SelectItem
                                            key={s}
                                            value={s}
                                            className="font-display font-medium focus:bg-slate-100 cursor-pointer"
                                        >
                                            {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-lg font-bold font-display text-[#261A36]">Organizer</label>
                            <Select onValueChange={setSelectedOrganizer} value={selectedOrganizer}>
                                <SelectTrigger className="w-full mt-2 md:w-64 h-12 rounded-sm border-2 text-lg border-black bg-white font-display font-semibold text-black  focus:ring-0 cursor-pointer">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Organizers">All Organizers</SelectItem>
                                    {filterOptions.organizers.map((o) => (
                                        <SelectItem
                                            key={o}
                                            value={o ?? ""}
                                            className="font-display font-medium focus:bg-slate-100 cursor-pointer"
                                        >
                                            {o}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-lg font-bold font-display text-[#261A36]">Participant Count</label>
                            <div className="flex items-center gap-3 mt-1">
                                <input
                                    type="number"
                                    value={minParticipants}
                                    onChange={(e) => setMinParticipants(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="border-2 border-black rounded-sm text-base h-10 w-full px-4 font-bold outline-none"
                                />
                                <span className="font-bold">—</span>
                                <input
                                    type="number"
                                    value={maxParticipants}
                                    onChange={(e) => setMaxParticipants(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="border-2 border-black rounded-sm text-base h-10 w-full px-4 font-bold outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-2 border-[#5C5C5C] shadow-[0px_4px_20px_0px_rgba(238,238,238,0.5)] py-1 rounded-[20px] bg-white overflow-hidden">
                    <div className="min-w-[1000px]">
                        <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] border-b-2 border-[#5C5C5C] bg-white">
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm">Event Title</div>
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm">Date</div>
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm">Organizer</div>
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm">Location</div>
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm">Status</div>
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm text-center">Attendees</div>
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm text-center">Capacity</div>
                            <div className="px-6 py-4 font-bold text-[#261A36] font-display text-sm text-center">Feedback</div>
                        </div>

                        <div className="flex flex-col min-h-[500px] max-h-[500px] overflow-y-auto print:min-h-none print:max-h-none print:overflow-visible print:block print:w-full ">
                            {filteredEvents.map((event) => (
                                <Skeleton
                                    key={event.id}
                                    initialBones={_my_reports_item as unknown as ResponsiveBones}
                                    animate="shimmer"
                                    name={`my-reports-item-${event.id}`}
                                    loading={showSkeleton}
                                    className={cn(
                                        showSkeleton && "h-8 border-b border-slate-200 transition-colors hover:bg-[#5C5C5C]/20",
                                    )}
                                    color="#574272"
                                    boneClass="opacity-40"
                                >
                                    <div
                                        key={event.id}
                                        className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.7fr)] items-center border-b border-slate-200 transition-colors hover:bg-[#5C5C5C]/20 print:break-inside-avoid print:mb-8"
                                    >
                                        <div className="px-6 py-4 font-normal font-display text-black break-all">
                                            {event.title}
                                        </div>

                                        <div className="px-6 py-4 font-normal font-display text-black break-all">
                                            {format(new Date(event.start_time), "MM/dd/yyyy")}
                                        </div>

                                        <div className="px-6 py-4 font-normal font-display text-black break-all">
                                            {event.creator?.display_name}
                                        </div>

                                        <div className="px-6 py-4 font-normal font-display text-black break-all">
                                            {event.location}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex flex-col gap-2 items-start justify-start">
                                                <Badge
                                                    className={cn(
                                                        "rounded-full font-bold font-display text-sm px-4 py-1.5 whitespace-nowrap",
                                                        statusColors[event.status as keyof typeof statusColors],
                                                    )}
                                                >
                                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase()}
                                                </Badge>
                                                <Badge
                                                    className={cn(
                                                        "rounded-full font-bold font-display text-sm px-4 py-1.5 whitespace-nowrap",
                                                        computedEventStatusColors[
                                                            event.event_status as keyof typeof computedEventStatusColors
                                                        ],
                                                    )}
                                                >
                                                    {`Event ${event.event_status.charAt(0).toUpperCase() + event.event_status.slice(1).toLowerCase()}`}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 font-normal font-display text-center text-black break-all">
                                            {event.participants?.[0]?.count || 0}
                                        </div>

                                        <div className="px-6 py-4 font-normal font-display text-center text-black break-all">
                                            {event.capacity}
                                        </div>

                                        <div className="px-6 py-4 font-normal font-display text-center text-black break-all">
                                            {event.response_count?.[0]?.count || 0}
                                        </div>
                                    </div>
                                </Skeleton>
                            ))}
                        </div>
                    </div>
                </Card>
            </main>

            <BackgroundBubbles />
        </div>
    );
}
