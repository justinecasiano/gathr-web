import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase/supabase";
import {DateRange} from "react-day-picker";
import {BaseEvent} from "@/types/base-event";
import {FormEditorValues} from "@/types/feedback";
import {getEventStatus} from "@/lib/utils";

interface ParticipantRow {
    status: string;
    participant_type: string;
    response_status: string;
    rating: number | null;
}

interface EventResponse extends Omit<BaseEvent, 'participants' | 'present_count' | 'response_count' | 'avg_rating' | 'event_status' | 'has_feedback_form' | 'question_count'> {
    participants: ParticipantRow[];
}

export const useOrganizerEvents = (dateRange?: DateRange) => {
    return useQuery({
        queryKey: ['events', 'organizer', 'mine', dateRange?.from, dateRange?.to],
        queryFn: async (): Promise<BaseEvent[]> => {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user) throw new Error("Unauthorized");

            let query = supabase
                .from('events')
                .select(`
                    *,
                    creator:users!events_created_by_fkey (*),
                    participants:participants(
                        status, 
                        participant_type, 
                        response_status, 
                        rating
                    )
                `)
                .eq('created_by', user.id)
                .eq('is_archive', false);

            if (dateRange?.from) {
                query = query.gte('start_time', dateRange.from.toISOString());
            }
            if (dateRange?.to) {
                query = query.lte('start_time', dateRange.to.toISOString());
            }

            const {data, error} = await query.order('start_time', {ascending: true});

            if (error) throw error;

            return (data as EventResponse[]).map((event): BaseEvent => {
                const feedbackForm = event.feedback_form as FormEditorValues | null;
                const rawParticipants = event.participants || [];

                const registeredCount = rawParticipants.filter((p) =>
                    ['REGISTERED', 'CHECKED_IN', 'PRESENT'].includes(p.status) &&
                    p.participant_type === 'ATTENDEE'
                ).length;

                const presentCount = rawParticipants.filter((p) =>
                    ['CHECKED_IN', 'PRESENT'].includes(p.status) &&
                    p.participant_type === 'ATTENDEE'
                ).length;

                const respondedParticipants = rawParticipants.filter((p) =>
                    p.response_status === 'ANSWERED' &&
                    p.participant_type === 'ATTENDEE'
                );

                const avgRating = respondedParticipants.length > 0
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
