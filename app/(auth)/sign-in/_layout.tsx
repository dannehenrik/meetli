import { Stack } from "expo-router";
import { TouchableWithoutFeedback } from "react-native";
import { KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { OnboardingHeader } from "@/components/shared/onboarding-header";
import { Box } from "@/components/ui/box";

import FloatingFab from "@/components/shared/floating-fab";
import { FabProvider } from "@/components/shared/floating-fab/FabContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {


    const handleKeyboardDismiss = () => {
        if (Platform.OS !== "web") {
            Keyboard.dismiss();
        }
    };
    return (
        <FabProvider>
            <SafeAreaView edges={["top"]} className="flex-1 bg-background-0">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                // keyboardVerticalOffset={85}
            >
                <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
                    <Box className="flex-1 bg-background-0">
                        <OnboardingHeader />
                        
                            <Stack
                                screenLayout={({ children }) => (
                                    <Box className="flex-1 bg-background-0">{children}</Box>
                                )}
                                screenOptions={{
                                    headerShown: false,
                                }}
                            />

                    </Box>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <FloatingFab/>
            </SafeAreaView>
        </FabProvider>
    );
}

