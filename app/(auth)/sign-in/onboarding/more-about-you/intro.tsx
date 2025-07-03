import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";

import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

import React, { useEffect, useState } from "react";
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
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";

import Animated, { FadeInDown } from "react-native-reanimated";
import { MAX_WORD_INTRO } from "@/constants/constants";



export default function intro() {
    const {showErrorToast} = useAwesomeToast();

    const [textValue, setTextValue] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [wordError, setWordError] = useState(false);

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
        if (pathName === "/sign-in/onboarding/profile-base-completed") {
            setFabState({
                label: i18n.t("onboarding.fab.continue"),
                isLoading: false,
                isDisabled: false,
                onPress: () => {
                    router.push("/sign-in/onboarding/more-about-you/intro");
                    mutation.mutate();
                }
            })
        }
    }, [pathName])
  

    useEffect(() => {
            const words = textValue.trim() ? textValue.trim().split(/\s+/) : [];
            if (words.length !== MAX_WORD_INTRO) {
                setWordCount(words.length);
            }
    }, [textValue]);

    useEffect(() => {
        if (wordCount > 120) {setWordError(true)};
    }, [wordCount]);

  return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full gap-6">
                    <Heading className="font-roboto font-semibold text-2xl">
                        Write a small intro to yourself!
                    </Heading>
                    <Box>
                        <Textarea className="bg-background-50 h-[150px]" size="lg">
                            <TextareaInput
                                placeholder="Write your cool intro here.."
                                className="p-4 text-typography-800 items-start"
                                multiline
                                style={{ textAlignVertical: "top" }}
                                onChangeText={(text) => {
                                    setTextValue(text);
                                }}
                            />
                        </Textarea>
                        <FormControlHelper className="flex justify-end">
                            <FormControlHelperText className="text-typography-400 font-roboto font-normal text-md">
                                {wordCount} words/120
                            </FormControlHelperText>
                        </FormControlHelper>
                    </Box>
                </FormControl>
            </Box>
        </Box>
  );
};



async function updateUser(userId: string, text: string) {
    const {error} = await supabase.from('users').update({intro: text}).eq('id', userId)
    if (error) throw new Error("Something went wrong when updating the user: " + error.message);
}

