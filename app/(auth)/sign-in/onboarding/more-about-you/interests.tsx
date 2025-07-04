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
const AnimatedBox = Animated.createAnimatedComponent(Box)

export default function Interests() {
    const pathName = usePathname();
    const { setFabState } = useFab();

    useEffect(() => {
        if (pathName === "/sign-in/onboarding/more-about-you/interests") {
            setFabState({
                label: undefined,
                isLoading: false,
                isDisabled: false,
                onPress: () => {
                router.push("/home");
                },
            });
        }
    }, [pathName]);

    const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    function toggleInterest(interest: InterestType) {
        setSelectedInterests((prev) =>
            prev.some((item) => item.value === interest.value)
                ? prev.filter((item) => item.value !== interest.value)
                : [...prev, interest]
        );
    };

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

                <VStack className="gap-3 mb-8">
                    <AnimatedBox className="flex-row items-center gap-2" entering={FadeInDown.delay(100).duration(600).springify().delay(100)}>
                        <Heading className="font-roboto font-semibold text-2xl">
                            What are your interests?
                        </Heading>
                        <Badge size="md" className="rounded-md">
                            <BadgeText>
                                {selectedInterests.length}/{MAX_INTERESTS_AMOUNT}
                            </BadgeText>
                        </Badge>
                    </AnimatedBox>
                    <Text className="font-normal font-roboto text-typography-400" >Välj upp till 6 olika intressen så att du kan hitta likasinnade personer.</Text>
                </VStack>

                <SelectedInterests selectedInterests={selectedInterests} onToggle={toggleInterest} />
                
                <Input className="border-typography-200 rounded-lg" size="md">
                    <InputField
                    placeholder="Search your interests"
                    className="font-normal font-roboto py-2"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    />
                    <InputSlot className="pr-3.5">
                        <InputIcon as={SearchIcon} className="text-typography-300" />
                    </InputSlot>
                </Input>
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
                                    const isSelected = selectedInterests.some((item) => item.value === interest.value);
                                    return (
                                        <InterestBadge
                                        key={interest.value}
                                        interest={interest}
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
                                Didn’t find your interests here? Just go on add it!
                            </Text>
                            <Button className="bg-background-900 px-4 rounded-[4px] data-[active=true]:bg-background-700">
                                <ButtonText className="text-typography-50 data-[active=true]:text-typography-0 font-roboto font-medium text-sm">
                                    Add New
                                </ButtonText>
                            </Button>
                        </HStack>

                    </VStack>
                </Pressable>
            </ScrollView>
        </Box>
    );
}





function SelectedInterests({selectedInterests, onToggle} : {selectedInterests: InterestType[], onToggle: (interest: InterestType) => void}) {

    if (selectedInterests.length === 0) return null

    return (
        <Box className="mb-2">
            <ScrollView horizontal={true} className="gap-4" showsHorizontalScrollIndicator={false}>
                {selectedInterests.map((interest) => (
                    <Box key={interest.value} className="mr-2">
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
    interest: InterestType;
    isSelected: boolean;
    onToggle: (interest: InterestType) => void;
    withRemoveButton?: boolean
}) => (
    <Pressable
    onPress={() => onToggle(interest)}
    className={`bg-background-50 py-1 px-3 rounded-3xl border border-background-100 ${
    isSelected ? "border-primary-800/10 bg-primary-700/80" : ""
    }`}
    >
        <HStack className="gap-2 items-center">
            <Text className={`font-sfpro text-sm font-normal ${isSelected ? "text-white" : ""}`}>
                {i18n.t(`interests.interests.${interest.value}`)}
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
    selectedInterests: InterestType[];
    onToggle: (interest: InterestType) => void;
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
                    const isSelected = selectedInterests.some((item) => item.value === interest.value);
                    return (
                        <InterestBadge
                        key={interest.value}
                        interest={interest}
                        isSelected={isSelected}
                        onToggle={onToggle}
                        />
                    );
                })}
            </Box>
            {interests.length > 6 && (
                <Pressable onPress={() => setExpanded((prev) => !prev)}>
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