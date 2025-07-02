import React from "react";
import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { ProgressBar } from "@/components/shared/progress-bar"
import FloatingFab from "@/components/shared/floating-fab";
import { FabProvider } from "@/components/shared/floating-fab/FabContext";

const layout = () => {
  return (
    <>
        <FabProvider>
          {/* <ProgressBar/> */}
          <Stack
          screenOptions={{ headerShown: false }}
          screenLayout={({ children }) => (
              <Box className="flex-1 bg-background-0">{children}</Box>
          )}
          >
              <Stack.Screen name="email" />
              <Stack.Screen name="profile-base-completed" />
              <Stack.Screen name="date-of-birth" />
              <Stack.Screen name="done" />
              <Stack.Screen name="gender" />
              <Stack.Screen name="interest" />
              <Stack.Screen name="interests" />
              <Stack.Screen name="location" />
              <Stack.Screen name="intro" />
              <Stack.Screen name="looking-for" />
              <Stack.Screen name="name" />
              <Stack.Screen name="otp" />
              <Stack.Screen name="pictures" />
              <Stack.Screen name="profile-answers" />
              <Stack.Screen name="verified" />
          </Stack>
          <FloatingFab/>
        </FabProvider>
    </>
  );
};

export default layout;
