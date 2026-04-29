"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { IndividualResponse } from "@/types/base-event";
import { FeedbackExpansion } from "./feedback-expansion";

interface ExtendedIndividualSummary extends IndividualResponse {
    isExpanded: boolean;
    onExpand: () => void;
}

export function IndividualSummaryCard({
    id,
    fullName,
    eventId,
    eventLocation,
    isExpanded,
    hasFeedback,
    onExpand,
}: ExtendedIndividualSummary) {
    return (
        <div className="rounded-[14px] bg-white px-6 py-5 shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all">
            <div className="flex items-start gap-6">
                <div className={cn("relative h-25 w-25 shrink-0 overflow-hidden")}>
                    <Image src="/svgs/feedbacks-indiv-response-icon.svg" alt="Avatar" fill />
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                            <h3 className="text-2xl font-heading font-bold text-black truncate max-w-[300px] lg:max-w-[650px] shrink-0">
                                {fullName}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-3 font-heading font-normal text-black">
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-location.svg" width="15" height="15" alt="Icon" />
                            <span className="text-xl truncate max-w-[700px] inline-block align-bottom">{eventLocation}</span>
                        </div>
                    </div>
                </div>
            </div>

            {hasFeedback && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onExpand();
                    }}
                    className="w-full pt-4 border-t-2 border-[#5C5C5C]/10 flex items-center justify-between group cursor-pointer"
                >
                    <div className="flex items-center gap-4 text-[#261A36] font-bold font-heading uppercase tracking-wider text-lg">
                        <Image src="/svgs/feedbacks-summary-icon.svg" width="24" height="24" alt="Icon" /> View Feedback
                    </div>
                    <ChevronDown className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
                </button>
            )}

            {isExpanded && <FeedbackExpansion eventId={eventId} />}
        </div>
    );
}
