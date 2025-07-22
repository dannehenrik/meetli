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

import { Favorite, favorites } from "@/types";

import { MAX_FAVORITES } from "@/constants/constants";
import { ScrollView } from "react-native-gesture-handler";

const AnimatedVstack = Animated.createAnimatedComponent(VStack)
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedScrollView = Animated.createAnimatedComponent(BottomSheetScrollView)


export function Favorites() {
    const {data: user} = useFullUser();
    const [isOpen, setIsOpen] = useState(false);

    return(
    <>
        <Box className="gap-3">
            <HStack className="justify-between items-center">
                <Text className="text-typography-950 text-base font-medium mb-1">
                    {i18n.t("editProfile.titles.favorites")}
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
            {user?.favorites?.some((favorite) => favorite.active === true) ? (
            <>
                {user?.favorites?.map((favorite) => 
                    <Item key={favorite.id} favorite={favorite}/>
                )}
            </>
            ) : (
                <Text className="text-typography-500 text-sm">{i18n.t("editProfile.emptyMessages.emptyFavorites")}</Text>
            )}
        </Box>
        <EditFavoritesSheet isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
    )
}

function Item({favorite} : {favorite: Favorite}) {
    const [isOpen, setIsOpen] = useState(false);

    if (!favorite.active) return null
    return(
    <>
        <Pressable 
        onPress={() => {
            triggerHaptic("buttonLight")
            setIsOpen(true)
        }}
        >
            <VStack className="gap-4 p-4 mb-1 bg-background-50 rounded-lg">
                <Text className="text-typography-600 text-sm">{i18n.t(`onboarding.moreAboutYou.profileFavorites.options.${favorite.id}.question`)}</Text>
                <Text className="text-typography-950">{favorite.answer}</Text>
            </VStack>
        </Pressable>
        <FavoriteEditSheet isOpen={isOpen} setIsOpen={setIsOpen} favorite={favorite} />
    </>
    )
}

