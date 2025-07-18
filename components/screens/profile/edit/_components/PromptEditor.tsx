import React, { memo, useCallback, useEffect, useState } from "react";
import { TextInput } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp } from "react-native-reanimated";
import { SquarePen, ChevronLeftIcon } from "lucide-react-native";

import { router } from "expo-router";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/ui/icon";
import {
  Button,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Heading } from "@/components/ui/heading";
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import { Badge, BadgeText } from "@/components/ui/badge";

import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@/components/shared/bottom-sheet";
import { PenIcon } from "@/components/shared/icons";

import { i18n } from "@/app/_layout";

import { useFullUser } from "@/hooks/user/useFullUser";
import { useAwesomeToast } from "@/hooks/toasts";

import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";

import { supabase } from "@/utils/supabase";
import { triggerHaptic } from "@/utils/haptics";

import { Prompt, prompts } from "@/types";

import { MAX_PROMPTS } from "@/constants/constants";


const AnimatedVstack = Animated.createAnimatedComponent(VStack)
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedScrollView = Animated.createAnimatedComponent(BottomSheetScrollView)


export function Prompts() {
    const {data: user} = useFullUser();
    const [isOpen, setIsOpen] = useState(false);

    return(
    <>
        <Box className="gap-3">
            <HStack className="justify-between items-center">
                <Text className="text-typography-950 text-base font-medium mb-1">
                    {i18n.t("editProfile.titles.prompts")}
                </Text>
                
                <Button 
                className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto text-black"
                onPress={() => {
                    triggerHaptic('buttonLight')
                    setIsOpen(true)
                }}
                >
                    <ButtonIcon
                    as={SquarePen}
                    className="text-typography-900 data-[active=true]:text-typography-950"
                    />
                </Button>
            </HStack>
            {user?.prompts?.some((prompt) => prompt.active === true) ? (
            <>
                {user?.prompts.map((prompt) => 
                    <Item key={prompt.id} prompt={prompt}/>
                )}
            </>
            ) : (
                <Text className="text-typography-500 text-sm">{i18n.t("editProfile.emptyMessages.emptyPrompts")}</Text>
            )}
        </Box>
        <EditPromptsSheet isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
    )
}

function Item({prompt} : {prompt: Prompt}) {
    const [isOpen, setIsOpen] = useState(false);

    if (!prompt.active) return null
    return(
    <>
        <Pressable 
        onPress={() => {
            triggerHaptic("buttonLight")
            setIsOpen(true)
        }}
        >
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
    }, [isOpen]);

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
                    isDisabled={value === prompt.answer}
                    onPress={() => {
                        if (!user?.prompts || mutation.isPending || !isOpen) return;
                        triggerHaptic("button")

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
                            {i18n.t("onboarding.moreAboutYou.profilePrompts.saveAnswer")}
                        </ButtonText>
                        )}
                    </Button>
                </VStack>
            </BottomSheetContent>
        </BottomSheet>
    );
}





