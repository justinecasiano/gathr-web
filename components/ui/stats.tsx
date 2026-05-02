"use client";

import React from "react";
import {usePathname} from "next/navigation";
import {KpiCard} from "@/components/ui/kpi-card";
import {useSkeleton} from "@/hooks/use-skeleton";
import {Skeleton} from "boneyard-js/react";
import _dashboard_stats from "@/bones/dashboard-stats-kpi.bones.json";
import {ResponsiveBones} from "boneyard-js";
import {cn} from "@/lib/utils";

interface StatItem {
    value: string;
    trend: string;
    trendUp?: boolean;
}

interface StatsProps {
    data: StatItem[];
    loading: boolean;
    comparisonLabel: string;
}

const CONFIGS = {
    organizer: [
        {
            label: "My Events",
            icon: "/svgs/my-events-dashboard-icon.svg",
            bgColor: "bg-[#F5F8F3]",
        },
        {
            label: "Total Participants",
            icon: "/svgs/total-participants-dashboard-icon.svg",
            bgColor: "bg-[#FAD2E6]",
        },
        {
            label: "Attendance Rate",
            icon: "/svgs/attendance-rate-dashboard-icon.svg",
            bgColor: "bg-[#FCE0D6]",
        },
        {
            label: "Event Feedback",
            icon: "/svgs/event-feedback-dashboard-icon.svg",
            bgColor: "bg-[#F3E8FF]",
            cardBg: "/svgs/event-feedback-background.svg",
        },
    ],
    moderator: [
        {
            label: "Total Events",
            icon: "/svgs/my-events-dashboard-icon.svg",
            bgColor: "bg-[#F5F8F3]",
        },
        {
            label: "Rejected Events",
            icon: "/svgs/total-participants-dashboard-icon.svg",
            bgColor: "bg-[#FAD2E6]",
        },
        {
            label: "Attendance Rate",
            icon: "/svgs/attendance-rate-dashboard-icon.svg",
            bgColor: "bg-[#FCE0D6]",
        },
        {
            label: "Total Attendees",
            icon: "/svgs/event-feedback-dashboard-icon.svg",
            bgColor: "bg-[#F3E8FF]",
            cardBg: "/svgs/total-attendees-background.svg",
        },
    ],
};

export function Stats({data, loading, comparisonLabel}: StatsProps) {
    const pathname = usePathname();

    const isModerator = pathname.includes("/moderator");
    let currentConfig = isModerator ? CONFIGS.moderator : CONFIGS.organizer;
    if (pathname.includes("/organizer/reports")) {
        currentConfig = currentConfig.map((item, index) =>
            index === 0 ? {...item, label: "Attendees"} : item
        );
    }

    const showSkeleton = useSkeleton(loading, 400);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[20%_20%_25%_30%] gap-4 w-full">
            {currentConfig.map((config, index) => (
                <Skeleton
                    key={index}
                    initialBones={_dashboard_stats as unknown as ResponsiveBones}
                    animate="shimmer"
                    name={`dashboard-stats-kpi`}
                    loading={showSkeleton}
                    className={cn(
                        showSkeleton &&
                        "rounded-xl bg-white/40 border-2 border-[#5C5C5C] shadow-[4px_4px_0px_0px_rgba(87,66,114,1)]",
                    )}
                    color="#574272"
                    boneClass="opacity-40"
                >
                    <KpiCard
                        key={config.label}
                        label={config.label}
                        icon={config.icon}
                        bgColor={config.bgColor}
                        cardBg={config.cardBg}
                        value={data[index]?.value || "0"}
                        trend={data[index]?.trend || "0%"}
                        trendUp={data[index]?.trendUp}
                        comparisonLabel={comparisonLabel}
                    />
                </Skeleton>
            ))}
        </div>
    );
}
