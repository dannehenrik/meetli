import { useEffect, useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon, CircleIcon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

import { default as RNSlider } from "@react-native-community/slider";
import { usesImperialUnits } from "@/utils/usesImperialDistance";
import { useTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { triggerHaptic } from "@/utils/haptics";
import { i18n } from "@/app/_layout";
import {
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
} from "@/components/ui/radio";
import { lookingForOptions } from "@/types";
import { useFullUser } from "@/hooks/user/useFullUser";



export const filterItems = [
    {
        key: "age",
        title: "Age",
        content: () => {
            return (
                <AgeFilter/>
            )
        },
    },
    {
        key: "distance",
        title: "Distance",
        content: () => {
            return (
                <DistanceFilter/>
            )
        },
    },
     {
        key: "gender",
        title: "Who you want to date?",
        content: () => {
            return (<InterestFilter/>)
        },
    },
    {
        key: "looking-for",
        title: "Looking for",
        content: () => {
            return (<LookingForFilter/>)
        },
    },
];



export function DistanceFilter() {
    const [distance, setDistance] = useState<number>(50);
    const isImperial = usesImperialUnits();
    
    const isDark = useColorScheme() === 'dark';
            
    return (
        <VStack space="xl" className="pb-1">
            <HStack space="md" className="items-center">
                <Text className="text-typography-950 bg-background-200 rounded-lg px-5 py-2">
                {isImperial
                    ? `${(distance * 0.6).toFixed(1)} mile`
                    : `${distance} km`}
                </Text>
            </HStack>

            <RNSlider
                style={{
                    width: "100%",
                }}
                minimumValue={20}
                value={distance}
                onValueChange={(value) => {
                    triggerHaptic("select")
                    setDistance(value)
                }}
                maximumValue={300}
                step={1}
                minimumTrackTintColor="#F472B6"
                maximumTrackTintColor={isDark ? '#535252' : '#E5E7EB'}
                thumbTintColor="#EC4899"
            />
        </VStack>
    );
}

export function AgeFilter() {
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(26);
    const isDark = useColorScheme() === 'dark';

    return (
        <VStack space="xl" className="pb-1">
            <HStack space="md" className="items-center">
                <Text className="text-typography-950 rounded-lg bg-background-200 px-5 py-2">
                {minAge}
                </Text>
                <Box className="bg-background-200 w-3.5 h-[1px] rounded-full" />
                <Text className="text-typography-950 rounded-lg bg-background-200 px-5 py-2">
                {maxAge}
                </Text>
            </HStack>

            <Text className="text-sm ">Minimum Age</Text>
            <RNSlider
            style={{ width: "100%" }}
            value={minAge}
            onValueChange={(val) => {
                triggerHaptic("select")
                if (val > maxAge) {
                    setMaxAge(val + 1)
                }
                setMinAge(val); // ✅ Prevent overlap
            }}
            minimumValue={18}
            maximumValue={79}
            step={1}
            minimumTrackTintColor="#F472B6"
            maximumTrackTintColor={isDark ? "#535252" : "#E5E7EB"}
            thumbTintColor="#EC4899"
            />

            <Text className="text-sm">Maximum Age</Text>
            <RNSlider
            style={{ width: "100%" }}
            value={maxAge}
            onValueChange={(val) => {
                triggerHaptic("select")
                if (val < minAge) {
                    setMinAge(val - 1)
                }
                    
                setMaxAge(val); // ✅ Prevent overlap
            }}
            minimumValue={19}
            maximumValue={80}
            step={1}
            minimumTrackTintColor="#F472B6"
            maximumTrackTintColor={isDark ? "#535252" : "#E5E7EB"}
            thumbTintColor="#EC4899"
            />
        </VStack>
    );
}

export function InterestFilter() {
    const {data: user} = useFullUser();
    useEffect(() => {
        if (user && user.gender_preferences) {
            setGenders(user.gender_preferences)
        }
    }, [user])
    const [genders, setGenders] = useState<string[]>([]);
    return(
        //  <VStack className="gap-4">
            <CheckboxGroup
                value={genders}
                onChange={(keys) => {
                    triggerHaptic("select")
                    setGenders(keys)
                }}
                className="gap-3"
            >
                <Checkbox
                value="woman"
                size="md"
                className="bg-background-50 border border-background-200 py-3 px-4 rounded-lg justify-between"
                >
                    <CheckboxLabel className="font-roboto font-medium text-typography-950">
                        {i18n.t("onboarding.gender.woman")}
                    </CheckboxLabel>
                    <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                </Checkbox>

                <Checkbox
                value="male"
                size="md"
                className="bg-background-50 border border-background-200 py-3 px-4 rounded-lg justify-between"
                >
                    <CheckboxLabel className="font-roboto font-medium text-typography-950">
                        {i18n.t("onboarding.gender.male")}
                    </CheckboxLabel>
                    <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                </Checkbox>

                <Checkbox
                value="nonBinary"  
                size="md"
                className="bg-background-50 border border-background-200 py-3 px-4 rounded-lg justify-between"
                >
                    <CheckboxLabel className="font-roboto font-medium text-typography-950">
                        {i18n.t("onboarding.gender.nonBinary")}
                    </CheckboxLabel>
                    <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                </Checkbox>
            </CheckboxGroup>
        // </VStack>
    )
}

function LookingForFilter() {
    const {data: user} = useFullUser();
    useEffect(() => {
        if (user && user.looking_for) {
            setLookingFor(user.looking_for)
        }
    }, [user])
    const [lookingFor, setLookingFor] = useState("");
    return(
        <RadioGroup  
        className="gap-3"
        value={lookingFor} 
        onChange={(value) => {
            triggerHaptic("select")
            setLookingFor(value)
        }}
        >
            {lookingForOptions.map((option) => 
                <Radio
                value={option}
                size="md"
                key={option}
                className="bg-background-50 border border-background-200 py-3 px-4 rounded-lg justify-between border border-background-200"
                
                >
                    <RadioLabel className="font-roboto font-medium text-typography-950 flex-1" >
                        {i18n.t(`onboarding.lookingFor.options.${option}`)}
                    </RadioLabel>
                    <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                </Radio>
            )}
        </RadioGroup>
    )
}
