import { supabase } from "@/lib/supabase/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFormStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventId, isActive }: { eventId: number; isActive: boolean }) => {
            const { data, error } = await supabase
                .from("events")
                .update({
                    is_form_active: isActive,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", eventId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["event-analytics", variables.eventId],
            });

            queryClient.invalidateQueries({
                queryKey: ["events", "organizer", "mine"],
            });
        },
    });
}
