"use client";

import {useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import WelcomeSide from "@/components/ui/welcome-side";
import {NotificationToast} from "@/components/ui/notification-toast";
import {cn} from "@/lib/utils";
import {supabase} from "@/lib/supabase/supabase";
import {z} from "zod";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const otpSchema = z.string().length(6, "OTP must be exactly 6 digits");

    useEffect(() => {
        const fetchUserEmail = async () => {
            if (!email) {
                router.replace("/organizer/sign-in");
            } else {
                setIsAuthorized(true);
            }
        };
        fetchUserEmail();
    }, [email, router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setHasError(false);

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        const result = otpSchema.safeParse(otp);
        if (!result.success) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(result.error.issues[0].message);
            return;
        }

        try {
            const {error: verifyError} = await supabase.auth.verifyOtp({
                email: email!,
                token: otp,
                type: 'email',
            });

            if (verifyError) {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage(verifyError.message);
                return;
            }

            setShowSuccessToast(true);

            setTimeout(() => {
                router.push("../dashboard");
            }, 3000);

        } catch (error: unknown) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(error instanceof Error ? error.message : "Verification failed");
        }
    };

    const handleResendEmail = async () => {
        if (!email) return;
        setIsResending(true);
        const {error} = await supabase.auth.signInWithOtp({email});
        if (error) {
            setHasError(true);
            setErrorMessage(error.message);
        } else {
            setCountdown(60);
        }
        setIsResending(false);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#F7F0FF]">
                <Loader2 className="h-12 w-12 animate-spin text-brand-dark" />
            </div>
        );
    }

    return (
        <main className="flex min-h-screen w-full bg-[#F7F0FF]">
            <NotificationToast
                isOpen={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                variant="success"
                title="Login Successful"
                description="Please wait for the website to load your account."
                duration={3000}
            />

            <WelcomeSide/>

            <div
                className="w-full lg:w-[65%] min-h-screen flex lg:items-center justify-center pt-16 pb-10 lg:py-20 px-6 lg:px-20">
                <div className="max-w-2xl w-full text-white">
                    <div className="mb-7">
                        <h1 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-[#4C3668] uppercase">
                            Verify Login
                        </h1>
                        <p className="mt-4 text-sm text-[#888888] break-words leading-relaxed">
                            Please check email <span className="text-[#888888] font-medium">{email}</span> to see your OTP
                            code.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4">
                        <Input
                            id="otp"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="Enter OTP code here"
                            className={cn(
                                "h-14 rounded-xl border-3 bg-white px-4 text-[#302F35] placeholder:text-[#302F35]/60 focus-visible:ring-offset-0 transition-colors",
                                hasError ? "border-[#C44E52]" : "border-[#574272]"
                            )}
                        />

                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <div className="min-h-[20px]">
                                {hasError && (
                                    <p className="text-[#C44E52] text-sm animate-in fade-in slide-in-from-top-1 font-medium">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                disabled={isResending || countdown > 0}
                                onClick={handleResendEmail}
                                className="text-[#820006] text-sm font-semibold hover:brightness-90 disabled:opacity-50 text-right"
                            >
                                Resend Again {countdown > 0 ? `in ${countdown}s` : ""}
                            </button>
                        </div>

                        <div className="mt-8 w-full flex items-center justify-between gap-4">
                            <Button
                                type="button"
                                onClick={() => router.back()}
                                variant="elevated"
                                className="h-16 w-[35%] rounded-3xl bg-brand border-[#4C2576] font-display text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                            >
                                BACK
                            </Button>
                            <Button
                                type="submit"
                                variant="elevated"
                                disabled={isLoading || !otp.trim()}
                                className="h-16 w-[62%] rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-8 w-8 animate-spin"/>
                                        Please Wait
                                    </>
                                ) : (
                                    "VERIFY"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
