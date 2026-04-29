import {useMutation, useQueryClient} from '@tanstack/react-query';
import {FormEditorValues} from '@/types/feedback';
import {supabase} from "@/lib/supabase/supabase";

interface UpdateFeedbackFormPayload {
    eventId: number;
    formData: FormEditorValues;
}

export function useUpdateFeedbackForm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({eventId, formData}: UpdateFeedbackFormPayload) => {
            const {data, error} = await supabase
                .from('events')
                .update({
                    feedback_form: formData,
                    form_title: formData.title,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', eventId)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['event-analytics', variables.eventId]
            });

            queryClient.invalidateQueries({
                queryKey: ['events', 'organizer', 'mine']
            });
        },
    });
}