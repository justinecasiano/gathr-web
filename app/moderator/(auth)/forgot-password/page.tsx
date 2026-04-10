"use client";
import Image from "next/image";
import {motion} from "motion/react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {z} from "zod";
import {supabase} from "@/lib/supabase/supabase";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");

    const emailSchema = z.string().email("Invalid email format");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setHasError(false);
        setErrorMessage("");

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (!email.trim()) {
            setIsLoading(false);
            setHasError(true);
            setErrorMessage("This field is required");
            return;
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

            if (userData.role !== "MODERATOR") {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage("Access denied. This account is not a Moderator.");
                return;
            }

            const {error: resetError} = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/moderator/reset-password`,
            });

            if (resetError) {
                setIsLoading(false);
                setHasError(true);
                setErrorMessage(resetError.message);
                return;
            }

            setIsLoading(false);

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
    return (
        <main className="flex flex-col min-h-screen w-full bg-brand-dark">
            <div className="flex items-center  mt-5 ml-6">
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

            <div className="mx-auto flex items-center justify-center w-[80%] z-20">
                <div className="relative h-140 w-140">
                    <Image
                        src="/svgs/password-reset.svg"
                        alt="Forgot Password Clipart"
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="max-w-lg w-full text-white">
                    <div className="mb-7">
                        <h1 className="text-4xl font-display font-black tracking-tight text-white uppercase">
                            Account <br/> Password Reset
                        </h1>
                    </div>

                    <form className="space-y-2">
                        <div>
                            <Label className="text-base font-heading font-semibold text-white" htmlFor="email">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address here"
                                className={cn(
                                    "h-14 mt-2 rounded-xl border-3 bg-[#312245] px-4 text-white placeholder:text-white/60 focus-visible:ring-offset-0 transition-colors",
                                    hasError ? "border-[#C44E52]" : "border-[#574272]"
                                )}
                            />
                        </div>

                        {hasError && (
                            <p className="text-[#C44E52] text-sm animate-in fade-in slide-in-from-top-1">
                                {errorMessage}
                            </p>
                        )}

                        <div className="mt-8 w-full flex items-center justify-between">
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
                                onClick={handleReset}
                                disabled={isLoading || !email.trim()}
                                className="h-16 w-[62%] rounded-3xl bg-brand-accent font-display text-xl font-black uppercase text-white shadow-lg transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-8 w-8 animate-spin"/>
                                        Please Wait
                                    </>
                                ) : (
                                    "CONFIRM"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="absolute inset-0 overflow-hidden">
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
    )
        ;
}
