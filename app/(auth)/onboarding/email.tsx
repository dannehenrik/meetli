import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PhoneInput } from "@/components/shared/phone-input";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Fab, FabIcon } from "@/components/ui/fab";
import { i18n } from "../../_layout";
import { supabase } from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
// import useCustomToast, { toastTest } from "@/utils/toast";
import { useToast } from "@/components/ui/toast";
import { useErrorToast } from "@/utils/toast";
import { Button, ButtonText } from "@/components/ui/button";


export default function Index() {
    // const { successToast, errorToast, warningToast, infoToast, updateToast } = useCustomToast();
    const { showToast: showError } = useErrorToast();

    const router = useRouter();
    const [isValid, setIsValid] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");


    const handleValidationChange = (isValid: boolean) => {
        setIsValid(isValid);
    };
    const insets = useSafeAreaInsets();

    const mutation = useMutation({
        mutationFn: async (phoneNumber: string) => sendOtp(phoneNumber),
        onError: (error) => {
            console.error("Something went wrong when sending OTP: ", error.message)
            router.back();
        },
        onSuccess: (data) => {
            console.log("Success: ", data)
        }
    })

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
                <PhoneInput
                    onPhoneChange={setPhoneNumber}
                    onValidationChange={handleValidationChange}
                />
            </Box>
            <Fab
                size="lg"
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
                isDisabled={!isValid}
                onPress={() => {
                    router.push("/onboarding/otp");
                    mutation.mutate(phoneNumber);
                }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
}


async function sendOtp(phoneNumber: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        phone: "46702343351",
    })

    if (error || !data) throw new Error("Something went wrong when sending OTP: " + error?.message);

    return data
}