function EditPromptsSheet({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (value: boolean) => void}) {
    const { showErrorToast, showInfoToast, showSuccessToast } = useAwesomeToast();
    const queryClient = useQueryClient();

    const {data: user} = useFullUser();

    const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);

    useEffect(() => {
        if (user && user.prompts) {
            setUserPrompts(user.prompts)
        }
    }, [user])

    const [missClicks, setMissClicks] = useState(0);
    useEffect(() => {
        if (missClicks > 0 && missClicks % 3 === 0) {
            showInfoToast(i18n.t("messages.info.onlyThree"), i18n.t("messages.info.unselect"))
        }
    }, [missClicks])

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", userPrompts),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.setQueryData(['user', 'full'], {...user, prompts: userPrompts})
            showSuccessToast(i18n.t("messages.success.dataUpdated"))
            queryClient.invalidateQueries({ queryKey: ['user', 'full']})
        }
    })

    // Utils
    function handleAnswerChange(id: string, newQuestion: string) {
        setUserPrompts((prev) => {
            const existing = prev.find((p) => p.id === id);

            if (existing) {
                return prev.map((p) =>
                    p.id === id ? { ...p, answer: newQuestion } : p
                );
            }

            return [...prev, { id, answer: newQuestion, active: false }];
        });
    }
    function getActiveAmount() {
        return userPrompts.filter((p) => p.active).length;
    }

    function toggleActive(id: string, value?: boolean) {
        setUserPrompts((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((p) => p.id === id);

            if (index !== -1) {
                const currentlyActive = updated.filter((p) => p.active).length;
                const willBeActive = typeof value === "boolean" ? value : !updated[index].active;

                if (willBeActive && !updated[index].active && currentlyActive >= MAX_PROMPTS) {
                    // Do not allow activating more than 3 prompts
                    triggerHaptic("error")
                    setMissClicks((prev) => prev + 1)
                    return prev;
                }

                updated[index] = {
                    ...updated[index],
                    active: willBeActive,
                };

                triggerHaptic("select")
                return updated;
            } else {
                const currentlyActive = updated.filter((p) => p.active).length;

                if (currentlyActive >= MAX_PROMPTS) {
                    // Do not allow adding a new active prompt
                    triggerHaptic("error")
                    setMissClicks((prev) => prev + 1)
                    return prev;
                }
                triggerHaptic("select")
                return [
                    ...updated,
                    { id, answer: "", active: true },
                ];
            }
        });
    }

    function getPromptValue(id: string): string {
        const prompt = userPrompts.find((p) => p.id === id);
        return prompt?.answer ?? "";
    }

    function isPromptActive(id: string): boolean {
        const prompt = userPrompts.find((p) => p.id === id);
        return !!prompt?.active;
    }

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
            
            const isDirty = JSON.stringify(user.prompts) !== JSON.stringify(userPrompts);
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
                <Box className="flex-1 bg-background-0 gap-4 justify-start items-center">
                    <Box className="flex-1 justify-start items-start px-5 w-[100%]">
                        
                        <VStack className="gap-[18px] w-full">
                            <VStack className="gap-3">
                                <HStack className="gap-2 items-center">
                                    <Heading className="font-roboto font-semibold text-2xl">
                                        {i18n.t("onboarding.moreAboutYou.profilePrompts.title")}
                                    </Heading>
                                    <Badge size="md" className="rounded-md">
                                        <BadgeText>
                                            {getActiveAmount()}/{MAX_PROMPTS}
                                        </BadgeText>
                                    </Badge>
                                </HStack>
                                <Text className="font-roboto font-normal text-base text-typography-400 leading-6">
                                    {i18n.t("onboarding.moreAboutYou.profilePrompts.instructions")}
                                </Text>
                            </VStack>
                            <BottomSheetScrollView 
                            showsVerticalScrollIndicator={false} 
                            contentContainerStyle={{paddingBottom: 150}}
                            entering={FadeInUp.delay(400).duration(400).springify()}
                            >
                                <Pressable>
                                    
                                    <Accordion className="w-full bg-background-0 gap-4 pb-6">
                                        {prompts.map((promptId) => (
                                            <PromptItem 
                                            key={promptId}
                                            promptId={promptId} 
                                            isActive={isPromptActive(promptId)} 
                                            toggleActive={toggleActive}
                                            answer={getPromptValue(promptId)}
                                            handleAnswerChange={handleAnswerChange}
                                            mutation={mutation}
                                            />
                                        ))}
                                    </Accordion>
                    
                                </Pressable>
                            </BottomSheetScrollView>
                                
                        </VStack>
                    </Box>
                </Box>
            </BottomSheetContent>
        </BottomSheet>
    );
};






interface PromptItemProps {
    promptId: string, 
    isActive: boolean, 
    toggleActive: (id: string, value?: boolean) => void,
    answer: string,
    handleAnswerChange: (id: string, newValue: string) => void,
    mutation: UseMutationResult<void, Error, void, unknown>
}

function PromptItem({promptId, isActive, toggleActive, answer, handleAnswerChange, mutation} : PromptItemProps) {
    
    return(
        <AccordionItem
        value={`item-${promptId}`}
        className="rounded-lg bg-background-50"
        isDisabled={!isActive || mutation.isPending}
        >
            <AccordionHeader>
                <AccordionTrigger className="focus:web:rounded-lg">
                    {({ isExpanded } : {isExpanded: boolean}) => {
                    return (
                        <>
                        <Box className="pr-3">
                            {isExpanded ? (
                            <AccordionIcon
                            as={ChevronUpIcon}
                            className="py-3 pr-4 text-background-400"
                            size="md"
                            />
                        ) : (
                            <AccordionIcon
                            as={ChevronDownIcon}
                            className="py-3 pr-4 text-background-400"
                            size="md"
                            />
                        )}
                        </Box>
                        <AccordionTitleText
                            className={`font-roboto font-medium text-sm leading-4 ${
                            isExpanded ? "text-typography-400" : ""
                            }`}
                        >
                            {i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${promptId}.question`)}
                        </AccordionTitleText>

                        <Checkbox 
                        value=""
                        onChange={(value) => {toggleActive(promptId, value)}}
                        isChecked={isActive}
                        >
                            <CheckboxIndicator>
                                <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                        </Checkbox>
                        
                        </>
                    );
                    }}
                </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
                <VStack className="gap-6 w-full">
                
                    <BottomSheetTextInput
                    placeholder={i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${promptId}.placeholder`)}
                    multiline
                    value={answer}
                    onChangeText={(value) => handleAnswerChange(promptId, value)}
                    style={{ minHeight: 120, maxHeight: 200, textAlignVertical: "top" }}
                    className="text-base font-roboto text-typography-800 w-full"
                    />
                </VStack>
            </AccordionContent>
        </AccordionItem>
    )
}




async function updateUser(userId: string, userPrompts: Prompt[]) {
    const {error} = await supabase.from('user_additional_info').update({prompts: userPrompts}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}