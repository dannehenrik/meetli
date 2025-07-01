import { Box } from "@/components/ui/box";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { ONBOARDING_BASE_PAGES, ONBOARDING_PAGES } from "@/constants/constants";
import { useNavigationState } from "@react-navigation/native";

import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { router, usePathname } from "expo-router";
import { ChevronLeftIcon } from "@/components/ui/icon";


const onboardingRoutes = [
    {progress: null, route: "/sign-in/onboarding/verified"},
    {progress: 0, route: "/sign-in/onboarding/name"},
    {progress: 1, route: "/sign-in/onboarding/date-of-birth"},
    {progress: 2, route: "/sign-in/onboarding/gender"},
    {progress: 3, route: "/sign-in/onboarding/interest"},
    {progress: 4, route: "/sign-in/onboarding/looking-for"},
    {progress: 5, route: "/sign-in/onboarding/location"},
    {progress: 6, route: "/sign-in/onboarding/pictures"},
    {progress: null, route: "/sign-in/onboarding/profile-base-completed"},
]



export function ProgressBar({pathName} : {pathName: string}) {
    const isBaseOnboarding = !pathName.startsWith("/sign-in/onboarding/more-about-you")

    // Use index to compute progress smoothly
    const currentRoute = onboardingRoutes.find(r => r.route === pathName);
    const isVisible = currentRoute?.progress !== null

    
    const progress = (currentRoute?.progress ?? 0) / (isBaseOnboarding ? ONBOARDING_BASE_PAGES : ONBOARDING_PAGES) * 100

    return(
    <>
        {/* {isVisible && ( */}
        <Box className={`py-6 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <Progress
            value={progress}
            className="w-1/2 mx-auto rounded-full h-1 bg-background-600"
            >
                <ProgressFilledTrack />
            </Progress>
        </Box>
    </>
    )
}