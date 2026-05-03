import {Card, CardHeader, CardTitle} from "./card";
import Image from "next/image";
import {useMemo, useState} from "react";
import {Search, X} from "lucide-react";
import _my_reports_attendance_summary from "@/bones/my-reports-attendance-summary.bones.json";
import _my_reports_responses_summary from "@/bones/my-reports-responses-summary.bones.json";
import {useSkeleton} from "@/hooks/use-skeleton";
import {useEventParticipantReport} from "@/hooks/use-event-participant-report";
import {cn, mapToFeedbackEvent} from "@/lib/utils";
import {Skeleton} from "boneyard-js/react";
import {ResponsiveBones} from "boneyard-js";
import {useEventAnalytics} from "@/hooks/use-event-analytics";
import {ParticipantStatus} from "@/types/participant";

const attendees = [
    {name: "Angela Cabrera asdasda asdasda asdasdas", date: "Oct. 13, 2025 - 12:03 pm", status: "Present"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Absent"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Cancelled"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Absent"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Cancelled"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Absent"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Cancelled"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Absent"},
    {name: "Angela Cabrera", date: "Oct. 13, 2025 - 12:03 pm", status: "Cancelled"},
];

export function AttendanceSummary({eventId}: { eventId: number }) {
    const [searchQuery, setSearchQuery] = useState("");
    const {data, isLoading: isEventParticipantReportLoading} = useEventParticipantReport(eventId);
    const showSkeleton = useSkeleton(isEventParticipantReportLoading, 400);

    const participants = useMemo(() => {
        if (!data?.participants) return [];

        const sortedReports = [...data.participants].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        if (searchQuery.trim() !== "") {
            const lowerQuery = searchQuery.toLowerCase();

            return sortedReports.filter((participant) => {
                const fullName = participant.name.toLowerCase();
                const status = participant.status.toLowerCase();
                const checkInDate = participant.date.toLowerCase();

                return (
                    fullName.includes(lowerQuery) ||
                    status.includes(lowerQuery) ||
                    checkInDate.includes(lowerQuery)
                );
            });
        }

        return sortedReports;
    }, [data, searchQuery]);


    const formatStatus = (status: ParticipantStatus) => {
        return status
            .toLowerCase()
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <Card
            className="border-2 border-[#5C5C5C] shadow-[12px_12px_0px_0px_rgba(87,66,114,1)] rounded-2xl p-6 print:block print:break-inside-avoid print:mb-8">
            <CardHeader className="flex flex-row items-center gap-3 px-0 pt-0">
                <Image src="/svgs/monthly-event-icon.svg" width={25} height={25} alt="Icon"/>
                <CardTitle className="text-xl font-bold font-display text-[#261A36]">
                    Attendance Summary
                </CardTitle>
            </CardHeader>

            <div className="grid grid-cols-3 gap-6">
                <Skeleton
                    initialBones={_my_reports_responses_summary as unknown as ResponsiveBones}
                    animate="shimmer"
                    name={`my-reports-responses-summary`}
                    loading={showSkeleton}
                    className={cn(
                        showSkeleton &&
                        "bg-gradient-to-b from-[#7B55A3] to-[#583181] py-6 px-4 rounded-xl text-center text-white",
                    )}
                    color="#574272"
                    boneClass="opacity-40"
                >
                    <div
                        className="flex flex-col gap-3 bg-gradient-to-b from-[#7B55A3] to-[#583181] py-6 px-4 rounded-xl text-center text-white">
                        <p className="text-4xl text-[#F6F6F6] font-bold font-heading">{data?.stats.present}</p>
                        <p className="text-base opacity-80 text-[#F6F6F6] font-bold font-heading">Present</p>
                    </div>
                </Skeleton>
                <Skeleton
                    initialBones={_my_reports_responses_summary as unknown as ResponsiveBones}
                    animate="shimmer"
                    name={`my-reports-responses-summary`}
                    loading={showSkeleton}
                    className={cn(
                        showSkeleton &&
                        "bg-gradient-to-b from-[#FFBBA6] to-[#F6835E] py-6 px-4 rounded-xl text-center text-white",
                    )}
                    color="#574272"
                    boneClass="opacity-40"
                >
                    <div
                        className="flex flex-col gap-3 bg-gradient-to-b from-[#FFBBA6] to-[#F6835E] py-6 px-4 rounded-xl text-center text-white">
                        <p className="text-4xl text-[#F6F6F6] font-bold font-heading">{data?.stats.cancelled}</p>
                        <p className="text-base opacity-80 text-[#F6F6F6] font-bold font-heading">Cancelled</p>
                    </div>
                </Skeleton>
                <Skeleton
                    initialBones={_my_reports_responses_summary as unknown as ResponsiveBones}
                    animate="shimmer"
                    name={`my-reports-responses-summary`}
                    loading={showSkeleton}
                    className={cn(
                        showSkeleton &&
                        "bg-gradient-to-b from-[#F6835E] to-[#6C0005] py-6 px-4 rounded-xl text-center text-white",
                    )}
                    color="#574272"
                    boneClass="opacity-40"
                >
                    <div
                        className="flex flex-col gap-3 bg-gradient-to-b from-[#F6835E] to-[#6C0005] py-6 px-4 rounded-xl text-center text-white">
                        <p className="text-4xl text-[#F6F6F6] font-bold font-heading">{data?.stats.absent}</p>
                        <p className="text-base opacity-80 text-[#F6F6F6] font-bold font-heading">Absent</p>
                    </div>
                </Skeleton>
            </div>

            <div className="relative ">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
                    <Search size={18} strokeWidth={2.5}/>
                </div>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${data?.stats.total} participants`}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#312245]/0 border border-[#D7D7D7] rounded-[15px] text-base font-heading font-medium text-black outline-none focus:border-[#5C5C5C] focus:ring-1 focus:ring-[#5C5C5C]/20 transition-all "
                />

                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9A9A9] hover:text-black transition-colors"
                    >
                        <X size={18} strokeWidth={2.5}/>
                    </button>
                )}
            </div>

            <div className="flex flex-col h-full bg-white">
                <div
                    className="grid grid-cols-[1fr_2fr_1fr] rounded-[6px] bg-gradient-to-b from-[#9B7CBC] to-[#583181] text-white font-bold font-heading text-base z-10">
                    <div className="pl-6 py-2 text-left">Name</div>
                    <div className="py-2 text-center">Date & Time</div>
                    <div className="pr-6 py-2 text-right">Status</div>
                </div>

                <div
                    className="overflow-y-auto max-h-[450px] scrollbar-thin scrollbar-thumb-slate-300 print:max-h-none print:overflow-visible">
                    {participants.map((a, i) => (
                        <div key={i} className="break-inside-avoid">
                            <Skeleton
                                key={i}
                                initialBones={_my_reports_attendance_summary as unknown as ResponsiveBones}
                                animate="shimmer"
                                name={`my-reports-attendance-summary-${i}`}
                                loading={showSkeleton}
                                className={cn(
                                    showSkeleton &&
                                    "grid grid-cols-[1fr_2fr_1fr] h-3 items-center border hover:bg-[#5C5C5C]/20 transition-colors",
                                )}
                                color="#574272"
                                boneClass="opacity-40"
                            >
                                <div
                                    className="grid grid-cols-[1fr_2fr_1fr] items-center border hover:bg-[#5C5C5C]/20 transition-colors ">
                                    <div
                                        className="pl-6 py-5 font-bold text-sm font-heading text-black text-left truncate">
                                        {a.name}
                                    </div>

                                    <div className="px-4 py-5 text-sm text-black font-heading font-medium text-center">
                                        {a.date}
                                    </div>

                                    <div className={`pr-6 py-5 text-sm text-right font-bold font-heading ${
                                        a.status === "PRESENT" || a.status === "CHECKED_IN" ? 'text-[#9FC090]' :
                                            a.status === "ABSENT" ? 'text-[#820006]' : 'text-[#F36F44]'
                                    }`}>
                                        {formatStatus(a.status)}
                                    </div>
                                </div>
                                <hr className="border-0 h-px bg-black/20 mx-2"/>
                            </Skeleton>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}