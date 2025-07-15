import { i18n } from "@/app/_layout";
import {
    BottomSheet,
    BottomSheetBackdrop,
    BottomSheetContent,
    BottomSheetDragIndicator,
    BottomSheetScrollView,
    BottomSheetTextInput
} from "@/components/shared/bottom-sheet";
import { PenIcon } from "@/components/shared/icons";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { User } from "@/types";
import { triggerHaptic } from "@/utils/haptics";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';

import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { MAX_INTERESTS_AMOUNT } from "@/constants/constants";
import { interestsList, InterestType } from "@/constants/interests";
import { useAwesomeToast } from "@/hooks/toasts";
import { supabase } from "@/utils/supabase";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";
import { BottomSheetView, TouchableWithoutFeedback } from "@gorhom/bottom-sheet";
import { Keyboard, Platform } from "react-native";
import { useFullUser } from "@/hooks/user/useFullUser";
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedHstack = Animated.createAnimatedComponent(HStack)
const AnimatedVstack = Animated.createAnimatedComponent(VStack)



export function Interests() {
    const [isEditing, setIsEditing] = useState(false);

    const {data: user} = useFullUser();
    if (!user) return null
     
    return(
    <>
        {/* Interests */} 
        <Box className="gap-3">
            <HStack className="justify-between items-center">
                <Text className="text-typography-950 text-base font-medium mb-1">
                    Interests ({user?.interests.length}/{MAX_INTERESTS_AMOUNT})
                </Text>
                
                <Button 
                className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto"
                onPress={() => setIsEditing(true)}
                >
                    <ButtonIcon
                    as={PenIcon}
                    className="text-typography-900 data-[active=true]:text-typography-950"
                    />
                </Button>
            </HStack>
            <Pressable onPress={() => setIsEditing(true)}>
                <Box className="flex-wrap flex-row gap-2 p-4 border border-background-100 rounded-lg">
                    {user?.interests.map((interest) => (
                        <InterestBadge key={interest.interest} interest={interest.interest} isSelected={true} onToggle={() => setIsEditing(true)}/>
                    ))}
                </Box>
            </Pressable>
        </Box>
        
        <EditInterestsSheet isOpen={isEditing} setIsOpen={setIsEditing} />
    </>
    )
}



function EditInterestsSheet({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (value: boolean) => void}) {
    const {showErrorToast, showSuccessToast} = useAwesomeToast();
    const queryClient = useQueryClient();

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const {data: user} = useFullUser();
    useEffect(() => {
        if (user && user.interests) {
            setSelectedInterests(user.interests.map((interest) => interest.interest))
        }
    }, [user])



    const mutation = useMutation({
        mutationFn: async () => updateUserInterests(selectedInterests),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"));
        },
        onSuccess: () => {
            queryClient.setQueryData(['user', 'full'], (oldUserData: User | undefined) => {
                if (!oldUserData) return oldUserData;

                return {
                    ...oldUserData,
                    interests: selectedInterests.map((interest) => ({ interest: interest })),
                };
            });
            showSuccessToast(i18n.t("messages.success.dataUpdated"))
            queryClient.invalidateQueries({queryKey: ['user', 'full']})
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
            
            const isDirty = JSON.stringify(user.interests.map(i => i.interest)) !== JSON.stringify(selectedInterests);
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
                <InterestsEdit selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests} />
            
            </BottomSheetContent>
        </BottomSheet>
    );
};







