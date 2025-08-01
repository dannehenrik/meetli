import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { OTPComponent } from "@/components/shared/otp-input";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useAwesomeToast } from "@/hooks/toasts";
import { fetchUserFromId } from "@/server/auth/fetchUserFromId";
import { supabase } from "@/utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';
const AnimatedBox = Animated.createAnimatedComponent(Box)

export default function Otp() {
    const { email } = useLocalSearchParams<{email: string}>();

    const { showErrorToast } = useAwesomeToast();
    const queryClient = useQueryClient();
    const [otpValue, setOtpValue] = useState("");
    const router = useRouter();

    function handleOtpChange(otp: string) {
        setOtpValue(otp);
    };


    const mutation = useMutation({
        mutationFn: async () => handleOtpVerification(email, otpValue),
        onError: (error) => { 
            console.error("OTP not correct: ", error.message)
            showErrorToast(i18n.t("messages.error.otpError"));
            
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user']})
            if (data?.onboarding_completed) {
                router.push("/home")
            } else {
                router.push("/sign-in/onboarding/verified")
            }
        }
    })

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/otp") {
            setFabState({
                isDisabled: otpValue.length !== 6,
                onPress: () => mutation.mutate(),
                isLoading: mutation.isPending
            })
        }
    }, [otpValue, pathName, mutation.isPending])
    
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            {/* <OnboardingHeader /> */}
            <Box className="flex-1 justify-start items-center gap-12 px-5 top-20">

                <AnimatedBox 
                className="flex justify-start gap-3"
                entering={FadeInDown.duration(400).springify()}
                >
                    <Text className="font-roboto text-2xl font-semibold leading-7">
                        {i18n.t("onboarding.otp.otpInstruction")}
                    </Text>
                    <Text className="font-roboto text-typography-500 leading-6">
                        {i18n.t("onboarding.otp.otpSubInstruction")}
                    </Text>
                </AnimatedBox>
                <AnimatedBox entering={FadeInDown.delay(400).duration(400).springify()}>
                    <OTPComponent onComplete={handleOtpChange} />
                </AnimatedBox>
            </Box>
        </Box>
    );
}

async function handleOtpVerification(email: string, otp: string) {
    console.log("Emaaail: ", email);
    const { data, error} = await supabase
    .auth
    .verifyOtp({
        email: email,
        token: otp,
        type: 'email',
    })
    if (error || !data || !data.user) throw new Error("OTP verification failed: " + error?.message)

    const user = await fetchUserFromId(data.user.id);

    return user
}
