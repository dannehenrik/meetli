import { i18n } from "@/app/_layout";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Box } from "@/components/ui/box";
import {
    Checkbox,
    CheckboxGroup,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
} from "@/components/ui/checkbox";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { CheckIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/utils/supabase";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";

import { useFab } from "@/components/shared/floating-fab/FabContext";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { Gender } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';
import { triggerHaptic } from "@/utils/haptics";
const AnimatedHeader = Animated.createAnimatedComponent(Heading)
const AnimatedCheckboxGroup = Animated.createAnimatedComponent(CheckboxGroup)
const AnimatedCheckboxLabel = Animated.createAnimatedComponent(CheckboxLabel)
// const CheckboxIndicator = Animated.createAnimatedComponent(CheckboxIndicator)

export default function interest() {
    const queryClient = useQueryClient();

    const {showErrorToast} = useAwesomeToast();

    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", genders as Gender[]),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    const [genders, setGenders] = useState<string[]>([]);

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.gender_preferences) {
            setGenders(user.gender_preferences); // adjust to match your user schema
        }
    }, [user]);


    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/interest") {
            setFabState({
                isDisabled: genders.length === 0,
                onPress: () => {
                    router.push("/sign-in/onboarding/looking-for");
                    if (genders !== user?.gender_preferences) {
                        mutation.mutate()
                    }
                }
            })
        } 
    }, [genders, user, pathName])

    

    if (!user) return null

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full">
                    <VStack className="gap-6">
                        <AnimatedHeader 
                        className="font-roboto font-semibold text-2xl"
                        entering={FadeInDown.delay(100).duration(600).springify().delay(100)}
                        >
                            {i18n.t("onboarding.gender.genderInterestInfo")}
                        </AnimatedHeader>

                        <VStack className="gap-4">
                            <AnimatedCheckboxGroup
                                value={genders}
                                onChange={(keys) => {
                                    triggerHaptic("select")
                                    setGenders(keys)
                                }}
                                className="gap-3"
                                entering={FadeInUp.delay(400).duration(500).springify()}
                            >
                                <Checkbox
                                value="woman"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <AnimatedCheckboxLabel
                                    className="font-roboto font-medium text-typography-950"
                                    entering={FadeInDown.delay(800).duration(500).springify()}
                                    >
                                        {i18n.t("onboarding.gender.woman")}
                                    </AnimatedCheckboxLabel>
                                    <CheckboxIndicator>
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                </Checkbox>

                                <Checkbox
                                value="male"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <AnimatedCheckboxLabel 
                                    className="font-roboto font-medium text-typography-950"
                                    entering={FadeInDown.delay(900).duration(500).springify()}
                                    >
                                        {i18n.t("onboarding.gender.male")}
                                    </AnimatedCheckboxLabel>
                                    <CheckboxIndicator>
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                </Checkbox>

                                <Checkbox
                                value="non-binary"  
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <AnimatedCheckboxLabel 
                                    className="font-roboto font-medium text-typography-950"
                                    entering={FadeInDown.delay(1000).duration(500).springify()}
                                    >
                                        {i18n.t("onboarding.gender.nonBinary")}
                                    </AnimatedCheckboxLabel>
                                    <CheckboxIndicator>
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                </Checkbox>
                            </AnimatedCheckboxGroup>
                        </VStack>

                        <InfoOnboarding
                        info={i18n.t("onboarding.changeInformationLaterInfo")}
                        classNameIcon="mt-1"
                        />
                    </VStack>
                </FormControl>
            </Box>
        </Box>
    );
};


async function updateUser(userId: string, gender: Gender[]) {
    const {error} = await supabase.from('users').update({gender_preferences: gender}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}
