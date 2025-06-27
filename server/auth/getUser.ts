import { User } from "@/types";
import { supabase } from "@/utils/supabase";



export async function getUser() : Promise<User | null>{
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { return null }

    const {data, error} = await supabase.from('users').select('*').eq('id', user.id).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    console.log("User: ", data);

    return data
}


export async function getUserId() : Promise<string>{
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) throw new Error("Something went wrong when fetching the userId: " + error?.message);

    return user.id
}

export async function getUserFromId(userId: string) : Promise<User | null>{
 
    const {data, error} = await supabase.from('users').select('*').eq('id', userId).single();

    if (error || !data) { throw new Error("Something went wrong when fetching the user: " + error?.message) }

    return data
}

