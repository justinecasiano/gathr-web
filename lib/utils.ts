import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {SimpleEvent, BaseEvent, FeedbackEvent, IndividualResponse} from "@/types/base-event";
import {format, subMonths, startOfMonth, endOfMonth, isWithinInterval, differenceInDays, subDays} from "date-fns";
import {DateRange} from "react-day-picker";
import {ParticipantWithUsers} from "@/hooks/use-event-participants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getURL = () => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

    let url = envUrl || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

    url = url.includes("http") ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === "/" ? url.slice(0, -1) : url;
    return url;
};

export const getEventStatus = (start: string, end: string): "UPCOMING" | "ONGOING" | "ENDED" => {
    const now = new Date();

    const startTime = new Date(start);
    const endTime = new Date(end);

    if (now < startTime) return "UPCOMING";
    if (now >= startTime && now <= endTime) return "ONGOING";
    return "ENDED";
};

export const mapToSimpleEvent = (event: BaseEvent): SimpleEvent => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);

    const dateStr = start
        .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        .replace(",", "");

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const currentCount = event.participants?.[0]?.count ?? 0;
    const organizerName = event.creator
        ? event.creator.display_name || `${event.creator.first_name} ${event.creator.last_name}`.trim()
        : "Unknown Organizer";

    return {
        id: event.id,
        title: event.title,
        location: event.location,
        date: `${dateStr} | ${formatTime(start)} to ${formatTime(end)}`,
        organizer: organizerName,
        attendees: `${currentCount}/${event.capacity}`,
        status: event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase(),
        hasFeedback: event.has_feedback_form,
        image: event.background_image || "/images/placeholder_small.png",
    };
};

export const mapToFeedbackEvent = (event: BaseEvent): FeedbackEvent => {
    return {
        id: event.id,
        title: event.title,
        location: event.location,
        image: event.background_image || "/images/placeholder_small.png",
        status: event.event_status.charAt(0).toUpperCase() + event.event_status.slice(1).toLowerCase(),
        isFormActive: !!event.is_form_active,
        hasFeedback: event.has_feedback_form,
        feedbackForm: event.feedback_form,
        questionCount: event.question_count,
        responseCount: event.response_count?.[0]?.count ?? 0,
    };
};

