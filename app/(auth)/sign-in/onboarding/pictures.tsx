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
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router, usePathname } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";



import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper
} from "@/components/ui/actionsheet";

import { FabState, useFab } from "@/components/shared/floating-fab/FabContext";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { ImageType, User } from "@/types";
import { generateUniqueUrl } from "@/utils/generateUniqueUrl";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { View } from "react-native";
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';
import type { SortableGridRenderItem } from 'react-native-sortables';
import Sortable from 'react-native-sortables';
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedText = Animated.createAnimatedComponent(Text)


export default function Pictures() {
    const queryClient = useQueryClient();
    const { showErrorToast } = useAwesomeToast();

    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
    const [showActionsheet, setShowActionsheet] = useState(false);

    // Helper functions

    // Updates the cache with new images
    function updateCache(images: ImageType[]) {
        const user = queryClient.getQueryData<User>(['user']);
        if ( !user ) return

        queryClient.setQueryData(["user"], {
            ...user, images: images
        });
    }
    // Adds an image last in the caceh
    function addImageInCache(image: ImageType) {
        const images = getImages();

        queryClient.setQueryData(["user"], {...user, images: [...images, image]});
    }

    // Replaces an image in the cache
    function replaceImageFromCache(newImage: ImageType, imageToReplace: ImageType) {
        const images = getImages()

        queryClient.setQueryData(['user'], {
            ...user,
            images: replaceImage(newImage, imageToReplace.filePath, images),
        });
    }

    // Removes a specific image from the cache
    function removeImageFromCache(imageToRemove: ImageType) {
        const images = getImages();

        const newImages = images.filter((image) => imageToRemove.filePath !== image.filePath )
        queryClient.setQueryData(["user"], {...user, images: newImages})
    }

    // Get the images from the cache
    function getImages() {
        const userData = queryClient.getQueryData<User>(['user']);
        if (!userData) throw new Error("User data not found");

        return userData.images ?? []
    }
    function getUserId() {
        const userData = queryClient.getQueryData<User>(['user']);
        if (!userData) throw new Error("User data not found");

        return userData.id
    }

    // A function that replaces an item in a given array
    function replaceImage(newImage: ImageType, imageToReplacePath: string, images: ImageType[]) {
        return images.map(image =>
            image.filePath === imageToReplacePath ? newImage : image
        ) ?? [];       
    }
    
    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const newImageMutation = useMutation({
        mutationFn: async ({newImageData, filePath} : {newImageData: ImagePicker.ImagePickerAsset, filePath: string}) => {
            const newImage = await uploadImage(getUserId(), newImageData.base64 ?? "", filePath) //Upload image and return public url

            const images = getImages();

            const newImages = replaceImage(newImage, filePath, images)
            await updateUser(getUserId(), newImages); //Update the database with new data

            return newImages
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({queryKey: ['user']});
            const newImage = {fileName: variables.newImageData.fileName ?? "", filePath: variables.filePath, url: null, tempUrl: variables.newImageData.uri}
            addImageInCache(newImage);
        },
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.sortImageError"));
        },
        onSuccess: (newImages) => {
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
            await queryClient.cancelQueries({queryKey: ['user']});
            const newImage = {filePath: variables.filePath, tempUrl: variables.newImageData.uri, url: null}
            replaceImageFromCache(newImage, variables.imageToReplace);
        },
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.replaceImageError"));
        },
        onSuccess: (newImages) => {
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
            await queryClient.cancelQueries({queryKey: ['user']});
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
            await queryClient.cancelQueries({queryKey: ['user']});
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
                <AnimatedBox 
                className="aspect-square relative" 
                entering={FadeInLeft.delay(800 + (100 * index)).duration(500).springify()}>
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
                                Haptics.selectionAsync()
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
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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
                </AnimatedBox>
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

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/pictures") {
            const images = user?.images ?? [];
            setFabState( {
                label: "Pictures",
                isDisabled: images.length === 0,
                onPress: () => {
                    router.push("/sign-in/onboarding/profile-base-completed")
                }
            })
        }

    }, [pathName, user])

    
    if (!user) return null

    return (
    <>
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-full">
   
                <VStack className="gap-6 w-full">
                    <VStack className="gap-3">
                        <AnimatedBox className="flex-row items-center gap-2" entering={FadeInDown.delay(100).duration(600).springify().delay(100)}>
                            <Heading className="font-roboto font-semibold text-2xl">
                                {i18n.t("onboarding.pictures.title")}
                            </Heading>
                            <Badge size="sm">
                                <BadgeText>
                                    {user.images?.length || 0}/{MAX_PROFILE_IMAGES_AMOUNT}
                                </BadgeText>
                            </Badge>
                        </AnimatedBox>
                        <AnimatedText 
                        entering={FadeInUp.delay(400).duration(500).springify()} 
                        className="font-normal font-roboto text-typography-400"
                        >
                        {i18n.t("onboarding.pictures.instructions")}
                        </AnimatedText>
                    </VStack>
                
                    <View>
                        <Sortable.Grid
                            columnGap={10}
                            customHandle
                            columns={3}
                            data={images}
                            renderItem={renderItem}
                            rowGap={10}
                            onDragStart={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            keyExtractor={(item) => item?.filePath}
                            onDragEnd={(images) => sortMutation.mutate({newImages: images.data})}
                        />
                    </View>
                        
                    <InfoOnboarding info={i18n.t("onboarding.pictures.dndInstructions")} />
                </VStack>
            </Box>
        </Box>
        <Actionsheet 
            isOpen={showActionsheet} 
            onClose={() => setShowActionsheet(false)}
        >
            <ActionsheetBackdrop/>
            <ActionsheetContent >
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                
                {/* Action Buttons */}
                <VStack space="md" className={`w-full p-4 pb-8`}>
                    <Button
                        action="negative"
                        size="md"
                        className="w-full"
                        onPress={() => {
                            if (selectedImage !== null) {
                                deleteImageMutation.mutate({imageToDelete: selectedImage})
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                            }
                            setShowActionsheet(false);
                        }}
                    >
                        
                        <ButtonText>{i18n.t("onboarding.pictures.deleteImage")}</ButtonText>
                    </Button>
                    
                    <Button
                        size="md"
                        variant="outline"
                        className="w-full"
                        onPress={async () => {
                        setShowActionsheet(false);
                        if (selectedImage !== null) {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                            const image = await pickImage();
                            if (image) {
                                const filePath = generateUniqueUrl();
                                replaceImageMutation.mutate({newImageData: image, imageToReplace: selectedImage, filePath: filePath})
                            }
                        }
                        }}
                    >
                        <ButtonText>{i18n.t("onboarding.pictures.replaceImage")}</ButtonText>
                    </Button>
                
                </VStack>
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