import { Icon, InfoIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "react-native";
import Animated, {

  FadeIn,
} from 'react-native-reanimated';
const AnimatedHstack = Animated.createAnimatedComponent(HStack)

export const InfoOnboarding = ({ info, classNameIcon }: { info: string, classNameIcon?: string }) => {
  const colorTheme = useColorScheme();
  return (
    <AnimatedHstack 
    className="gap-[6px] w-full items-center justify-start"
    entering={FadeIn.delay(600).duration(400)}
    >
      <Icon as={InfoIcon} className={`text-typography-${colorTheme === "dark" ? 300 : 600} ${classNameIcon}`} />
      <Text className={`font-roboto font-normal text-md pr-8 text-typography-${colorTheme === "dark" ? 300 : 600}`}>
        {info}
      </Text>
    </AnimatedHstack>
  );
};
