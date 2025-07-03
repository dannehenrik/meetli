import { useQuery } from "@tanstack/react-query"
import { USER_STALE_TIME } from "@/constants/staleTimes"
import { ExtendedUser, User } from "@/types"
import { supabase } from "@/utils/supabase"

export function useExtendedUser() {
    return useQuery<ExtendedUser>({
        queryKey: ['user', 'extended'],
        queryFn: getUser,
        staleTime: USER_STALE_TIME,
    })
}


export async function getUser() : Promise<ExtendedUser>{
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) { throw new Error("Something went wrong when fetching the user: " + userError?.message)}

    const {data, error} = await supabase.from('user_additional_info').select('*').eq('id', user.id).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    return data
}