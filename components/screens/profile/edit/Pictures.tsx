import { i18n } from "@/app/_layout";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import {
    AddIcon,
    Icon,
    RemoveIcon
} from "@/components/ui/icon";
import { Image } from 'expo-image';
// import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MAX_PROFILE_IMAGES_AMOUNT } from "@/constants/constants";
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router, usePathname } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";


import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetDragIndicator,
  BottomSheetContent,
} from "@/components/shared/bottom-sheet";

import { useFab } from "@/components/shared/floating-fab/FabContext";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAwesomeToast } from "@/hooks/toasts";
import { useCoreUser } from "@/hooks/user/useCoreUser";
import { CoreUser, ImageType } from "@/types";
import { generateUniqueUrl } from "@/utils/generateUniqueUrl";
import { triggerHaptic } from "@/utils/haptics";
import { supabase } from "@/utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useColorScheme, View } from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';
import type { SortableGridRenderItem } from 'react-native-sortables';
import Sortable from 'react-native-sortables';
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFullUser } from "@/hooks/user/useFullUser";
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedVstack = Animated.createAnimatedComponent(VStack)


export function Pictures() {
    const queryClient = useQueryClient();
    const { showErrorToast } = useAwesomeToast();

    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
    const [showActionsheet, setShowActionsheet] = useState(false);

    const {data: user} = useCoreUser()

    // Helper functions

    // Updates the cache with new images
    function updateCache(images: ImageType[]) {
        const user = queryClient.getQueryData<CoreUser>(['user', 'core']);
        if ( !user ) return

        queryClient.setQueryData(["user", 'core'], {
            ...user, images: images
        });
    }
    // Adds an image last in the caceh
    function addImageInCache(image: ImageType) {
        const images = getImages();

        queryClient.setQueryData(["user", 'core'], {...user, images: [...images, image]});
    }

    // Replaces an image in the cache
    function replaceImageFromCache(newImage: ImageType, imageToReplace: ImageType) {
        const images = getImages()

        queryClient.setQueryData(['user', 'core'], {
            ...user,
            images: replaceImage(newImage, imageToReplace.filePath, images),
        });
    }

    // Removes a specific image from the cache
    function removeImageFromCache(imageToRemove: ImageType) {
        const images = getImages();

        const newImages = images.filter((image) => imageToRemove.filePath !== image.filePath )
        queryClient.setQueryData(["user", 'core'], {...user, images: newImages})
    }

    // Get the images from the cache
    function getImages() {
        const userData = queryClient.getQueryData<CoreUser>(['user', 'core']);
        if (!userData) throw new Error("CoreUser data not found");

        return userData.images ?? []
    }
    function getUserId() {
        const userData = queryClient.getQueryData<CoreUser>(['user', 'core']);
        if (!userData) throw new Error("CoreUser data not found");

        return userData.id
    }

    // A function that replaces an item in a given array
    function replaceImage(newImage: ImageType, imageToReplacePath: string, images: ImageType[]) {
        return images.map(image =>
            image.filePath === imageToReplacePath ? newImage : image
        ) ?? [];       
    }


    const newImageMutation = useMutation({
        mutationFn: async ({newImageData, filePath} : {newImageData: ImagePicker.ImagePickerAsset, filePath: string}) => {
            const newImage = await uploadImage(getUserId(), newImageData.base64 ?? "", filePath) //Upload image and return public url

            const images = getImages();

            const newImages = replaceImage(newImage, filePath, images)
            await updateUser(getUserId(), newImages); //Update the database with new data

            return newImages
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({queryKey: ['user', 'core']});
            const newImage = {fileName: variables.newImageData.fileName ?? "", filePath: variables.filePath, url: null, tempUrl: variables.newImageData.uri}
            addImageInCache(newImage);
        },
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.sortImageError"));
        },
        onSuccess: (newImages) => {
            triggerHaptic("success")
            updateCache(newImages);
        },
        onSettled: () => { 
            queryClient.invalidateQueries({ queryKey: ['user']}) 
        }
    })


    const replaceImageMutation = useMutation({
        mutationFn: async ({newImageData, imageToReplace, filePath} : {newImageData: ImagePicker.ImagePickerAsset, imageToReplace: ImageType, filePath: string}) => {
            const newImage = await uploadImage(getUserId(), newImageData.base64 ?? "", filePath) //Upload image and return public url

            const images = getImages()
            const newImages = replaceImage(newImage, filePath, images);
    
            await updateUser(getUserId(), newImages)
            await deleteImage(getUserId(), imageToReplace);
            return newImages
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({queryKey: ['user', 'core']});
            const newImage = {filePath: variables.filePath, tempUrl: variables.newImageData.uri, url: null}
            replaceImageFromCache(newImage, variables.imageToReplace);
        },
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.replaceImageError"));
        },
        onSuccess: (newImages) => {
            triggerHaptic("success")
            updateCache(newImages)
        },
        onSettled: () => { 
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    const deleteImageMutation = useMutation({
        mutationFn: async ({imageToDelete} : {imageToDelete: ImageType}) => {
            const images = getImages();
            await updateUser(getUserId(), images);
            await deleteImage(getUserId(), imageToDelete);
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({queryKey: ['user', 'core']});
            removeImageFromCache(variables.imageToDelete);
        },
        onError: (error) => {
            console.error(error.message);
            showErrorToast(i18n.t("messages.error.removeImageError"));
        },
        onSettled: () => { 
            queryClient.invalidateQueries({ queryKey: ['user']}) 
        }
    })

    const sortMutation = useMutation({
        mutationFn: async ({newImages} : {newImages: ImageType[]}) => {
            await updateUser(getUserId(), newImages.filter((image) => image.filePath !== "placeholder"))
        },
        onMutate: async (variables) => {
            const images = variables.newImages.filter((image) => image.filePath !== "placeholder")
            updateCache(images);
            await queryClient.cancelQueries({queryKey: ['user', 'core']});
        },
        onError: (error) => {
            console.error(error.message);
            showErrorToast(i18n.t("messages.error.sortImageError"));
        },
        onSettled: () => { queryClient.invalidateQueries({ queryKey: ['user']}) }
    })

    const renderItem = useCallback<SortableGridRenderItem<ImageType>>(({ item, index }) => {
        const isPlaceholder = item.filePath === "placeholder"
        const isLoading = !item.url && item.tempUrl;

        return (
            <Sortable.Handle mode={isPlaceholder ? 'fixed' : 'draggable'}>
                <Box className="aspect-square relative">
                {/* <AnimatedBox className="aspect-square relative" entering={FadeInLeft.delay(800 + (100 * index)).duration(500).springify()}> */}
                    {!isPlaceholder ? (
                    <>
                        <Image
                        source={item.url ?? item.tempUrl}
                        cachePolicy="memory-disk"
                        blurRadius={isLoading ? 50 : 0}
                        contentFit="cover"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 12,    // adjust for how rounded you want it
                        }}
                        alt="uploaded"
                        />
                        {isLoading && (
                            <Box className="absolute inset-0 items-center justify-center z-10 bg-black/30 rounded-lg">
                                <Spinner className="z-11"/>
                            </Box>
                        )}

                        {/* Remove button */}
                        {!isLoading && (
                            <Pressable 
                            className="absolute top-1 right-1 bg-background-950 p-1 rounded-full z-10"
                            onPress={() => {
                                triggerHaptic("buttonLight")
                                setSelectedImage(item);
                                setShowActionsheet(true);
                            }}
                            >
                                <Icon
                                as={RemoveIcon}
                                className="text-typography-50 h-3 w-3"
                                />
                            </Pressable>
                        )}

                        {/* Badge */}
                        {!isLoading && (
                        <>
                            {index === 0 ? (
                                <Badge className="absolute bottom-2 left-2 rounded-full" size="sm" action="success">
                                    <BadgeText>{i18n.t("onboarding.pictures.main")}</BadgeText>
                                </Badge>
                            ) : (
                                <Badge className="absolute bottom-2 left-2 rounded-full" size="sm">
                                    <BadgeText>{index + 1}</BadgeText>
                                </Badge>
                            )}
                        </>
                        )}
                    </>

                    ) : (
                    
                    // Placeholder
                    <Pressable 
                    className="active:bg-background-50 rounded-lg"
                    onPress= { async () => {
                        triggerHaptic("button")
                        const fileData = await pickImage();
                        if (fileData) { 
                            const filePath = generateUniqueUrl();
                            newImageMutation.mutate({newImageData: fileData, filePath: filePath}) 
                        }
                    }}
                    >
                        <Box className="w-full h-full rounded-lg items-center justify-center border border-background-100">
                            <Icon as={AddIcon} size="lg" />
                        </Box>
                    </Pressable>
                    
                )}
                </Box>
            </Sortable.Handle>
        );
    }, []);


    const images = useMemo(() => {
        const currentImages = user?.images ?? [];
        const needsPlaceholder = currentImages.length < MAX_PROFILE_IMAGES_AMOUNT;

        return [
            ...currentImages,
            ...(needsPlaceholder ? [{filePath: "placeholder", url: null, tempUrl: null }] : []),
        ];
    }, [user?.images]);

    
    if (!user) return <Spinner/>

    return (
    <>
        <VStack className="gap-6 w-full">
            
            <View>
                <Sortable.Grid
                    columnGap={10}
                    customHandle
                    columns={3}
                    data={images}
                    renderItem={renderItem}
                    rowGap={10}
                    onDragStart={() => triggerHaptic("dragStart")}
                    keyExtractor={(item) => item?.filePath}
                    onDragEnd={(images) => sortMutation.mutate({newImages: images.data})}
                />
            </View>
                
            <InfoOnboarding info={i18n.t("onboarding.pictures.dndInstructions")} />
        </VStack>
 
        <ReplaceOrDeleteBottomSheet 
        isOpen={showActionsheet} 
        setIsOpen={setShowActionsheet}
        selectedImage={selectedImage}
        deleteImageMutation={deleteImageMutation}
        replaceImageMutation={replaceImageMutation}
        />

    </>
    );
}



