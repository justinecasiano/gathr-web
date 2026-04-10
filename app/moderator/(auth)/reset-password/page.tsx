"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter} from "next/navigation";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase/supabase";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [shouldShowPassword, setShouldShowPassword] = useState(false);
    const [shouldShowConfirmPassword, setShouldShowConfirmPassword] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userEmail, setUserEmail] = useState("");

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

            if (roleError || !userData || userData.role !== 'MODERATOR') {
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
            router.push("sign-in?success=true");

        } catch (error: unknown) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(error instanceof Error ? error.message : "Failed to verify code. Please try again.");
        }
    };

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-brand-dark">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
            </div>
        );
    }

    return (
        <main className="flex flex-col min-h-screen w-full bg-brand-dark">
            <div className="absolute flex items-center mt-5 ml-6">
                <div className="relative h-16 w-16">
                    <Image
                        src="/svgs/gathr-logo-initial.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="relative h-15 w-25">
                    <Image
                        src="/svgs/gathr-logo-full.svg"
                        alt="Gathr Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="mx-auto flex items-center justify-end w-full min-h-screen z-20 overflow-hidden">
                <div className="max-w-lg w-full text-white">
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase">
                            Account <br/> Change Password
                        </h1>
                        <p className="mt-2 text-sm text-[#C2C2C2]">
                            Changing password for account {userEmail}
                        </p>
                    </div>

                    <form className="space-y-2">
                        <div className="space-y-2">
                            <Label className="text-base font-heading font-semibold text-white" htmlFor="password">
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
                                        "h-14 mt-2 rounded-xl border-3 bg-[#312245] px-4 text-white placeholder:text-white/60 focus-visible:ring-offset-0 transition-colors",
                                        hasError ? "border-[#C44E52]" : "border-[#574272]"
                                    )}
                                />
                                {formData.password.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShouldShowPassword(!shouldShowPassword)}
                                        className="absolute right-4 top-9 -translate-y-1/2"
                                    >
                                        {shouldShowPassword ? (
                                            <Eye
                                                className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        ) : (
                                            <EyeOff
                                                className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-heading font-semibold text-white" htmlFor="confirmPassword">
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
                                        "h-14 mt-2 rounded-xl border-3 bg-[#312245] px-4 text-white placeholder:text-white/60 focus-visible:ring-offset-0 transition-colors",
                                        hasError ? "border-[#C44E52]" : "border-[#574272]"
                                    )}
                                />
                                {formData.confirmPassword.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setShouldShowConfirmPassword(!shouldShowConfirmPassword)}
                                        className="absolute right-4 top-9 -translate-y-1/2"
                                    >
                                        {shouldShowConfirmPassword ? (
                                            <Eye
                                                className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        ) : (
                                            <EyeOff
                                                className="h-6 w-6 text-brand-accent hover:brightness-110 transition-colors"/>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        {hasError && (
                            <p className="text-[#C44E52] text-sm animate-in fade-in slide-in-from-top-1">
                                {errorMessage}
                            </p>
                        )}

                        <Button
                            type="submit"
                            variant={"elevated"}
                            onClick={handleChangePassword}
                            disabled={isLoading || (!formData.password.trim() || !formData.confirmPassword.trim())}
                            className="mt-9 h-16 w-full rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-all"
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
                <div className="relative h-160 w-160">
                    <Image
                        src="/svgs/change-password.svg"
                        alt="Change Password Clipart"
                        fill
                        className="object-contain"
                    />
                </div>

            </div>

            <div className="absolute inset-0 overflow-hidden z-50 pointer-events-none">
                <motion.div
                    className="absolute -top-20 -right-55 h-80 w-80 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: 50}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                />

                <motion.div
                    className="absolute -top-25 left-1/2 h-40 w-40 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{y: -40, scale: 1.1}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                />

                <motion.div
                    className="absolute top-55 -left-55 h-110 w-110 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{x: 0, y: 0}}
                    whileHover={{x: -60, scale: 1.05}}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />

                <motion.div
                    className="absolute -bottom-55 right-120 h-100 w-100 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
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
