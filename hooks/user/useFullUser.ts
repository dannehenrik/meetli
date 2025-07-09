import { USER_STALE_TIME } from "@/constants/staleTimes"
import { CoreUser, User } from "@/types"
import { supabase } from "@/utils/supabase"
import { useQuery } from "@tanstack/react-query"

export function useFullUser() {
    return useQuery<User>({
        queryKey: ['user', 'full'],
        queryFn: fetchFullUser,
        staleTime: USER_STALE_TIME,
    })
}


export async function fetchFullUser() : Promise<User>{
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) { throw new Error("Something went wrong when fetching the user: " + userError?.message) }

    const {data, error} = await supabase
        .from('users')
        .select('*, ...user_additional_info(*, interests:user_interests(interest))')
        .eq('id', user.id)
        .single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    

    return data
}