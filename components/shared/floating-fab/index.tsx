import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { usePathname } from "expo-router";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useEffect } from "react";
import { useFab } from "./FabContext";
import { Spinner } from "@/components/ui/spinner";
import { i18n } from "@/app/_layout";



export default function FloatingFab() {
    const router = useRouter();
    const pathname = usePathname();
    const { isDisabled = false, onPress, label, isLoading } = useFab().fabState;

    const defaultText = getDefaultFabLabel(pathname);
    function defaultOnPress() {
        const nextRoute = getReroutePath(pathname);
        if (nextRoute) {
            router.push(nextRoute);
        }
    }

    const currentLabel = label ?? defaultText

    return (
        <Fab
        size={currentLabel ? "md" : "lg"}
        disabled={isDisabled ?? false}
        onPress={() => { (onPress ?? defaultOnPress)() }}
        className="bg-background-950 rounded-lg data-[active=true]:bg-background-900"
        >
            {isLoading ? (
                <Spinner/>
            ) : (
            <>
            {(label || defaultText) && (
                <FabLabel>{label ?? defaultText}</FabLabel>
            )}
                <FabIcon as={ChevronRight} />
            </>
            )}
        </Fab>
    )
}


const onboardingRoutes = [
    "/sign-in/onboarding/email",
    "/sign-in/onboarding/otp",
    "/sign-in/onboarding/verified",
    "/sign-in/onboarding/name",
    "/sign-in/onboarding/date-of-birth",
    "/sign-in/onboarding/gender",
    "/sign-in/onboarding/interest",
    "/sign-in/onboarding/looking-for",
    "/sign-in/onboarding/location",
    "/sign-in/onboarding/pictures",
    "/sign-in/onboarding/profile-base-completed",
] as const;

function getDefaultFabLabel(pathname: string) {
    const shortPath = pathname.replace("/sign-in/onboarding/", "");
    switch (shortPath) {
        case "email":
            return i18n.t('onboarding.fab.sendCode')
        case "otp":
            return i18n.t('onboarding.fab.verify')
        case "verified":
            return i18n.t('onboarding.fab.enterDetails')
        case "profile-base-completed":
            return i18n.t('onboarding.fab.continue')
        default:
            return null
    }
}

function getReroutePath(pathname: string) {
    const currentIndex = onboardingRoutes.findIndex((route) => route === pathname);
    return onboardingRoutes[currentIndex + 1];
}