function ReplaceOrDeleteBottomSheet({
    isOpen,
    setIsOpen,
    selectedImage,
    deleteImageMutation,
    replaceImageMutation,
}: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    selectedImage: ImageType | null,
    deleteImageMutation: any
    replaceImageMutation: any,
}) {

    return (
        <BottomSheet
        isOpen={isOpen}
        index={0}
        enableDynamicSizing
        enableOverDrag={true}
        onClose={() => {
            setIsOpen(false);
        }}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={() => {
            return (
                <BottomSheetDragIndicator
                    className="border-background-0 bg-background-0 rounded-t-xl"
                    indicatorStyle={{
                    backgroundColor: "gray",
                    width: 64,
                    height: 4,
                    marginTop: 10,
                    }}
                />
            );
        }}
        >
            <BottomSheetContent className="border-primary-0 bg-background-0">
        
                <AnimatedVstack entering={FadeInDown.delay(100)} space="md" className="w-full flex flex-col gap-4 p-4 pb-10">
                    <Button
                    action="negative"
                    size="lg"
                    onPress={() => {
                        triggerHaptic("buttonImportant")
                        setIsOpen(false);
                        if (selectedImage !== null) {
                            deleteImageMutation.mutate({imageToDelete: selectedImage})
                        }
                    }}
                    >
                        <ButtonText className="text-typography-950 data-[active=true]:text-typography-900">
                            {i18n.t("onboarding.pictures.deleteImage")}
                        </ButtonText>
                    </Button>
                    
                    <Button
                    size="lg"
                    className="bg-transparent data-[active=true]:bg-background-50"
                    onPress={async () => {
                        triggerHaptic("button")
                        setIsOpen(false);
                        if (selectedImage !== null) {
                            const image = await pickImage();
                            if (image) {
                                const filePath = generateUniqueUrl();
                                replaceImageMutation.mutate({newImageData: image, imageToReplace: selectedImage, filePath: filePath})
                            }
                        }
                    }}
                    >
                        <ButtonText className="text-typography-950 data-[active=true]:text-typography-900">
                            {i18n.t("onboarding.pictures.replaceImage")}
                        </ButtonText>
                    </Button>
                      
                </AnimatedVstack>
            </BottomSheetContent>
        </BottomSheet>
    );
};





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

    return {filePath: filePath, url: publicUrl, tempUrl: null}
}

async function deleteImage(userId: string, image: ImageType) {
    const { error } = await supabase
    .storage
    .from('images')
    .remove([`${userId}/${image.filePath}`])

    if (error) throw new Error("Something went wrong when deleting the image: " + error.message)
}