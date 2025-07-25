import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { updateUserStreak } from "@/server/updateUserStreak";
import { supabase } from "@/utils/supabase";
import { useUserStatus } from "@/hooks/user/useUserStatus";

export function useActiveStreak() {
    const queryClient = useQueryClient();
    const { data: user } = useUserStatus();

    const { data: activeStreak } = useQuery({
        queryKey: ["user", "activeStreak"],
        queryFn: () => fetchUserStreak(user!.id),
        staleTime: getMillisecondsUntilTomorrow(),
        enabled: !!user?.id,
    });

    const activeStreakMutation = useMutation({
        mutationFn: updateUserStreak,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["user"]});
        },
        onError: (error) => {
            console.error("Failed to update streak:", error.message)
        },
    });

    useEffect(() => {
        if (activeStreak && !isToday(activeStreak.last_active_day)) {
            activeStreakMutation.mutate();
        }
    }, [activeStreak]);
}

// --- helpers ---

function isToday(date: string | Date): boolean {
    const today = new Date();
    const d = new Date(date);
    return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
    );
}

function getMillisecondsUntilTomorrow(): number {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.getTime() - now.getTime();
}

async function fetchUserStreak(userId: string) {
    const { data, error } = await supabase
        .from("users")
        .select("last_active_day, active_streak")
        .eq("id", userId)
        .single();

    if (error || !data) throw new Error("Something went wrong when fetching the user streak: " + error.message);


    return data;
}
