"use client";

import {useState} from "react";
import {useRouter} from "next/navigation"; // Added for redirection
import Link from "next/link";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import WelcomeSide from "@/components/custom/welcome-side";
import {cn} from "@/lib/utils";
import {supabase} from "@/lib/supabase";
import {z} from "zod";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [shouldShowPassword, setShouldShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const loginSchema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        if (hasError) setHasError(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (!formData.email.trim() || !formData.password.trim()) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage("Both email and password are required.");
            return;
        }

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(result.error.issues[0].message);
            return;
        }

        try {
            const {data: authCheck, error: authError} = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError || !authCheck.user) {
                setHasError(true);
                setErrorMessage(authError?.message || "Authentication failed.");
                setIsLoading(false);
                return;
            }

            const {data: userData, error: roleError} = await supabase
                .from("users")
                .select("role")
                .eq("id", authCheck.user.id)
                .single();

            if (roleError || userData?.role !== "MODERATOR") {
                await supabase.auth.signOut();
                setHasError(true);
                setIsLoading(false);
                setErrorMessage("Access denied. This account is not a Moderator.");
                return;
            }

            await supabase.auth.signOut();

            const {error: otpError} = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    shouldCreateUser: false,
                },
            });

            if (otpError) {
                setHasError(true);
                setIsLoading(false);
                setErrorMessage(otpError.message);
            } else
                router.push(`sign-in/verify?email=${encodeURIComponent(formData.email)}`);

        } catch (error: unknown) {
            setHasError(true);
            setIsLoading(false);

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }
    };

    return (
        <main className="flex min-h-screen w-full bg-brand-dark">
            <WelcomeSide/>
            <div className="w-[65%] h-screen flex items-center justify-center py-20 px-20">
                <div className="max-w-2xl w-full text-white">
                    <div className="mb-10">
                        <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase">
                            Sign In
                        </h1>
                        <p className="mt-4 text-sm text-[#C2C2C2]">
                            Please log in to access the{" "}
                            <span className="font-semibold text-gray-200">moderator</span> account.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <Label className="text-base font-heading font-semibold text-white" htmlFor="email">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address here"
                                className={cn(
                                    "h-14 mt-2 rounded-xl border-3 bg-[#312245] px-4 text-white placeholder:text-white/60 focus-visible:ring-offset-0 transition-colors",
                                    hasError ? "border-[#C44E52]" : "border-[#574272]"
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-heading font-semibold text-white" htmlFor="password">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    type={shouldShowPassword ? "text" : "password"}
                                    placeholder="Enter password here"
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

                            {hasError && (
                                <p className="text-[#C44E52] text-sm animate-in fade-in slide-in-from-top-1">
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="mt-4 flex items-center space-x-2">
                                <Checkbox id="terms"
                                          className="h-6 w-6 bg-[#574272] data-[state=checked]:bg-[#574272]"/>
                                <Label htmlFor="terms" className="text-sm font-medium text-white">
                                    Keep me logged in
                                </Label>
                            </div>
                            <Link href="forgot-password" className="text-sm font-bold text-[#E05723] hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant={"elevated"}
                            disabled={isLoading || (!formData.email.trim() || !formData.password.trim())}
                            className="mt-4 h-16 w-full rounded-2xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-all "
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin"/>
                                    Please Wait
                                </>
                            ) : (
                                "LOGIN"
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm font-bold text-[#C2C2C2]">
                        Are you an Organizer?{" "}
                        <Link href="/organizer/sign-in"
                              className="text-[#C2C2C2] font-medium underline underline-offset-3">
                            Switch to Organizer
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
