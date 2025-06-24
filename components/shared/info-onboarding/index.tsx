import { Icon, InfoIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "react-native";

export const InfoOnboarding = ({ info, classNameIcon }: { info: string, classNameIcon?: string }) => {
  const colorTheme = useColorScheme();
  return (
    <HStack className="gap-[6px] w-full items-start justify-start">
      <Icon as={InfoIcon} className={`text-typography-${colorTheme === "dark" ? 300 : 600} ${classNameIcon}`} />
      <Text className={`font-roboto font-normal text-md pr-8 text-typography-${colorTheme === "dark" ? 300 : 600}`}>
        {info}
      </Text>
    </HStack>
  );
};
