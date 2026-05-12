"use client";

import { Icon, IconName } from "@/components/icons";
import { GlobalSearch } from "@/components/ui/global-search";
import { useUser } from "@/hooks/use-user";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";

const PATH_TO_ICON: Record<string, IconName> = {
    "/dashboard": "dashboard",
    "/events": "events",
    "/feedback": "feedback",
    "/reports": "reports",
    "/settings": "settings",
};

export function Header() {
    const { data: user, isLoading } = useUser();
    const pathname = usePathname();

    const activeIconName = React.useMemo(() => {
        const match = Object.keys(PATH_TO_ICON).find((path) => pathname.endsWith(path));
        return match ? PATH_TO_ICON[match] : "dashboard";
    }, [pathname]);

    return (
        <header className="sticky top-0 z-45 flex h-21 items-center justify-between px-10 pt-3">
            <div className="flex items-center gap-6">
                <div className="rounded-full border-2 border-[#5C5C5C] bg-white p-2.5 text-[#261A36] shadow-[0px_4px_0px_0px_rgba(87,66,114,1)] transition-colors hover:!brightness-80">
                    <Icon name={activeIconName} size={26} className="text-[#261A36]" />
                </div>
            </div>

            <GlobalSearch />

            <div className="flex max-w-[22%] items-center justify-center gap-2 rounded-2xl border-2 border-[#5C5C5C] bg-white p-1.5 shadow-[4px_4px_0px_0px_rgba(87,66,114,1)] transition-all hover:!brightness-80">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border-2 border-[#261A36]">
                    <Image
                        src={user?.avatar_url ?? "/svgs/moderator-profile-icon.svg"}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="aspect-square object-cover"
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-lg font-bold font-display text-[#261A36] leading-none truncate max-w-[150px]">
                        {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
                    </p>
                    <p className="text-sm font-medium font-heading text-[#111111] truncate max-w-[150px]">
                        {user ? `${user.email}` : "Loading..."}
                    </p>
                </div>
            </div>
        </header>
    );
}