export default function InterestsEdit( {selectedInterests, setSelectedInterests} : {selectedInterests: string[], setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>}) {
    const [searchQuery, setSearchQuery] = useState<string>("");

    function toggleInterest(interest: string) {
        const isSelected = selectedInterests.includes(interest);

        if (isSelected) {
            setSelectedInterests((prev) => prev.filter((item) => item !== interest));
            return;
        }

        if (selectedInterests.length >= MAX_INTERESTS_AMOUNT) {
            triggerHaptic("error");
            return;
        }

        triggerHaptic("select");
        setSelectedInterests((prev) => [...prev, interest]);
    }


    const filteredInterests = interestsList.filter((interest) =>
        i18n.t(`interests.interests.${interest.value}`).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedInterests = interestsList.reduce((acc, interest) => {
        if (!acc[interest.group]) acc[interest.group] = [];
            acc[interest.group].push(interest);
            return acc;
    }, {} as Record<string, InterestType[]>);

    function handleKeyboardDismiss() {
        if (Platform.OS !== "web") {
            Keyboard.dismiss();
        }
    };


    return (
    <>
    
        <VStack space="sm">

                <Box className="gap-3">
                    <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
                        <VStack className="gap-3">
                            <Box className="flex-row items-center gap-2" >
                                <Heading className="font-roboto font-semibold text-2xl">
                                    {i18n.t("onboarding.moreAboutYou.interests.title")}
                                </Heading>
                                <Badge size="md" className="rounded-md">
                                    <BadgeText>
                                        {selectedInterests.length}/{MAX_INTERESTS_AMOUNT}
                                    </BadgeText>
                                </Badge>
                            </Box>
                            <Text className="font-normal font-roboto text-typography-400" >
                                {i18n.t("onboarding.moreAboutYou.interests.instructions")}
                            </Text>
                        </VStack>
                    </TouchableWithoutFeedback>
                </Box>
            {/* </TouchableWithoutFeedback> */}
            
            

            <SelectedInterests selectedInterests={selectedInterests} onToggle={toggleInterest} />

            {/* Input */}
            <HStack 
            className="w-full px-4 py-2 bg-background-50 rounded-md border border-background-200 items-center"
            space="xs"
            >
                <Icon as={SearchIcon} className="text-typography-400 w-4 h-4" />
                <BottomSheetTextInput
                    placeholder={i18n.t("onboarding.moreAboutYou.interests.placeholder")}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="flex-1 text-md py-1 text-typography-900 placeholder-text-typography-400 bg-transparent"
                    
                />
            </HStack>

            
        </VStack>
    
        <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        className="flex-1"  // Added horizontal padding here
        contentContainerStyle={{paddingBottom: 60}}
        >   

            <VStack className="gap-12 mt-4 mb-8">
                {searchQuery.length > 0 ? (
                    <Box className="flex flex-row flex-wrap gap-2">
                        {filteredInterests.map((interest) => {
                            const isSelected = selectedInterests.some((item) => item === interest.value);
                            return (
                                <InterestBadge
                                key={interest.value}
                                interest={interest.value}
                                isSelected={isSelected}
                                onToggle={toggleInterest}
                                />
                            );
                        })}
                    </Box>
                ) : (
                    <VStack className="gap-10">
                        {Object.entries(groupedInterests).map(([group, items]) => (
                            <InterestGroup
                            key={group}
                            group={group}
                            interests={items}
                            selectedInterests={selectedInterests}
                            onToggle={toggleInterest}
                            />
                        ))}
                    </VStack>
                )}

                <HStack className="justify-between items-center bg-background-50 p-3 rounded-lg w-full gap-2">
                    <Text className="flex-1">
                        {i18n.t("onboarding.moreAboutYou.interests.requestInterestPrompt")}
                    </Text>
                    <Button className="bg-background-900 px-4 rounded-[4px] data-[active=true]:bg-background-700">
                        <ButtonText className="text-typography-50 data-[active=true]:text-typography-0 font-roboto font-medium text-sm">
                            {i18n.t("onboarding.moreAboutYou.interests.request")}
                        </ButtonText>
                    </Button>
                </HStack>

            </VStack>
        </BottomSheetScrollView>
    </>
    );
}





function SelectedInterests({selectedInterests, onToggle} : {selectedInterests: string[], onToggle: (interest: string) => void}) {

    if (selectedInterests.length === 0) return null

    return (
        <Box className="flex-wrap flex-row gap-2 p-4 border border-background-100 rounded-lg mb-8">
            {selectedInterests.map((interest) => (
                <InterestBadge key={interest} withRemoveButton={true} interest={interest} isSelected={true} onToggle={onToggle}/>
            ))}
        </Box>
    )
}
// 🧱 Reusable badge component
const InterestBadge = ({
    interest,
    isSelected,
    onToggle,
    withRemoveButton = false,
}: {
    interest: string;
    isSelected: boolean;
    onToggle: (interest: string) => void;
    withRemoveButton?: boolean
}) => (
    <Pressable
    onPress={() => onToggle(interest)}
    className={`bg-background-50 py-1 px-3 rounded-3xl border border-background-100 active:bg-background-100 ${
    isSelected ? "border-primary-800/10 bg-primary-700/80" : ""
    }`}
    >
        <HStack className="gap-2 items-center">
            <Text className={`font-sfpro text-sm font-normal ${isSelected ? "text-white" : ""}`}>
                {i18n.t(`interests.interests.${interest}`)}
            </Text>

            {withRemoveButton && (
            <Icon className="text-white" as={X} />
            )}
        </HStack>
    </Pressable>
);

// 🔽 Group component to handle toggle logic
const InterestGroup = ({
    group,
    interests,
    selectedInterests,
    onToggle,
}: {
    group: string;
    interests: InterestType[];
    selectedInterests: string[];
    onToggle: (interest: string) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? interests : interests.slice(0, 6);

    return (
        <VStack key={group} className="gap-4">
            <Text className="font-roboto font-medium text-lg text-typography-800">
                {i18n.t(`interests.groups.${group}`)}
            </Text>
            <Box className="flex flex-row flex-wrap gap-2">
                {visibleItems.map((interest) => {
                    const isSelected = selectedInterests.some((item) => item === interest.value);
                    return (
                        <InterestBadge
                        key={interest.value}
                        interest={interest.value}
                        isSelected={isSelected}
                        onToggle={onToggle}
                        />
                    );
                })}
            </Box>
            {interests.length > 6 && (
                <Pressable 
                onPress={() => {
                    triggerHaptic("buttonLight")
                    setExpanded((prev) => !prev)
                }}
                >
                    <HStack className="items-center">
                        <Text className="text-primary-700 font-roboto font-medium text-sm">
                            {expanded ? "Show less" : "Show more"}
                        </Text>
                        <Icon className="text-primary-700" size="sm" as={expanded ? ChevronUp : ChevronDown} />
                    </HStack>
                </Pressable>
            )}
        </VStack>
    );
};


async function updateUserInterests(interests: string[]) {
    const {error} = await supabase.rpc('update_user_interests', {user_interests: interests})

    if (error) throw new Error("Something went wrong when updating the user interests: " + error.message)
}