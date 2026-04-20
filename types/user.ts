import { User as SupabaseAuthUser } from '@supabase/supabase-js';

export type UserRole = 'PARTICIPANT' | 'MODERATOR';

export interface UserTableData {
    id: string;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    role: UserRole;
    department: string | null;
    school: string;
    is_umak: boolean;
    is_alumni: boolean;
    fcm_token: string | null;
    created_at: string;
    email: string | null;
}

export type FullUserProfile = SupabaseAuthUser & UserTableData;