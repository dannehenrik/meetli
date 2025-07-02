import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { supabase } from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { i18n } from "../../../_layout";
// import useCustomToast, { toastTest } from "@/utils/toast";
import { Input, InputField } from "@/components/ui/input";

import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText
} from "@/components/ui/form-control";
import { Spinner } from "@/components/ui/spinner";
import { useAwesomeToast } from "@/hooks/toasts";
import { useFab } from "@/components/shared/floating-fab/FabContext";


export default function Email() {
    const { showErrorToast, showSuccessToast } = useAwesomeToast();

    const router = useRouter();
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    

    const mutation = useMutation({
        mutationFn: async (email: string) => sendOtp(email),
        onError: (error) => {
            console.error("Something went wrong when sending OTP: ", error.message)
            showErrorToast(i18n.t("messages.error.emailError"))
        },
        onSuccess: () => {
            showSuccessToast(i18n.t("messages.success.emailSent"))
            router.push("/sign-in/onboarding/otp");
        }
    })

    // Sets the fab
    const { setFabState } = useFab();
    useEffect(() => {
        setFabState({
            isDisabled: email.length === 0,
            isLoading: mutation.isPending,
            onPress: () => handleSubmit(email)
        })
    }, [email, mutation.isPending])



    function handleValidation(value: string) {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());
        setError(!isValidEmail);
        return isValidEmail
    }

    function handleSubmit(value: string) {
        const validation = handleValidation(value);
        if (!validation) return
        mutation.mutate(email);
    }

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            {/* <OnboardingHeader/> */}
            <Box className="flex-1 justify-start items-center gap-12 px-5 top-20">
                <Box className="flex justify-start gap-3">
                    <Text className="font-roboto text-2xl font-semibold leading-7">
                        {i18n.t('onboarding.email.loginInstruction')}
                    </Text>
                    <Text className="font-roboto text-typography-500 leading-6">
                        {i18n.t('onboarding.email.loginSubInstruction')}
                    </Text>
                </Box>

                <FormControl isInvalid={error}>

                    <Input className="w-full">
                        <InputField onFocus={() => setError(false)}  value={email} onChangeText={setEmail} placeholder={i18n.t('onboarding.email.enterEmail')}/>
                    </Input>


                    <FormControlHelper>
                        <FormControlHelperText>{i18n.t('onboarding.email.emailExample')}</FormControlHelperText>
                    </FormControlHelper>

                    <FormControlError>
                        <FormControlErrorText>{i18n.t('onboarding.email.enterEmailError')}</FormControlErrorText>
                    </FormControlError>
                </FormControl>

            </Box>
            <Fab
                size="lg"
                className="bg-background-950 rounded-lg data-[active=true]:bg-background-900"
                isDisabled={email.length === 0}
                onPress={() => { handleSubmit(email) }}
            >   
                {mutation.isPending ? (
                        <Spinner/>
                    ) : (
                        <FabIcon as={ChevronRightIcon} />
                    )}
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