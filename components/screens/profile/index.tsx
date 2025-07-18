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
import { QACard } from "./_components/qa-card";
// import { InstaCard } from "../../shared/instagram-card";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useFullUser } from "@/hooks/user/useFullUser";
import { Spinner } from "@/components/ui/spinner";
import { i18n } from "@/app/_layout";
import { calculateAge } from "@/utils/calculateAge";
const AnimatedBox = Animated.createAnimatedComponent(Box);

export const ProfileScreen = () => {
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
          {user && (
            <Badge
              variant="outline"
              className="bg-transparent gap-1 rounded-full border-secondary-700 ml-auto"
            >
              <Box className="w-2 h-2 bg-secondary-700 rounded-full" />
              <Text className="text-secondary-700 pb-[3px]">active now</Text>
            </Badge>
          )}
          <Button variant="link" className="bg-transparent">
            <ButtonIcon
              as={ThreeDotsIcon}
              className="text-typography-950 data-[active=true]:text-typography-900"
            />
          </Button>
        </HStack>
        <ImageBackground
          source={user.images[0]?.url ? { uri: user.images[0].url } : undefined}

          className="w-full rounded-lg aspect-[0.8] justify-end overflow-hidden"
        >
          <LinearGradient
            colors={["#12121200", "#121212bb"]}
            className="flex-row w-full justify-between p-4"
          >
            <LoveBadge lovePercentage={60} size="lg" />
            <LocationBadge distance={50} size="lg" />
          </LinearGradient>
        </ImageBackground>
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
                  className="font-roboto bg-background-200 py-2 px-4 rounded-3xl items-center justify-center h-9"
                >
                  {i18n.t(`interests.interests.${item.interest}`)}
                </Text>
              ))}
            </HStack>
          </ScrollView>
        </Box>
        <Text size="sm">{user.intro}</Text>
        <ImageBackground
          source={user.images[1]?.url ? { uri: user.images[1].url } : undefined}

          className="w-full rounded-lg aspect-square overflow-hidden"
        />
         <QACard
          question={i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${user.prompts[0]?.id}.question`)}
          answer={user.prompts[0].answer}
        />
        {/*
        <ImageBackground
          source={user.images[2]}
          className="w-full rounded-lg aspect-square overflow-hidden"
        />
        <ImageBackground
          source={user.images[3]}
          className="w-full rounded-lg aspect-square overflow-hidden"
        />
        <QACard
          question={user.qa[1].question}
          answer={user.qa[1].answer}
        />
        <ImageBackground
          source={user.images[4]}
          className="w-full rounded-lg aspect-square overflow-hidden"
        />
        {user.qa.length > 2 && (
          <QACard
            question={user.qa[2].question}
            answer={user.qa[2].answer}
          />
        )}
        <InstaCard img={user.images} /> */}
      </AnimatedBox>
    </ScrollView>
  );
};
