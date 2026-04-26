import {cn} from "@/lib/utils";

interface FeedbackExpansionProps {
    responseCount: number;
}

export function FeedbackExpansion({ responseCount }: FeedbackExpansionProps) {
    return (
        <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ResponseStatCard label="Responses" value={responseCount.toString()} bgColor="bg-[#F5F8F3]" />
                <ResponseStatCard label="No Response" value="5" bgColor="bg-[#FCE0D6]" />
                <ResponseStatCard label="Did not attend" value="3" bgColor="bg-[#F3E8FF]" />
            </div>

            <div className="p-6 rounded-[32px] border-2 border-[#7B55A3] bg-white shadow-sm">
                <p className="text-xs font-black text-[#7B55A3] uppercase mb-1">Question 1 / 10</p>
                <p className="font-bold text-[#261A36] mb-6">What are the things you observed during the event...?</p>

                <div className="space-y-4">
                    {[35, 40, 25].map((val, i) => (
                        <div key={i} className="relative h-12 w-full rounded-full border-2 border-[#7B55A3] flex items-center px-4 overflow-hidden">
                            <div
                                className="absolute left-0 top-0 bottom-0 bg-[#7B55A3]/20 z-0 transition-all duration-500"
                                style={{ width: `${val}%` }}
                            />
                            <div className="relative z-10 w-full flex justify-between items-center text-sm font-black text-[#261A36]">
                                <span className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#7B55A3] text-white flex items-center justify-center text-[10px]">
                                        {i + 1}
                                    </span>
                                    Option Label {i + 1}
                                </span>
                                <span>{val}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ResponseStatCard({ label, value, bgColor }: { label: string, value: string, bgColor: string }) {
    return (
        <div className={cn("p-4 rounded-2xl flex flex-col items-center justify-center border-2 border-[#5C5C5C]/5", bgColor)}>
            <span className="text-2xl font-black text-[#261A36]">{value}</span>
            <span className="text-xs font-bold text-[#5C5C5C] uppercase">{label}</span>
        </div>
    )
}