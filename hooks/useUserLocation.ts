import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserStatus } from "@/hooks/user/useUserStatus";
import { updateUserLocation } from "@/server/updateUserLocation";
import { supabase } from "@/utils/supabase";


export function useLocationUpdater() {
    const { data: user } = useUserStatus();
    const queryClient = useQueryClient();

    const dummyQuery = useQuery({
        queryKey: ["user", "location"],
        queryFn: async () => {
            return String(new Date());
        },
        initialData: () => "first-location",
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const mutation = useMutation({
        mutationFn: async () => updateUserLocation(user?.id ?? ""), 
      
        onError: (error) => {
            console.error("Failed to update location:", error.message);
        },
    });

    useEffect(() => {
        if (dummyQuery.data !== "first-location")
            mutation.mutate();
    }, [dummyQuery.data])


    

  
    // useEffect(() => {
    //     if (dummyQuery.isFetching) {
    //         console.log("Nu muterar vi");
    //         mutation.mutate();
    //     }
    // }, [dummyQuery.isFetching]);
}
