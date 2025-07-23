import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAwesomeToast } from "@/hooks/toasts";
import { useCoreUser } from "@/hooks/user/useCoreUser";
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { CoreUser } from "@/types";
import { calculateAge } from "@/utils/calculateAge";
import { supabase } from "@/utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import React, { useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedVstack = Animated.createAnimatedComponent(VStack);
const AnimatedHeading = Animated.createAnimatedComponent(Heading);
const AnimatedText = Animated.createAnimatedComponent(Text);


export default function ProfileBaseComplete() {
    const queryClient = useQueryClient();
    const {showErrorToast} = useAwesomeToast();

    const {data: user} = useCoreUser() //

    const mutation = useMutation({
        mutationFn: async () => setOnboardingCompleted(user),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user']})
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
                    // router.push("/sign-in/onboarding/more-about-you/intro");
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

// Updates or add the user preferences (age and distance) and sets the onboarding as completed
async function setOnboardingCompleted(user: CoreUser | undefined) {
    if (!user) return 

    const age = calculateAge(user.dob);
    
    const minAge = Math.floor((age / 2) + 9); //Based on some formula
    const maxAge = Math.ceil((age * 2) - 14); //Based on some formula
    const {error: preferencesError} = await supabase
        .from('user_preferences')
        .upsert({min_age: minAge, max_age: maxAge, distance: 50})
        .eq('user_id', user.id)

    if (preferencesError) throw new Error("Something went wrong when updating the user preferences: " + preferencesError.message);


    const {error: onboardingError} = await supabase.from('users').update({onboarding_completed: true}).eq('id', user.id)
    if (onboardingError) throw new Error("Something went wrong when setting the onboarding as complete: " + onboardingError.message);
}