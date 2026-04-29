import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabase";
import { Participant } from "@/types/participant";

export interface ParticipantWithUsers extends Participant {
    users: {
        first_name: string | null;
        last_name: string | null;
        display_name: string | null;
        avatar_url: string | null;
        email: string | null;
    } | null;
}

export function useEventParticipants(eventId: number) {
    return useQuery({
        queryKey: ["event-participants", eventId],
        queryFn: async (): Promise<ParticipantWithUsers[]> => {
            if (!eventId) return [];

            const { data, error } = await supabase
                .from("participants")
                .select<string, ParticipantWithUsers>(
                    `
                    *,
                    users (
                        first_name,
                        last_name,
                        display_name,
                        avatar_url,
                        email
                    )
                `,
                )
                .eq("event_id", eventId)
                .eq("participant_type", "ATTENDEE")
                .eq("response_status", "ANSWERED")
                .order("feedback_submitted_at", { ascending: false });

            if (error) {
                console.error("Error fetching participants:", error);
                throw error;
            }

            return data ?? [];
        },
        enabled: !!eventId,
    });
}
