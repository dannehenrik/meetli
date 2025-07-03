import { i18n } from "@/app/_layout";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedVstack = Animated.createAnimatedComponent(VStack);
const AnimatedHeading = Animated.createAnimatedComponent(Heading);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function ProfileBaseComplete() {
    

    return (
        <Box className="flex-1 justify-center items-center gap-11 px-5 w-full pb-28">
            <AnimatedVstack
                entering={FadeInDown.duration(400)}
                className="gap-7 justify-center items-center"
            >
                <AnimatedImage
                    source={require("@/assets/images/onboarding/onboarding-completed.png")}
                    alt="Profile complete"
                    className="w-[350px] h-[338px]"
                />

                <VStack className="gap-2">
                    <AnimatedHeading 
                    className="text-typography-950 text-4xl font-roboto font-semibold text-center"
                    entering={FadeInDown.duration(400).springify()}
                    >
                        {i18n.t("onboarding.profileBaseCompleted.title")}
                    </AnimatedHeading>

                    <AnimatedText 
                    className="text-typography-500 text-xl font-roboto font-medium text-center"
                    entering={FadeInDown.delay(400).duration(400).springify()}
                    >
                        {i18n.t("onboarding.profileBaseCompleted.description")}
                    </AnimatedText>
                </VStack>
            </AnimatedVstack>
        </Box>
    );
}