export const generateOrganizerDashboardAnalytics = (events: BaseEvent[], dateRange: DateRange | undefined) => {
    const now = new Date();
    const currentFrom = dateRange?.from || subDays(now, 29);
    const currentTo = dateRange?.to || now;

    const diff = Math.abs(differenceInDays(currentTo, currentFrom)) + 1;
    const previousFrom = subDays(currentFrom, diff);
    const previousTo = subDays(currentFrom, 1);

    const getEventsInPeriod = (start: Date, end: Date) =>
        events.filter((e) => {
            const d = new Date(e.start_time);
            return d >= start && d <= end;
        });

    const currEvents = getEventsInPeriod(currentFrom, currentTo);
    const prevEvents = getEventsInPeriod(previousFrom, previousTo);

    const getTrend = (current: number, previous: number) => {
        if (previous === 0) {
            return {string: current > 0 ? "+100%" : "0%", up: current > 0};
        }
        const percentage = ((current - previous) / previous) * 100;
        const sign = percentage >= 0 ? "+" : "";
        return {
            string: `${sign}${percentage.toFixed(1)}%`,
            up: percentage >= 0,
        };
    };

    const calcStats = (eventList: BaseEvent[]) => {
        const total = eventList.length;
        const totalRegistered = eventList.reduce((sum, e) => sum + (e.participants?.[0]?.count ?? 0), 0);
        const totalPresent = eventList.reduce((sum, e) => sum + (e.present_count?.[0]?.count ?? 0), 0);
        const totalResponses = eventList.reduce((sum, e) => sum + (e.response_count?.[0]?.count ?? 0), 0);
        const attendanceRate = totalRegistered > 0 ? (totalPresent / totalRegistered) * 100 : 0;

        return {
            total,
            attendees: totalRegistered,
            responses: totalResponses,
            rate: attendanceRate,
        };
    };

    const curr = calcStats(currEvents);
    const prev = calcStats(prevEvents);

    const eventTrend = getTrend(curr.total, prev.total);
    const attendeeTrend = getTrend(curr.attendees, prev.attendees);
    const rateTrend = getTrend(curr.rate, prev.rate);
    const feedbackTrend = getTrend(curr.responses, prev.responses);

    const dashboardStats = [
        {label: "My Events", value: curr.total.toLocaleString(), trend: eventTrend.string, trendUp: eventTrend.up},
        {
            label: "Total Participants",
            value: curr.attendees.toLocaleString(),
            trend: attendeeTrend.string,
            trendUp: attendeeTrend.up,
        },
        {
            label: "Attendance Rate",
            value: curr.rate.toFixed(1) + "%",
            trend: rateTrend.string,
            trendUp: rateTrend.up,
        },
        {
            label: "Event Feedback",
            value: curr.responses.toLocaleString(),
            trend: feedbackTrend.string,
            trendUp: feedbackTrend.up,
        },
    ];

    const getStatusCount = (list: BaseEvent[], status: string) => list.filter((e) => e.status === status).length;

    const statuses = [
        {name: "Approved", key: "APPROVED", color: "#94B983"},
        {name: "Pending", key: "PENDING", color: "#F6835E"},
        {name: "Rejected", key: "REJECTED", color: "#CD4249"},
    ];

    const eventStatusData = statuses.map((s) => {
        const currentCount = getStatusCount(currEvents, s.key);
        const previousCount = getStatusCount(prevEvents, s.key);
        const trend = getTrend(currentCount, previousCount);

        return {
            name: s.name,
            value: currentCount,
            percentage: trend.string,
            color: s.color,
        };
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const eventAttendeeData = dayNames.map((day) => {
        const eventsOnDay = currEvents.filter((e) => format(new Date(e.start_time), "eee") === day);
        return {
            name: day,
            Events: eventsOnDay.length,
            Attendees: eventsOnDay.reduce((sum, e) => sum + (e.participants?.[0]?.count ?? 0), 0),
        };
    });

    const last6Months = Array.from({length: 6}, (_, i) => {
        const referenceDate = dateRange?.to || new Date();
        return subMonths(referenceDate, i);
    }).reverse();

    const feedbackTrendData = last6Months.map((monthDate) => {
        const monthLabel = format(monthDate, "MMM");
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);

        const eventsInMonth = events.filter((e) => {
            const eventDate = new Date(e.start_time);
            return isWithinInterval(eventDate, {start: monthStart, end: monthEnd});
        });

        let totalWeightedRating = 0;
        let totalResponsesInMonth = 0;

        eventsInMonth.forEach((e) => {
            const count = Number(e.response_count?.[0]?.count ?? 0);
            const avg = Number(e.avg_rating ?? 0);

            if (count > 0) {
                totalWeightedRating += avg * count;
                totalResponsesInMonth += count;
            }
        });

        const monthAvg = totalResponsesInMonth > 0 ? totalWeightedRating / totalResponsesInMonth : 0;

        return {
            name: monthLabel,
            rating: Number(monthAvg.toFixed(1)),
        };
    });

    const daysDiff = Math.abs(differenceInDays(currentTo, currentFrom)) + 1;

    let prevLabel = "previous period";
    if (daysDiff === 7) prevLabel = "last week";
    if (daysDiff === 30 || daysDiff === 28 || daysDiff === 31) prevLabel = "last month";
    if (daysDiff === 1) prevLabel = "yesterday";
    else prevLabel = `prev. ${daysDiff} days`;

    return {dashboardStats, eventAttendeeData, eventStatusData, feedbackTrendData, comparisonLabel: prevLabel};
};

export const generateOrganizerDashboardAnalyticsForReports = (events: BaseEvent[], selectedEventId: number) => {
    const targetEvent = events.find(e => e.id === selectedEventId);

    const otherEvents = events
        .filter(e => e.id !== selectedEventId)
        .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

    const referenceEvent = otherEvents[0];

    const getTrend = (current: number, previous: number) => {
        if (!previous || previous === 0) {
            return {string: current > 0 ? "+100%" : "0%", up: current > 0};
        }
        const percentage = ((current - previous) / previous) * 100;
        const sign = percentage >= 0 ? "+" : "";
        return {
            string: `${sign}${percentage.toFixed(1)}%`,
            up: percentage >= 0,
        };
    };

    const extractStats = (event: BaseEvent | undefined) => {
        if (!event) return {total: 0, attendees: 0, responses: 0, rate: 0, rating: 0};

        const registered = event.participants?.[0]?.count ?? 0;
        const present = event.present_count?.[0]?.count ?? 0;
        const responses = event.response_count?.[0]?.count ?? 0;
        const rate = registered > 0 ? (present / registered) * 100 : 0;
        const rating = Number(event.avg_rating ?? 0);

        return {attendees: present, total: registered, responses, rate, rating};
    };

    const curr = extractStats(targetEvent);
    const prev = extractStats(referenceEvent);

    const attendeeTrend = getTrend(curr.attendees, prev.attendees);
    const totalTrend = getTrend(curr.total, prev.total);
    const rateTrend = getTrend(curr.rate, prev.rate);
    const feedbackTrend = getTrend(curr.responses, prev.responses);

    const dashboardStats = [
        {
            label: "Attendees",
            value: curr.attendees.toLocaleString(),
            trend: attendeeTrend.string,
            trendUp: attendeeTrend.up,
        },
        {
            label: "Total Participants",
            value: curr.total.toLocaleString(),
            trend: totalTrend.string,
            trendUp: totalTrend.up,
        },
        {
            label: "Attendance Rate",
            value: curr.rate.toFixed(1) + "%",
            trend: rateTrend.string,
            trendUp: rateTrend.up,
        },
        {
            label: "Event Feedback",
            value: curr.responses.toLocaleString(),
            trend: feedbackTrend.string,
            trendUp: feedbackTrend.up,
        },
    ];

    const comparisonLabel = referenceEvent
        ? `vs. latest event`
        : "no previous events to compare";

    return {
        dashboardStats,
        comparisonLabel,
        targetEventTitle: targetEvent?.title
    };
};

export const mapToIndividualSummary = (participants: ParticipantWithUsers[], location: string): IndividualResponse[] => {
    return participants.map((p): IndividualResponse => {
        const fullName = p.users ? `${p.users.first_name} ${p.users.last_name}`.trim() : "Unknown User";

        return {
            id: p.user_id,
            fullName: fullName,
            eventId: p.event_id,
            eventLocation: location,
            hasFeedback: !!p.feedback_submission || p.response_status === "ANSWERED",
        };
    });
};
