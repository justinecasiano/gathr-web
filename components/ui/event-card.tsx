'use client'

import Image from 'next/image'
import {ChevronRight} from 'lucide-react'
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {SimpleEvent} from "@/types/base-event";
import {useRouter} from 'next/navigation'
import {AnimatePresence, motion} from 'motion/react'
import {FeedbackExpansion} from "@/components/ui/feedback-expansion";

interface ExtendedSimpleEvent extends SimpleEvent {
    isExpanded: boolean;
    onExpand: () => void;
}

export function EventCard({
                              id,
                              title,
                              location,
                              date,
                              organizer,
                              attendees,
                              status,
                              hasFeedback,
                              image,
                              isExpanded,
                              onExpand
                          }: ExtendedSimpleEvent) {

    type EventStatus = 'Approved' | 'Rejected' | 'Pending';
    const statusColors: Record<EventStatus, string> = {
        Approved: "bg-[#CADDC2] text-[#184D00] hover:bg-[#CADDC2]",
        Rejected: "bg-[#FFC7B5] text-[#820006] hover:bg-[#FFC7B5]",
        Pending: "bg-[#FFD600] text-[#4B3F00] hover:bg-[#FFD600]"
    };

    const router = useRouter();
    const handleCreateFeedback = () => {
        router.push(`/organizer/feedback?eventId=${id}`);
    };

    return (
        <div
            className="flex flex-col w-full gap-3 rounded-[14px] bg-white shadow-sm border border-transparent hover:border-[#5C5C5C] transition-all">
            <div
                className="group relative flex w-full flex-col sm:flex-row items-center gap-6 p-6 ">
                <div className={cn(
                    "relative h-40 w-40 shrink-0 overflow-hidden rounded-[15px]",
                    "shadow-[0_6px_10px_0_rgba(0,0,0,0.25)]"
                )}>
                    <Image src={image} alt={title} fill
                           className={cn("transition-all",
                               image.includes('placeholder_small') ? "object-contain" : "object-cover")}
                    />
                </div>

                <div className="flex flex-1 flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-5 flex-wrap">
                        <h3 className="text-2xl font-heading font-bold text-black truncate max-w-[300px] lg:max-w-[500px] shrink-0">{title}</h3>
                        <div className="flex items-center gap-3 min-w-0 shrink-0">
                            <Badge
                                className={cn("rounded-full font-bold font-display text-sm px-6 py-1.5 whitespace-nowrap", statusColors[status as keyof typeof statusColors])}>
                                {status}
                            </Badge>
                            <Badge
                                className={cn("rounded-full  bg-[#CBBDDE] text-[#312245] px-6 py-1.5 font-bold font-display text-sm  whitespace-nowrap",
                                    !hasFeedback && "bg-white border-1 border-[#676767]"
                                )}>
                                {hasFeedback ? 'With Feedback Form' : 'No Feedback Form'}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-3 font-heading font-normal text-black">
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-location.svg" width="15" height="15" alt="Icon"/>
                            <span className="text-xl truncate max-w-[700px] inline-block align-bottom">{location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-date.svg" width="15" height="15" alt="Icon"/>
                            <span className="text-base truncate max-w-[700px] inline-block align-bottom">{date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-organizer.svg" width="15" height="15" alt="Icon"/>
                            <span
                                className="text-base truncate max-w-[700px] inline-block align-bottom">Organized by {organizer}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src="/svgs/my-events-attendees.svg" width="15" height="15" alt="Icon"/>
                            <span
                                className="font-bold text-[#FC3436] text-base inline-block align-bottom">{attendees}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute top-4 right-6">
                    <div className="flex items-center gap-2 min-w-[80px] justify-end">
                        {status !== 'Rejected' && (
                            <>
                                {hasFeedback && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onExpand();
                                        }}
                                        aria-label="View Summary"
                                        className="p-1.5 pl-4 hover:bg-[#261A36]/20 rounded-lg transition-colors text-[#261A36] flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Image src="/svgs/my-events-summary.svg" width="24" height="24" alt="Icon"/>
                                        <ChevronRight
                                            size={32}
                                            className={cn(
                                                "transition-transform duration-300 ease-in-out",
                                                isExpanded ? "rotate-90" : "rotate-0"
                                            )}
                                        />
                                    </button>
                                )}
                                {!hasFeedback && (
                                    <button
                                        type="button"
                                        onClick={handleCreateFeedback}
                                        aria-label="Create Feedback Form"
                                        className="p-1.5 hover:bg-[#261A36]/20 rounded-lg transition-colors text-[#261A36]"
                                    >
                                        <Image src="/svgs/my-events-create.svg" width="24" height="24" alt="Icon"/>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        className="overflow-hidden bg-white rounded-b-[14px] px-6 -mt-7 border-x border-b border-slate-200"
                    >
                        <FeedbackExpansion eventId={id} showText={true}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}