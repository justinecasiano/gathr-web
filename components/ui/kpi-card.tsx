import Image from "next/image";
import * as React from "react";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";

interface KpiCardProps {
    label: string
    value: string
    icon: string
    trend: string
    trendUp?: boolean
    bgColor: string
    cardBg?: string
}

export function KpiCard({label, value, icon, trend, trendUp, bgColor, cardBg}: KpiCardProps) {
    return (
        <Card className={cn("relative overflow-hidden border-2 border-[#5C5C5C] shadow-[4px_4px_0px_0px_rgba(87,66,114,1)]", bgColor)}>
            {cardBg && (
                <div className="absolute inset-0 z-0 -right-40">
                    <Image
                        src={cardBg}
                        alt="Card Background"
                        fill
                        className="object-contain pointer-events-none"
                        priority={false}
                    />
                </div>
            )}

            <CardContent className="relative flex flex-col gap-2 z-10 px-6 py-2 bg-blue">
                <Image src={icon} alt="Card Icon" width={48} height={45}/>
                <span className="text-2xl font-semibold font-display text-[#261A36] mt-2">{value}</span>
                <p className="text-lg font-heading font-bold text-[#574272]">{label}</p>
                <div
                    className={cn("flex items-center text-sm font-medium font-display", trendUp ? "text-[#003F1F]" : "text-[#820006]")}>
                    {trend} from last month
                </div>
            </CardContent>
        </Card>
    )
}