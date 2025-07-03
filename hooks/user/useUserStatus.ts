// src/hooks/useUserStatus.ts

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { USER_STALE_TIME } from '@/constants/staleTimes'
import { fetchUserStatus } from '@/server/auth/fetchUserStatus'

type UserStatus = {
    id: string
    onboarding_completed: boolean
} | null

export function useUserStatus() {
    return useQuery<UserStatus>({
        queryKey: ['user', 'status'],
        queryFn: fetchUserStatus,
        staleTime: USER_STALE_TIME,
        retry: false, // Don’t retry on null
    })
}