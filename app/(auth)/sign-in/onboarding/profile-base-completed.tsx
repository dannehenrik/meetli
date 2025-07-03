import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import React, { useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedVstack = Animated.createAnimatedComponent(VStack);
const AnimatedHeading = Animated.createAnimatedComponent(Heading);
const AnimatedText = Animated.createAnimatedComponent(Text);


export default function ProfileBaseComplete() {
    const queryClient = useQueryClient();
    const {showErrorToast} = useAwesomeToast();

    const {data: user} = useExtendedUser() //Prefetching

    const mutation = useMutation({
        mutationFn: async () => setOnboardingCompleted(user?.id ?? ""),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user', 'status']})
        }

    })


    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/profile-base-completed") {
            setFabState({
                label: i18n.t("onboarding.fab.continue"),
                isDisabled: false,
                onPress: () => {
                    router.push("/sign-in/onboarding/more-about-you/intro");
                    mutation.mutate();
                }
            })
        }
    }, [pathName])

    return (
        <Box className="flex-1 justify-center items-center gap-11 px-5 w-full pb-28">
            <AnimatedVstack
                entering={FadeInDown.duration(400)}
                className="gap-7 justify-center items-center"
            >
                <Image
                    source={require("@/assets/images/onboarding/onboarding-completed.png")}
                    alt="Profile complete"
                    className="w-[350px] h-[338px]"
                />

                <VStack className="gap-2">
                    <AnimatedHeading 
                    className="text-typography-950 text-4xl font-roboto font-semibold text-center"
                    entering={FadeInDown.duration(400).springify()}
                    >
                        {i18n.t("onboarding.profileBaseCompleted.title")}
                    </AnimatedHeading>

                    <AnimatedText 
                    className="text-typography-500 text-xl font-roboto font-medium text-center"
                    entering={FadeInDown.delay(400).duration(400).springify()}
                    >
                        {i18n.t("onboarding.profileBaseCompleted.description")}
                    </AnimatedText>
                </VStack>
            </AnimatedVstack>
        </Box>
    );
}


async function setOnboardingCompleted(userId: string) {
    const {error} = await supabase.from('users').update({onboarding_completed: true}).eq('id', userId)
    if (error) throw new Error("Something went wrong when setting the onboarding as complete: " + error.message);
}