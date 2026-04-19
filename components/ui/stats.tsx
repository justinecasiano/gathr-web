import React from 'react';
import { KpiCard } from '@/components/ui/kpi-card';

interface StatItem {
    value: string;
    trend: string;
    trendUp?: boolean;
}

interface StatsProps {
    data: StatItem[];
}

const STATS_CONFIG = [
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
];

export function Stats({ data }: StatsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[20%_20%_25%_30%] gap-4 w-full">
            {STATS_CONFIG.map((config, index) => (
                <KpiCard
                    key={config.label}
                    label={config.label}
                    icon={config.icon}
                    bgColor={config.bgColor}
                    cardBg={config.cardBg}
                    value={data[index]?.value || "0"}
                    trend={data[index]?.trend || "0%"}
                    trendUp={data[index]?.trendUp}
                />
            ))}
        </div>
    );
}