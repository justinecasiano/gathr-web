import { EventResponse } from "@/hooks/use-organizer-events";
import { supabase } from "@/lib/supabase/supabase";
import { getEventStatus } from "@/lib/utils";
import { BaseEvent } from "@/types/base-event";
import { FormEditorValues } from "@/types/feedback";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

export const useModeratorEvents = (dateRange?: DateRange) => {
    return useQuery({
        queryKey: ["events", "moderator", "all", dateRange?.from, dateRange?.to],
        queryFn: async (): Promise<BaseEvent[]> => {
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
                        rating
                    )
                `,
                )
                .eq("is_archive", false);

            if (dateRange?.from) {
                query = query.gte("start_time", dateRange.from.toISOString());
            }
            if (dateRange?.to) {
                query = query.lte("start_time", dateRange.to.toISOString());
            }

            const { data, error } = await query.order("start_time", { ascending: true });

            if (error) throw error;

            return (data as EventResponse[]).map((event): BaseEvent => {
                const feedbackForm = event.feedback_form as FormEditorValues | null;
                const rawParticipants = event.participants || [];

                const registeredCount = rawParticipants.filter(
                    (p) => ["REGISTERED", "CHECKED_IN", "PRESENT"].includes(p.status) && p.participant_type === "ATTENDEE",
                ).length;

                const presentCount = rawParticipants.filter(
                    (p) => ["CHECKED_IN", "PRESENT"].includes(p.status) && p.participant_type === "ATTENDEE",
                ).length;

                const respondedParticipants = rawParticipants.filter(
                    (p) => p.response_status === "ANSWERED" && p.participant_type === "ATTENDEE",
                );

                const avgRating =
                    respondedParticipants.length > 0
                        ? respondedParticipants.reduce((sum, p) => sum + (p.rating || 0), 0) / respondedParticipants.length
                        : 0;

                return {
                    ...event,
                    participants: [{ count: registeredCount }],
                    present_count: [{ count: presentCount }],
                    response_count: [{ count: respondedParticipants.length }],
                    avg_rating: avgRating,

                    event_status: getEventStatus(event.start_time, event.end_time),
                    has_feedback_form: !!feedbackForm,
                    question_count: feedbackForm?.questions?.length || 0,
                };
            });
        },
        staleTime: 1000 * 60 * 5,
    });
};
