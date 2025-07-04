import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Box } from "@/components/ui/box";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { CircleIcon } from "@/components/ui/icon";
import {
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
} from "@/components/ui/radio";
import { useAwesomeToast } from "@/hooks/toasts";
import { useCoreUser } from "@/hooks/user/useCoreUser";
import { triggerHaptic } from "@/utils/haptics";
import { supabase } from "@/utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';
const AnimatedHeader = Animated.createAnimatedComponent(Heading)
const AnimatedRadioLabel = Animated.createAnimatedComponent(RadioLabel)
const AnimatedRadioIndicator = Animated.createAnimatedComponent(RadioIndicator)
const AnimatedRadioGroup = Animated.createAnimatedComponent(RadioGroup)
// const AnimatedRadioGroup = Animated.createAnimatedComponent(CheckboxGroup)

const lookingForOptions = [
  { value: "serious", label: i18n.t("onboarding.lookingFor.options.serious") },
  { value: "serious-casual", label: i18n.t("onboarding.lookingFor.options.seriousCasual") },
  { value: "casual-serious", label: i18n.t("onboarding.lookingFor.options.casualSerious") },
  { value: "casual", label: i18n.t("onboarding.lookingFor.options.casual") },
  { value: "not-sure", label: i18n.t("onboarding.lookingFor.options.notSure") },
  { value: "friends", label: i18n.t("onboarding.lookingFor.options.friends") },
];


export type LookingFor = "serious" | "serious-casual" | "casual-serious" | "casual" | "not-sure" | "friends"

export default function lookingFor() {
    const queryClient = useQueryClient();

    const {showErrorToast} = useAwesomeToast();

    const [lookingFor, setLookingfor] = useState('');


    const {data: user} = useCoreUser()

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", lookingFor as LookingFor),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'core']})
        }
    })

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.looking_for) {
            setLookingfor(user.looking_for); // adjust to match your user schema
        }
    }, [user]);

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/looking-for") {
            setFabState({
                isDisabled: lookingFor.length === 0,
                onPress: () => {
                    router.push("/sign-in/onboarding/location");
                    if (lookingFor !== user?.looking_for) {
                        mutation.mutate()
                    }
                }
            })
        }
    }, [lookingFor, user, pathName])

    

    if (!user) return null

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full gap-6">
                    <AnimatedHeader 
                    className="font-roboto font-semibold text-2xl"
                    entering={FadeInDown.delay(100).duration(600).springify().delay(100)} 
                    >
                        {i18n.t("onboarding.lookingFor.lookingForInstruction")}
                    </AnimatedHeader>

                    <AnimatedRadioGroup 
                    className="gap-3" 
                    entering={FadeInUp.delay(400).duration(400).springify()}
                    value={lookingFor} 
                    onChange={(value) => {
                        triggerHaptic("select")
                        setLookingfor(value)
                    }}
                    >
                        {lookingForOptions.map((option, index) => 
                            <Radio
                            value={option.value}
                            size="md"
                            key={option.value}
                            className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                            
                            >
                                <AnimatedRadioLabel 
                                className="font-roboto font-medium text-typography-950 flex-1" 
                                entering={FadeInLeft.delay(600 + (index * 100)).duration(500).springify()}
                                >
                                    {option.label}
                                </AnimatedRadioLabel>
                                <AnimatedRadioIndicator entering={FadeInLeft.delay(500 + (index * 100)).duration(500).springify()}>
                                    <RadioIcon as={CircleIcon} />
                                </AnimatedRadioIndicator>
                            </Radio>
                        )}
                    </AnimatedRadioGroup>

                    <InfoOnboarding info={i18n.t("onboarding.lookingFor.lookingForClarification")}/>
                </FormControl>
            </Box>
        </Box>
    );
};

async function updateUser(userId: string, lookingFor: LookingFor) {
    const {error} = await supabase.from('users').update({looking_for: lookingFor}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}
