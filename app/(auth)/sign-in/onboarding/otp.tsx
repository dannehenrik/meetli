import { i18n } from "@/app/_layout";
import { OTPComponent } from "@/components/shared/otp-input";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUserFromId } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";


export default function Otp() {
    const queryClient = useQueryClient();
    const [otpValue, setOtpValue] = useState("");
    const router = useRouter();

    const {showErrorToast} = useAwesomeToast();

    function handleOtpChange(otp: string) {
        setOtpValue(otp);
    };


    const mutation = useMutation({
        mutationFn: async () => handleOtpVerification("dannehenrik2@gmail.com", otpValue),
        onError: (error) => { 
            console.error("OTP not correct: ", error.message) 
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
    
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            {/* <OnboardingHeader /> */}
            <Box className="flex-1 justify-start items-center gap-12 px-5 top-20">
                <Box className="flex justify-start gap-3">
                    <Text className="font-roboto text-2xl font-semibold leading-7">
                        {i18n.t("onboarding.otp.otpInstruction")}
                    </Text>
                    <Text className="font-roboto text-typography-500 leading-6">
                        {i18n.t("onboarding.otp.otpSubInstruction")}
                    </Text>
                </Box>
                <OTPComponent onComplete={handleOtpChange} />
            </Box>
            <Fab
                size="lg"
                className="bg-background-950 rounded-lg data-[active=true]:bg-background-900"
                isDisabled={otpValue.length !== 6}
                onPress={() => mutation.mutate()}
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

async function handleOtpVerification(email: string, otp: string) {
    const { data, error} = await supabase
    .auth
    .verifyOtp({
        email: email,
        token: otp,
        type: 'email',
    })
    if (error || !data || !data.user) throw new Error("OTP verification failed: " + error?.message)

    const user = await getUserFromId(data.user.id);

    return user
}
