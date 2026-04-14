"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase/supabase";
import { NotificationToast } from "@/components/ui/notification-toast";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [shouldShowPassword, setShouldShowPassword] = useState(false);
    const [shouldShowConfirmPassword, setShouldShowConfirmPassword] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const validateSession = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                router.replace("sign-in");
                return;
            }

            const { data: userData, error: roleError } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            if (roleError || !userData || userData.role !== 'PARTICIPANT') {
                router.replace("sign-in");
                return;
            }

            setUserEmail(user.email ?? "");
            setIsAuthorized(true);
        };

        validateSession();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const resetPasswordSchema = z.object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol (@, #, $, etc.)"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords do not match",
        });

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        const result = resetPasswordSchema.safeParse(formData);
        if (!result.success) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(result.error.issues[0].message);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: result.data.password,
            });

            if (error) {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage(error.message);
                return;
            }

            await supabase.auth.signOut();
            setShowSuccessToast(true);
            setTimeout(() => {
                router.push("sign-in");
            }, 3000);

        } catch (error: unknown) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(error instanceof Error ? error.message : "Failed to verify code. Please try again.");
        }
    };

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-white">
                <Loader2 className="h-12 w-12 animate-spin text-brand-dark" />
            </div>
        );
    }

    return (
        <main className="flex flex-col min-h-screen w-full bg-[#FDFBFF] relative overflow-x-hidden">
            <NotificationToast
                isOpen={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                variant="success"
                title="Password Changed"
                description="Your password has been updated successfully. Redirecting to sign in."
                duration={3000}
            />

            <div className="absolute top-6 left-6 flex items-center z-50">
                <div className="relative h-12 w-12 lg:h-16 lg:w-16">
                    <Image
                        src="/svgs/gathr-logo-initial.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="relative h-10 w-20 lg:h-15 lg:w-25 ml-2">
                    <Image
                        src="/svgs/gathr-logo-full.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row items-center justify-start lg:justify-end w-full px-6 pt-32 lg:pt-0 lg:px-20 z-20">

                <div className="max-w-lg w-full text-white order-2 lg:order-1">
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-[#4C3668] uppercase leading-tight">
                            Account <br className="hidden lg:block"/> Change Password
                        </h1>
                        <p className="mt-2 text-sm text-[#888888] break-words">
                            Changing password for account {userEmail}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleChangePassword}>
                        <div className="space-y-2">
                            <Label className="text-base font-heading font-semibold text-[#261A36]" htmlFor="password">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type={shouldShowPassword ? "text" : "password"}
                                    placeholder="Enter new password here"
                                    className={cn(
                                        "h-14 mt-2 rounded-xl border-3 bg-white px-4 text-[#302F35] placeholder:text-[#302F35]/60 focus-visible:ring-offset-0 transition-colors",
                                        hasError ? "border-[#C44E52]" : "border-[#574272]"
                                    )}
                                />
                                {formData.password.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShouldShowPassword(!shouldShowPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    >
                                        {shouldShowPassword ? (
                                            <Eye className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        ) : (
                                            <EyeOff className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-heading font-semibold text-[#261A36]" htmlFor="confirmPassword">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    type={shouldShowConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password here"
                                    className={cn(
                                        "h-14 mt-2 rounded-xl border-3 bg-white px-4 text-[#302F35] placeholder:text-[#302F35]/60 focus-visible:ring-offset-0 transition-colors",
                                        hasError ? "border-[#C44E52]" : "border-[#574272]"
                                    )}
                                />
                                {formData.confirmPassword.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShouldShowConfirmPassword(!shouldShowConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    >
                                        {shouldShowConfirmPassword ? (
                                            <Eye className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        ) : (
                                            <EyeOff className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {hasError && (
                            <p className="text-[#C44E52] text-sm animate-in fade-in slide-in-from-top-1 font-medium">
                                {errorMessage}
                            </p>
                        )}

                        <Button
                            type="submit"
                            variant={"elevated"}
                            disabled={isLoading || (!formData.password.trim() || !formData.confirmPassword.trim())}
                            className="mt-6 h-16 w-full rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-8 w-8 animate-spin"/>
                                    Please Wait
                                </>
                            ) : (
                                "CHANGE PASSWORD"
                            )}
                        </Button>
                    </form>
                </div>

                <div className="relative hidden lg:block lg:h-[40rem] lg:w-[40rem] order-1 lg:order-2 shrink-0">
                    <Image
                        src="/svgs/change-password.svg"
                        alt="Change Password Clipart"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="hidden lg:block absolute inset-0 overflow-hidden z-50 pointer-events-none opacity-100">
                <motion.div
                    className="absolute -top-20 -right-55 h-80 w-80 rounded-full bg-[#7B55A3]/20 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: 50}}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute -top-25 left-1/2 h-40 w-40 rounded-full bg-[#7B55A3]/20 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: -40, scale: 1.1}}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute top-55 -left-55 h-110 w-110 rounded-full bg-[#7B55A3]/20 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />

                <motion.div
                    className="absolute -bottom-55 right-120 h-100 w-100 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: 50, scale: 1.05}}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
            </div>
        </main>
    );
}
