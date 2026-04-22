"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import { KpiCard } from '@/components/ui/kpi-card';

interface StatItem {
    value: string;
    trend: string;
    trendUp?: boolean;
}

interface StatsProps {
    data: StatItem[];
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
    ]
};

export function Stats({ data }: StatsProps) {
    const pathname = usePathname();

    const isModerator = pathname.includes('/moderator');
    const currentConfig = isModerator ? CONFIGS.moderator : CONFIGS.organizer;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[20%_20%_25%_30%] gap-4 w-full">
            {currentConfig.map((config, index) => (
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
