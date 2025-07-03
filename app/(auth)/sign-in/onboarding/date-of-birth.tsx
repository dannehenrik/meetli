import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { Box } from "@/components/ui/box";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { getDeviceLangugage } from "@/utils/getDeviceLangugage";
import { supabase } from "@/utils/supabase";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import { Calendar } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';
const AnimatedHeader = Animated.createAnimatedComponent(Heading)
const AnimatedInput = Animated.createAnimatedComponent(Input);

export default function Dateofbirth() {
    const {showErrorToast} = useAwesomeToast();

    const queryClient = useQueryClient();

    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    // const [date, setDate] = useState(new Date());
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
    const [tempDate, setTempDate] = useState<Date>(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false);


    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", dateOfBirth ?? new Date()),
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
            setDateOfBirth(user.dob)
            setTempDate(user.dob)
        }
    }, [user]);


    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/date-of-birth") {
            setFabState({
                onPress:() => {
                    router.push("/sign-in/onboarding/gender");
                    if (dateOfBirth !== user?.dob) { 
                        mutation.mutate();
                    }
                }
            })
        }
        // return () => {
        //     setFabState({
        //         onPress: undefined,
        //         isDisabled: true
        //     })
        // }
    }, [dateOfBirth, user, pathName])

    function toggleDatePicker() {
        // tempDate()
        setShowDatePicker((oldValue) => !oldValue)
    }

    function confirmIosDate() {
        setDateOfBirth(tempDate)
        toggleDatePicker();
    }

    function handleChange(event: DateTimePickerEvent, date?: Date) {
        if (event.type === "set") {
            const currentDate = date ?? new Date();
            // setDateOfBirth(currentDate)
            setTempDate(currentDate);

            if (Platform.OS === "android") {
                toggleDatePicker();
                setDateOfBirth(currentDate)
            }
        } else {
            toggleDatePicker();
        }
    }

    if (!user) return null

    
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full">
                    <VStack className="gap-6">
                        <AnimatedHeader 
                        className="font-roboto font-semibold text-2xl"
                        entering={FadeInDown.delay(100).duration(600).springify().delay(100)}
                        >
                            {i18n.t('onboarding.dob.whatIsYourDOB')}
                        </AnimatedHeader>

                        <VStack className="gap-4">

                            {showDatePicker && (
                

                                <Box className="w-full items-center">
                                    <DateTimePicker
                                        mode="date"
                                        display="spinner"
                                        value={new Date(tempDate)}
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
                                        className="w-full py-4 rounded-lg bg-primary-700 active:bg-primary-800 items-center justify-center"
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
                                <AnimatedInput 
                                className="rounded-lg" 
                                size="lg" 
                                isReadOnly={true}
                                entering={FadeInUp.delay(400).duration(500).springify()} 
                                >
                                    <InputSlot className="pl-3">
                                        <InputIcon as={Calendar}>
                                        </InputIcon>
                                    </InputSlot>
                                    <InputField 
                                        onPressIn={toggleDatePicker} 
                                        placeholder={i18n.t('onboarding.dob.dob')} 
                                        value={new Date(dateOfBirth).toLocaleDateString()}/>
                                        {/* value={""}/> */}
                                </AnimatedInput>
                            )}

                        </VStack>

                    </VStack>
                </FormControl>
            </Box>
        </Box>
    );
};



async function updateUser(userId: string, dob: Date) {
    const {error} = await supabase.from('users').update({dob: dob}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}