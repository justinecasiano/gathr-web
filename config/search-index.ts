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
        title: "My Events",
        description: "List of all organized events",
        href: "events",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Reports",
        description: "View event analytics and feedback",
        href: "reports",
        user: 'organizer',
        category: 'page'
    },
    {
        title: "Account Settings",
        description: "Update your profile",
        href: "settings",
        user: 'organizer',
        category: 'setting'
    },
];