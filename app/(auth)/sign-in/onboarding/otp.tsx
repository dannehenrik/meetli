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
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { getUser, getUserFromId } from "@/server/auth/getUser";
import { User } from "@/types";


export default function Otp() {
    const queryClient = useQueryClient();
    const [otpValue, setOtpValue] = useState("");
    const router = useRouter();

    function handleOtpChange(otp: string) {
        setOtpValue(otp);
    };

    // const {data, error, isPending} = useQuery({
    //     queryKey: ["user"],
    //     queryFn: async () => getUser()
    // })

    const mutation = useMutation({
        mutationFn: async () => handleOtpVerification("dannehenrik2@gmail.com", otpValue),
        onError: (error) => { console.error("Something went wrong when sending OTP: ", error.message) },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user']})
            if (data?.onboarding_completed) {
                router.push("/home")
            } else {
                router.push("/sign-in/onboarding/verified")
            }
        }
    })
    const insets = useSafeAreaInsets();
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
