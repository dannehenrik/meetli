import { LogoIcon } from "@/components/shared/icons";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedHstack = Animated.createAnimatedComponent(HStack);
const AnimatedText = Animated.createAnimatedComponent(Text);

import { i18n } from "@/app/_layout";


export default function Verified() {

    

    return (
        <Box className="px-5 gap-4 flex-1 items-center justify-center">
            <AnimatedHstack
                entering={FadeInDown.duration(400)}
                className="gap-4 w-full justify-center items-center"
            >
                <Icon as={LogoIcon} className="w-[72px] h-[72px]" />
                <Text className="font-semibold font-roboto text-4xl leading-10 text-typography-950 flex-1">
                    {i18n.t("onboarding.verified.accountVerifiedText")}
                </Text>
            </AnimatedHstack>
            <AnimatedText
                entering={FadeInDown.delay(400).duration(400)}
                className="font-roboto text-typography-500 text-base leading-6"
            >
                {i18n.t("onboarding.verified.accountVerifiedSubText")}
            </AnimatedText>
            <Fab
                className="bg-background-950 rounded-lg w-auto h-[48px] data-[active=true]:bg-background-900"
                onPress={() => router.push("./name")}
            >
                <FabLabel className="text-typography-50 font-roboto font-medium">
                    {i18n.t("onboarding.verified.enterDetails")}
                </FabLabel>
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
};
