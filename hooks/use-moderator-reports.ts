import { supabase } from "@/lib/supabase/supabase";
import { getEventStatus } from "@/lib/utils";
import { BaseEvent } from "@/types/base-event";
import { FormSubmission } from "@/types/feedback";
import { ParticipantStatus, ParticipantType, ResponseStatus } from "@/types/participant";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

interface RawParticipantData {
    status: ParticipantStatus;
    participant_type: ParticipantType;
    response_status: ResponseStatus;
    feedback_submission: FormSubmission | null;
}

export interface ModeratorReportEvent extends BaseEvent {
    creator: User;
    participants: RawParticipantData[] | any;
}

export const useModeratorReports = (dateRange?: DateRange) => {
    return useQuery({
        queryKey: ["reports", "moderator", dateRange?.from, dateRange?.to],
        queryFn: async (): Promise<ModeratorReportEvent[]> => {
            let query = supabase
                .from("events")
                .select(
                    `
                    *,
                    creator:users!events_created_by_fkey (*),
                    participants:participants(
                        status, 
                        participant_type, 
                        response_status, 
                        feedback_submission
                    )
                `,
                )
                .eq("is_archive", false);

            if (dateRange?.from) {
                query = query.gte("start_time", dateRange.from.toISOString());
            }

            const { data, error } = await query.order("start_time", { ascending: false });

            if (error) throw error;

            const events = data as (BaseEvent & {
                creator: User;
                participants: RawParticipantData[];
            })[];

            return (data as any[]).map((event): ModeratorReportEvent => {
                const rawParticipants = event.participants || [];

                const attendeeCount = rawParticipants.filter(
                    (p: RawParticipantData) =>
                        p.participant_type === "ATTENDEE" && ["CHECKED_IN", "PRESENT"].includes(p.status),
                ).length;

                const responseCount = rawParticipants.filter(
                    (p: RawParticipantData) =>
                        p.participant_type === "ATTENDEE" && p.response_status === "ANSWERED" && p.feedback_submission !== null,
                ).length;

                return {
                    ...event,
                    participants: [{ count: attendeeCount }],
                    response_count: [{ count: responseCount }],
                    event_status: getEventStatus(event.start_time, event.end_time),
                };
            });
        },
    });
};
