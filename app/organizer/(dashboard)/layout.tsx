import {Sidebar} from "@/components/Sidebar";

export default function DashboardLayout({children,}: { children: React.ReactNode; }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F7F0FF]">
            <Sidebar/>
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <main className="flex-1">
                    <div className="mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
