import { USER_STALE_TIME } from "@/constants/staleTimes"
import { CoreUser } from "@/types"
import { supabase } from "@/utils/supabase"
import { useQuery } from "@tanstack/react-query"

export function useCoreUser() {
    return useQuery<CoreUser>({
        queryKey: ['user', 'core'],
        queryFn: fetchUser,
        staleTime: USER_STALE_TIME,
    })
}


export async function fetchUser() : Promise<CoreUser>{
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (!user || userError) { throw new Error("Something went wrong when fetching the user: " + userError?.message) }

    const {data, error} = await supabase.from('users').select('*').eq('id', user.id).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    return data
}