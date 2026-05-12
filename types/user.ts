import { User as SupabaseAuthUser } from "@supabase/supabase-js";

export type UserRole = "PARTICIPANT" | "MODERATOR";

export interface User {
    id: string;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    role: UserRole;
    department: string | null;
    school: string;
    is_umak: boolean;
    is_alumni: boolean;
    created_at: string;
    email: string | null;
    avatar_url: string | null;
}

export type FullUser = SupabaseAuthUser & User;
