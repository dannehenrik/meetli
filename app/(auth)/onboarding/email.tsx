import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { supabase } from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { i18n } from "../../_layout";
// import useCustomToast, { toastTest } from "@/utils/toast";
import { Input, InputField } from "@/components/ui/input";
import { useErrorToast } from "@/utils/toast";

import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText
} from "@/components/ui/form-control";


export default function Email() {
    // const { successToast, errorToast, warningToast, infoToast, updateToast } = useCustomToast();
    const { showToast: showError } = useErrorToast();

    const router = useRouter();
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");


    const insets = useSafeAreaInsets();

    const mutation = useMutation({
        mutationFn: async (email: string) => sendOtp(email),
        onError: (error) => {
            console.error("Something went wrong when sending OTP: ", error.message)
            router.back();
        },
        onSuccess: (data) => {
            console.log("Success: ", data)
        }
    })

    function handleValidation(value: string) {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());
        setError(!isValidEmail);
        return isValidEmail
    }

    function handleSubmit(value: string) {
        const validation = handleValidation(value);
        if (!validation) return
        router.push("/onboarding/otp");
        mutation.mutate(email);
    }

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            {/* <OnboardingHeader/> */}
            <Box className="flex-1 justify-start items-center gap-12 px-5 top-20">
                <Box className="flex justify-start gap-3">
                    <Text className="font-roboto text-2xl font-semibold leading-7">
                        {i18n.t('loginInstruction')}
                    </Text>
                    <Text className="font-roboto text-typography-500 leading-6">
                        {i18n.t('loginSubInstruction')}
                    </Text>
                </Box>

                <FormControl isInvalid={error}>

                    <Input className="w-full">
                        <InputField onFocus={() => setError(false)}  value={email} onChangeText={setEmail} placeholder={i18n.t('enterEmail')}/>
                    </Input>


                    <FormControlHelper>
                        <FormControlHelperText>{i18n.t('emailExample')}</FormControlHelperText>
                    </FormControlHelper>

                    <FormControlError>
                        <FormControlErrorText>{i18n.t('enterEmailError')}</FormControlErrorText>
                    </FormControlError>
                </FormControl>

            </Box>
            <Fab
                size="lg"
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
                isDisabled={email.length === 0}
                onPress={() => { handleSubmit(email) }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
}


async function sendOtp(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
    })

    if (error || !data) throw new Error("Something went wrong when sending OTP: " + error?.message);

    return data
}