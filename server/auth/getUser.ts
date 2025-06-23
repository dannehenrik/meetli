import { User } from "@/types";
import { supabase } from "@/utils/supabase";

export async function getUser() : Promise<User | null>{
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { return null }

    const {data, error} = await supabase.from('users').select('*').eq('id', user.id).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    return data
}

export async function getUserFromId(userId: string) : Promise<User | null>{
 
    const {data, error} = await supabase.from('users').select('*').eq('id', userId).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    return data
}

