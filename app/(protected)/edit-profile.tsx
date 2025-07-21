import { memo, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { ProfileScreen } from "@/components/screens/profile";
import { ButtonGroup, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { EditScreen } from "@/components/screens/profile/edit";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { useFullUser } from "@/hooks/user/useFullUser";
import { triggerHaptic } from "@/utils/haptics";
import { Spinner } from "@/components/ui/spinner";
import { i18n } from "../_layout";
const AnimatedBox = Animated.createAnimatedComponent(Box);

export function Header() {
    const router = useRouter();

    const {data: user} = useFullUser();
    function handleDone() {
        triggerHaptic("buttonLight")
        router.back();
    };


    return (
        <Box className="w-full flex flex-row items-center py-3 gap-2 justify-between">
            <Button variant="link" className="px-4" onPress={handleDone}>
                <ButtonIcon
                as={ChevronLeftIcon}
                className="text-typography-950 h-6 w-6"
                />
            </Button>
            <Heading size="lg" className="font-satoshi font-medium">
                {user?.first_name}
            </Heading>
            <Button
                variant="link"
                className="bg-transparent px-4"
                size="sm"
                onPress={handleDone}
            >
                <ButtonText className="font-roboto data-[active=true]:no-underline">
                Done
                </ButtonText>
            </Button>
        </Box>
    );
};

export default function EditProfile() {
    const translateX = useSharedValue(0);
    const { width } = useWindowDimensions();
    const animatedStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: translateX.value }],};
    });
    
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"Edit" | "Preview">("Edit");
    const isEditing = activeTab === "Edit";

    useEffect(() => {
        return () => {
            router.push("/profile");
        };
    }, []);

    const {data: user} = useFullUser();

    if (!user) return <Spinner/>

    return (
        <Box className="flex-1">
            <Header />
            <ButtonGroup className="w-full flex flex-row px-4 mt-6" isAttached>
                <Button
                onPress={() => {
                    translateX.value = withTiming(0, { duration: 300 });
                    setActiveTab("Edit");
                }}
                className="flex-1 bg-transparent  rounded-none data-[active=true]:bg-transparent"
                >
                    <ButtonText className="text-typography-950 data-[active=true]:text-typography-950">
                        {i18n.t("editProfilePage.edit")}
                    </ButtonText>
                </Button>
                <Button
                className="flex-1 bg-transparent rounded-none data-[active=true]:bg-transparent"
                onPress={() => {
                    translateX.value = withTiming(width / 2, { duration: 300 });
                    setActiveTab("Preview");
                }}
                >
                    <ButtonText className="text-typography-950 data-[active=true]:text-typography-950">
                        {i18n.t("editProfilePage.preview")}
                    </ButtonText>
                </Button>
            </ButtonGroup>
            <AnimatedBox className="w-1/2 border-b-2 border-primary-500 mb-6" style={animatedStyle}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                {isEditing ? <EditScreen /> : <ProfileScreen user={user}/>}
            </ScrollView>
        </Box>
    );
}
