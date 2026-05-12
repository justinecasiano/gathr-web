"use client";

import {BackgroundBubbles} from "@/components/ui/background-bubbles";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Header} from "@/components/ui/header";
import {Input} from "@/components/ui/input";
import {NotificationToast, ToastVariant} from "@/components/ui/notification-toast";
import PopupModal from "@/components/ui/popup-modal";
import {useUser} from "@/hooks/use-user";
import {supabase} from "@/lib/supabase/supabase";
import {getURL} from "@/lib/utils";
import {Loader2, Search} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {z} from "zod";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

interface ToastState {
    title: string;
    description: string;
    variant: ToastVariant;
}

export default function SettingsPage() {
    const {data: user, isLoading: isUserLoading, refetch} = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingReset, setIsLoadingReset] = useState(false);
    const [shouldShowToast, setShouldShowToast] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [lastSavedData, setLastSavedData] = useState({
        firstName: "",
        lastName: "",
        username: ""
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
    });

    const [toastData, setToastData] = useState<ToastState>({
        title: "",
        description: "",
        variant: "success",
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
            const freshData = {
                firstName: user.first_name ?? "",
                lastName: user.last_name ?? "",
                username: user.display_name ?? "",
            };
            setFormData(freshData);
            setLastSavedData(freshData);
        }
    }, [user]);

    const updateProfileSchema = z.object({
        firstName: z.string()
            .min(2, "First name is too short")
            .max(50, "First name is too long")
            .regex(/^[a-zA-Z\s.]*$/, "Only letters allowed"),
        lastName: z.string()
            .min(2, "Last name is too short")
            .max(50, "Last name is too long")
            .regex(/^[a-zA-Z\s.]*$/, "Only letters allowed"),
        username: z.string()
            .min(3, "Username must be at least 3 characters.")
            .max(20, "Username is too long")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    });

    const processImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = document.createElement("img");
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const size = 400;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext("2d");

                    const sourceSize = Math.min(img.width, img.height);
                    const startX = (img.width - sourceSize) / 2;
                    const startY = (img.height - sourceSize) / 2;

                    ctx?.drawImage(img, startX, startY, sourceSize, sourceSize, 0, 0, size, size);

                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Canvas to Blob failed"));
                    }, "image/webp", 0.85);
                };
            };
            reader.onerror = reject;
        });
    };

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
                variant: "error",
            });
            setShouldShowToast(true);
            return;
        }

        setIsUploading(true);

        try {
            const processedBlob = await processImage(file);
            const filePath = `${user.id}/profile.webp`;

            const {error: uploadError} = await supabase.storage.from("avatars").upload(filePath, file, {
                upsert: true,
                contentType: "image/webp",
            });

            if (uploadError) throw uploadError;

            const {
                data: {publicUrl},
            } = supabase.storage.from("avatars").getPublicUrl(filePath);

            const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

            const {error: dbError} = await supabase
                .from("users")
                .update({avatar_url: urlWithCacheBuster})
                .eq("id", user.id);

            if (dbError) throw dbError;

            await refetch();

            setToastData({
                title: "Success Updating Picture",
                description: "Profile picture updated!",
                variant: "success"
            });
        } catch (error: any) {
            setToastData({title: "Upload Failed", description: error.message, variant: "error"});
        } finally {
            setIsUploading(false);
            setShouldShowToast(true);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.firstName === lastSavedData.firstName && formData.lastName === lastSavedData.lastName && formData.username === lastSavedData.username) {
            setToastData({
                title: "No Changes Detected",
                description: "You haven't modified your name or username.",
                variant: "warning",
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

        setIsUpdateModalOpen(true);
    };

    const confirmUpdate = async () => {
        setIsUpdateModalOpen(false);
        setIsLoading(true);

        const first_name = formData.firstName;
        const last_name = formData.lastName;

        try {
            if (!user?.id) throw new Error("User session not found");

            const newUsername = formData.username;

            const {data: existingUser, error: checkError} = await supabase
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

            const {error: updateError} = await supabase
                .from("users")
                .update({
                    first_name,
                    last_name,
                    display_name: formData.username,
                })
                .eq("id", user.id);

            if (updateError) throw updateError;

            await refetch();

            setLastSavedData({
                firstName: first_name,
                lastName: last_name,
                username: formData.username,
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
        const {id, value} = e.target;
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
                variant: "error",
            });
            setShouldShowToast(true);
            return;
        }

        try {
            const handshakeKey = crypto.randomUUID();

            localStorage.setItem("reset_handshake_key", handshakeKey);

            const siteUrl = getURL();
            const {error: resetError} = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${siteUrl}/moderator/reset-password?key=${handshakeKey}`,
            });

            if (resetError) {
                setToastData({
                    title: "Error Sending Link",
                    description: resetError.message,
                    variant: "error",
                });
            } else {
                setToastData({
                    title: "Password Reset Link Sent",
                    description: `Please check your email for password reset link.`,
                    variant: "success",
                });
                setCountdown(60);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to reset password.";
            setToastData({
                title: "System Error",
                description: message,
                variant: "error",
            });
        } finally {
            setIsLoadingReset(false);
            setShouldShowToast(true);
        }
    };

    return (
        <div className="flex relative min-h-screen w-full flex-col bg-[#F7F0FF] overflow-hidden">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>

            <PopupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    setIsModalOpen(false);
                    fileInputRef.current?.click();
                }}
                title="Update Profile Picture?"
                confirmText="Upload New"
                cancelText="Cancel"
            />

            <PopupModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false)
                    setIsLoading(false);
                }}
                onConfirm={confirmUpdate}
                title="Update user profile?"
                confirmText="Save Changes"
                cancelText="Discard"
            />

            <NotificationToast
                isOpen={shouldShowToast}
                onClose={handleCloseToast}
                variant={toastData.variant}
                title={toastData.title}
                description={toastData.description}
                duration={3000}
            />

            <Header/>
            <main className="flex-1 px-10 py-6 space-y-8 max-w-[1600px] mx-auto w-full z-10 relative">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-bold font-display text-[#261A36] tracking-tight">Settings</h1>
                        </div>
                        <p className="text-[#261A36] text-lg font-display font-bold mt-1">
                            Configure your account and system preferences
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-5">
                    <Card
                        className="rounded-[20px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <CardHeader className="flex flex-row items-center gap-3 p-0">
                            <Image src="/svgs/user-profile-icon.svg" width="30" height="30" alt="Icon"/>
                            <CardTitle className="text-2xl font-bold font-display text-[#261A36] tracking-tight">
                                Profile
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="py-5 flex flex-col items-center gap-8">
                            <div className="relative group w-[196px] h-[196px]">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative cursor-zoom-in w-full h-full overflow-hidden rounded-full border-4 border-[#574272] shadow-xl transition-transform hover:scale-[1.02] active:scale-95">
                                            <Image
                                                src={user?.avatar_url || "/svgs/profile-icon.svg"}
                                                alt="Avatar"
                                                fill
                                                className="aspect-square object-cover transition-all duration-300 group-hover:brightness-90"
                                            />
                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Search className="text-white opacity-50" size={32} />
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[90vw] sm:max-w-[500px] p-0 border-none bg-transparent shadow-none flex items-center justify-center">
                                        <DialogTitle className="sr-only">Profile Picture Preview</DialogTitle>
                                        <div className="relative w-full aspect-square max-h-[80vh]">
                                            <Image
                                                src={user?.avatar_url || "/svgs/profile-icon.svg"}
                                                alt="Avatar Large"
                                                fill
                                                className="object-contain rounded-lg"
                                                priority
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <button
                                    disabled={isUploading}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleProfileClick();
                                    }}
                                    className="absolute bottom-2 right-2 p-3 bg-white rounded-full border-4 border-[#574272] shadow-lg transition-all transform hover:scale-110 active:scale-90 z-20"
                                    aria-label="Upload new picture"
                                >
                                    {isUploading ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-black"/>
                                    ) : (
                                        <Image src="/svgs/camera-icon.svg" alt="Camera" width={20} height={20} />
                                    )}
                                </button>
                            </div>

                            <div className="w-full space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#574272] ml-1 uppercase">First
                                            Name</label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-14 rounded-[13px] border-2 bg-white px-4 !text-base font-bold font-display text-black border-[#312245]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#574272] ml-1 uppercase">Last
                                            Name</label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="h-14 rounded-[13px] border-2 bg-white px-4 !text-base font-bold font-display text-black border-[#312245]"
                                        />
                                    </div>
                                </div>
                                <Input
                                    value={user ? user.email : "Loading..."}
                                    disabled={true}
                                    className="h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black border-[#312245]"
                                />
                                <Input
                                    value="Moderator"
                                    disabled={true}
                                    className="h-14 mt-2 rounded-[13px] border-2 bg-white px-4 font-bold !text-base font-display text-black border-[#312245]"
                                />
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#574272] ml-1 uppercase">Username</label>
                                    <div className="relative">
                                        <span
                                            className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#574272] text-lg">@</span>
                                        <Input
                                            id="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="h-14 rounded-[13px] border-2 bg-white pl-10 pr-4 font-bold font-display text-black border-[#312245]"
                                        />
                                    </div>
                                </div>
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
                                        <Loader2 className="mr-2 h-10 w-10 animate-spin"/>
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
                            <Image src="/svgs/security-icon.svg" width="30" height="30" alt="Icon"/>
                            <CardTitle className="text-2xl font-bold font-display text-[#261A36] tracking-tight">
                                Security
                            </CardTitle>
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
                                {isLoadingReset ? (
                                    <Loader2 className="h-10 w-10 animate-spin"/>
                                ) : countdown > 0 ? (
                                    `Retry in ${countdown}s`
                                ) : (
                                    "RESET PASSWORD"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <BackgroundBubbles/>
        </div>
    );
}
