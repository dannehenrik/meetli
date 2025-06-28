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
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native"; // Add this at the top
import { decode } from 'base64-arraybuffer'



import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";

import { ButtonText, Button, ButtonGroup } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Gender, ImageType, User } from "@/types";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { getUser } from "@/server/auth/getUser";
import { generateUniqueUrl } from "@/utils/generateUniqueUrl";
import { Spinner } from "@/components/ui/spinner";




export default function Pictures() {
    const queryClient = useQueryClient();
    const [images, setImages] = useState<ImageType[]>([]);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [showActionsheet, setShowActionsheet] = useState(false);

    const {data: user, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: Infinity,
    })

    const insets = useSafeAreaInsets();

    const newImageMutation = useMutation({
        mutationFn: async ({fileData} : {fileData: ImagePicker.ImagePickerAsset}) => {
            const filePath = generateUniqueUrl(fileData.fileName ?? "");
            const newImage = {fileName: fileData.fileName ?? "", filePath: filePath, url: fileData.uri}
            const copyImages = [...(user?.images ?? [])];

            queryClient.setQueryData(["user"], (oldData: User) => ({
                ...oldData, images: [...copyImages, newImage]
            }));
            const publicUrl = await uploadImage(user?.id ?? "", fileData.base64 ?? "", filePath) //Upload image and return public url
            await updateUser(user?.id ?? "", [...copyImages, {...newImage, url: publicUrl} ]); //Update the database with new data
        },
        onError: (error) => {
            console.error(error.message)
        },
        onSuccess: (data) => {
            // setImages((oldImages) => [...oldImages, data])
        },
        onSettled: () => { queryClient.invalidateQueries({ queryKey: ['user']}) }
    })


    const replaceImageMutation = useMutation({
        mutationFn: async ({fileData, index} : {fileData: ImagePicker.ImagePickerAsset, index: number}) => {
            const filePath = generateUniqueUrl(fileData.fileName ?? "");
            const newImage = {fileName: fileData.fileName ?? "", filePath: filePath, url: fileData.uri}
            const copyImages = [...(user?.images ?? [])];
            copyImages[index] = newImage
            queryClient.setQueryData(["user"], (oldData: User) => ({
                ...oldData, images: copyImages
            }));
            const publicUrl = await uploadImage(user?.id ?? "", fileData.base64 ?? "", filePath) //Upload image and return public url
            copyImages[index] = {...newImage, url: publicUrl}
            await updateUser(user?.id ?? "", copyImages); //Update the database with new data
            await deleteImage(newImage);
        },
        onError: (error) => {
            console.error(error.message)
        },
        onSuccess: (data) => {
            // setImages((oldImages) => [...oldImages, data])
        },
        onSettled: () => { queryClient.invalidateQueries({ queryKey: ['user']}) }
    })

    const deleteImageMutation = useMutation({
        mutationFn: async ({index} : {index: number}) => {
            if (user?.images) {
                const imageToDelete = user.images[index];
                const newImages = user.images.filter((_, i) => i !== index )
                queryClient.setQueryData(["user"], (oldData: User) => ({
                    ...oldData, images: newImages
                }));
                await updateUser(user?.id ?? "", newImages); //Update the database with new data
                await deleteImage(imageToDelete);
            }
        },
        onError: (error) => {
            console.error(error.message)
        },
        onSuccess: (data) => {
            // setImages((oldImages) => [...oldImages, data])
        },
        onSettled: () => { queryClient.invalidateQueries({ queryKey: ['user']}) }
    })

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const fileData = result.assets[0];
            return fileData
        }

        return null
    }

    if (!user) return null

    return (
    <>
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
                        // const image = images[index];
                        const image = user.images[index];
                        return (
                            <Box className="w-[31%] aspect-square relative" key={index}>
                            {image ? (
                                <>
                                <Image
                                    source={image.url}
                                    className="w-full h-full object-cover rounded-lg"
                                    alt="uploaded"
                                />
                                <Pressable 
                                    className="absolute top-1 right-1 bg-background-950 p-1 rounded-full z-10"
                                    onPress={() => {
                                        setSelectedImageIndex(index);
                                        setShowActionsheet(true);
                                    }}
                                
                                >
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
                                <Pressable onPress={async () => {
                                    const fileData = await pickImage();
                                    if (fileData) newImageMutation.mutate({fileData})
                                }}>
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

                    {/* <InfoOnboarding info={i18n.t("onboarding.pictures.dndInstructions")} /> */}
                </VStack>
            </Box>

            <Fab
                size="lg"
                disabled={user.images.length === 0}
                onPress={() => router.push("/sign-in/onboarding/profile-base-completed")}
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>

        <Actionsheet isOpen={showActionsheet} onClose={() => setShowActionsheet(false)}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator/>
                </ActionsheetDragIndicatorWrapper>
                <ButtonGroup className="w-full mt-3">
                    <Button 
                        action="negative" 
                        className="w-full rounded-xl"
                        onPress={() => {
                            if (selectedImageIndex !== null) {
                                deleteImageMutation.mutate({index: selectedImageIndex})
                            }
                            setShowActionsheet(false);
                        }}
                    >
                        <ButtonText>Delete image</ButtonText>
                    </Button>
                    <Button 
                        className="w-full rounded-xl"
                        onPress={async () => {
                            setShowActionsheet(false);
                            if (selectedImageIndex !== null) {
                                const image = await pickImage()
                                if (image) replaceImageMutation.mutate({fileData: image, index: selectedImageIndex});
                                // await replaceImage(selectedImageIndex);
                            }
                        }}
                    >
                        <ButtonText>Replace image</ButtonText>
                    </Button>
                    <Button className="w-full mt-3 rounded-xl" variant="outline" onPress={() => setShowActionsheet(false)}>
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                </ButtonGroup>
            </ActionsheetContent>
        </Actionsheet>
    </>
    );
}

async function updateUser(userId: string, images: ImageType[]) {
    const {error} = await supabase.from('users').update({images: images}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}


async function uploadImage(userId: string, base64FileData: string, filePath: string) {
    const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('images')
    .upload(`${userId}/${filePath}`, decode(base64FileData))

    if (uploadError || !uploadData) throw new Error("Something went wrong when uploading the file" + uploadError?.message)

    
    const { data: {publicUrl} } = supabase
    .storage
    .from('images')
    .getPublicUrl(uploadData.path)

    return publicUrl
}

async function deleteImage(image: ImageType) {
    const { error } = await supabase
    .storage
    .from('images')
    .remove([image.filePath])

    if (error) throw new Error("Something went wrong when deleting the image: " + error.message)
}

// async function updateUser(userId: string, gender: Gender) {
//     const {error} = await supabase.from('users').update({gender: gender}).eq('id', userId);

//     if (error) throw new Error("Something went wrong when updating the user: " + error.message)
// }