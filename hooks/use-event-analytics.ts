import {useQuery} from "@tanstack/react-query";
import {EventAnalytics, QuestionAnalytics, ChoiceSummary, SliderSummary} from "@/types/event-analytics";
import {ChoiceQuestion, FeedbackQuestion, QuestionResponse} from "@/types/feedback";
import {supabase} from "@/lib/supabase/supabase";

export function useEventAnalytics(eventId: number) {
    return useQuery({
        queryKey: ["event-analytics", eventId],
        queryFn: async (): Promise<EventAnalytics> => {
            const {data: event, error: eventError} = await supabase
                .from("events")
                .select(`
                      id,
                      feedback_form,
                      participants (
                        response_status,
                        feedback_submission
                      )
                    `)
                .eq("id", eventId)
                .single();

            if (eventError || !event) throw eventError;

            const participants = event.participants ?? [];
            const form = event.feedback_form;

            const summary = {
                answered: participants.length > 0
                    ? participants.filter(p => p.response_status === 'ANSWERED').length
                    : 0,
                noResponse: participants.length > 0
                    ? participants.filter(p => p.response_status === 'NO_RESPONSE').length
                    : 0,
                absent: participants.length > 0
                    ? participants.filter(p => p.response_status === 'ABSENT').length
                    : 0,
            };

            if (!form || !form.questions || form.questions.length === 0) {
                return {id: event.id, responseStatusSummary: summary, questions: []};
            }

            const questionsAnalytics: QuestionAnalytics[] = (form.questions as FeedbackQuestion[]).map((q) => {
                const answeredParticipants = participants.filter(
                    p => p.response_status === 'ANSWERED' && p.feedback_submission
                );

                const allAnswers = answeredParticipants
                    .map(p => {
                        const submission = p.feedback_submission as unknown as QuestionResponse[];
                        if (!Array.isArray(submission)) return undefined;

                        const resp = submission.find((r) => r.questionId === q.id);
                        return resp?.answer;
                    })
                    .filter((ans): ans is string | string[] | number => ans !== undefined);

                const totalResponses = allAnswers.length;

                const analytics: QuestionAnalytics = {
                    questionId: q.id,
                    questionText: q.questionText,
                    type: q.type,
                    totalResponses,
                };

                if (q.type === 'radio' || q.type === 'checkbox') {
                    const choiceQuestion = q as ChoiceQuestion;

                    analytics.choiceData = (choiceQuestion.options ?? []).map((opt): ChoiceSummary => {
                        const count = totalResponses > 0
                            ? allAnswers.filter(ans => {
                                if (Array.isArray(ans)) {
                                    return ans.includes(opt.id);
                                }
                                return ans === opt.id;
                            }).length
                            : 0;

                        return {
                            optionId: opt.id,
                            optionLabel: opt.label,
                            count,
                            percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0
                        };
                    });
                }

                if (q.type === 'slider') {
                    const SLIDER_LABELS = ["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"];
                    let sum = 0;

                    analytics.sliderData = [1, 2, 3, 4, 5].map((val): SliderSummary => {
                        const count = totalResponses > 0
                            ? allAnswers.filter(ans => Number(ans) === val).length
                            : 0;

                        sum += (val * count);
                        return {
                            ratingLabel: SLIDER_LABELS[val - 1],
                            ratingValue: val,
                            count
                        };
                    });

                    analytics.averageRating = totalResponses > 0 ? Number((sum / totalResponses).toFixed(1)) : 0;
                }

                if (q.type === 'text_input') {
                    analytics.textAnswers = totalResponses > 0
                        ? allAnswers
                            .filter((ans): ans is string => typeof ans === 'string')
                            .map(ans => ans)
                        : [];
                }

                return analytics;
            });

            return {
                id: event.id,
                responseStatusSummary: summary,
                questions: questionsAnalytics,
            };
        },
        enabled: !!eventId,
    });
}
