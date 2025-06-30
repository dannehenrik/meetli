import { i18n } from "@/app/_layout";
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
import { Image } from 'expo-image';
// import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MAX_PROFILE_IMAGES_AMOUNT } from "@/constants/constants";
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";



import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper
} from "@/components/ui/actionsheet";

import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { ImageType, User } from "@/types";
import { generateUniqueUrl } from "@/utils/generateUniqueUrl";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_STALE_TIME } from "@/constants/staleTimes";





export default function Pictures() {
    const queryClient = useQueryClient();
    const { showErrorToast } = useAwesomeToast();
    // const [images, setImages] = useState<ImageType[]>([]);

    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
    const [showActionsheet, setShowActionsheet] = useState(false);
    
    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    if (!user) return null

    function handleNewImage(newImageData: ImagePicker.ImagePickerAsset) {
        const user = queryClient.getQueryData<User>(['user']);
        if ( !user ) return

        const imagesCopy = [...user.images ?? []];

        const filePath = generateUniqueUrl();
        const newImage = {fileName: newImageData.fileName ?? "", filePath: filePath, url: newImageData.uri}
        queryClient.setQueryData(["user"], (oldData: User) => ({
            ...oldData, images: [...oldData.images ?? [], newImage]
        }));

        newImageMutation.mutate({newImageData: newImageData, filePath: filePath, images: imagesCopy})
    }

    const newImageMutation = useMutation({
        scope: {id: "image"},
        mutationFn: async ({newImageData, filePath, images} : {newImageData: ImagePicker.ImagePickerAsset, filePath: string, images: ImageType[]}) => {
            await queryClient.cancelQueries({queryKey: ['user']});

            const publicUrl = await uploadImage(user.id, newImageData.base64 ?? "", filePath) //Upload image and return public url
            const newImage = {fileName: newImageData.fileName ?? "", filePath: filePath, url: publicUrl}
            await updateUser(user.id, [...images, newImage ]); //Update the database with new data
        },
        onError: (error) => {
            console.error(error.message)
            showErrorToast("Could not upload image");
        },
        onSettled: () => { queryClient.invalidateQueries({ queryKey: ['user']}) }
    })

    function handleReplace(newImageData: ImagePicker.ImagePickerAsset, imageToReplace: ImageType) {
        const user = queryClient.getQueryData<User>(['user']);

        const filePath = generateUniqueUrl();
        const newImage = {fileName: newImageData.fileName ?? "", filePath: filePath, url: newImageData.uri}
        const newImages = (user?.images ?? []).map((image) => {
            if (imageToReplace.filePath === image.filePath) {
                return newImage
            } else {
                return image
            }
        })
        queryClient.setQueryData(["user"], (oldData: User) => ({
            ...oldData, images: newImages
        }));
        replaceImageMutation.mutate({newImageData: newImageData, newImages: newImages, filePath: filePath, imageToReplace: imageToReplace} )
    }

    const replaceImageMutation = useMutation({
        scope: {id: "image"},
        mutationFn: async ({newImageData, newImages, filePath, imageToReplace} : {newImageData: ImagePicker.ImagePickerAsset, newImages: ImageType[], filePath: string, imageToReplace: ImageType}) => {
            await queryClient.cancelQueries({queryKey: ['user']});

            const publicUrl = await uploadImage(user.id, newImageData.base64 ?? "", filePath) //Upload image and return public url
            
            const newImage = {fileName: newImageData.fileName ?? "", filePath: filePath, url: publicUrl}
            await updateUser(user.id, newImages.map((image) => {
                if (filePath === image.filePath) {
                    return newImage
                } else {
                    return image
                }
            })); //Update the database with new data
            await deleteImage(user.id, imageToReplace);
        },
        onError: (error) => {
            console.error(error.message)
            showErrorToast("Error", "Something went wrong when replacing image")
        },
        onSettled: () => { 
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    function handleDelete(imageToDelete: ImageType) {
        const userData = queryClient.getQueryData<User>(['user']);
        if (!userData) return

        const previousImages = userData.images ?? [];
        const newImages = previousImages.filter((image) => image.filePath !== imageToDelete.filePath )
        queryClient.setQueryData(["user"], {...userData, images: newImages})
        deleteImageMutation.mutate({imageToDelete: imageToDelete, newImages: newImages})
    }

    const deleteImageMutation = useMutation({
        scope: { id: "image" },
        mutationFn: async ({imageToDelete, newImages} : {imageToDelete: ImageType, newImages: ImageType[]}) => {
            await queryClient.cancelQueries({queryKey: ['user']});      
            
            await updateUser(user.id, newImages); //Update the database with new data
            await deleteImage(user.id, imageToDelete);
        },
        onError: (error) => {
            console.error(error.message);
            showErrorToast("Could not delete image");
        },
        onSettled: () => { queryClient.invalidateQueries({ queryKey: ['user']}) }
    })

    const insets = useSafeAreaInsets();
    return (
    <>

        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-full">
   
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
                        const image = user.images?.[index];
                        return (
                            <Box className="w-[31%] aspect-square relative" key={index}>
                            {image ? (
                                <>
                                <Image
                                    source={image.url}
                                    cachePolicy="memory-disk"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'cover', // equivalent to object-cover
                                        borderRadius: 12,    // adjust for how rounded you want it
                                    }}
                                    alt="uploaded"
                                />
                                <Pressable 
                                    className="absolute top-1 right-1 bg-background-950 p-1 rounded-full z-10"
                                    onPress={() => {
                                        setSelectedImage(image);
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
                                (user.images ?? []).length !== MAX_PROFILE_IMAGES_AMOUNT && (
                                <Pressable onPress={async () => {
                                    const fileData = await pickImage();
                                    if (fileData) { handleNewImage(fileData) }
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
                disabled={user.images?.length === 0}
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
                            if (selectedImage !== null) {
                                handleDelete(selectedImage)
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
                            if (selectedImage !== null) {
                                const image = await pickImage()
                                if (image) handleReplace(image, selectedImage)
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

async function updateUser(userId: string, images: ImageType[]) {
    console.log("3");
    const {error} = await supabase.from('users').update({images: images}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}


async function uploadImage(userId: string, base64FileData: string, filePath: string) {
    const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('images')
    .upload(`${userId}/${filePath}`, decode(base64FileData), {contentType: 'image/png'})

    if (uploadError || !uploadData) throw new Error("Something went wrong when uploading the file" + uploadError?.message)

    
    const { data: {publicUrl} } = supabase
    .storage
    .from('images')
    .getPublicUrl(uploadData.path)

    return publicUrl
}

async function deleteImage(userId: string, image: ImageType) {
    console.log("4");
    const { error } = await supabase
    .storage
    .from('images')
    .remove([`${userId}/${image.filePath}`])

    if (error) throw new Error("Something went wrong when deleting the image: " + error.message)
}

// async function updateUser(userId: string, gender: Gender) {
//     const {error} = await supabase.from('users').update({gender: gender}).eq('id', userId);

//     if (error) throw new Error("Something went wrong when updating the user: " + error.message)
// }