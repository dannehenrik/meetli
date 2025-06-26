import { i18n } from "@/app/_layout";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import {
    AddIcon,
    ChevronRightIcon,
    Icon,
    RemoveIcon,
} from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MAX_PROFILE_IMAGES_AMOUNT, ONBOARDING_PAGES } from "@/constants/constants";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function Pictures() {
    const [images, setImages] = useState<string[]>([]);
    const insets = useSafeAreaInsets();

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const copyImages = [...images];
            if (copyImages.length < MAX_PROFILE_IMAGES_AMOUNT) {
                copyImages.push(result.assets[0].uri);
                setImages(copyImages);
            }
        }
    }

    function removeImage(index: number) {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    }


    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-full">
                <Progress
                value={(7 / ONBOARDING_PAGES) * 100}
                className="w-1/2 mx-auto rounded-full h-1 bg-background-600"
                >
                <ProgressFilledTrack />
                </Progress>

                <VStack className="gap-6 w-full">
                    <VStack className="gap-3">
                        <Heading className="font-roboto font-semibold text-2xl">
                        {i18n.t("onboarding.pictures.title")}
                        </Heading>
                        <Text className="font-normal font-roboto text-typography-400">
                        {i18n.t("onboarding.pictures.instructions")}
                        </Text>
                    </VStack>

                    <Box className="flex-row flex-wrap justify-between gap-y-2.5">
                        {[...Array(MAX_PROFILE_IMAGES_AMOUNT)].map((_, index) => {
                        const image = images[index];
                        return (
                            <Box className="w-[31%] aspect-square relative" key={index}>
                            {image ? (
                                <>
                                <Image
                                    source={image}
                                    className="w-full h-full object-cover rounded-lg"
                                    alt="uploaded"
                                />
                                <Pressable onPress={() => removeImage(index)} className="absolute top-1 right-1 bg-background-950 p-1 rounded-full z-10">
                                    <Icon
                                    as={RemoveIcon}
                                    className="text-typography-50 h-3 w-3"
                                    />
                                </Pressable>
                                {index === 0 ? (
                                    <Badge className="absolute bottom-2 left-2 rounded-full" action="success">
                                        <BadgeText>Main</BadgeText>
                                    </Badge>
                                ) : (
                                    <Badge className="absolute bottom-2 left-2 rounded-full">
                                        <BadgeText>{index + 1}</BadgeText>
                                    </Badge>
                                )}
                                </>
                            ) : (
                                images.length !== MAX_PROFILE_IMAGES_AMOUNT && (
                                <Pressable onPress={pickImage}>
                                    <Box className="w-full h-full rounded-lg items-center justify-center border border-background-100">
                                    <Icon as={AddIcon} size="lg" />
                                    </Box>
                                </Pressable>
                                )
                            )}
                            </Box>
                        );
                        })}
                    </Box>

                    <InfoOnboarding info={i18n.t("onboarding.pictures.dndInstructions")} />
                </VStack>
            </Box>

            <Fab
                size="lg"
                onPress={() => router.push("/sign-in/onboarding/intro")}
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
}




