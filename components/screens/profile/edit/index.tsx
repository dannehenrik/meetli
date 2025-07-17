import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { useFullUser } from "@/hooks/user/useFullUser";
import { i18n } from "@/app/_layout";
import { Pictures } from "./_components/Pictures";
import { Spinner } from "@/components/ui/spinner";
import { Interests } from "./_components/Interests";
import { Intro } from "./_components/IntroEditor";
import { Prompts } from "./_components/PromptEditor";
import { Favorites } from "./_components/FavoritesEditor";
import { LifestyleSections } from "./_components/lifestyle";
import { BeliefsAndValuesSections } from "./_components/beliefsAndValues";
import { FamilySections } from "./_components/family";
import { CareerSections } from "./_components/career";


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
            <Box className="gap-3">
                <Text className="text-typography-950 text-base font-medium mb-1">
                {i18n.t("editProfile.titles.pictures")}
                </Text>
                {picturesReady ? <Pictures/> : <Spinner/>}
            </Box>

            {/* Interests */}
            <Interests />

            {/* Profile Description */}
            <Intro/>
 

            {/* Prompts */}
           
            <Prompts/>

            <Favorites/>

            <LifestyleSections/>

            <BeliefsAndValuesSections/>

            <FamilySections/>

            <CareerSections/>
            
        </AnimatedBox>
    );
};
