import { LogoIcon } from "@/components/shared/icons";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { router, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

const AnimatedHstack = Animated.createAnimatedComponent(HStack);
const AnimatedText = Animated.createAnimatedComponent(Text);

import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";


export default function Verified() {

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        setFabState({
            onPress: () => {
                router.push("/sign-in/onboarding/name");
            }
        })
    }, [pathName])
    
    return (
        <Box className="px-5 gap-4 flex-1 items-center justify-center">
            <AnimatedHstack
                entering={FadeInDown.duration(400).springify()}
                className="gap-4 w-full justify-center items-center"
            >
                <Icon as={LogoIcon} className="w-[72px] h-[72px]" />
                <Text className="font-semibold font-roboto text-4xl leading-10 text-typography-950 flex-1">
                    {i18n.t("onboarding.verified.accountVerifiedText")}
                </Text>
            </AnimatedHstack>
            <AnimatedText
                entering={FadeInDown.delay(400).duration(400).springify()}
                className="font-roboto text-typography-500 text-base leading-6"
            >
                {i18n.t("onboarding.verified.accountVerifiedSubText")}
            </AnimatedText>
        </Box>
    );
};
