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
    {progres: null, route: "/sign-in/onboarding/verified"},
    {progres: 0, route: "/sign-in/onboarding/name"},
    {progres: 1, route: "/sign-in/onboarding/date-of-birth"},
    {progres: 2, route: "/sign-in/onboarding/gender"},
    {progres: 3, route: "/sign-in/onboarding/interest"},
    {progres: 4, route: "/sign-in/onboarding/looking-for"},
    {progres: 5, route: "/sign-in/onboarding/location"},
    {progres: 6, route: "/sign-in/onboarding/pictures"},
    {progres: null, route: "/sign-in/onboarding/profile-base-completed"},
]



export function ProgressBar() {
    const pathname = usePathname();
    const isBaseOnboarding = !pathname.startsWith("/sign-in/onboarding/more-about-you")

  // Use index to compute progress smoothly
    const currentRoute = onboardingRoutes.find(r => r.route === pathname);
    if (!currentRoute || currentRoute.progres === null) return null
    
    const progress = (currentRoute.progres) / (isBaseOnboarding ? ONBOARDING_BASE_PAGES : ONBOARDING_PAGES) * 100

    return(
    <>
        {/* {isVisible && ( */}
        <Box className="py-6">
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