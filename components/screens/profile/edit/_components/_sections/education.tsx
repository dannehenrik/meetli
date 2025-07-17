import { i18n } from "@/app/_layout";

import { useFullUser } from "@/hooks/user/useFullUser";
import { Pressable } from "react-native";
import {
    BottomSheet,
    BottomSheetBackdrop,
    BottomSheetContent,
    BottomSheetDragIndicator,
    BottomSheetScrollView,
} from "@/components/shared/bottom-sheet";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { DrinkingHabits, drinkingHabitsOptions, educationOptions, foodChoicesOptions, trainingHabitsOptions } from "@/types";
import { triggerHaptic } from "@/utils/haptics";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';
import { useAwesomeToast } from "@/hooks/toasts";
import { supabase } from "@/utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FormControl } from "@/components/ui/form-control";

import { CircleIcon } from "@/components/ui/icon";
import {
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
} from "@/components/ui/radio";
import { router } from "expo-router";


const AnimatedHeader = Animated.createAnimatedComponent(Heading)
const AnimatedRadioLabel = Animated.createAnimatedComponent(RadioLabel)
const AnimatedRadioIndicator = Animated.createAnimatedComponent(RadioIndicator)
const AnimatedRadioGroup = Animated.createAnimatedComponent(RadioGroup)

export function EducationSection() {
    const [isOpen, setIsOpen] = useState(false);

    const { data: user } = useFullUser();

    if (!user) return null;

    return(
    <>
        <Pressable 
        onPress={() => {
            triggerHaptic("buttonLight")
            setIsOpen(true)
        }}
        >
            <VStack className="gap-4 p-4 mb-1 bg-background-50 rounded-lg">
                <Text className="text-typography-600 text-sm">{i18n.t("onboarding.moreAboutYou.education.title")}</Text>
                <Text className="text-typography-950">{i18n.t(`onboarding.moreAboutYou.education.options.${user.education}`)}</Text>
            </VStack>
        </Pressable>
        <EditSheet isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
    )
}




function EditSheet({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (value: boolean) => void}) {
    const queryClient = useQueryClient();
    const {showErrorToast, showSuccessToast} = useAwesomeToast();

    const [value, setValue] = useState('');

    const {data: user} = useFullUser()

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.education) {
            setValue(user.education);
        }
    }, [user]);

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", value),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.setQueryData(['user', 'full'], {...user, education: value})
            showSuccessToast(i18n.t("messages.success.dataUpdated"))
            queryClient.invalidateQueries({ queryKey: ['user', 'full']})
        }
    })

    

    if (!user) return null

    return (
        <BottomSheet
        isOpen={isOpen}
        snapPoints={["60%", "90%"]}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        enableOverDrag={false}
        keyboardBehavior="extend"
        index={0}
        onClose={() => {
            if (mutation.isPending || !isOpen) return
            setIsOpen(false); // close the sheet first
            
            const isDirty = user.education !== value;
            if (isDirty) {
                mutation.mutate();
            }
        }}

   
        backdropComponent={BottomSheetBackdrop}
        handleComponent={() => {
            return (
                <BottomSheetDragIndicator
                className="border-background-0 bg-background-0 rounded-t-xl"
                indicatorStyle={{
                    backgroundColor: "gray",
                    width: 64,
                    height: 4,
                    marginTop: 15,
                    marginBottom: 50,
                }}
                />
            );
        }}
       >
        
            <BottomSheetContent className="border-primary-0 bg-background-0 px-5 flex-1 h-full" >

                <FormControl className="w-full gap-6">
                    <AnimatedHeader 
                    className="font-roboto font-semibold text-2xl"
                    entering={FadeInDown.delay(100).duration(600).springify().delay(100)} 
                    >
                        {i18n.t("onboarding.moreAboutYou.education.title")}
                    </AnimatedHeader>
                    <BottomSheetScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{paddingBottom: 110 }}
                    >
                        <AnimatedRadioGroup 
                        className="gap-3" 
                        entering={FadeInUp.delay(400).duration(400).springify()}
                        value={value} 
                        onChange={(value) => {
                            triggerHaptic("select")
                            setValue(value)
                        }}
                        >
                            {educationOptions.map((option, index) => 
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
                                        {i18n.t(`onboarding.moreAboutYou.education.options.${option}`)}
                                    </AnimatedRadioLabel>
                                    <AnimatedRadioIndicator entering={FadeInLeft.delay(500 + (index * 100)).duration(500).springify()}>
                                        <RadioIcon as={CircleIcon} />
                                    </AnimatedRadioIndicator>
                                </Radio>
                            )}
                        </AnimatedRadioGroup>
                    </BottomSheetScrollView>
                </FormControl>
            
            </BottomSheetContent>
        </BottomSheet>
    );
};

async function updateUser(userId: string, value: string) {
    const {error} = await supabase.from('user_additional_info').update({education: value}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}




