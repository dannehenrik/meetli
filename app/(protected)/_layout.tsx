import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { Header } from "./edit-profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useUserStatus } from "@/hooks/user/useUserStatus";
import { updateUserStreak } from "@/server/updateUserStreak";
import { useEffect } from "react";
import { useActiveStreak } from "@/hooks/useActiveStreak";
import { useLocationUpdater } from "@/hooks/useUserLocation";

function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <Box className="flex flex-col flex-1 w-screen bg-background-0">
            {children}
        </Box>
    );
}

export default function ChatLayout() {
    useActiveStreak();
    useLocationUpdater();

    return (
        <SafeAreaView className="flex-1 bg-background-0">
            <Stack
            screenOptions={{
                headerShown: false,
            }}
            screenLayout={({ children }) => <RootLayout>{children}</RootLayout>}
            >
                <Stack.Screen name="edit-profile" />
                <Stack.Screen name="messages/[id]" />
                
            </Stack>
        </SafeAreaView>
    );
}
