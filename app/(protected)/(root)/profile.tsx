import React, { useEffect, useState } from "react";
import { router, Router } from "expo-router";
import { LogoIcon, BoltIcon, HelpCenterIcon, FilterIcon } from "@/components/shared/icons";
import { Headset,  } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import {
  ChevronRightIcon,
  EditIcon,
  Icon,
  SettingsIcon,
} from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
// import { Image } from "@/components/ui/image";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
// import { profile } from "@/data/data";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useCoreUser } from "@/hooks/user/useCoreUser";
import { Spinner } from "@/components/ui/spinner";
import { calculateAge } from "@/utils/calculateAge";
import { useExtendedUser } from "@/hooks/user/useExtendedUser";
import { useFullUser } from "@/hooks/user/useFullUser";
import { User } from "@/types";
import { triggerHaptic } from "@/utils/haptics";
import { FilterBottomSheet } from "@/components/shared/filter";

function Header() {
    return (
        <Box className="w-full flex flex-row items-center p-4 gap-2">
            <Icon as={LogoIcon} className="w-7 h-7" />
            <Heading size="xl" className="font-satoshi">
                Meetli
            </Heading>
        </Box>
    );
}

function ProfileHeader({user} : {user: User}) {
    const [isOpen, setIsOpen] = useState(false);
    const [defaultOpen, setDefaultOpen] = useState<string | undefined>(undefined);
    const defaultOpenProp = defaultOpen && {
        defaultOpen: [defaultOpen?.toLocaleLowerCase().replace(" ", "-")],
    };

    return (
    <>
        <Box className="items-center flex-row justify-between">
            <Heading size="2xl" className="font-roboto text-[32px]">
                {`${user.first_name}`}, {calculateAge(user.dob)}
            </Heading>
            <Button
                className="bg-background-200 data-[active=true]:bg-background-300"
                size="sm"
                onPress={() => {
                    triggerHaptic("button")
                    setDefaultOpen(undefined);
                    setIsOpen(true);
                }}
            >
                <ButtonText className="text-typography-950 font-roboto data-[active=true]:text-typography-900">
                Filter
                </ButtonText>
                <ButtonIcon
                as={FilterIcon}
                className="text-typography-950 font-roboto data-[active=true]:text-typography-900"
                />
            </Button>
        </Box>
        <FilterBottomSheet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            {...defaultOpenProp}
        />
    </>
    );
}

function ProfileProgress({user} : {user: User}) {

    const [number, setNumber] = useState(0);
    const targetNumber = 67;
    useEffect(() => {
        // If we haven't reached target yet
        if (number < targetNumber) {
        setTimeout(() => {
            setNumber((prev: any) => Math.min(prev + 2, targetNumber));
        }, 1); // Update every 1ms
        }
    }, [number]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
        width: `${number}%`,
        };
    });

    return (
        <Box className="h-[176px] flex flex-col items-center justify-center bg-background-50 rounded-lg mt-6 gap-5 p-3">
            <Box className="flex-row gap-x-5 w-full">
                <Box className="aspect-square w-24">
                <Image
                source={user.images[0]?.url ?? ""}
                cachePolicy="memory-disk"
                alt="profile"
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 50,    // adjust for how rounded you want it
                }}
                />
                </Box>
                <Box className="flex-col flex-1">
                <Box className="flex-row gap-x-2 items-center">
                    <Text className="font-roboto text-secondary-500 flex-wrap text-sm font-semibold">
                    {number}%
                    </Text>
                    <Box className="flex-1 flex-row h-1 bg-background-300 rounded-full">
                    <Animated.View
                        style={animatedStyle}
                        className="bg-secondary-500 h-full rounded-full"
                    />
                    </Box>
                </Box>
                <Text className="font-roboto text-typography-500 flex-wrap text-sm">
                    {user.intro}
                </Text>
                </Box>
            </Box>
            <Button
            size="sm"
            className="bg-background-950 data-[active=true]:bg-background-800 self-end"
            onPress={() => router.push("/edit-profile")}
            >
                <ButtonText className="text-typography-0 font-roboto data-[active=true]:text-typography-50">
                Edit Profile
                </ButtonText>
                <ButtonIcon
                as={EditIcon}
                className="text-typography-0 font-roboto data-[active=true]:text-typography-900"
                />
            </Button>
        </Box>
    );
}

function ProfileOptions() {
    return (
        <Box className="flex-col gap-y-2 mt-4 py-2">
            {/* <Box className="flex-row gap-3 bg-primary-800 rounded-lg p-2 ">
                <Box className="bg-primary-900 p-2.5 rounded-lg h-10 w-10 flex items-center justify-center">
                    <Icon className="w-5 h-5" as={BoltIcon} />
                </Box>
                <Box className="flex-col flex-1">
                    <Text className="font-roboto text-typography-950 font-medium">
                        Profile Boost
                    </Text>
                    <Text className="font-roboto text-typography-800 text-sm">
                        Get more visibility and increase your chances of finding the perfect
                        match with our Profile Boost feature.
                    </Text>
                </Box>
                <Pressable className="p-1">
                    <Icon as={ChevronRightIcon} className="w-4 h-4" />
                </Pressable>
            </Box> */}
            <Pressable className="flex-row gap-x-2 items-center w-full gap-3 data-[active=true]:bg-background-50/50 rounded-lg py-3 mt-2 px-2">
                <Box className="bg-background-50 rounded-lg h-8 w-8 flex items-center justify-center">
                <Icon as={SettingsIcon} className="w-4 h-4" />
                </Box>
                <Text className="font-roboto text-typography-950 font-medium flex-1">
                Settings
                </Text>
                <Icon as={ChevronRightIcon} className="w-4 h-4" />
            </Pressable>
            <Pressable className="flex-row gap-x-2 items-center w-full gap-3 data-[active=true]:bg-background-50/50 rounded-lg py-3 px-2">
                <Box className="bg-background-50 rounded-lg h-8 w-8 flex items-center justify-center">
                    <Icon as={Headset} className="text-typography-950 w-4 h-4" />
                </Box>
                <Text className="font-roboto text-typography-950 font-medium flex-1">
                Help Center
                </Text>
                <Icon as={ChevronRightIcon} className="w-4 h-4" />
            </Pressable>
        </Box>
    );
}

export default function Index() {
    const {data: user} = useFullUser();

    return (
        <>
        <Header/>
        <Box className="px-4">
            {user ? (
            <>
                <ProfileHeader user={user}/>
                <ProfileProgress user={user}/>
                <ProfileOptions/>
            </>
            ) : (
                <Spinner/>
            )}
        </Box>
        </>
    );
}
