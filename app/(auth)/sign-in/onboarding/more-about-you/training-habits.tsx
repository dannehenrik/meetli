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
import { TrainingHabit, trainingHabitsOptions } from "@/types";
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { ScrollView } from "react-native-gesture-handler";


export default function training() {
    const queryClient = useQueryClient();
    const {showErrorToast} = useAwesomeToast();

    const [trainingHabits, setTrainingHabits] = useState('');

    const {data: user} = useExtendedUser()

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.training_habits) {
            setTrainingHabits(user.training_habits);
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", trainingHabits as TrainingHabit),
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
        if (pathName === "/sign-in/onboarding/more-about-you/training-habits") {
            setFabState({
                isDisabled: false,
                onPress: () => {
                    router.push("/sign-in/onboarding/more-about-you/food-choice");
                    if (trainingHabits && trainingHabits !== user?.training_habits) {
                        mutation.mutate()
                    }
                }
            })
        }
    }, [user, pathName, trainingHabits])

    

    if (!user) return null

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full gap-6">
                    <AnimatedHeader 
                    className="font-roboto font-semibold text-2xl"
                    entering={FadeInDown.delay(100).duration(600).springify().delay(100)} 
                    >
                        {i18n.t("onboarding.moreAboutYou.training.title")}
                    </AnimatedHeader>
                    <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{paddingBottom: 110 }}
                    >
                        <AnimatedRadioGroup 
                        className="gap-3" 
                        entering={FadeInUp.delay(400).duration(400).springify()}
                        value={trainingHabits} 
                        onChange={(value) => {
                            triggerHaptic("select")
                            setTrainingHabits(value)
                        }}
                        >
                            {trainingHabitsOptions.map((option, index) => 
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
                                        {i18n.t(`onboarding.moreAboutYou.training.options.${option}`)}
                                    </AnimatedRadioLabel>
                                    <AnimatedRadioIndicator entering={FadeInLeft.delay(500 + (index * 100)).duration(500).springify()}>
                                        <RadioIcon as={CircleIcon} />
                                    </AnimatedRadioIndicator>
                                </Radio>
                            )}
                        </AnimatedRadioGroup>
                    </ScrollView>

                    {/* <InfoOnboarding info={i18n.t("onboarding.lookingFor.lookingForClarification")}/> */}
                </FormControl>
            </Box>
        </Box>
    );
};

async function updateUser(userId: string, trainingHabits: TrainingHabit) {
    const {error} = await supabase.from('user_additional_info').update({training_habits: trainingHabits}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}
