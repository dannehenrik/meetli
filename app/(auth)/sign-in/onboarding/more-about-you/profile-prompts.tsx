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
import { Pressable } from "react-native";
import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetDragIndicator,
  BottomSheetContent,
  BottomSheetTextInput,
} from "@/components/shared/bottom-sheet";
import { Button, ButtonText } from "@/components/ui/button";
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
const AnimatedVstack = Animated.createAnimatedComponent(VStack)
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)



export default function profilePrompts() {
    const { showErrorToast, showInfoToast } = useAwesomeToast();
    const queryClient = useQueryClient();

    const {data: user} = useExtendedUser();

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
            queryClient.invalidateQueries({ queryKey: ['user', 'extended']})
        }
    })

     // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/more-about-you/profile-prompts") {
            setFabState({
                isDisabled: false,
                onPress: () => {
                    router.push("/sign-in/onboarding/more-about-you/favorites");
                    mutation.mutate();        
                }
            })
        }
    }, [pathName])

    // Utils
    function handleAnswerChange(id: string, newQuestion: string) {
        setUserPrompts((prev) => {
            const existing = prev.find((p) => p.id === id);

            if (existing) {
                return prev.map((p) =>
                    p.id === id ? { ...p, question: newQuestion } : p
                );
            }

            return [...prev, { id, question: newQuestion, active: false }];
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
                    { id, question: "", active: true },
                ];
            }
        });
    }

    function getPromptValue(id: string): string {
        const prompt = userPrompts.find((p) => p.id === id);
        return prompt?.question ?? "";
    }

    function isPromptActive(id: string): boolean {
        const prompt = userPrompts.find((p) => p.id === id);
        return !!prompt?.active;
    }
  

    return (
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
    const [isEditing, setIsEditing] = useState(false);
    
    return(
    <>
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
                <AccordionContentText onPress={() => setIsEditing(true)} className="font-semibold font-roboto text-2xl text-typography-800 leading-7">
                    {answer.length === 0 ? i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${promptId}.placeholder`) : answer}
                </AccordionContentText>
            </AccordionContent>
        </AccordionItem>

        <PromptEditSheet
        isOpen={isEditing}
        setIsOpen={() => setIsEditing(false)}
        promptId={promptId}
        answer={answer}
        onSave={(value) => handleAnswerChange(promptId, value)}
        mutation={mutation}
        />
    </>
    )
}



export function PromptEditSheet({
    isOpen,
    setIsOpen,
    promptId,
    answer,
    onSave,
    mutation,
}: {
    isOpen: boolean;
    setIsOpen: (newValue: boolean) => void;
    promptId: string;
    answer: string,
    onSave: (newValue: string) => void;
    mutation: UseMutationResult<void, Error, void, unknown>
}) {
    const { showSuccessToast } = useAwesomeToast();
    const [value, setValue] = useState("");

    useEffect(() => {
        // Reset on open
        if (isOpen) {
            setValue(answer);
        }
    }, [isOpen, answer]);

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
                        {i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${promptId}.question`)}
                    </Heading>
                
                    <BottomSheetTextInput
                    placeholder={i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${promptId}.placeholder`)}
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
                        onSave(value);
                        mutation.mutate(undefined, {onSuccess: () => {
                            showSuccessToast(i18n.t("messages.success.dataUpdated"))
                        }})
                        // setIsOpen(false);
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
