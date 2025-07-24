import { USER_STALE_TIME } from "@/constants/staleTimes"
import { CoreUser, UserPreferences } from "@/types"
import { supabase } from "@/utils/supabase"
import { useQuery } from "@tanstack/react-query"

export function usePreferences() {
    return useQuery<UserPreferences>({
        queryKey: ['user', 'preferences'],
        queryFn: fetchUserPreferences,
        staleTime: USER_STALE_TIME,
    })
}


export async function fetchUserPreferences() : Promise<UserPreferences>{
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) { throw new Error("Something went wrong when fetching the user: " + userError?.message) }

    const {data, error} = await supabase
        .from('users')
        .select('id, looking_for, interest:gender_preferences, ...user_preferences(min_age, max_age, distance)')
        .eq('id', user.id)
        .single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }


    return data
}