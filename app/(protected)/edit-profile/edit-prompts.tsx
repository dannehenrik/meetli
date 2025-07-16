import { InfoOnboarding } from "@/components/shared/info-onboarding";
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
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import {
    CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@/components/ui/icon";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Pressable, TextInput } from "react-native";
import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetDragIndicator,
  BottomSheetContent,
  BottomSheetTextInput,
} from "@/components/shared/bottom-sheet";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { i18n } from "@/app/_layout";
import { triggerHaptic } from "@/utils/haptics";
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { Prompt, prompts } from "@/types";
import { supabase } from "@/utils/supabase";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useAwesomeToast } from "@/hooks/toasts";
import { Spinner } from "@/components/ui/spinner";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';
import { Badge, BadgeText } from "@/components/ui/badge";
import { MAX_PROMPTS } from "@/constants/constants";
import { HStack } from "@/components/ui/hstack";
import { ChevronLeftIcon } from "lucide-react-native";
import { useFullUser } from "@/hooks/user/useFullUser";
const AnimatedVstack = Animated.createAnimatedComponent(VStack)
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)



export default function EditProfilePrompts() {
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

    function handleDone() {
        triggerHaptic('buttonLight')
        const isDirty = JSON.stringify(userPrompts) !== JSON.stringify(user?.prompts ?? []);

        if (isDirty) {
            mutation.mutate();
        }
        router.back();
    };
  

    return (
        <Box className="flex-1">
            <Box className="w-full flex flex-row items-center py-3">
                <Button variant="link" className="px-4" onPress={handleDone}>
                    <ButtonIcon
                    as={ChevronLeftIcon}
                    className="text-typography-950 h-6 w-6"
                    />
                </Button>
            
            </Box>

            <Box className="flex-1 bg-background-0 gap-4 justify-start items-center">
                <Box className="flex-1 justify-start items-start px-5 top-11 w-[100%]">
                    <VStack className="gap-[18px] w-full">

                        <AnimatedVstack entering={FadeInDown.delay(100).duration(400).springify()}  className="gap-3">
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
                        </AnimatedVstack>
                        {/* <AnimatedBox entering={FadeInUp.delay(400).duration(400).springify()}> */}
                            <AnimatedScrollView 
                            showsVerticalScrollIndicator={false} 
                            contentContainerStyle={{paddingBottom: 250}}
                            entering={FadeInUp.delay(400).duration(400).springify()}
                            >
                                <Pressable>
                                    
                                    <Accordion className="w-full bg-background-0 gap-4 pb-6">
                                        {prompts.map((promptId, index) => (
                                            <AnimatedBox key={promptId} entering={FadeInLeft.delay(600 + (50 * index)).duration(400).springify()}>
                                                <PromptItem 
                                                promptId={promptId} 
                                                isActive={isPromptActive(promptId)} 
                                                toggleActive={toggleActive}
                                                answer={getPromptValue(promptId)}
                                                handleAnswerChange={handleAnswerChange}
                                                mutation={mutation}
                                                />
                                            </AnimatedBox>
                                        ))}
                                    </Accordion>
                    
                                </Pressable>
                            </AnimatedScrollView>
                        {/* </AnimatedBox> */}
                            
                    </VStack>
                </Box>
            </Box>
        </Box>
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
                
                    <TextInput
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
