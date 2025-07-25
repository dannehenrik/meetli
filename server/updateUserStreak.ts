import { supabase } from "@/utils/supabase";


export async function updateUserStreak() {
    const {data, error} = await supabase.rpc('update_user_streak');

    if (error || !data) throw new Error("Something went wrong when updating the user streak: " + error?.message)

    return data
}