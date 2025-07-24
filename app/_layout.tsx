import "@/global.css";
import React, { useEffect, useState } from 'react'
import { AppState, Platform } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { onlineManager, focusManager, useQuery } from '@tanstack/react-query'
import type { AppStateStatus } from 'react-native'
import { SplashScreen } from '@/components/shared/splash-screen'
import { BottomSheetModalProvider } from "@/components/shared/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Tanstack
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()


import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Slot, Stack } from 'expo-router';
import 'react-native-reanimated';

import * as SplashScreenExpo from "expo-splash-screen";


// Translation
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { translations } from '@/constants/translations'
import { fetchUserStatus } from "@/server/auth/fetchUserStatus";
import { fetchFullUser, useFullUser } from "@/hooks/user/useFullUser";
import { checkAndFetchCoordinates, checkAndFetchLocation } from "@/utils/getLocation";
import { supabase } from "@/utils/supabase";
import { updateUserLocation } from "@/server/updateUserLocation";
export const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;




export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);

    const colorScheme = "dark" as "light" | "dark";

    // Setup online status once on mount
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            onlineManager.setOnline(!!state.isConnected)
        })
        return () => unsubscribe()
    }, [])



    useEffect(() => {
        function onAppStateChange(status: AppStateStatus) {
            if (Platform.OS !== 'web') {
                focusManager.setFocused(status === 'active')
            }
        }
        const subscription = AppState.addEventListener('change', onAppStateChange)
        return () => subscription.remove()
    }, [])


    useEffect(() => {
        async function prepareApp() {
            try {

                // 🔑 Fetch user manually
                const userStatus = await fetchUserStatus();
                

                if (userStatus?.onboarding_completed) {
                    await updateUserLocation(userStatus.id)
                    // queryClient.setQueryData(['user', 'full'], await fetchFullUser())
                }

                // ✅ Pre-populate user data into TanStack cache
                queryClient.setQueryData(['user', 'status'], userStatus);

                 // Hide native splash screen
                await SplashScreenExpo.hideAsync();


                // Optional: Simulate some delay
                await new Promise(res => setTimeout(res, 1500));
            } catch (e) {
                console.error(e);
            } finally {
                setIsReady(true);
            }
        };

        prepareApp();
    }, []);



     if (!isReady) {
        // Async font loading only occurs in development.
        return <SplashScreen/>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GluestackUIProvider mode={"system"}>
                {/* <SafeAreaView className="flex-1 bg-background-0"> */}
                {/* <SafeAreaView edges={["top"]} className="flex-1 bg-background-0"> */}
                
                    <GestureHandlerRootView style={{ flex: 1}}>
                        <BottomSheetModalProvider>
                            <Slot/>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                {/* </SafeAreaView> */}
            </GluestackUIProvider>
        </QueryClientProvider>
    );
}


