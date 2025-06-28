import { i18n } from "@/app/_layout";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { getUserId } from "@/server/auth/getUser";
import { LocationType } from "@/types";
import { getCoordinates } from "@/utils/getLocation";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { AlertCircle, Check, LocateFixed } from "lucide-react-native";
import { Linking, Platform, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


type LocationStatus = "granted" | "denied" | "undetermined";

export default function LocationScreen() {
    const colorTheme = useColorScheme();
    const queryClient = useQueryClient();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    function openSettings() {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    async function requestLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        queryClient.setQueryData(['locationPermission'], status); // Optimistic update
        queryClient.invalidateQueries({ queryKey: ['locationPermission'] });
    }

    const { data: locationStatus, isPending } = useQuery({
        queryKey: ["locationPermission"],
        queryFn: async () => await checkLocationPermissions(),
    });

    const mutation = useMutation({
        mutationFn: async () => updateUserLocation(),
        onError: (error) => {
            console.error(error.message)
        },
    })

    async function checkLocationPermissions(): Promise<LocationStatus> {
        const { status } = await Location.getForegroundPermissionsAsync();
        console.log("Status: ", status);
        return status;
    }

    const locationStatusMessages = {
        granted: i18n.t("onboarding.location.granted"),
        denied: i18n.t("onboarding.location.denied"),
        undetermined: i18n.t("onboarding.location.undetermined")
    } as const;

    const renderInstructions = () => {
        
        if (Platform.OS === 'ios') {
            const iosSteps = i18n.t("onboarding.location.iosInstructions", { returnObjects: true }) as string[];

            return (
                <Box className="w-full p-4 bg-background-50 rounded-lg">
                    <Text className="font-medium mb-2">{i18n.t("onboarding.location.iosInstructionsTitle")}</Text>
                    {iosSteps.map((step, index) => (
                        <Text key={index}>{index + 1}. {step}</Text>
                    ))}
                </Box>
            );
        } else {
            const androidSteps = i18n.t("onboarding.location.androidInstructions", { returnObjects: true }) as string[];

            return (
                <Box className="mt-4 p-4 bg-background-50 rounded-lg">
                    <Text className="font-medium mb-2">{i18n.t("onboarding.location.androidInstructionsTitle")}</Text>
                    {androidSteps.map((step, index) => (
                        <Text key={index}>{index + 1}. {step}</Text>
                    ))}
                </Box>
            );
        }
    };

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-5 px-5 top-11 w-[100%]">


                <Heading className="font-roboto font-semibold text-2xl">
                    {i18n.t("onboarding.location.title")}
                </Heading>

                <Text>{locationStatusMessages[locationStatus ?? "undetermined"]}</Text>

                {locationStatus === "denied" && (
                    <>
                        <Box className="flex-row items-start gap-2 bg-background-50 p-3 rounded-lg">
                            <Icon as={AlertCircle} className="text-red-500 mt-0.5" size="sm" />
                            <Text className="flex-1">
                                {i18n.t("onboarding.location.accessRequired")}
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
                            {i18n.t("onboarding.location.allowButton")}
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
                            {i18n.t("onboarding.location.grantedButton")}
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
                        <ButtonText>{i18n.t("onboarding.location.openSettingsButton")}</ButtonText>
                    </Button>
                )}

                <InfoOnboarding
                    info={i18n.t("onboarding.location.info")}
                    classNameIcon="mt-1"
                />
            </Box>

            <Fab
                size="lg"
                onPress={() => {
                    router.push("/sign-in/onboarding/pictures");
                    mutation.mutate();
                }}
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
}

async function updateUserLocation() {
    const userId = await getUserId()
    const coordinates = await getCoordinates();
    await updateUser(userId, coordinates)
}

async function updateUser(userId: string, location: LocationType) {
    const {error} = await supabase.from('users').update({location: location}).eq('id', userId);
    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}

