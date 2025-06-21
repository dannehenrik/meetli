import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, MailIcon } from "@/components/ui/icon"; // Assume you have these icons or similar
import { Apple, AppleIcon, Mail } from "lucide-react-native";
import { i18n } from "../_layout";
import { useRouter } from "expo-router";


export default function LoginMain() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <Box
            className="flex-1 bg-background-0 justify-between items-center px-6"
            style={{ paddingBottom: insets.bottom + 40, paddingTop: insets.top + 60 }}
        >
            {/* Header */}
            <Box className="gap-2 items-center">
                <Text className="text-3xl font-bold text-center">
                    {i18n.t("welcomeBack")}
                </Text>
                <Text className="text-base text-typography-500 text-center">
                    {i18n.t("signInToContinue")}
                </Text>
            </Box>

            {/* Auth Buttons */}
            <Box className="w-full gap-4">
                <Button className="w-full flex-row gap-3 items-center justify-center text-white">
                    {/* <GoogleLogo className="w-5 h-5" /> */}
                    <ButtonText className="text-base font-medium text-white">
                        {i18n.t("continueWithGoogle")}
                    </ButtonText>
                </Button>

                <Button className="w-full flex-row gap-3 items-center justify-center text-white">
                    {/* <Icon as={Apple}></Icon> */}
                    <ButtonText className="text-base font-medium text-white">
                        {i18n.t("continueWithApple")}
                    </ButtonText>
                </Button>

                <Box className="border-t border-background-200 my-4" />

                <Button 
                    variant="outline" 
                    className="w-full flex-row gap-3 items-center justify-center"
                    onPress={() => router.push("/onboarding/email")}
                >
                    <Icon size="lg" className="text-primary-600" as={Mail}/>
                    <ButtonText className="text-base font-medium text-primary-600">
                        {i18n.t("continueWithEmail")}
                    </ButtonText>
                </Button>
            </Box>

            {/* Footer (optional) */}
            <Box className="items-center">
                <Text className="text-xs text-typography-400 text-center">
                    {i18n.t("agreeToTermsAndPolicy")}
                </Text>
            </Box>
        </Box>
    );
}
