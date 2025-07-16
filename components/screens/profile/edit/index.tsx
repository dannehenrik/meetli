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
import { Intro } from "./_components/IntroEditor";
import { Prompts } from "./_components/PromptEditor";


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
            <Intro/>
 

            {/* Prompts */}
           
            <Prompts/>
            
        </AnimatedBox>
    );
};
