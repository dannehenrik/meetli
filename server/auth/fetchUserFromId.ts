import { supabase } from "@/utils/supabase";

export async function fetchUserFromId(userId: string) : Promise<{id: string, onboarding_completed: boolean} | null>{
 
    const {data, error} = await supabase.from('users').select('id, onboarding_completed').eq('id', userId).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    return data
}