import { supabase } from "@/utils/supabase";


export async function fetchUserId() : Promise<string>{
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) throw new Error("Something went wrong when fetching the userId: " + error?.message);

    return user.id
}