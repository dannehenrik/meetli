import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { router, usePathname } from "expo-router";
import { ChevronLeftIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { ProgressBar } from "../progress-bar";
import { triggerHaptic } from "@/utils/haptics";

export const OnboardingHeader = () => {
  const pathname = usePathname();
  const isRootRoute = pathname === "/";
  const isOtpRoute = pathname === "/sign-in/onboarding/otp";
  const isVerifiedRoute = pathname === "/sign-in/onboarding/verified" || pathname === "/sign-in/onboarding/done" || pathname === "/sign-in/onboarding/profile-base-completed";
  const isLastPath = pathname === "/sign-in/onboarding/done";
  const isOnboardingRoute = pathname.startsWith("/sign-in/onboarding");

  const isBaseOnboarding = !pathname.startsWith("/sign-in/onboarding/more-about-you")

  const enabledBackButton = (isOtpRoute || isOnboardingRoute) && !isVerifiedRoute;
  const enabledSkipButton = !isBaseOnboarding;
  return (
    <VStack>
    <HStack className="justify-between items-center w-full px-4 py-2">
      <Button
        className={`bg-transparent data-[active=true]:bg-transparent ${
          enabledBackButton ? "opacity-100" : "opacity-0"
        }`}
        isDisabled={!enabledBackButton}
        onPress={() => {
          triggerHaptic("buttonLight")
          router.back()
        }}
      >
        <ButtonIcon
          as={ChevronLeftIcon}
          className={`text-typography-500 ${
            enabledBackButton ? "opacity-100" : "opacity-0"
          }`}
          size="xl"
        />
      </Button>

      <HStack
        className={`justify-center items-center gap-2 ${
          isVerifiedRoute ? "hidden" : ""
        }`}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          alt="Logo"
          className="h-[28px] w-[28px]"
        />
        <Text className="font-satoshi font-bold">Meetli</Text>
      </HStack>

      <Button
        className={`bg-transparent data-[active=true]:bg-transparent ${
          !isLastPath && enabledSkipButton ? "opacity-100" : "opacity-0"
        }`}
        // onPress={() => router.navigate("/home")}
        isDisabled={isLastPath || !enabledSkipButton}
        size="sm"
      >
        <ButtonText
          className={`text-typography-500 data-[active=true]:text-typography-400 font-roboto font-medium ${
            !isLastPath && enabledSkipButton ? "opacity-100" : "opacity-0"
          }`}
        >
          Skip
        </ButtonText>
      </Button>
    </HStack>
    <ProgressBar pathName={pathname}/>
    </VStack>
  );
};
