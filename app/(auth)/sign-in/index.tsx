import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon"; // Assume you have these icons or similar
import { Mail } from "lucide-react-native";
import { i18n } from "@/app/_layout";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { AppleIcon, GoogleIcon } from "@/assets/icons/icons";
import Animated, {FadeInDown} from 'react-native-reanimated';
const AnimatedBox = Animated.createAnimatedComponent(Box)
const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function LoginMain() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <Box
            className="flex-1 bg-background-0 justify-between items-center px-6"
            style={{ paddingBottom: insets.bottom + 40, paddingTop: insets.top + 60 }}
        >
            {/* Header */}
            <AnimatedBox 
            entering={FadeInDown.duration(400).springify()}
            className="gap-2 items-center"
            >
                <Text className="text-3xl font-bold text-center">
                    {i18n.t("onboarding.signIn.welcomeBack")}
                </Text>
                <Text className="text-base text-typography-500 text-center">
                    {i18n.t("onboarding.signIn.signInToContinue")}
                </Text>
            </AnimatedBox>

            {/* Auth Buttons */}
            <Box className="w-full gap-4">
                <AnimatedButton 
                entering={FadeInDown.delay(200).duration(500).springify()}
                className="w-full flex-row gap-3 items-center justify-center bg-primary-700"
                >
                    <GoogleIcon/>
                    <ButtonText className="text-base font-medium text-background-0">
                        {i18n.t("onboarding.signIn.continueWithGoogle")}
                    </ButtonText>
                </AnimatedButton>

                <AnimatedButton 
                className="w-full flex-row gap-3 items-center justify-center bg-primary-700"
                entering={FadeInDown.delay(300).duration(500).springify()}
                >
                    <AppleIcon/>
                    <ButtonText className="text-base font-medium text-background-0">
                        {i18n.t("onboarding.signIn.continueWithApple")}
                    </ButtonText>
                </AnimatedButton>

                {/* <Box className="border-t border-background-200 my-4" /> */}
                <Box className="flex-row items-center my-6">
                    <Box className="flex-1 h-px bg-gray-300" />
                        <Text className="mx-3 text-gray-500 font-medium">
                            {i18n.t("onboarding.signIn.or")} {/* or just "or"/"eller" directly */}
                        </Text>
                    <Box className="flex-1 h-px bg-gray-300" />
                </Box>


                <AnimatedButton 
                    variant="outline" 
                    className="w-full flex-row gap-3 items-center justify-center"
                    entering={FadeInDown.delay(500).duration(800).springify()}
                    onPress={() => router.push("/sign-in/onboarding/email")}
                >
                    <Icon size="lg" className="text-primary-500" as={Mail}/>
                    <ButtonText className="text-base font-medium text-primary-500">
                        {i18n.t("onboarding.signIn.continueWithEmail")}
                    </ButtonText>
                </AnimatedButton>
            </Box>

            {/* Footer (optional) */}
            <Box className="items-center">
                <Text className="text-xs text-typography-400 text-center">
                    {i18n.t("onboarding.signIn.agreeToTermsAndPolicy")}
                </Text>
            </Box>
        </Box>
    );
}