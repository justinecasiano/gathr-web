"use client";

import {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation"; // Added for redirection
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import WelcomeSide from "@/components/custom/welcome-side";
import {cn} from "@/lib/utils";
import {supabase} from "@/lib/supabase";
import {z} from "zod";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Track specific error text
    const [otp, setOtp] = useState("")
    const [countdown, setCountdown] = useState(0);
    const [isResending, setIsResending] = useState(false);

    const otpSchema = z.string().length(6,"OTP must be exactly 6 digits");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (!otp.trim()) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage("This field is required.");
            return;
        }

        const result = otpSchema.safeParse(otp);
        if (!result.success) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(result.error.issues[0].message);
            return;
        }

        if (!email) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage("Email is missing");
            return;
        }

        try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email: email,
                token: otp,
                type: 'email',
            });

            if (verifyError) {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage(verifyError.message);
            }

            router.push("moderator/dashboard");

        } catch (error: unknown) {
            setIsLoading(false);
            setHasError(true);

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Failed to verify code. Please try again.");
            }
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            setHasError(true);
            setErrorMessage("Email is missing.");
            return;
        }

        setIsResending(true);

        const {error: error} = await supabase.auth.signInWithOtp({
            email: email,
        });

        if (error) {
            setHasError(true);
            setErrorMessage(error.message);
            setIsResending(false);
        } else {
            setCountdown(60);
            setIsResending(false);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    return (
        <main className="flex min-h-screen w-full bg-brand-dark">
            <WelcomeSide/>
            <div className="w-[65%] h-screen flex items-center justify-center py-20 px-20">
                <div className="max-w-2xl w-full text-white">
                    <div className="mb-7">
                        <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase">
                            Verify Login
                        </h1>
                        <p className="mt-4 text-sm text-gray-400">
                            Please check email {email || 'in your inbox '} to see your OTP code.
                        </p>
                    </div>

                    <form>
                        <Input
                            id="otp"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="Enter OTP code here"
                            className={cn(
                                "h-14 rounded-xl border-3 bg-[#312245] px-4 text-white placeholder:text-white/60 focus-visible:ring-offset-0 transition-colors",
                                hasError ? "border-[#C44E52]" : "border-[#574272]"
                            )}
                        />
                        <div className="mt-4 flex justify-between">
                            {hasError && (
                                <p className="text-[#C44E52] text-sm animate-in fade-in slide-in-from-top-1">
                                    {errorMessage}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleResendEmail}
                                className="cursor-pointer ml-auto text-[#C2C2C2] text-sm font-semibold transition-colors hover:text-white active:opacity-70 focus:outline-none"
                            >
                                Resend Again {countdown > 0 ? `in ${countdown}s` : ""}
                            </button>
                        </div>

                        <div className="mt-6 w-full flex items-center justify-between">
                            <Button
                                type="button"
                                onClick={() => router.back()}
                                variant={"elevated"}
                                className="h-16 w-[35%] rounded-3xl bg-brand border-[#4C2576] font-display text-xl font-black uppercase text-white shadow-lg transition-all "
                            >BACK
                            </Button>
                            <Button
                                type="submit"
                                variant={"elevated"}
                                disabled={isLoading}
                                className="h-16 w-[62%] rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin"/>
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
