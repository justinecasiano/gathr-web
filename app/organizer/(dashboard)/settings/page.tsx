'use client'

import * as React from "react"
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/ui/header";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NotificationToast, ToastVariant } from "@/components/ui/notification-toast";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase/supabase";
import { z } from "zod";
import {motion} from "motion/react";
import {getURL} from "@/lib/utils";
import { useRef } from "react";
import PopupModal from "@/components/ui/popup-modal";

interface ToastState {
    title: string;
    description: string;
    variant: ToastVariant;
}

export default function SettingsPage() {
    const { data: user, isLoading: isUserLoading, refetch } = useUser(); // Ensure refetch is destructured
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReset, setIsLoadingReset] = useState(false);
    const [shouldShowToast, setShouldShowToast] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [lastSavedData, setLastSavedData] = useState({ fullName: "", username: "" });

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
    });

    const [toastData, setToastData] = useState<ToastState>({
        title: "",
        description: "",
        variant: "success"
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    useEffect(() => {
        if (user) {
            const initialData = {
                fullName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
                username: user.display_name ?? "",
            };
            setFormData(initialData);
            setLastSavedData(initialData);
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

    const handleCloseToast = React.useCallback(() => {
        setShouldShowToast(false);
    }, []);

    const handleProfileClick = () => setIsModalOpen(true);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            setToastData({
                title: "File Too Large",
                description: "Image must be less than 5MB.",
                variant: "error"
            });
            setShouldShowToast(true);
            return;
        }

        setIsUploading(true);

        try {
            const filePath = `${user.id}/profile`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: true,
                    contentType: file.type
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

            const { error: dbError } = await supabase
                .from('users')
                .update({ avatar_url: urlWithCacheBuster })
                .eq('id', user.id);

            if (dbError) throw dbError;

            await refetch();

            setToastData({ title: "Success Updating Picture", description: "Profile picture updated!", variant: "success" });
        } catch (error: any) {
            setToastData({ title: "Upload Failed", description: error.message, variant: "error" });
        } finally {
            setIsUploading(false);
            setShouldShowToast(true);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            formData.fullName === lastSavedData.fullName &&
            formData.username === lastSavedData.username
        ) {
            setToastData({
                title: "No Changes Detected",
                description: "You haven't modified your name or username.",
                variant: "error",
            });
            setShouldShowToast(true);
            return;
        }

        setIsLoading(true);

        const result = updateProfileSchema.safeParse(formData);

        if (!result.success) {
            const firstError = result.error.issues[0].message;
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

            setLastSavedData({
                fullName: formData.fullName,
                username: formData.username
            });

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
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
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
            const handshakeKey = crypto.randomUUID();

            localStorage.setItem('reset_handshake_key', handshakeKey);

            const siteUrl = getURL();
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${siteUrl}/organizer/reset-password?key=${handshakeKey}`,
            });

            if (resetError) {
                setToastData({
                    title: "Error Sending Link",
                    description: resetError.message,
                    variant: "error"
                });
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
        } finally {
            setIsLoadingReset(false);
            setShouldShowToast(true);
        }
    };

    return (
        <div className="flex relative min-h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <PopupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => { setIsModalOpen(false); fileInputRef.current?.click(); }}
                title="Update Profile Picture?"
                confirmText="Upload New"
                cancelText="Cancel"
            />

            <NotificationToast
                isOpen={shouldShowToast}
                onClose={handleCloseToast}
                variant={toastData.variant}
                title={toastData.title}
                description={toastData.description}
                duration={3000}
            />

            <Header />
            <main className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full z-10 relative">
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
                    <Card className="rounded-[20px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <CardHeader className="flex flex-row items-center gap-3 p-0">
                            <Image src="/svgs/user-profile-icon.svg" width="30" height="30" alt="Icon" />
                            <CardTitle className="text-2xl font-bold font-display text-[#261A36] tracking-tight">Profile</CardTitle>
                        </CardHeader>

                        <CardContent className="py-5 flex flex-col items-center gap-8">
                            <div
                                onClick={handleProfileClick}
                                className="relative group cursor-pointer w-[196px] h-[196px] overflow-hidden rounded-full"
                            >
                                <Image
                                    src={user?.avatar_url || "/svgs/profile-icon.svg"}
                                    alt="Avatar"
                                    width={196}
                                    height={196}
                                    className="aspect-square object-cover transition-all duration-300 group-hover:brightness-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-300">
                                    {isUploading ? (
                                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                                    ) : (
                                        <Image src="/svgs/camera-icon.svg" alt="Camera" width={27} height={27} />
                                    )}
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Angela Mae Cabrera"
                                    className="h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black border-[#312245]"
                                />
                                <Input
                                    value={user ? user.email : "Loading..."}
                                    disabled={true}
                                    className="h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black border-[#312245]"
                                />
                                <Input
                                    value="Event Organizer"
                                    disabled={true}
                                    className="h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black border-[#312245]"
                                />
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="a.cabrera67"
                                    className="h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black border-[#312245]"
                                />
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
                                        <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                                        Please Wait
                                    </>
                                ) : "UPDATE PROFILE"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[20px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <CardHeader className="flex flex-row items-center gap-3 p-0">
                            <Image src="/svgs/security-icon.svg" width="30" height="30" alt="Icon" />
                            <CardTitle className="text-2xl font-bold font-display text-[#261A36] tracking-tight">Security</CardTitle>
                        </CardHeader>

                        <CardContent className="py-5 space-y-8">
                            <div className="space-y-4">
                                <Input
                                    value="· · · · · · · · · · · · · · · · · · · · · · · · "
                                    disabled={true}
                                    className="h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black border-[#312245]"
                                />
                            </div>

                            <Button
                                onClick={handleReset}
                                variant="elevated"
                                disabled={isLoadingReset}
                                className="h-16 w-full rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-transform active:scale-95"
                            >
                                {isLoadingReset ? <Loader2 className="h-10 w-10 animate-spin" /> : countdown > 0 ? `Retry in ${countdown}s` : "RESET PASSWORD"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <div className="hidden lg:block absolute inset-0 pointer-events-none h-full">
                <motion.div
                    className="absolute -top-5 -right-55 h-90 w-90 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 50 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute -top-22 left-90 h-40 w-40 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ y: -40, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />

                <motion.div
                    className="absolute top-35 left-10 h-130 w-130 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: -60, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />

                <motion.div
                    className="absolute -bottom-35 -right-10 h-160 w-160 rounded-full bg-[#7B55A3]/10 pointer-events-auto"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: -60, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
            </div>
        </div>
    )
}
