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
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { useFullUser } from "@/hooks/user/useFullUser";
import { i18n } from "@/app/_layout";
import { Pictures } from "./_components/Pictures";
import { Spinner } from "@/components/ui/spinner";
import { InteractionManager } from "react-native";
import { Interests } from "./_components/Interests";


const AnimatedBox = Animated.createAnimatedComponent(Box);


export function EditScreen() {
    
    const {data: user} = useFullUser();

    const [picturesReady, setPicturesReady] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPicturesReady(true);
        }, 1000); // simulate a delay for loading or animation

        return () => clearTimeout(timeout);
    }, []);

    if (!user) return <Spinner/>

    return (
        <AnimatedBox
        className="flex-1 gap-5 p-4 pt-0 w-full bg-background-0"
        entering={SlideInLeft}
        exiting={SlideOutLeft}
        >
            {/* My photos & videos */}
            {/* <Box className="gap-3">
                <Text className="text-typography-950 text-base font-medium mb-1">
                My Photos & Videos
                </Text>
                {picturesReady ? <Pictures/> : <Spinner/>}
            </Box> */}

            {/* Interests */}
            <Interests />

            {/* Profile Description */}
            <Box className="gap-3">
                <HStack className="justify-between items-center">
                    <Text className="text-typography-950 text-base font-medium mb-1">
                        Profile Description
                    </Text>
                    <Button className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto">
                        <ButtonIcon
                        as={PenIcon}
                        className="text-typography-900 data-[active=true]:text-typography-950"
                        />
                    </Button>
                </HStack>
                <Box className="flex-wrap flex-row gap-2 p-4 bg-background-50 rounded-lg">
                    <Text className="text-typography-950 text-sm">{user?.intro}</Text>
                </Box>
            </Box>

            {/* Prompts */}
            <Box className="gap-3">
                <Text className="text-typography-950 text-base font-medium mb-1">
                Prompts
                </Text>

                <Pressable className="flex-row gap-2 py-2.5 px-4 self-center mb-1">
                    <Text className="text-typography-950 text-sm">Add New Prompt</Text>
                    <Icon as={AddIcon} />
                </Pressable>

                {user?.prompts.map(({ answer, id, active }, index) => {
                    if (!active) return null
                    return(
                        <VStack className="gap-4 p-4 mb-1 bg-background-50 rounded-lg" key={index}>
                            <HStack className="justify-between items-center">
                                <Text className="text-typography-600 text-sm">{i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${id}.question`)}</Text>
                                <Button className="p-1.5 bg-background-400 data-[active=true]:bg-background-500 h-auto">
                                    <ButtonIcon
                                    as={PenIcon}
                                    className="text-typography-900 data-[active=true]:text-typography-950"
                                    />
                                </Button>
                            </HStack>
                            <Text className="text-typography-950">{answer}</Text>
                        </VStack>
                    )
                })}
            </Box>
            
        </AnimatedBox>
    );
};
