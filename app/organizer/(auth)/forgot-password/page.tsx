"use client";
import Image from "next/image";
import {motion} from "motion/react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {cn, getURL} from "@/lib/utils";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState, useEffect, useCallback} from "react";
import {z} from "zod";
import {supabase} from "@/lib/supabase/supabase";
import {NotificationToast} from "@/components/ui/notification-toast";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const emailSchema = z.string().email("Invalid email format");

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleCloseToast = useCallback(() => {
        setShowSuccessToast(false);
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        const result = emailSchema.safeParse(email);
        if (!result.success) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(result.error.issues[0].message);
            return;
        }

        try {
            const {data: userData, error: userError} = await supabase
                .from("users")
                .select("id, role")
                .eq("email", email)
                .single();

            if (userError || !userData) {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage("Email not found");
                return;
            }

            if (userData.role !== "PARTICIPANT") {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage("Access denied. This account is not an Organizer.");
                return;
            }

            const handshakeKey = crypto.randomUUID();

            localStorage.setItem('reset_handshake_key', handshakeKey);
            const siteUrl = getURL();
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${siteUrl}/organizer/reset-password?key=${handshakeKey}`,
            });

            if (resetError) {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage(resetError.message);
                return;
            }

            setIsLoading(false);
            setShowSuccessToast(true);
            setCountdown(60);

        } catch (error: unknown) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(error instanceof Error ? error.message : "Failed to reset password.");
        }
    };

    return (
        <main className="flex flex-col min-h-screen w-full bg-[#FDFBFF] relative overflow-x-hidden">
            <NotificationToast
                isOpen={showSuccessToast}
                onClose={handleCloseToast}
                variant="success"
                title="Password Reset Link Sent"
                description="Please check your email for password reset link."
                duration={5000}
            />

            <div className="absolute top-6 left-6 flex items-center z-50">
                <div className="relative h-10 w-10 lg:h-14 lg:w-14">
                    <Image src="/svgs/gathr-logo-initial.svg" alt="Logo" fill className="object-contain" priority />
                </div>
                <div className="relative h-8 w-16 lg:h-12 lg:w-20 ml-2">
                    <Image src="/svgs/gathr-logo-full.svg" alt="Gathr Logo" fill className="object-contain" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center lg:items-center justify-start lg:justify-center px-6 pt-24 lg:pt-0 lg:px-20 z-20">
                <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl gap-8 lg:gap-12">

                    <div className="hidden lg:block relative h-120 w-120 xl:h-140 xl:w-140 shrink-0">
                        <Image
                            src="/svgs/password-reset.svg"
                            alt="Forgot Password"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="w-full max-w-md text-[#4C3668]">
                        <div className="mb-6 text-center lg:text-left">
                            <h1 className="text-3xl lg:text-4xl font-display font-black tracking-tight uppercase leading-[1.1]">
                                Account <br className="hidden lg:block"/> Password Reset
                            </h1>
                        </div>

                        <form className="space-y-2" onSubmit={handleReset}>
                            <div className="space-y-1.5">
                                <Label className="text-base font-heading font-semibold text-[#261A36] opacity-90" htmlFor="email">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address here"
                                    className={cn(
                                        "h-12 rounded-xl border-3 bg-white px-4 text-[#302F35] transition-colors text-sm",
                                        hasError ? "border-[#C44E52]" : "border-[#574272]"
                                    )}
                                />
                                {hasError && (
                                    <p className="text-[#C44E52] text-sm font-medium pt-1 animate-in fade-in slide-in-from-top-1">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={() => router.back()}
                                    variant={"elevated"}
                                    className="h-14 w-full sm:w-[35%] rounded-2xl bg-brand border-[#4C2576] font-display text-lg font-black uppercase text-white shadow-lg"
                                >
                                    BACK
                                </Button>
                                <Button
                                    type="submit"
                                    variant={"elevated"}
                                    disabled={isLoading || !email.trim() || countdown > 0}
                                    className="h-14 w-full sm:w-[65%] rounded-2xl bg-brand-accent font-display text-lg font-black uppercase text-white shadow-lg"
                                >
                                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin"/> : countdown > 0 ? `Retry in ${countdown}s` : "CONFIRM"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none z-50 opacity-50">
                <motion.div
                    className="absolute -top-25 left-1/2 h-40 w-40 rounded-full bg-[#7B55A3]/20 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: -40, scale: 1.1}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                />
                <motion.div
                    className="absolute top-55 -left-55 h-110 w-110 rounded-full bg-[#7B55A3]/20 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />

                <motion.div
                    className="absolute -bottom-55 right-120 h-100 w-100 rounded-full bg-[#7B55A3]/20 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: 50, scale: 1.05}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />
            </div>
        </main>
    );
}
