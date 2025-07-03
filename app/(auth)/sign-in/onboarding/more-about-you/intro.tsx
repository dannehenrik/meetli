import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
} from "@/components/ui/form-control";

import { Textarea, TextareaInput } from "@/components/ui/textarea";

import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";

import { MAX_WORD_INTRO } from "@/constants/constants";
import { triggerHaptic } from "@/utils/haptics";
import { useColorScheme } from "react-native";
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp
} from 'react-native-reanimated';
const AnimatedHeading = Animated.createAnimatedComponent(Heading)
const AnimatedBox = Animated.createAnimatedComponent(Box)



export default function intro() {
    const theme = useColorScheme()

    const {showErrorToast} = useAwesomeToast();

    const [textValue, setTextValue] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [error, setError] = useState(false);

    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    useEffect(() => {
        if (user && user.intro) {
            setTextValue(user.intro);
        }
    }, [user])

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", textValue),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"));
            router.back();
        },
    })


    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/more-about-you/intro") {
            setFabState({
                label: undefined,
                isLoading: false,
                isDisabled: error || wordCount === 0,
                onPress: () => {
                    router.push("/sign-in/onboarding/more-about-you/intro");
                    mutation.mutate();
                }
            })
        }
    }, [pathName, wordCount, error])
  

    useEffect(() => {
            const words = textValue.trim() ? textValue.trim().split(/\s+/) : [];
            setWordCount(words.length);
    }, [textValue]);

    useEffect(() => {
        if (wordCount > MAX_WORD_INTRO && !error) { 
            triggerHaptic("error");
            setError(true) 
        };

        if (wordCount <= 120 && error) {
            setError(false);
        }
    }, [wordCount]);

  return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full gap-6" isInvalid={error}>
                    <AnimatedHeading 
                    className="font-roboto font-semibold text-2xl"
                    entering={FadeInDown.duration(400).springify()}
                    >
                        {i18n.t("onboarding.moreAboutYou.intro.title")}
                    </AnimatedHeading>
                    <AnimatedBox entering={FadeInDown.delay(400).duration(400).springify()}>
                        <Textarea className={`bg-background-50 h-[150px]`} size="lg">
                            <TextareaInput
                                placeholder={i18n.t("onboarding.moreAboutYou.intro.placeholder")}
                                className={`p-4 items-start`}
                                multiline
                                style={{ textAlignVertical: "top" }}
                                onChangeText={(text) => {
                                    setTextValue(text);
                                }}
                            />
                        </Textarea>
                        <FormControlError>
                            <FormControlErrorText>{i18n.t("onboarding.moreAboutYou.intro.wordError")}</FormControlErrorText>
                        </FormControlError>
                        <FormControlHelper className="flex justify-end">
                             <FormControlHelperText className="text-typography-400 font-roboto font-normal text-md">
                                {`${wordCount} ${i18n.t("onboarding.moreAboutYou.intro.words")}/${MAX_WORD_INTRO}`}
                            </FormControlHelperText>
                        </FormControlHelper>
                    </AnimatedBox>
                </FormControl>
            </Box>
        </Box>
  );
};



async function updateUser(userId: string, text: string) {
    const {error} = await supabase.from('user_additional_info').upsert({intro: text}).eq('id', userId)
    if (error) throw new Error("Something went wrong when updating the user: " + error.message);
}

