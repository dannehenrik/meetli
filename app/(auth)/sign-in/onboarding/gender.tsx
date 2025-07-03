import { i18n } from "@/app/_layout";
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
import { VStack } from "@/components/ui/vstack";
import { usePathname, useRouter } from "expo-router";
import React from "react";

import { useEffect, useState } from "react";


import { useFab } from "@/components/shared/floating-fab/FabContext";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { Gender } from "@/types";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';
import { triggerHaptic } from "@/utils/haptics";
const AnimatedHeader = Animated.createAnimatedComponent(Heading)
const AnimatedRadioGroup = Animated.createAnimatedComponent(RadioGroup)
const AnimatedRadioLabel = Animated.createAnimatedComponent(RadioLabel)
const AnimatedRadioIndicator = Animated.createAnimatedComponent(RadioIndicator)


export default function gender() {
    const {showErrorToast} = useAwesomeToast();
    const queryClient = useQueryClient();
    const router = useRouter();

    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", gender as Gender),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    const [gender, setGender] = useState('');

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.gender) {
            setGender(user.gender); // adjust to match your user schema
        }
    }, [user]);

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/gender") {
            setFabState({
                isDisabled: !gender,
                onPress: () => {
                    router.push("/sign-in/onboarding/interest");
                    if (gender !== user?.gender) {
                        mutation.mutate()
                    }
                }
            })
        }

    }, [gender, user, pathName])

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
                            {i18n.t("onboarding.gender.howDoYouIdentify")}
                        </AnimatedHeader>

                        <VStack className="gap-4">
                            <AnimatedRadioGroup 
                            className="gap-3" 
                            entering={FadeInUp.delay(400).duration(500).springify()}
                            value={gender} 
                            onChange={(value) => {
                                triggerHaptic("select")
                                setGender(value)
                            }}
                            >
                                <Radio
                                value="woman"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <AnimatedRadioLabel 
                                    entering={FadeInUp.delay(800).duration(500).springify()}
                                    className="font-roboto font-medium text-typography-950"
                                    >
                                        {i18n.t("onboarding.gender.woman")}
                                    </AnimatedRadioLabel>
                                    <AnimatedRadioIndicator entering={FadeInUp.delay(800).duration(500).springify()}>
                                        <RadioIcon as={CircleIcon} />
                                    </AnimatedRadioIndicator>
                                </Radio>

                                <Radio
                                value="male"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <AnimatedRadioLabel 
                                    className="font-roboto font-medium text-typography-950"
                                    entering={FadeInUp.delay(900).duration(500).springify()}
                                    >
                                        {i18n.t("onboarding.gender.male")}
                                    </AnimatedRadioLabel>
                                    <AnimatedRadioIndicator entering={FadeInUp.delay(900).duration(500).springify()}>
                                        <RadioIcon as={CircleIcon} />
                                    </AnimatedRadioIndicator>
                                </Radio>

                                <Radio
                                value="non-binary"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <AnimatedRadioLabel 
                                    className="font-roboto font-medium text-typography-950"
                                    entering={FadeInUp.delay(1000).duration(500).springify()}
                                    >
                                        {i18n.t("onboarding.gender.nonBinary")}
                                    </AnimatedRadioLabel>
                                    <AnimatedRadioIndicator entering={FadeInUp.delay(1000).duration(500).springify()}>
                                        <RadioIcon as={CircleIcon} />
                                    </AnimatedRadioIndicator>
                                </Radio>
                            </AnimatedRadioGroup>
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


async function updateUser(userId: string, gender: Gender) {
    const {error} = await supabase.from('users').update({gender: gender}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}