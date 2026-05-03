import { supabase } from "@/lib/supabase/supabase";
import { IndividualEventAnalytics, IndividualQuestionAnalytics } from "@/types/event-analytics";
import { ChoiceQuestion, FormEditorValues, QuestionResponse } from "@/types/feedback";
import { useQuery } from "@tanstack/react-query";

interface ParticipantJoinResult {
    response_status: string;
    feedback_submission: unknown;
    feedback_submitted_at: string | null;
    events: {
        id: number;
        feedback_form: FormEditorValues | null;
    } | null;
}

export function useIndividualEventAnalytics(eventId: number, userId: string | undefined) {
    return useQuery({
        queryKey: ["individual-analytics", eventId, userId],
        queryFn: async (): Promise<IndividualEventAnalytics> => {
            if (!userId) throw new Error("User ID is required");

            const { data, error } = await supabase
                .from("participants")
                .select<string, ParticipantJoinResult>(
                    `
                    response_status,
                    feedback_submission,
                    feedback_submitted_at,
                    events (
                        id,
                        feedback_form
                    )
                `,
                )
                .eq("event_id", eventId)
                .eq("user_id", userId)
                .single();

            if (error || !data) throw error || new Error("Submission not found");

            if (!data.events) throw new Error("Event configuration not found");

            const submission = (data.feedback_submission as QuestionResponse[]) ?? [];
            const eventData = data.events;
            const formQuestions = eventData.feedback_form?.questions ?? [];

            const questions: IndividualQuestionAnalytics[] = formQuestions.map((q) => {
                const userResponse = submission.find((r) => r.questionId === q.id);
                const answer = userResponse?.answer;

                const base: IndividualQuestionAnalytics = {
                    questionId: q.id,
                    questionText: q.questionText,
                    type: q.type,
                };

                if (q.type === "radio" || q.type === "checkbox") {
                    const choiceQ = q as ChoiceQuestion;
                    base.choiceResults = choiceQ.options.map((opt) => ({
                        optionId: opt.id,
                        optionLabel: opt.label,
                        isSelected: Array.isArray(answer) ? answer.includes(opt.id) : answer === opt.id,
                    }));
                }

                if (q.type === "slider") {
                    const SLIDER_LABELS = ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"];
                    const val = typeof answer === "number" ? answer : Number(answer);
                    base.sliderResult = {
                        ratingValue: val,
                        ratingLabel: SLIDER_LABELS[val - 1] || "No Rating",
                    };
                }

                if (q.type === "text_input") {
                    base.textAnswer = typeof answer === "string" ? answer : "";
                }

                return base;
            });

            return {
                id: eventData.id,
                participantId: userId,
                status: data.response_status as IndividualEventAnalytics["status"],
                submittedAt: data.feedback_submitted_at,
                questions,
            };
        },
        enabled: !!eventId && !!userId,
    });
}
