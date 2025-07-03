import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { supabase } from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
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
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp
} from 'react-native-reanimated';
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedInput = Animated.createAnimatedComponent(Input)


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
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/email") {
            setFabState({
                isDisabled: email.length === 0,
                isLoading: mutation.isPending,
                onPress: () => handleSubmit(email)
            })
        } 
        // return () => {
        //     setFabState({
        //         isDisabled: true,
        //         isLoading: false,
        //         onPress: undefined,
        //     })
        // }
    }, [email, mutation.isPending, pathName])



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
                <AnimatedBox 
                entering={FadeInDown.duration(400).springify()}
                className="flex justify-start gap-3">
                    <Text className="font-roboto text-2xl font-semibold leading-7">
                        {i18n.t('onboarding.email.loginInstruction')}
                    </Text>
                    <Text className="font-roboto text-typography-500 leading-6">
                        {i18n.t('onboarding.email.loginSubInstruction')}
                    </Text>
                </AnimatedBox>

                <FormControl isInvalid={error}>
                    <AnimatedBox entering={FadeInDown.delay(400).duration(400).springify()} className="w-full">
                    <AnimatedInput 
                    className="w-full"
                    // entering={FadeInDown.delay(400).duration(400).springify()}
                    >
                        <InputField onFocus={() => setError(false)}  value={email} onChangeText={setEmail} placeholder={i18n.t('onboarding.email.enterEmail')}/>
                    </AnimatedInput>


                    <FormControlHelper>
                        <FormControlHelperText>{i18n.t('onboarding.email.emailExample')}</FormControlHelperText>
                    </FormControlHelper>

                    <FormControlError>
                        <FormControlErrorText>{i18n.t('onboarding.email.enterEmailError')}</FormControlErrorText>
                    </FormControlError>
                    </AnimatedBox>
                </FormControl>

            </Box>
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