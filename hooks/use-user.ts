import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { FullUser } from "@/types/user";

export function useUser() {
    const supabase = createClient();

    return useQuery<FullUser | null>({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();
            if (authError || !user) return null;

            const { data: userData, error: userDataError } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            if (userDataError) {
                console.error("User data not found in public.users:", userDataError);
                throw userDataError;
            }

            return { ...user, ...userData } as FullUser;
        },
        staleTime: 1000 * 60 * 5,
    });
}
