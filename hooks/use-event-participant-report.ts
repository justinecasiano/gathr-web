import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase/supabase";
import {ParticipantStatus} from "@/types/participant";
import {format} from "date-fns";
import { ParticipantReportData } from "@/types/event-analytics";

export const useEventParticipantReport = (eventId: number | undefined) => {
    return useQuery({
        queryKey: ["event-report", eventId],
        enabled: !!eventId,
        queryFn: async (): Promise<ParticipantReportData> => {
            const { data, error } = await supabase
                .from("participants")
                .select(`
                    status,
                    check_in,
                    user:users (
                        first_name,
                        last_name
                    )
                `)
                .eq("event_id", eventId)
                .in("status", ["PRESENT", "CHECKED_IN", "CANCELLED", "ABSENT"])
                .order("check_in", { ascending: false });

            if (error) throw error;

            const rawData = data as unknown as {
                status: ParticipantStatus;
                check_in: string | null;
                user: { first_name: string | null; last_name: string | null };
            }[];

            let presentCount = 0;
            let cancelledCount = 0;
            let absentCount = 0;

            const participants = rawData.map((row) => {
                if (row.status === "PRESENT" || row.status === "CHECKED_IN") presentCount++;
                else if (row.status === "CANCELLED") cancelledCount++;
                else if (row.status === "ABSENT") absentCount++;

                const firstName = row.user?.first_name ?? "";
                const lastName = row.user?.last_name ?? "";
                const fullName = `${firstName} ${lastName}`.trim() || "Anonymous User";

                const formattedDate = row.check_in
                    ? format(new Date(row.check_in), "MMM d, yyyy - h:mm") +
                    format(new Date(row.check_in), " b").toLowerCase()
                    : "N/A";

                return {
                    name: fullName,
                    date: formattedDate,
                    status: row.status,
                };
            });

            return {
                participants,
                stats: {
                    present: presentCount,
                    cancelled: cancelledCount,
                    absent: absentCount,
                    total: presentCount + cancelledCount + absentCount,
                },
            };
        },
        staleTime: 1000 * 60 * 5,
    });
};
