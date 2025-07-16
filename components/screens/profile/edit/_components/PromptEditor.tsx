import React, { memo, useCallback, useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, Icon, InfoIcon, RemoveIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { PenIcon } from "@/components/shared/icons";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";

import { i18n } from "@/app/_layout";
import { useFullUser } from "@/hooks/user/useFullUser";
import { SquarePen } from "lucide-react-native";
import {
    BottomSheet,
    BottomSheetBackdrop,
    BottomSheetContent,
    BottomSheetDragIndicator,
    BottomSheetScrollView,
    BottomSheetTextInput
} from "@/components/shared/bottom-sheet";
import { useAwesomeToast } from "@/hooks/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Prompt } from "@/types";
import { router } from "expo-router";
import { triggerHaptic } from "@/utils/haptics";
import { Spinner } from "@/components/ui/spinner";
import { Heading } from "@/components/ui/heading";


export function Prompts() {
    const {data: user} = useFullUser();

    if (!user?.prompts) return null
    return(
        <Box className="gap-3">
            <HStack className="justify-between items-center">
                <Text className="text-typography-950 text-base font-medium mb-1">
                    Prompts
                </Text>
                
                <Button 
                className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto text-black"
                onPress={() => {
                    triggerHaptic('buttonLight')
                    router.push("/edit-profile/edit-prompts")
                }}
                >
                    <ButtonIcon
                    as={SquarePen}
                    className="text-typography-900 data-[active=true]:text-typography-950"
                    />
                </Button>
            </HStack>
            {user?.prompts.map((prompt) => 
                <PromptItem key={prompt.id} prompt={prompt}/>
            )}
        </Box>
    )
}

function PromptItem({prompt} : {prompt: Prompt}) {
    const [isOpen, setIsOpen] = useState(false);

    if (!prompt.active) return null
    return(
    <>
        <Pressable onPress={() => setIsOpen(true)}>
            <VStack className="gap-4 p-4 mb-1 bg-background-50 rounded-lg">
                <Text className="text-typography-600 text-sm">{i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${prompt.id}.question`)}</Text>
                <Text className="text-typography-950">{prompt.answer}</Text>
            </VStack>
        </Pressable>
        <PromptEditSheet isOpen={isOpen} setIsOpen={setIsOpen} prompt={prompt} />
    </>
    )
}



export function PromptEditSheet({
    isOpen,
    setIsOpen,
    prompt,
}: {
    isOpen: boolean;
    setIsOpen: (newValue: boolean) => void;
    prompt: Prompt,
}) {
    const { showSuccessToast, showErrorToast } = useAwesomeToast();
    const queryClient = useQueryClient();

    const {data: user} = useFullUser();
    const [value, setValue] = useState("");

    useEffect(() => {
        // Reset on open
        if (isOpen) {
            setValue(prompt.answer);
        }
    }, [isOpen, prompt]);

    const mutation = useMutation({
        mutationFn: async (newPrompts: Prompt[]) => updateUser(user?.id ?? "", newPrompts),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: (variables) => {
            queryClient.setQueryData(['user', 'full'], {...user, prompts: variables})
            showSuccessToast(i18n.t("messages.success.dataUpdated"))
            queryClient.invalidateQueries({ queryKey: ['user', 'full']})
        }
    })


    useEffect(() => {
        if (mutation.isSuccess) {
            setIsOpen(false);
        }
    }, [mutation.isSuccess])

    return (
        <BottomSheet
        isOpen={isOpen}
        index={0}
        enableDynamicSizing
        enableOverDrag
        onClose={() => setIsOpen(false)}
        backdropComponent={BottomSheetBackdrop}
        keyboardBehavior="interactive"
        handleComponent={() => (
            <BottomSheetDragIndicator
            className="border-background-0 bg-background-0 rounded-t-xl"
            indicatorStyle={{
                backgroundColor: "gray",
                width: 64,
                height: 4,
                marginTop: 10,
            }}
            />
        )}
        >
            <BottomSheetContent className="border-primary-0 bg-background-0 px-5 pb-8 pt-4">
                <VStack className="gap-6 w-full">
                {/* Question Header */}

                    <Heading className="font-semibold text-xl leading-6 text-typography-800">
                        {i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${prompt.id}.question`)}
                    </Heading>
                
                    <BottomSheetTextInput
                    placeholder={i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${prompt.id}.placeholder`)}
                    multiline
                    value={value}
                    onChangeText={setValue}
                    style={{ minHeight: 120, maxHeight: 200, textAlignVertical: "top" }}
                    className="text-base font-roboto text-typography-800 w-full"
                    />
                

                    {/* Save Button */}
                    <Button
                    className="w-full rounded-lg bg-primary-700 data-[active=true]:bg-primary-800"
                    onPress={() => {
                        if (!user?.prompts || mutation.isPending || !isOpen) return;

                        const newPrompts = user.prompts.map((p) =>
                            p.id === prompt.id ? { ...prompt, answer: value } : p
                        );
                        mutation.mutate(newPrompts);
                    }}

                    disabled={value.trim().length === 0}
                    >
                        {mutation.isPending ? (
                            <Spinner/>
                        ) : (
                        <ButtonText>
                            Save Answer
                        </ButtonText>
                        )}
                    </Button>
                </VStack>
            </BottomSheetContent>
        </BottomSheet>
    );
}


async function updateUser(userId: string, userPrompts: Prompt[]) {
    const {error} = await supabase.from('user_additional_info').update({prompts: userPrompts}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}