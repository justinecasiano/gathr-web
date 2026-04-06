import React from 'react';
import { cn } from "@/lib/utils";

import DashboardIconSVG from './dashboard-icon.svg';
import FeedbackFormsIconSVG from './feedback-forms-icon.svg';
import LogoutIconSVG from './logout-icon.svg';
import MyEventsIconSVG from './my-events-icon.svg';
import ReportsIconSVG from './reports-icon.svg';
import SettingsIconSVG from './settings-icon.svg';
import SidebarArrowIconSVG from './sidebar-arrow-icon.svg';

const ICON_MAP = {
    dashboard: DashboardIconSVG,
    feedback: FeedbackFormsIconSVG,
    logout: LogoutIconSVG,
    events: MyEventsIconSVG,
    reports: ReportsIconSVG,
    settings: SettingsIconSVG,
    arrow: SidebarArrowIconSVG,
} as const;

export type IconName = keyof typeof ICON_MAP;

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    className?: string;
    size?: number;
}

export function Icon({ name, className, size = 24, ...props }: IconProps) {
    const SVGComponent = ICON_MAP[name];

    if (!SVGComponent) return null;

    return (
        <SVGComponent
            width={size}
            height={size}
            className={cn(className)}
            {...props}
        />
    );
}