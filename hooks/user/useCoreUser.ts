import { useQuery } from "@tanstack/react-query"
import { USER_STALE_TIME } from "@/constants/staleTimes"
import { User } from "@/types"
import { supabase } from "@/utils/supabase"

export function useCoreUser() {
    return useQuery<User>({
        queryKey: ['user', 'core'],
        queryFn: getUser,
        staleTime: USER_STALE_TIME,
    })
}


export async function getUser() : Promise<User>{
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) { throw new Error("Something went wrong when fetching the user: " + userError?.message) }

    const {data, error} = await supabase.from('users').select('*').eq('id', user.id).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    return data
}