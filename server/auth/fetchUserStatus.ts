import { supabase } from "@/utils/supabase";

type UserStatus = {
    id: string
    onboarding_completed: boolean
} | null

export async function fetchUserStatus(): Promise<UserStatus> {
    const {data: { user: authUser }, error: authError} = await supabase.auth.getUser()

    if (authError || !authUser) { return null }

    const { data, error } = await supabase
        .from('users')
        .select('id, onboarding_completed')
        .eq('id', authUser.id)
        .single()

    if (error) { throw new Error('Error fetching user status: ' + error.message)}

    return data
}