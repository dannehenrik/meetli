// import React from "react";
// import { Box } from "@/components/ui/box";
// import { Button, ButtonIcon } from "@/components/ui/button";
// import { Heading } from "@/components/ui/heading";
// import { ThreeDotsIcon } from "@/components/ui/icon";
// import { HStack } from "@/components/ui/hstack";
// import { ScrollView } from "@/components/ui/scroll-view";
// import { Badge } from "@/components/ui/badge";
// import { ImageBackground } from "@/components/ui/image-background";
// import { LinearGradient } from "expo-linear-gradient";
// import { LocationBadge, LoveBadge } from "../../shared/badge";
// import { Text } from "@/components/ui/text";
// import { FavoriteCard, PromptCard } from "./_components/qa-card";
// // import { InstaCard } from "../../shared/instagram-card";
// import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
// import { useFullUser } from "@/hooks/user/useFullUser";
// import { Spinner } from "@/components/ui/spinner";
// import { i18n } from "@/app/_layout";
// import { calculateAge } from "@/utils/calculateAge";
// import ImageCarousel from "./_components/imageCarousel";
// import { Image } from "expo-image";
// import { View } from "react-native";
// import ProfileImage from "./_components/profileImage";
// import { Divider } from "@/components/ui/divider";
// import { User } from "@/types";
// const AnimatedBox = Animated.createAnimatedComponent(Box);

// export function ProfileScreen() {
//     const {data: user} = useFullUser();
    
//     if (!user) return <Spinner/>

//     return (
//         <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//             <AnimatedBox
//             key={user.id}
//             className="flex-1 gap-5 w-full p-4 pt-0 bg-background-0"
//             entering={SlideInRight}
//             exiting={SlideOutRight}
//             >
//                 <HStack className="w-full items-center justify-between gap-3">
//                 <Heading size="3xl" className="font-roboto">
//                     {user.first_name}, {calculateAge(user.dob)}
//                 </Heading>

//                 <Button variant="link" className="bg-transparent">
//                     <ButtonIcon
//                     as={ThreeDotsIcon}
//                     className="text-typography-950 data-[active=true]:text-typography-900"
//                     />
//                 </Button>
//                 </HStack>
        
//                 <ImageCarousel user={user} shouldLoad />
//                 <Box>
//                 <ScrollView
//                     horizontal
//                     className="w-full"
//                     showsHorizontalScrollIndicator={false}
//                 >
//                     <HStack className="gap-x-3">
//                     {user.interests.map((item, index) => (
//                         <Text
//                         key={index}
//                         size="sm"
//                         className="font-roboto bg-primary-700 py-2 px-4 rounded-3xl text-white items-center justify-center h-9"
//                         >
//                         {i18n.t(`interests.interests.${item.interest}`)}
//                         </Text>
//                     ))}
//                     </HStack>
//                 </ScrollView>
//                 </Box>
//                 <Text size="sm">{user.intro}</Text>

//                 {/* Lifestyle */}
//                 <View className="mb-4">
//                     <View className="bg-background-50 rounded-lg p-5">
//                         <Text className="text-typography-950 font-bold text-lg mb-2 px-5 py-4">{i18n.t("editProfile.titles.lifestyle")}</Text>
//                         <ProfileInfoItem tKey="training" value={user.training_habits} />
//                         <Divider className="my-2" />
//                         <ProfileInfoItem tKey="foodChoice" value={user.food_choice} />
//                         <Divider className="my-2" />
//                         <ProfileInfoItem tKey="smoking" value={user.smoking_habits} />
//                         <Divider className="my-2" />
//                         <ProfileInfoItem tKey="drinking" value={user.drinking_habits} />
//                     </View>
//                 </View>

//                 {/* Beliefs and values */}
//                 <View className="mb-4">
//                     <View className="bg-background-50 rounded-lg p-5">
//                         <Text className="text-typography-950 font-bold text-lg mb-2 px-5 py-4">{i18n.t("editProfile.titles.beliefsAndValues")}</Text>
//                         <ProfileInfoItem tKey="religion" value={user.religion} />
//                         <Divider className="my-2" />
//                         <ProfileInfoItem tKey="politicalView" value={user.political_view} />
//                     </View>
//                 </View>