export function FavoriteEditSheet({
    isOpen,
    setIsOpen,
    favorite,
}: {
    isOpen: boolean;
    setIsOpen: (newValue: boolean) => void;
    favorite: Favorite,
}) {
    const { showSuccessToast, showErrorToast } = useAwesomeToast();
    const queryClient = useQueryClient();

    const {data: user} = useFullUser();
    const [value, setValue] = useState("");

    useEffect(() => {
        // Reset on open
        if (isOpen) {
            setValue(favorite.answer);
        }
    }, [isOpen]);

    const mutation = useMutation({
        mutationFn: async (newFavorites: Favorite[]) => updateUser(user?.id ?? "", newFavorites),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: (variables) => {
            queryClient.setQueryData(['user', 'full'], {...user, favorites: variables})
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
                        {i18n.t(`onboarding.moreAboutYou.profileFavorites.options.${favorite.id}.question`)}
                    </Heading>
                
                    <BottomSheetTextInput
                    placeholder={i18n.t(`onboarding.moreAboutYou.profileFavorites.options.${favorite.id}.placeholder`)}
                    multiline
                    value={value}
                    onChangeText={setValue}
                    style={{ minHeight: 120, maxHeight: 200, textAlignVertical: "top" }}
                    className="text-base font-roboto text-typography-800 w-full"
                    />
                

                    {/* Save Button */}
                    <Button
                    className="w-full rounded-lg bg-primary-700 data-[active=true]:bg-primary-800"
                    isDisabled={value === favorite.answer}
                    onPress={() => {
                        if (!user?.favorites || mutation.isPending || !isOpen) return;
                        triggerHaptic("button")

                        const newFavorites = user.favorites.map((f) =>
                            f.id === favorite.id ? { ...favorite, answer: value } : f
                        );
                        mutation.mutate(newFavorites);
                    }}

                    disabled={value.trim().length === 0}
                    >
                        {mutation.isPending ? (
                            <Spinner/>
                        ) : (
                        <ButtonText>
                            {i18n.t("onboarding.moreAboutYou.profileFavorites.saveAnswer")}
                        </ButtonText>
                        )}
                    </Button>
                </VStack>
            </BottomSheetContent>
        </BottomSheet>
    );
}





function EditFavoritesSheet({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (value: boolean) => void}) {
    const { showErrorToast, showInfoToast, showSuccessToast } = useAwesomeToast();
    const queryClient = useQueryClient();

    const {data: user} = useFullUser();

    const [userFavorites, setUserFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        if (user && user.favorites) {
            setUserFavorites(user.favorites)
        }
    }, [user])

    const [missClicks, setMissClicks] = useState(0);
    useEffect(() => {
        if (missClicks > 0 && missClicks % 3 === 0) {
            showInfoToast(i18n.t("messages.info.onlyThree"), i18n.t("messages.info.unselect"))
        }
    }, [missClicks])

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", userFavorites),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.setQueryData(['user', 'full'], {...user, favorites: userFavorites})
            showSuccessToast(i18n.t("messages.success.dataUpdated"))
            queryClient.invalidateQueries({ queryKey: ['user', 'full']})
        }
    })

    // Utils
    function handleAnswerChange(id: string, newQuestion: string) {
        setUserFavorites((prev) => {
            const existing = prev.find((f) => f.id === id);

            if (existing) {
                return prev.map((f) =>
                    f.id === id ? { ...f, answer: newQuestion } : f
                );
            }

            return [...prev, { id, answer: newQuestion, active: false }];
        });
    }
    function getActiveAmount() {
        return userFavorites.filter((f) => f.active).length;
    }

    function toggleActive(id: string, value?: boolean) {
        setUserFavorites((prev) => {
            const updated = [...prev];
            const index = updated.findIndex((f) => f.id === id);

            if (index !== -1) {
                const currentlyActive = updated.filter((f) => f.active).length;
                const willBeActive = typeof value === "boolean" ? value : !updated[index].active;

                if (willBeActive && !updated[index].active && currentlyActive >= MAX_FAVORITES) {
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
                const currentlyActive = updated.filter((f) => f.active).length;

                if (currentlyActive >= MAX_FAVORITES) {
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

    function getFavoriteValue(id: string): string {
        const favorite = userFavorites.find((f) => f.id === id);
        return favorite?.answer ?? "";
    }

    function isFavoriteActive(id: string): boolean {
        const favorite = userFavorites.find((f) => f.id === id);
        return !!favorite?.active;
    }

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isOpen) return
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, 300);

        return () => {
            setIsReady(false);
            clearTimeout(timeout);
        }
    }, [isOpen]);

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
            setIsOpen(false);
            
            const isDirty = JSON.stringify(user.favorites) !== JSON.stringify(userFavorites);
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
                {isReady && (
                <AnimatedBox entering={FadeInDown.duration(400)} className="flex-1 bg-background-0 gap-4 justify-start items-center">
                    <Box className="flex-1 justify-start items-start px-5 w-[100%]">
                        <VStack className="gap-[18px] w-full">

                            <VStack className="gap-3">
                                <HStack className="gap-2 items-center">
                                    <Heading className="font-roboto font-semibold text-2xl">
                                        {i18n.t("onboarding.moreAboutYou.profileFavorites.title")}
                                    </Heading>
                                    <Badge size="md" className="rounded-md">
                                        <BadgeText>
                                            {getActiveAmount()}/{MAX_FAVORITES}
                                        </BadgeText>
                                    </Badge>
                                </HStack>
                                <Text className="font-roboto font-normal text-base text-typography-400 leading-6">
                                    {i18n.t("onboarding.moreAboutYou.profileFavorites.instructions")}
                                </Text>
                            </VStack>
                            {/* <AnimatedBox entering={FadeInUp.delay(400).duration(400).springify()}> */}
                                <AnimatedScrollView 
                                showsVerticalScrollIndicator={false} 
                                contentContainerStyle={{paddingBottom: 150}}
                                entering={FadeInUp.delay(400).duration(400).springify()}
                                >
                                    <Pressable>
                                        
                                        <Accordion className="w-full bg-background-0 gap-4 pb-6">
                                            {favorites.map((favoriteId) => (
                                                    <FavoriteItem 
                                                    key={favoriteId}
                                                    favoriteId={favoriteId} 
                                                    isActive={isFavoriteActive(favoriteId)} 
                                                    toggleActive={toggleActive}
                                                    answer={getFavoriteValue(favoriteId)}
                                                    handleAnswerChange={handleAnswerChange}
                                                    mutation={mutation}
                                                    />
                                            ))}
                                        </Accordion>
                        
                                    </Pressable>
                                </AnimatedScrollView>
                            {/* </AnimatedBox> */}
                                
                        </VStack>
                    </Box>
                </AnimatedBox>
                )}
            </BottomSheetContent>
        </BottomSheet>
    );
};






interface FavoriteItemProps {
    favoriteId: string, 
    isActive: boolean, 
    toggleActive: (id: string, value?: boolean) => void,
    answer: string,
    handleAnswerChange: (id: string, newValue: string) => void,
    mutation: UseMutationResult<void, Error, void, unknown>
}

function FavoriteItem({favoriteId, isActive, toggleActive, answer, handleAnswerChange, mutation} : FavoriteItemProps) {
    
    return(
        <AccordionItem
        value={`item-${favoriteId}`}
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
                            {i18n.t(`onboarding.moreAboutYou.profileFavorites.options.${favoriteId}.question`)}
                        </AccordionTitleText>

                        <Checkbox 
                        value=""
                        onChange={(value) => {toggleActive(favoriteId, value)}}
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
                    placeholder={i18n.t(`onboarding.moreAboutYou.profileFavorites.options.${favoriteId}.placeholder`)}
                    multiline
                    value={answer}
                    onChangeText={(value) => handleAnswerChange(favoriteId, value)}
                    style={{ minHeight: 120, maxHeight: 200, textAlignVertical: "top" }}
                    className="text-base font-roboto text-typography-800 w-full"
                    />
                </VStack>
            </AccordionContent>
        </AccordionItem>
    )
}




async function updateUser(userId: string, userFavorites: Favorite[]) {
    const {error} = await supabase.from('user_additional_info').update({favorites: userFavorites}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}