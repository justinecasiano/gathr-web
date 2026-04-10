async function getDashboardData() {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return { status: "success" };
}

export default async function DashboardPage() {
    await getDashboardData();

    return (
        <main className="p-8 text-white">
            <h1 className="text-3xl font-display font-black uppercase">
                Dashboard Overview
            </h1>
            <p className="mt-4 text-[#C2C2C2]">
                The loading screen should have stayed visible for 3 seconds.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6">
                <div className="h-40 rounded-2xl bg-[#312245] border border-[#574272] p-6">
                    <p className="text-sm font-bold opacity-60">Total Reports</p>
                    <h2 className="text-4xl font-black mt-2">1,284</h2>
                </div>
            </div>
        </main>
    );
}
