import { getUser } from "@/server/auth/getUser";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";

export default function Main() {

    const {data, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser()
    })

    console.log("Data: ", data);

    if (isPending || data === undefined) return null

    if (!data) { return <Redirect href="./sign-in"/> } 

    if (!data?.onboarding_completed) { 
        console.log("Onboooarding: ", data?.onboarding_completed);
        return <Redirect href="./sign-in/onboarding/verified"/>
    }

    return <Redirect href="/home"/>


}