"use client";

import {useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
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
    const [errorMessage, setErrorMessage] = useState("");
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
                return;
            }

            router.push("../dashboard");

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
        const {error: error} = await supabase.auth.signInWithOtp({email: email,});

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
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <main className="flex min-h-screen w-full bg-[#F7F0FF]">
            <WelcomeSide/>
            <div className="w-[65%] h-screen flex items-center justify-center py-20 px-20">
                <div className="max-w-2xl w-full text-white">
                    <div className="mb-7">
                        <h1 className="text-4xl font-display font-black tracking-tight text-[#4C3668] uppercase">
                            Verify Login
                        </h1>
                        <p className="mt-4 text-sm text-[#888888]">
                            A 6-digit code has been sent to your email {email || ''}
                        </p>
                    </div>

                    <form>
                        <Input
                            id="otp"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="Enter OTP code here"
                            className={cn(
                                "h-14 mt-2 rounded-xl border-3 bg-white px-4 text-brand-dark placeholder:text-[#302F35]/60 focus-visible:ring-offset-0 transition-colors",
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
                                disabled={isResending}
                                onClick={handleResendEmail}
                                className="cursor-pointer ml-auto text-[#820006] text-sm font-semibold transition-colors hover:brightness-150 active:opacity-70 focus:outline-none"
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
                                onClick={handleVerify}
                                disabled={isLoading || !otp.trim()}
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
