import React, { useContext, useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressFilledTrack } from "@/components/ui/progress";
import { FormControl } from "@/components/ui/form-control";
import { Progress } from "@/components/ui/progress";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { InfoIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { i18n } from "@/app/_layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Pressable } from "@/components/ui/pressable";
import { Platform } from "react-native";
import { Calendar, ChevronLeft, View } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { getLocales } from 'expo-localization';
import { getDeviceLangugage } from "@/utils/getDeviceLangugage";
import { useToast } from "@/components/ui/toast";
import { useAwesomeToast } from "@/hooks/toasts";

export default function dateOfBirth() {
    const {showErrorToast} = useAwesomeToast();

    const queryClient = useQueryClient();
    const router = useRouter();

    const [date, setDate] = useState(new Date());
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {data: user, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", date),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messaged.error.somethingWentWrong"),i18n.t("messaged.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.dob) {
            setDate(new Date(user.dob)); // adjust to match your user schema
        }
    }, [user]);

    useEffect(() => {
        setDateOfBirth(date.toLocaleDateString())
    }, [date])


    function toggleDatePicker() {
        setShowDatePicker((oldValue) => !oldValue)
    }

    function confirmIosDate() {
        setDateOfBirth(date.toLocaleDateString())
        toggleDatePicker();
    }

    function handleChange(event: DateTimePickerEvent, date?: Date) {
        if (event.type === "set") {
            const currentDate = date ?? new Date();
            setDate(currentDate)

            if (Platform.OS === "android") {
                toggleDatePicker();
                setDateOfBirth(currentDate.toLocaleDateString())
            }
        } else {
            toggleDatePicker();
        }
    }

    const insets = useSafeAreaInsets();

    if (!user) return null
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full">
                    <VStack className="gap-6">
                        <Heading className="font-roboto font-semibold text-2xl">
                            {i18n.t('onboarding.dob.whatIsYourDOB')}
                        </Heading>

                        <VStack className="gap-4">

                            {showDatePicker && (
                

                                <Box className="w-full items-center">
                                    <DateTimePicker
                                        mode="date"
                                        display="spinner"
                                        value={new Date(date)}
                                        onChange={handleChange}
                                        locale={getDeviceLangugage()}
                                        maximumDate={new Date(
                                            new Date().getFullYear() - 18,
                                            new Date().getMonth(),
                                            new Date().getDate()
                                        )}
                                    />
                                </Box>
                            )}

                            {showDatePicker && Platform.OS === "ios" && (
                                <VStack className="gap-2 mt-4 w-full">
                                    <Pressable 
                                        className="w-full py-4 rounded-lg bg-primary-500 active:bg-primary-600 items-center justify-center"
                                        onPress={confirmIosDate}
                                    >
                                        <Text className="text-white font-medium">{i18n.t("confirm")}</Text>
                                    </Pressable>
                                    <Pressable 
                                        className="w-full py-4 rounded-lg bg-transparent active:bg-background-100 items-center justify-center"
                                        onPress={toggleDatePicker}
                                    >
                                        <Text className="text-background-900">{i18n.t("cancel")}</Text>
                                    </Pressable>
                                </VStack>
                            )}


                            {!showDatePicker && (
                                <Input className="rounded-lg" size="lg" isReadOnly={true}>
                                    <InputSlot className="pl-3">
                                        <InputIcon as={Calendar}>
                                        </InputIcon>
                                    </InputSlot>
                                    <InputField 
                                        onPressIn={toggleDatePicker} 
                                        placeholder={i18n.t('onboarding.dob.dob')} 
                                        value={dateOfBirth}/>
                                </Input>
                            )}

                        </VStack>

                    </VStack>
                </FormControl>
            </Box>
            <Fab
                size="lg"
                onPress={() => {
                    router.push("/sign-in/onboarding/gender");
                    if (date !== user.dob) { 
                        mutation.mutate();
                    }
                }}
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
};



async function updateUser(userId: string, dob: Date) {
    const {error} = await supabase.from('users').update({dob: dob}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}