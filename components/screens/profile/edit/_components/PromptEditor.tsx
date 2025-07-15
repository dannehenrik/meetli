import React, { memo, useCallback, useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, Icon, InfoIcon, RemoveIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { PenIcon } from "@/components/shared/icons";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";

import { i18n } from "@/app/_layout";
import { useFullUser } from "@/hooks/user/useFullUser";
import { SquarePen } from "lucide-react-native";
import {
    BottomSheet,
    BottomSheetBackdrop,
    BottomSheetContent,
    BottomSheetDragIndicator,
    BottomSheetScrollView,
    BottomSheetTextInput
} from "@/components/shared/bottom-sheet";
import { useAwesomeToast } from "@/hooks/toasts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Prompt } from "@/types";


export function Prompts() {
    const [isEditing, setIsEditing] = useState(false);
    const {data: user} = useFullUser();

    <Box className="gap-3">
       <HStack className="justify-between items-center">
                <Text className="text-typography-950 text-base font-medium mb-1">
                    Prompts
                </Text>
                
                <Button 
                className="p-1.5 bg-background-100 data-[active=true]:bg-background-200 h-auto text-black"
                onPress={() => setIsEditing(true)}
                >
                    <ButtonIcon
                    as={SquarePen}
                    className="text-typography-900 data-[active=true]:text-typography-950"
                    />
                </Button>
            </HStack>

        {user?.prompts.map(({ answer, id, active }, index) => {
            if (!active) return null
            return(
                <VStack className="gap-4 p-4 mb-1 bg-background-50 rounded-lg" key={index}>
                    <HStack className="justify-between items-center">
                        <Text className="text-typography-600 text-sm">{i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${id}.question`)}</Text>
                        <Button className="p-1.5 bg-background-400 data-[active=true]:bg-background-500 h-auto">
                            <ButtonIcon
                            as={PenIcon}
                            className="text-typography-900 data-[active=true]:text-typography-950"
                            />
                        </Button>
                    </HStack>
                    <Text className="text-typography-950">{answer}</Text>
                </VStack>
            )
        })}
    </Box>
}


function EditPrompts({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (value: boolean) => void}) {
    const {showErrorToast, showSuccessToast} = useAwesomeToast();
    const queryClient = useQueryClient();

    const {data: user} = useFullUser();
    const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
    useEffect(() => {
        if (user && user.prompts) {
            setUserPrompts(user.prompts)
        }
    }, [user])


    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id, selectedInterests),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
        },
        onSuccess: () => {
            queryClient.setQueryData(['user', 'full'], (oldUserData: User | undefined) => {
                if (!oldUserData) return oldUserData;

                return {
                    ...oldUserData,
                    prompts: [...userPrompts],
                };
            });
            showSuccessToast(i18n.t("messages.success.dataUpdated"))
            queryClient.invalidateQueries({queryKey: ['user', 'full']})
        }
    })

    if (!user) return null

    return (
        <BottomSheet
        isOpen={isOpen}
        snapPoints={["60%", "90%"]}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        enableOverDrag={false}
        keyboardBehavior="extend"
        index={0}
        onClose={() => {
            if (mutation.isPending || !isOpen) return
            setIsOpen(false); // close the sheet first
            
            const isDirty = JSON.stringify(user.interests.map(i => i.interest)) !== JSON.stringify(selectedInterests);
            if (isDirty) {
                mutation.mutate();
            }
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
                    marginTop: 15,
                    marginBottom: 50,
                }}
                />
            );
        }}
       >
        
            <BottomSheetContent className="border-primary-0 bg-background-0 px-5 flex-1 h-full" >
                <InterestsEdit selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests} />
            
            </BottomSheetContent>
        </BottomSheet>
    );
};



async function updateUser(userId: string, prompts: string) {
    const {error} = await supabase.from('user_additional_info').upsert({prompts: prompts}).eq('id', userId)
    if (error) throw new Error("Something went wrong when updating the user: " + error.message);
}