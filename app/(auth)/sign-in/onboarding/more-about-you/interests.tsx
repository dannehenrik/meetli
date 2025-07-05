import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { router, usePathname } from "expo-router";
import { interestsList, InterestType } from "@/constants/interests";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Badge, BadgeText } from "@/components/ui/badge";
import { MAX_INTERESTS_AMOUNT } from "@/constants/constants";
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';
import { i18n } from "@/app/_layout";
import { triggerHaptic } from "@/utils/haptics";
import { supabase } from "@/utils/supabase";
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { useMutation } from "@tanstack/react-query";
import { useAwesomeToast } from "@/hooks/toasts";
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedVstack = Animated.createAnimatedComponent(VStack)
const AnimatedInput = Animated.createAnimatedComponent(Input)


export default function Interests() {
    const {showErrorToast, showWarningToast, showInfoToast} = useAwesomeToast();
    

    const {data: user} = useExtendedUser();

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

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
            router.back();
        },
    })



    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/more-about-you/interests") {
            setFabState({
                label: undefined,
                isLoading: false,
                isDisabled: false,
                onPress: () => {
                    router.push("/sign-in/onboarding/more-about-you/training-habits");
                    mutation.mutate()
                },
            });
        }
    }, [pathName]);

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

    return (
        <Box className="flex-1 bg-background-0">
            <Box className="px-5 pt-11 pb-4 bg-background-0 z-10">

                <AnimatedVstack entering={FadeInDown.duration(400).springify()} className="gap-3 mb-8">
                    <AnimatedBox className="flex-row items-center gap-2" >
                        <Heading className="font-roboto font-semibold text-2xl">
                            {i18n.t("onboarding.moreAboutYou.interests.title")}
                        </Heading>
                        <Badge size="md" className="rounded-md">
                            <BadgeText>
                                {selectedInterests.length}/{MAX_INTERESTS_AMOUNT}
                            </BadgeText>
                        </Badge>
                    </AnimatedBox>
                    <Text className="font-normal font-roboto text-typography-400" >
                        {i18n.t("onboarding.moreAboutYou.interests.instructions")}
                    </Text>
                </AnimatedVstack>

                <SelectedInterests selectedInterests={selectedInterests} onToggle={toggleInterest} />
                
                <AnimatedInput 
                className="border-typography-200 rounded-lg" 
                size="md"
                entering={FadeInDown.delay(400).duration(400).springify()} 
                >
                    <InputField
                    placeholder="Search your interests"
                    className="font-normal font-roboto py-2"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    />
                    <InputSlot className="pr-3.5">
                        <InputIcon as={SearchIcon} className="text-typography-300" />
                    </InputSlot>
                </AnimatedInput>
            </Box>

            <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            >
                <Pressable>
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
                </Pressable>
            </ScrollView>
        </Box>
    );
}





function SelectedInterests({selectedInterests, onToggle} : {selectedInterests: string[], onToggle: (interest: string) => void}) {

    if (selectedInterests.length === 0) return null

    return (
        <Box className="mb-2">
            <ScrollView horizontal={true} className="gap-4" showsHorizontalScrollIndicator={false}>
                {selectedInterests.map((interest) => (
                    <Box key={interest} className="mr-2">
                        <InterestBadge withRemoveButton={true} interest={interest} isSelected={true} onToggle={onToggle}/>
                    </Box>
                ))}
            </ScrollView>
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
        <AnimatedVstack 
        key={group} 
        className="gap-4"
        entering={FadeInLeft.delay(600).duration(400).springify()}
        >
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
        </AnimatedVstack>
    );
};


async function updateUserInterests(interests: string[]) {
    const {error} = await supabase.rpc('update_user_interests', {user_interests: interests})

    if (error) throw new Error("Something went wrong when updating the user interests: " + error.message)
}