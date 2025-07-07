
import React from "react";
import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { ProgressBar } from "@/components/shared/progress-bar"
import FloatingFab from "@/components/shared/floating-fab";
import { FabProvider } from "@/components/shared/floating-fab/FabContext";

export default function layout() {
    return (
    <>
        
        <Stack
        screenOptions={{ headerShown: false }}
        screenLayout={({ children }) => (
            <Box className="flex-1 bg-background-0">{children}</Box>
        )}
        >
            <Stack.Screen name="intro" />
            <Stack.Screen name="interests" />
            <Stack.Screen name="training-habits" />
            <Stack.Screen name="smoking-habits" />
            <Stack.Screen name="drinking-habits" />
            <Stack.Screen name="religion" />
            <Stack.Screen name="political-view" />
            <Stack.Screen name="children" />
            <Stack.Screen name="pets" />
            <Stack.Screen name="education" />
            <Stack.Screen name="occupation" />
            <Stack.Screen name="profile-prompts" />
        </Stack>

    </>
    );
};
