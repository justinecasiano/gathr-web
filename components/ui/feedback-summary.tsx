import _my_reports_summary_question from "@/bones/my-reports-summary-question.bones.json";
import _my_reports_summary_respondents from "@/bones/my-reports-summary-respondents.bones.json";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { renderRadioAnalytics, renderSliderAnalytics, renderTextAnalytics } from "@/components/ui/feedback-expansion";
import { useEventAnalytics } from "@/hooks/use-event-analytics";
import { useSkeleton } from "@/hooks/use-skeleton";
import { cn } from "@/lib/utils";
import { EventAnalytics } from "@/types/event-analytics";
import { ResponsiveBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import Image from "next/image";

const MOCK_EVENT_ANALYTICS: EventAnalytics = {
    id: 101,
    responseStatusSummary: {
        answered: 233,
        noResponse: 12,
        absent: 5,
    },
    questions: [
        {
            questionId: "q1",
            questionText:
                "What are the things you observed during the event? asdasd ad asd ads sad asd sada sdasdasdasdasd asdasdasdasdas asdasdasdas asdasdadasd asdasdasdasd asdasd asdasdas",
            type: "checkbox",
            totalResponses: 233,
            choiceData: [
                {
                    optionId: "o1",
                    optionLabel:
                        "The Speakers are too informative asdasd ad asd ads sad asd sada sdasdasdasdasd asdasdasdasdas asdasdasdas asdasdadasd asdasdasdasd asdasd asdasdas",
                    count: 81,
                    percentage: 35,
                },
                { optionId: "o2", optionLabel: "The Venue is well-ventilated", count: 93, percentage: 40 },
                { optionId: "o3", optionLabel: "Technical issues were frequent", count: 58, percentage: 25 },
            ],
        },
        {
            questionId: "q2",
            questionText: "How satisfied are you with the event organization?",
            type: "slider",
            totalResponses: 233,
            averageRating: 3.5, // Calculated: (weighted sum / total responses)
            sliderData: [
                { ratingLabel: "Very Unsatisfied", ratingValue: 1, count: 35 },
                { ratingLabel: "Unsatisfied", ratingValue: 2, count: 73 },
                { ratingLabel: "Neutral", ratingValue: 3, count: 27 },
                { ratingLabel: "Satisfied", ratingValue: 4, count: 65 },
                { ratingLabel: "Very Satisfied", ratingValue: 5, count: 33 },
            ],
        },
        {
            questionId: "q3",
            questionText: "Which part of the event did you prefer?",
            type: "radio",
            totalResponses: 233,
            choiceData: [
                { optionId: "r1", optionLabel: "Morning Workshop", count: 193, percentage: 83 },
                { optionId: "r2", optionLabel: "Afternoon Keynote", count: 40, percentage: 17 },
            ],
        },
        {
            questionId: "q4",
            questionText: "Any additional suggestions for improvement?",
            type: "text_input",
            totalResponses: 233,
            textAnswers: [
                "More hands-on sessions please.",
                "Better seating arrangements.",
                "The food was great but ran out early.",
                "Loved the networking mixer at the end!",
                "The registration process was smooth, but the air conditioning was too cold.",
                "Provide digital copies of the slides next time.",
            ],
        },
    ],
};

const BLANK_EVENT_ANALYTICS: EventAnalytics = {
    id: 0,
    responseStatusSummary: {
        answered: 0,
        noResponse: 0,
        absent: 0,
    },
    questions: [
        {
            questionId: "mandatory-rating",
            questionText: "How would you rate your overall experience today? (1-Very Unsatisfied to 5-Very Satisfied)",
            type: "slider",
            totalResponses: 0,
            averageRating: 0,
            sliderData: [
                { ratingLabel: "Very Unsatisfied", ratingValue: 1, count: 0 },
                { ratingLabel: "Unsatisfied", ratingValue: 2, count: 0 },
                { ratingLabel: "Neutral", ratingValue: 3, count: 0 },
                { ratingLabel: "Satisfied", ratingValue: 4, count: 0 },
                { ratingLabel: "Very Satisfied", ratingValue: 5, count: 0 },
            ],
        },
        {
            questionId: "mandatory-comment",
            questionText: "Please share any additional feedback or suggestions you have for us.",
            type: "text_input",
            totalResponses: 0,
            textAnswers: [],
        },
    ],
};

export function FeedbackSummary({ eventId }: { eventId: number }) {
    const { data: analytics, isLoading: isEventAnalyticsLoading } = useEventAnalytics(eventId);
    const showSkeleton = useSkeleton(isEventAnalyticsLoading, 400);

    const data = analytics ?? BLANK_EVENT_ANALYTICS;

    return (
        <Card className="border-2 border-[#5C5C5C] shadow-[12px_12px_0px_0px_rgba(87,66,114,1)] rounded-2xl p-6 print:block print:shadow-none print:border-slate-300 print:overflow-visible print:mb-8">
            <CardHeader className="flex flex-row items-center gap-3 px-0 pt-0">
                <Image src="/svgs/event-status-icon.svg" width={25} height={25} alt="Icon" />
                <CardTitle className="text-xl font-bold font-display text-[#261A36]">Feedback Summary</CardTitle>
            </CardHeader>

            <div className="relative bg-gradient-to-b from-[#6C41A3] to-[#473163] rounded-[20px] py-6 px-8 text-white flex justify-between items-center print:break-inside-avoid">
                <div>
                    <h4 className="text-xl font-bold font-display mb-2">
                        Summary of Feedback
                        <br />
                        for this event
                    </h4>
                    <Skeleton
                        initialBones={_my_reports_summary_respondents as unknown as ResponsiveBones}
                        animate="shimmer"
                        name="my-reports-summary-respondents"
                        loading={showSkeleton}
                        color="#574272"
                        boneClass="opacity-40"
                    >
                        <p className="text-sm font-heading text-white flex items-center gap-2">
                            <Image src="/svgs/reports-feedback-summary-icon.svg" width={24} height={24} alt="Icon" />
                            Total Respondents: 234
                        </p>
                    </Skeleton>
                </div>
                <div className="absolute -top-6 right-4">
                    <Image src="/svgs/reports-feedback-summary-art.svg" width={160} height={120} alt="Icon" />
                </div>
            </div>

            <p className="text-sm text-black font-heading font-normal">
                These are the feedbacks of this survey, helping the host to improve their services for everyone.
            </p>

            <div className="space-y-6 min-h-[470px] max-h-[470px] overflow-y-auto print:min-h-none print:max-h-none print:overflow-visible print:block">
                {data.questions.map((q, i) => (
                    <Skeleton
                        key={i}
                        initialBones={_my_reports_summary_question as unknown as ResponsiveBones}
                        animate="shimmer"
                        name={`my-reports-summary-question-${i}`}
                        loading={showSkeleton}
                        className={cn(
                            showSkeleton &&
                                "p-5 rounded-[14px] border-3 border-[#7B55A3] bg-white shadow-sm relative overflow-hidden break-inside-avoid",
                        )}
                        color="#574272"
                        boneClass="opacity-40"
                    >
                        <div
                            key={q.questionId}
                            className="p-5 rounded-[14px] border-3 border-[#7B55A3] bg-white shadow-sm relative overflow-hidden print:break-inside-avoid print:block"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-base font-bold  font-heading text-[#3C2457] mb-3">
                                        Question {i + 1} / {data.questions.length}
                                    </p>
                                    <h3 className="text-xl font-bold font-heading text-black whitespace-normal break-words">
                                        {q.questionText}
                                    </h3>
                                </div>
                            </div>

                            {q.type === "checkbox" && renderRadioAnalytics(q.choiceData || [], true)}
                            {q.type === "slider" && renderSliderAnalytics(q.sliderData || [], false)}
                            {q.type === "radio" && renderRadioAnalytics(q.choiceData || [], true)}
                            {q.type === "text_input" && renderTextAnalytics(q.textAnswers || [])}
                        </div>
                    </Skeleton>
                ))}
            </div>
        </Card>
    );
}
