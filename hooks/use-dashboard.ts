import { supabase } from '@/lib/supabase/supabase';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { DateRange } from "react-day-picker";
import { useUser } from "@/hooks/use-user";

export function useDashboard(range: DateRange | undefined) {
    const { data: user } = useUser();

    return useQuery({
        queryKey: ['organizer-stats', user?.id, range?.from, range?.to],

        queryFn: async () => {
            if (!range?.from || !range?.to || !user?.id) return null;

            const { data, error } = await supabase.rpc('get_organizer_dashboard_stats', {
                p_organizer_id: user.id, // Pass the explicit organizer ID
                p_start_date: range.from.toISOString(),
                p_end_date: range.to.toISOString()
            });

            if (error) {
                console.error("RPC Error:", error.message);
                throw new Error(error.message);
            }

            return data;
        },

        enabled: !!range?.from && !!range?.to && !!user?.id,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });
}
