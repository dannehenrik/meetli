import React from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { FabIcon, Fab, FabLabel } from "@/components/ui/fab";
import { LogoIcon } from "@/components/shared/icons";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";

const AnimatedHstack = Animated.createAnimatedComponent(HStack);
const AnimatedText = Animated.createAnimatedComponent(Text);

import { useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { i18n } from "@/app/_layout";
import { getUser } from "@/server/auth/getUser";
import { useQuery } from "@tanstack/react-query";

export default function Verified() {

    const insets = useSafeAreaInsets();

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
                className="bg-background-950 rounded-lg w-auto h-[48px] absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                onPress={() => router.push("./name")}
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabLabel className="text-typography-50 font-roboto font-medium">
                    {i18n.t("onboarding.verified.enterDetails")}
                </FabLabel>
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
};
