import Image from "next/image";

export default function LoadingPage() {
    return (
        <main className="flex min-h-screen w-full bg-[#F7F0FF]">
            <div className="absolute inset-0 z-20 pointer-events-none">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80">
                    <Image
                        src="/svgs/gathr-logo-initial.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-16 w-16">
                    <Image
                        src="/svgs/gathr-logo-full.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                    />
                </div>

            </div>
        </main>
    );
}
