'use client'

import * as React from "react"
import {Loader2} from 'lucide-react'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Header} from "@/components/ui/header";
import Image from "next/image";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {NotificationToast, ToastVariant} from "@/components/ui/notification-toast";
import {useUser} from "@/hooks/use-user";
import {supabase} from "@/lib/supabase/supabase";
import {z} from "zod";

interface ToastState {
    title: string;
    description: string;
    variant: ToastVariant;
}

export default function SettingsPage() {
    const {data: user, isLoading: isUserLoading} = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReset, setIsLoadingReset] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [shouldShowToast, setShouldShowToast] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const [toastData, setToastData] = useState<ToastState>({
        title: "",
        description: "",
        variant: "success"
    });

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
                username: user.display_name ?? "",
            });
        }
    }, [user]);

    const updateProfileSchema = z.object({
        fullName: z
            .string()
            .min(3, "Full name is too short")
            .refine((val) => val.trim().includes(" "), {
                message: "Please enter both your first and last name.",
            }),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters.")
            .max(20, "Username is too long.")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    });
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        const result = updateProfileSchema.safeParse(formData);

        if (!result.success) {
            const firstError = result.error.issues[0].message;
            setErrorMessage(firstError);
            setToastData({
                title: "Validation Error",
                description: firstError,
                variant: "error",
            });
            setShouldShowToast(true);
            setIsLoading(false);
            return;
        }

        const nameParts = formData.fullName.trim().split(/\s+/);
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(" ");

        try {
            if (!user?.id) throw new Error("User session not found");

            const newUsername = formData.username;

            const { data: existingUser, error: checkError } = await supabase
                .from("users")
                .select("id")
                .eq("display_name", newUsername)
                .neq("id", user.id)
                .maybeSingle();

            if (checkError) throw checkError;

            if (existingUser) {
                setToastData({
                    title: "Username Taken",
                    description: "This username is already in use. Please try another one.",
                    variant: "error",
                });
                setShouldShowToast(true);
                setIsLoading(false);
                return;
            }

            const { error: updateError } = await supabase
                .from("users")
                .update({
                    first_name,
                    last_name,
                    display_name: formData.username,
                })
                .eq("id", user.id);

            if (updateError) throw updateError;

            setToastData({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
                variant: "success",
            });

        } catch (error: any) {
            const msg = error.message || "An unexpected error occurred";
            setToastData({
                title: "Update Failed",
                description: msg,
                variant: "error",
            });
        } finally {
            setIsLoading(false);
            setShouldShowToast(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (hasError) setHasError(false);
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoadingReset(true);

        if (!user?.email) {
            setIsLoadingReset(false);
            setToastData({
                title: "Error",
                description: "User email not found.",
                variant: "error"
            });
            setShouldShowToast(true);
            return;
        }

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/organizer/reset-password`,
            });

            if (resetError) {
                setToastData({
                    title: "Error Sending Link",
                    description: resetError.message,
                    variant: "error"
                });
                setErrorMessage(resetError.message);
            } else {
                setToastData({
                    title: "Password Reset Link Sent",
                    description: `Please check your email for password reset link.`,
                    variant: "success"
                });
                setCountdown(60);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to reset password.";
            setToastData({
                title: "System Error",
                description: message,
                variant: "error"
            });
            setErrorMessage(message);
        } finally {
            setIsLoadingReset(false);
            setShouldShowToast(true);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <NotificationToast
                isOpen={shouldShowToast}
                onClose={() => setShouldShowToast(false)}
                variant={toastData.variant}
                title={toastData.title}
                description={toastData.description}
                duration={3000}
            />

            <Header/>
            <main className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Settings</h1>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">Configure your account and
                            system preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-5">
                    <Card
                        className="rounded-[20px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <CardHeader className="flex flex-row items-center gap-3 p-0">
                            <Image
                                src="/svgs/user-profile-icon.svg"
                                width="30"
                                height="30"
                                alt="Icon"
                            />
                            <CardTitle
                                className="text-2xl font-bold font-display text-[#261A36] tracking-tight">Profile</CardTitle>
                        </CardHeader>

                        <CardContent className="py-5 flex flex-col items-center gap-8">
                            <div className="relative group cursor-pointer w-fit overflow-hidden rounded-full">
                                <Image
                                    src="/svgs/profile-icon.svg"
                                    alt="Avatar"
                                    width={196}
                                    height={196}
                                    className="transition-all duration-300 group-hover:brightness-50"
                                />

                                <div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <Image
                                        src="/svgs/camera-icon.svg"
                                        alt="Camera"
                                        width={27}
                                        height={27}
                                    />
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Angela Mae Cabrera"
                                    className={cn(
                                        "h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black placeholder:text-[#252E49]/50 focus-visible:ring-offset-0 transition-colors",
                                        hasError ? "border-[#C44E52]" : "border-[#312245]"
                                    )}
                                />
                                <Input
                                    value={user ? user.email : "Loading..."}
                                    disabled={true}
                                    className={cn(
                                        "h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black  placeholder:text-[#252E49]/50 focus-visible:ring-offset-0 transition-colors border-[#312245]"
                                    )}
                                />
                                <Input
                                    value="Event Organizer"
                                    disabled={true}
                                    className={cn(
                                        "h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black  placeholder:text-[#252E49]/50 focus-visible:ring-offset-0 transition-colors border-[#312245]"
                                    )}
                                />
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="a.cabrera67"
                                    className={cn(
                                        "h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black  placeholder:text-[#252E49]/50 focus-visible:ring-offset-0 transition-colors",
                                        hasError ? "border-[#C44E52]" : "border-[#312245]"
                                    )}
                                />
                                {hasError && (
                                    <p className="text-[#C44E52] text-sm animate-in fade-in slide-in-from-top-1">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>

                            <Button
                                onClick={handleUpdate}
                                type="submit"
                                variant="elevated"
                                disabled={isLoading}
                                className="h-16 w-full rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-8 w-8 animate-spin"/>
                                        Please Wait
                                    </>
                                ) : (
                                    "UPDATE PROFILE"
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card
                        className="rounded-[20px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <CardHeader className="flex flex-row items-center gap-3 p-0">
                            <Image
                                src="/svgs/security-icon.svg"
                                width="30"
                                height="30"
                                alt="Icon"
                            />
                            <CardTitle
                                className="text-2xl font-bold font-display text-[#261A36] tracking-tight">Security</CardTitle>
                        </CardHeader>

                        <CardContent className="p-0 space-y-8">
                            <div className="space-y-4">
                                <Input
                                    value="· · · · · · · · · · · · · · · · · · · · · · · · "
                                    disabled={true}
                                    className={cn(
                                        "h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black  placeholder:text-[#252E49]/50 focus-visible:ring-offset-0 transition-colors border-[#312245]"
                                    )}
                                />
                            </div>

                            <Button
                                onClick={handleReset}
                                type="submit"
                                variant="elevated"
                                disabled={isLoadingReset}
                                className="h-16 w-full rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                            >

                                {isLoadingReset ? <Loader2 className="h-8 w-8 animate-spin"/> : countdown > 0 ? `Retry in ${countdown}s` : "RESET PASSWORD"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
