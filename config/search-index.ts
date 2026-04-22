export interface SearchResult {
    title: string;
    description: string;
    href: string;
    user: 'organizer' | 'moderator';
    category: 'page' | 'event' | 'setting';
}

export const searchIndex: SearchResult[] = [
    {
        title: "Dashboard",
        description: "Overview of your events and feedback",
        href: "dashboard",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Monthly Events and Attendees",
        description: "View your monthly events and attendees",
        href: "dashboard",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Event Status",
        description: "View your event status",
        href: "dashboard",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Average Feedback Rating Trend",
        description: "View your average feedback rating trend",
        href: "dashboard",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "My Events",
        description: "Create and manage your events",
        href: "events",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Feedback Forms",
        description: "Create and manage your feedback and responses",
        href: "feedback",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Reports",
        description: "Oversee reports on events, feedback and attendee summary",
        href: "reports",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Settings",
        description: "Configure your account and system preferences",
        href: "settings",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Update Profile",
        description: "Change your name, username and profile picture",
        href: "settings",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Reset Password",
        description: "Send a password reset link to update your password",
        href: "settings",
        user: 'organizer',
        category: 'page'
    },


    {
        title: "Dashboard",
        description: "Overview of your events and feedback",
        href: "dashboard",
        user: 'moderator',
        category: 'page'
    },
    {
        title: "Monthly Events and Attendees",
        description: "View your monthly events and attendees",
        href: "dashboard",
        user: 'moderator',
        category: 'page'
    },
    {
        title: "Event Status",
        description: "View your event status",
        href: "dashboard",
        user: 'moderator',
        category: 'page'
    },
    {
        title: "Average Feedback Rating For All Events",
        description: "View your average feedback rating for all events",
        href: "dashboard",
        user: 'moderator',
        category: 'page'
    },
    {
        title: "Reports",
        description: "Oversee reports on events, feedback and attendee summary",
        href: "reports",
        user: 'moderator',
        category: 'page'
    },
    {
        title: "Settings",
        description: "Configure your account and system preferences",
        href: "settings",
        user: 'moderator',
        category: 'page'
    },
    {
        title: "Update Profile",
        description: "Change your name, username and profile picture",
        href: "settings",
        user: 'moderator',
        category: 'page'
    },
    {
        title: "Reset Password",
        description: "Send a password reset link to update your password",
        href: "settings",
        user: 'moderator',
        category: 'page'
    },
];