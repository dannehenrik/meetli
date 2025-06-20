import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { OTPComponent } from "@/components/shared/otp-input";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Fab, FabIcon } from "@/components/ui/fab";
import { i18n } from "@/app/_layout";
import { supabase } from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";


export default function Otp() {
    const [otpValue, setOtpValue] = useState("");
    const router = useRouter();

    function handleOtpChange(otp: string) {
        setOtpValue(otp);
    };

    const mutation = useMutation({
        mutationFn: async () => handleOtpVerification("46733760263", otpValue),
        onError: (error) => {
            console.error("Something went wrong when sending OTP: ", error.message)
        },
        onSuccess: (data) => {
            console.log("Success: ", data)
            router.push("./verified")
        }
    })
    const insets = useSafeAreaInsets();
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            {/* <OnboardingHeader /> */}
            <Box className="flex-1 justify-start items-center gap-12 px-5 top-20">
                <Box className="flex justify-start gap-3">
                    <Text className="font-roboto text-2xl font-semibold leading-7">
                        {i18n.t("otpInstruction")}
                    </Text>
                    <Text className="font-roboto text-typography-500 leading-6">
                        {i18n.t("otpSubInstruction")}
                    </Text>
                </Box>
                <OTPComponent onComplete={handleOtpChange} />
            </Box>
            <Fab
                size="lg"
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                isDisabled={otpValue.length !== 6}
                onPress={() => mutation.mutate()}
                style={{ marginBottom: -1 * insets.bottom }}
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

async function handleOtpVerification(phoneNumber: string, otp: string) {
    const { data, error} = await supabase
    .auth
    .verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
    })
    if (error || !data) throw new Error("OTP verification failed: " + error?.message)

    return data
}