//                 {/* Family section */}
//                 <View className="mb-4">
//                     <View className="bg-background-50 rounded-lg p-5">
//                         <Text className="text-typography-950 font-bold text-lg mb-2 px-5 py-4">{i18n.t("editProfile.titles.family")}</Text>
//                         <ProfileInfoItem tKey="children" value={user.children} />
//                         <Divider className="my-2" />
//                         <ProfileInfoItem tKey="pets" value={user.pets} />
//                     </View>
//                 </View>

//                 {/* Occupation */}
//                 <View className="mb-4">
//                     <View className="bg-background-50 rounded-lg p-5">
//                         <Text className="text-typography-950 font-bold text-lg mb-2 px-5 py-4">{i18n.t("editProfile.titles.career")}</Text>
//                         <OccupationInfoItem jobTitle={user.job_title}/>
//                         <Divider className="my-2" />
//                         <ProfileInfoItem tKey="education" value={user.education} />
//                     </View>
//                 </View>
                

//                 <PromptCard user={user} order={1}/>

//                 <FavoriteCard user={user} order={1}/>
//                 <ProfileImage user={user} order={4}/>
//                 <ProfileImage user={user} order={5}/>

       
//                 <PromptCard user={user} order={2}/>
//                 <PromptCard user={user} order={3}/>

//                 <ProfileImage user={user} order={6}/>
                
//                 <FavoriteCard user={user} order={2}/>
//                 <FavoriteCard user={user}order={3}/>
                

//             </AnimatedBox>
//         </ScrollView>
//     );
// };


import React from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ThreeDotsIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { FavoriteCard, PromptCard } from "./_components/qa-card";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useFullUser } from "@/hooks/user/useFullUser";
import { Spinner } from "@/components/ui/spinner";
import { i18n } from "@/app/_layout";
import { calculateAge } from "@/utils/calculateAge";
import ImageCarousel from "./_components/imageCarousel";
import { View } from "react-native";
import ProfileImage from "./_components/profileImage";
import { Divider } from "@/components/ui/divider";
import { User } from "@/types";

const AnimatedBox = Animated.createAnimatedComponent(Box);

