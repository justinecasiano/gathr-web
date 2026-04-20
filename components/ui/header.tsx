'use client';

import { usePathname } from 'next/navigation';
import { GlobalSearch } from "@/components/ui/global-search";
import { Icon, IconName } from "@/components/icons";
import Image from "next/image";
import * as React from "react";
import {useUser} from "@/hooks/use-user";

const PATH_TO_ICON: Record<string, IconName> = {
    '/dashboard': 'dashboard',
    '/events': 'events',
    '/feedback': 'feedback',
    '/reports': 'reports',
    '/settings': 'settings',
};

export function Header() {
    const {data: user, isLoading} = useUser();
    const pathname = usePathname();

    const activeIconName = React.useMemo(() => {
        const match = Object.keys(PATH_TO_ICON).find(path => pathname.endsWith(path));
        return match ? PATH_TO_ICON[match] : 'dashboard';
    }, [pathname]);

    return (
        <header className="sticky top-0 z-30 flex h-21 items-center justify-between border-b border-[#5C5C5C] bg-white/80 backdrop-blur-md px-10">
            <div className="flex items-center gap-6">
                <div className="rounded-full border-2 border-[#5C5C5C] bg-white p-2.5 text-[#261A36] shadow-[0px_4px_0px_0px_rgba(87,66,114,1)] cursor-pointer transition-colors hover:!bg-[#261A36]/20">
                    <Icon
                        name={activeIconName}
                        size={26}
                        className="text-[#261A36]"
                    />
                </div>
            </div>

            <GlobalSearch />

            <div className="flex max-w-[22%] items-center justify-center gap-2 rounded-2xl border-2 border-[#5C5C5C] bg-white p-1.5 shadow-[4px_4px_0px_0px_rgba(87,66,114,1)] cursor-pointer transition-all hover:!bg-[#261A36]/20">
                <div className="h-10 w-10 rounded-xl bg-purple-200 overflow-hidden shrink-0">
                    <Image
                        src="/svgs/organizer-profile-icon.svg"
                        alt="Avatar"
                        width={40}
                        height={40}
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
