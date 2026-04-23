"use client"

import * as React from "react"
import {ChevronDown} from "lucide-react"
import {addDays, format, differenceInDays, isSameDay} from "date-fns"
import {DateRange} from "react-day-picker"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Input} from "@/components/ui/input"
import {useEffect, useState} from "react";

export function DashboardDatePicker({ onDateChange }: { onDateChange: (range: DateRange | undefined) => void }) {
    const [tempDate, setTempDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -6),
        to: new Date(),
    })

    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -6),
        to: new Date(),
    })

    const [isOpen, setIsOpen] = useState(false)

    const getLabel = () => {
        if (date?.from && date?.to) {
            const today = new Date();
            const isToToday = isSameDay(date.to, today);

            if (isToToday) {
                const dayCount = differenceInDays(date.to, date.from) + 1;

                if (dayCount === 1) return "Today";
                return `Last ${dayCount} days`;
            }

            return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`;
        }
        return "Pick a date";
    };

    const handleApply = () => {
        setDate(tempDate);
        onDateChange(tempDate);
        setIsOpen(false);
    }

    return (
        <div className="grid gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-fit h-12 justify-between text-left font-display font-bold text-lg border-2 border-black rounded-sm bg-white hover:bg-white text-black px-4 gap-3",
                            !date && "text-muted-foreground"
                        )}
                    >
                        {getLabel()}
                        <ChevronDown
                            className={cn(
                                "h-5 w-5 transition-transform duration-200 ease-in-out text-black",
                                isOpen ? "rotate-180" : "rotate-0"
                            )}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-fit p-2 border-2 border-black rounded-[20px] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] bg-white overflow-hidden"
                    align="start"
                >
                    <div className="p-3">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={tempDate?.from}
                            selected={tempDate}
                            onSelect={setTempDate}
                            numberOfMonths={2}
                            disabled={[
                                { before: new Date(2024, 0, 1) },
                                { after: new Date() }
                            ]}
                            classNames={{
                                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "space-y-4",

                                range_start: "!bg-blue-600 !text-white !rounded-l-full",
                                range_end: "!bg-blue-600 !text-white !rounded-r-full",
                                range_middle: "!bg-blue-50 !text-blue-600 !rounded-none",

                                selected: "!bg-blue-600 !text-white hover:!bg-blue-600",

                                day_range_start: "!bg-blue-600 !text-white !rounded-full !opacity-100",
                                day_range_end: "!bg-blue-600 !text-white !rounded-full !opacity-100",
                                day_range_middle: "!bg-blue-50 !text-blue-600 !rounded-none",
                                day_selected: "!bg-blue-600 !text-white hover:!bg-blue-600 focus:!bg-blue-600 !opacity-100",
                                day: "!h-9 !w-9 !p-0 !font-normal aria-selected:!opacity-100 hover:!bg- !rounded-full transition-colors",
                            }}
                        />
                    </div>

                    <div
                        className="border-t-2 border-gray-100 px-4 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
                        <div className="flex items-center gap-1.5">
                            <Input
                                readOnly
                                value={tempDate?.from ? format(tempDate.from, "MMM d, yyyy") : ""}
                                className="w-[120px] h-10 rounded-xl border-2 border-gray-200 font-bold text-center text-xs focus-visible:ring-0"
                            />
                            <span className="text-gray-400 text-xs">—</span>
                            <Input
                                readOnly
                                value={tempDate?.to ? format(tempDate.to, "MMM d, yyyy") : ""}
                                className="w-[120px] h-10 rounded-xl border-2 border-gray-200 font-bold text-center text-xs focus-visible:ring-0"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="px-4 h-10 rounded-xl border-2 border-gray-200 font-bold text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!tempDate?.from || !tempDate?.to}
                                onClick={handleApply}
                                className="px-6 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
