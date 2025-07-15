

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
import { useAwesomeToast } from "@/hooks/toasts";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";

import { MAX_WORD_INTRO } from "@/constants/constants";
import { triggerHaptic } from "@/utils/haptics";
import { Pressable, useColorScheme } from "react-native";
import Animated, {FadeInDown} from 'react-native-reanimated';
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { useFullUser } from "@/hooks/user/useFullUser";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon } from "@/components/ui/button";
import { PenIcon } from "@/components/shared/icons";
import { Save } from "lucide-react-native";
import { Spinner } from "@/components/ui/spinner";
const AnimatedHeading = Animated.createAnimatedComponent(Heading)
const AnimatedBox = Animated.createAnimatedComponent(Box)

export function Intro() {
    const queryClient = useQueryClient();
    const {showErrorToast, showSuccessToast} = useAwesomeToast();

    const [isEditing, setIsEditing] = useState(false);

    const {data: user} = useFullUser();
    const [textValue, setTextValue] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [error, setError] = useState(false);

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
        onSuccess: () => {
            queryClient.setQueryData(['user', 'full'], {...user, intro: textValue})
            showSuccessToast(i18n.t("messages.success.dataUpdated"))
            queryClient.invalidateQueries({queryKey: ['user', 'full']})
            setIsEditing(false)
        }
    })
  

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


    return(
        <Box className="gap-3">
            <HStack className="justify-between items-center">
                <Text className="text-typography-950 text-base font-medium mb-1">
                    Profile Description
                </Text>
                {mutation.isPending ? (
                    <Button 
                    className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto"
                    >
                        <Spinner/>
                    </Button>
                ) : (
                <>

                {isEditing ? (
                    <Button 
                    className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto"
                    onPress={() => {
                        if (user?.intro !== textValue) {
                            mutation.mutate();
                        } else {
                            setIsEditing(false)
                        }
                    }}
                    >
                        <ButtonIcon
                        as={Save}
                        className="text-typography-900 data-[active=true]:text-typography-950"
                        />
                    </Button>
                ) : (
                     <Button onPress={() => setIsEditing(true)} className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto">
                        <ButtonIcon
                        as={PenIcon}
                        className="text-typography-900 data-[active=true]:text-typography-950"
                        />
                    </Button>
                )}
                </>
                )}
            </HStack>
            {isEditing ? (
                <FormControl className="w-full gap-6" isInvalid={error}>
                    <Textarea className={`bg-background-50 h-[150px]`} size="lg">
                        <TextareaInput
                            placeholder={i18n.t("onboarding.moreAboutYou.intro.placeholder")}
                            value={textValue}
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
                </FormControl>
            ) : (
                <Pressable onPress={() => setIsEditing(true)}>
                    <Box className="flex-wrap flex-row gap-2 p-4 bg-background-50 rounded-lg">
                        {(user?.intro ?? "").length > 0 ? (
                            <Text className="text-typography-950 text-sm">{user?.intro}</Text>
                        ) : (
                            <Text className="text-typography-600 text-sm">{i18n.t("editProfile.emptyMessages.emptyIntro")}</Text>
                        )}
                
                    </Box>
                </Pressable>
            )}
        </Box>
    )
}

async function updateUser(userId: string, text: string) {
    const {error} = await supabase.from('user_additional_info').upsert({intro: text}).eq('id', userId)
    if (error) throw new Error("Something went wrong when updating the user: " + error.message);
}

