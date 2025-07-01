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

export default function ProfileBaseComplete() {
    

    return (
        <Box className="flex-1 justify-center items-center gap-11 px-5 w-full pb-28">
            <AnimatedVstack
                entering={FadeInDown.duration(400)}
                className="gap-7 justify-center items-center"
            >
                <Image
                    source={require("@/assets/images/onboarding/onboarding-completed.png")}
                    alt="Profile complete"
                    className="w-[350px] h-[338px]"
                />

                <AnimatedVstack
                    entering={FadeInDown.delay(400).duration(400)}
                    className="gap-2"
                >
                    <Heading className="text-typography-950 text-4xl font-roboto font-semibold text-center">
                        Din profilbas är klar!
                    </Heading>

                    <Text className="text-typography-500 text-xl font-roboto font-medium text-center">
                        Nu fortsätter vi med några snabba frågor om din livsstil.
                    </Text>
                </AnimatedVstack>
            </AnimatedVstack>

            <Fab
                onPress={() => {
                    // router.push("/onboarding/lifestyle");
                }}
                className="bg-background-950 rounded-lg data-[active=true]:bg-background-900"
            >
                <FabLabel>Fortsätt</FabLabel>
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
}
