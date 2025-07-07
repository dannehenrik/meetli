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
const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedInput = Animated.createAnimatedComponent(Input)
import { occupationIndustries, OccupationIndustry } from "@/types";
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";


export default function smokingHabits() {
    const queryClient = useQueryClient();
    const {showErrorToast} = useAwesomeToast();

    const [industry, setIndustry] = useState('');
    const [jobTitle, setJobTitle] = useState('');

    const {data: user} = useExtendedUser()

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.occupation_industry && user.job_title) {
            setIndustry(user.occupation_industry);
            setJobTitle(user.job_title)
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", industry as OccupationIndustry, jobTitle),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'extended']})
        }
    })

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/more-about-you/occupation") {
            setFabState({
                isDisabled: false,
                onPress: () => {
                    router.push("/sign-in/onboarding/more-about-you/profile-prompts");
                    if (industry && (industry !== user?.occupation_industry || jobTitle !== user?.job_title) ) {
                        mutation.mutate()
                    }
                }
            })
        }
    }, [user, pathName, industry, jobTitle])

    

    if (!user) return null

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full gap-6">
                    <VStack className="gap-3">
                        <AnimatedHeader 
                        className="font-roboto font-semibold text-2xl"
                        entering={FadeInDown.delay(100).duration(600).springify().delay(100)} 
                        >
                            {i18n.t("onboarding.moreAboutYou.occupation.title")}
                        </AnimatedHeader>
                        <AnimatedText 
                        entering={FadeInDown.delay(400).duration(500).springify()} 
                        className="font-normal font-roboto text-typography-400"
                        >
                        {i18n.t("onboarding.moreAboutYou.occupation.description")}
                        </AnimatedText>
                    </VStack>

                    <AnimatedInput entering={FadeInUp.delay(600).duration(500).springify()} className="w-full">
                        <InputField 
                        value={jobTitle}
                        onChangeText={setJobTitle}
                        placeholder={i18n.t("onboarding.moreAboutYou.occupation.placeholder")}
                        />
                    </AnimatedInput>

                    <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{paddingBottom: 180 }}
                    keyboardDismissMode="on-drag"
                    >
                        <AnimatedRadioGroup 
                        className="gap-3 pb-8" 
                        entering={FadeInUp.delay(400).duration(400).springify()}
                        value={industry} 
                        onChange={(value) => {
                            triggerHaptic("select")
                            setIndustry(value)
                        }}
                        >
                            {occupationIndustries.map((option, index) => 
                                <Radio
                                value={option}
                                size="md"
                                key={option}
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                
                                >
                                    <AnimatedRadioLabel 
                                    className="font-roboto font-medium text-typography-950 flex-1" 
                                    entering={FadeInLeft.delay(600 + (index * 100)).duration(500).springify()}
                                    >
                                        {i18n.t(`onboarding.moreAboutYou.occupation.options.${option}`)}
                                    </AnimatedRadioLabel>
                                    <AnimatedRadioIndicator entering={FadeInLeft.delay(500 + (index * 100)).duration(500).springify()}>
                                        <RadioIcon as={CircleIcon} />
                                    </AnimatedRadioIndicator>
                                </Radio>
                            )}
                        </AnimatedRadioGroup>
                        <InfoOnboarding info={i18n.t(`onboarding.moreAboutYou.occupation.instruction`)}/>
                    </ScrollView>
                </FormControl>
            </Box>
        </Box>
    );
};

async function updateUser(userId: string, industry: OccupationIndustry, jobTitle: string) {
    const {error} = await supabase.from('user_additional_info').update({occupation_industry: industry, job_title: jobTitle}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}