export function ProfileScreen({user} : {user: User}) {
    
    if (!user) return <Spinner/>

    return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <AnimatedBox
                key={user.id}
                className="flex-1 gap-5 w-full p-4 pt-0 bg-background-0"
                entering={SlideInRight}
                exiting={SlideOutRight}
            >
                {/* 1. Profile Identity Section */}
                <HStack className="w-full items-center justify-between gap-3">
                    <Heading size="3xl" className="font-roboto">
                        {user.first_name}, {calculateAge(user.dob)}
                    </Heading>
                    <Button variant="link" className="bg-transparent">
                        <ButtonIcon as={ThreeDotsIcon} />
                    </Button>
                </HStack>
                
                <ImageCarousel shouldLoad user={user} />

                {user.intro && (
                    <View className="bg-background-50 rounded-lg p-5">
                        <Text className="text-typography-950 font-bold text-lg mb-3">
                            {i18n.t("editProfile.titles.aboutMe")}
                        </Text>
                        <Text className="text-typography-800 leading-6">
                            {user.intro}
                        </Text>
                    </View>
                )}
                
                {/* 2. Personality Preview (Interests + Bio) */}
                <Box>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack className="gap-x-3">
                            {user.interests.map((item, index) => (
                                <Text
                                    key={index}
                                    size="sm"
                                    className="font-roboto bg-primary-700 py-2 px-4 rounded-3xl text-white"
                                >
                                    {i18n.t(`interests.interests.${item.interest}`)}
                                </Text>
                            ))}
                        </HStack>
                    </ScrollView>
                </Box>
                
                
                {/* 3. Fun Personality Reveal */}
                <PromptCard user={user} order={1}/>
                <PromptCard user={user} order={2}/>
                <PromptCard user={user} order={3}/>

                {/* 6. Background (Career & Education) */}
                <View className="bg-background-50 rounded-lg p-5">
                    <Text className="text-typography-950 font-bold text-lg mb-3">
                        {i18n.t("editProfile.titles.career")}
                    </Text>
                    <OccupationInfoItem jobTitle={user.job_title}/>
                    <Divider className="my-3" />
                    <ProfileInfoItem tKey="education" value={user.education} />
                </View>

                {/* 5. Lifestyle & Practical Info */}
                <View className="bg-background-50 rounded-lg p-5">
                    <Text className="text-typography-950 font-bold text-lg mb-3">
                        {i18n.t("editProfile.titles.lifestyle")}
                    </Text>
                    <ProfileInfoItem tKey="training" value={user.training_habits} />
                    <Divider className="my-3" />
                    <ProfileInfoItem tKey="foodChoice" value={user.food_choice} />
                    <Divider className="my-3" />
                    <ProfileInfoItem tKey="smoking" value={user.smoking_habits} />
                    <Divider className="my-3" />
                    <ProfileInfoItem tKey="drinking" value={user.drinking_habits} />
                </View>

                <ProfileImage user={user} order={4}/>

                {/* 8. Personal Life */}
                <View className="bg-background-50 rounded-lg p-5">
                    <Text className="text-typography-950 font-bold text-lg mb-3">
                        {i18n.t("editProfile.titles.family")}
                    </Text>
                    <ProfileInfoItem tKey="children" value={user.children} />
                    <Divider className="my-3" />
                    <ProfileInfoItem tKey="pets" value={user.pets} />
                </View>

                 {/* 7. Values & Beliefs */}
                <View className="bg-background-50 rounded-lg p-5">
                    <Text className="text-typography-950 font-bold text-lg mb-3">
                        {i18n.t("editProfile.titles.beliefsAndValues")}
                    </Text>
                    <ProfileInfoItem tKey="religion" value={user.religion} />
                    <Divider className="my-3" />
                    <ProfileInfoItem tKey="politicalView" value={user.political_view} />
                </View>
                

                {/* 4. Quick Facts (Favorites) */}
                {user.favorites?.some((favorite) => favorite.active === true) && (
                <View className="bg-background-50 rounded-lg p-5">
                    <Text className="text-typography-950 font-bold text-lg mb-3">
                        {i18n.t("editProfile.titles.favorites")}
                    </Text>

                    <FavoriteCard user={user} order={1}/>

                    {/* <Divider className="my-3" /> */}
                    <FavoriteCard user={user} order={2}/>
                    {/* <Divider className="my-3" /> */}
                    <FavoriteCard user={user} order={3}/>
                </View>
                )}
                
            
                
                {/* 9. Additional Visual Content */}
                <ProfileImage user={user} order={5}/>
                <ProfileImage user={user} order={6}/>
                
            </AnimatedBox>
        </ScrollView>
    );
};



export const ProfileInfoItem = ({tKey, value}: {tKey: string, value: string}) => {
    if (!value) return null;

    return (
        <View className="py-2">
            <Text className="text-typography-400 font-medium mb-1">
                {i18n.t(`onboarding.moreAboutYou.${tKey}.title`)}
            </Text>
            <Text 
                className="text-typography-950 font-medium" 
                numberOfLines={2} // Optional: Limit to 2 lines
                ellipsizeMode="tail" // Adds "..." if text is cut off
            >
                {i18n.t(`onboarding.moreAboutYou.${tKey}.options.${value}`)}
            </Text>
        </View>
    );
};

function OccupationInfoItem({jobTitle} : {jobTitle: string}) {
    return (
        <View className="py-2">
            <Text className="text-typography-400 font-medium mb-1">
                {i18n.t(`onboarding.moreAboutYou.occupation.title`)}
            </Text>
            <Text 
                className="text-typography-950 font-medium" 
                numberOfLines={2} // Optional: Limit to 2 lines
                ellipsizeMode="tail" // Adds "..." if text is cut off
            >
                {jobTitle}
            </Text>
        </View>
    );
}

