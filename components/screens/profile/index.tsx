import React from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ThreeDotsIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Badge } from "@/components/ui/badge";
import { ImageBackground } from "@/components/ui/image-background";
import { LinearGradient } from "expo-linear-gradient";
import { LocationBadge, LoveBadge } from "../../shared/badge";
import { Text } from "@/components/ui/text";
import { FavoriteCard, PromptCard } from "./_components/qa-card";
// import { InstaCard } from "../../shared/instagram-card";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useFullUser } from "@/hooks/user/useFullUser";
import { Spinner } from "@/components/ui/spinner";
import { i18n } from "@/app/_layout";
import { calculateAge } from "@/utils/calculateAge";
import ImageCarousel from "./_components/imageCarousel";
import { Image } from "expo-image";
import ProfileImage from "./_components/profileImage";
const AnimatedBox = Animated.createAnimatedComponent(Box);

export function ProfileScreen() {
    const {data: user} = useFullUser();
    
    if (!user) return <Spinner/>

    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <AnimatedBox
            key={user.id}
            className="flex-1 gap-5 w-full p-4 pt-0 bg-background-0"
            entering={SlideInRight}
            exiting={SlideOutRight}
            >
                <HStack className="w-full items-center justify-between gap-3">
                <Heading size="3xl" className="font-roboto">
                    {user.first_name}, {calculateAge(user.dob)}
                </Heading>

                <Button variant="link" className="bg-transparent">
                    <ButtonIcon
                    as={ThreeDotsIcon}
                    className="text-typography-950 data-[active=true]:text-typography-900"
                    />
                </Button>
                </HStack>
        
                <ImageCarousel user={user} shouldLoad />
                <Box>
                <ScrollView
                    horizontal
                    className="w-full"
                    showsHorizontalScrollIndicator={false}
                >
                    <HStack className="gap-x-3">
                    {user.interests.map((item, index) => (
                        <Text
                        key={index}
                        size="sm"
                        className="font-roboto bg-primary-700 py-2 px-4 rounded-3xl text-white items-center justify-center h-9"
                        >
                        {i18n.t(`interests.interests.${item.interest}`)}
                        </Text>
                    ))}
                    </HStack>
                </ScrollView>
                </Box>
                <Text size="sm">{user.intro}</Text>

                <PromptCard
                user={user}
                order={1}
                />

                <FavoriteCard
                user={user}
                order={1}
                />
                <ProfileImage user={user} order={4}/>
                <ProfileImage user={user} order={5}/>

       
                <PromptCard
                user={user}
                order={2}
                />
                <PromptCard
                user={user}
                order={3}
                />

                <ProfileImage user={user} order={6}/>
                
                <FavoriteCard
                user={user}
                order={2}
                />
                <FavoriteCard
                user={user}
                order={3}
                />
                

            </AnimatedBox>
        </ScrollView>
    );
};
