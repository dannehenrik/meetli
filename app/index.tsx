import { Redirect } from "expo-router";
import { useUserStatus } from "@/hooks/user/useUserStatus";
import { useFullUser } from "@/hooks/user/useFullUser";

export default function Main() {

    const {data, error, isPending} = useUserStatus()

    if (error) return null //I don't know yet what should happen if there is an error

    if (isPending || data === undefined) return null

    if (!data) { return <Redirect href="./sign-in"/> } 

    if (!data?.onboarding_completed) { 
        return <Redirect href="./sign-in/onboarding/verified"/>
    }

    return <Redirect href="/home"/>

    // Just temporary for testing
    // return <Redirect href="/sign-in/onboarding/profile-base-completed"/>


}