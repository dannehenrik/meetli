import React, { useEffect, useState } from "react";
import { Linking, Platform, Alert } from "react-native";
import * as Location from "expo-location";
import { router, useRouter } from "expo-router";
import { ProgressFilledTrack } from "@/components/ui/progress";
import { Progress } from "@/components/ui/progress";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { LocateFixed, AlertCircle, Check, X } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type LocationStatus = "granted" | "denied" | "undetermined"
export default function LocationScreen() {
    const colorTheme = useColorScheme();
    const queryClient = useQueryClient();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    // const [locationPermissionStatus, setLocationPermissionStatus] = useState<>
    const [locationAllowed, setLocationAllowed] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [locationText, setLocationText] = useState("Allow location access to find matches near you");

    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };


    async function requestLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        queryClient.setQueryData(['locationPermission'], status); // Optimistic update
        queryClient.invalidateQueries({queryKey: ['locationPermission']})
    };

    const {data: locationStatus, isPending} = useQuery({
        queryKey: ["locationPermission"],
        queryFn: async () => checkLocationPermissions(),
    })
    async function checkLocationPermissions(): Promise<LocationStatus> {
        const { status } = await Location.getForegroundPermissionsAsync();
        return status;
    }

    const locationStatusMessages = {
        granted: "Location access granted. Thank you!",
        denied: "Location permission not granted",
        undetermined: "Location permission required for app functionality."
    } as const;

    const renderInstructions = () => {
        if (Platform.OS === 'ios') {
            return (
                <Box className="w-full p-4 bg-background-100 rounded-lg">
                    <Text className="font-medium mb-2">To enable location on iOS:</Text>
                    <Text>1. Open Settings</Text>
                    <Text>2. Scroll down and select this app</Text>
                    <Text>3. Tap 'Location'</Text>
                    <Text>4. Select 'While Using the App' or 'Always'</Text>
                </Box>
            );
        } else {
            return (
                <Box className="mt-4 p-4 bg-background-100 rounded-lg">
                    <Text className="font-medium mb-2">To enable location on Android:</Text>
                    <Text>1. Open Settings</Text>
                    <Text>2. Go to 'Apps & notifications'</Text>
                    <Text>3. Select this app</Text>
                    <Text>4. Tap 'Permissions'</Text>
                    <Text>5. Enable 'Location'</Text>
                </Box>
            );
        }
    };

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-5 px-5 top-11 w-[100%]">
                <Progress
                    value={(5 / 9) * 100}
                    className="w-1/2 mx-auto rounded-full h-1 bg-background-600"
                >
                    <ProgressFilledTrack />
                </Progress>

                <Heading className="font-roboto font-semibold text-2xl">
                    To find people near you, we need access to your location.
                </Heading>

             
                <Text>{locationStatusMessages[locationStatus ?? "undetermined"]}</Text>

                {locationStatus === "denied" && (
                    <>
                        <Box className="flex-row items-start gap-2 bg-background-100 p-3 rounded-lg">
                            <Icon as={AlertCircle} className="text-red-500 mt-0.5" size="sm" />
                            <Text className="flex-1">
                                Location access is required for all app functionality. Without it, you won't be able to find matches or appear in others' searches.
                                You can enable location later in settings for full functionality or you can follow the instructions below.
                            </Text>
                        </Box>
                        {renderInstructions()}
                    </>
                )}

                {locationStatus === "undetermined" && (
                    <Button 
                        className="w-full" 
                        onPress={requestLocation} 
                        size="lg" 
                    >
                        <Icon as={LocateFixed} className="text-white" size="lg"/>
                        <ButtonText className="text-white">
                            Allow Location Access
                        </ButtonText>
                    </Button>
                )}

                {locationStatus === "granted" && (
                    <Button 
                        className="w-full" 
                        onPress={requestLocation} 
                        size="lg" 
                        disabled={true}
                        action="positive"
                    >
                        <ButtonText>
                            Location Access Granted
                        </ButtonText>
                        <Icon as={Check} size="xl" className={`text-${colorTheme === "dark" ? "black" : "white"}`}/>
                    </Button>
                )}

                {locationStatus === "denied" && (
                    <Button 
                        variant="outline" 
                        className="w-full" 
                        onPress={openSettings}
                        size="lg"
                    >
                        <ButtonText>Open Settings to Enable Location</ButtonText>
                    </Button>
                )}

                <InfoOnboarding
                    info="We never share your location and only use it to show nearby matches."
                    classNameIcon="mt-1"
                />
            </Box>

            <Fab
                size="lg"
                onPress={() => {
                    router.push("/sign-in/onboarding/intro");
                }}
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
}