import { useContext, useEffect, useState } from "react";
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
import { Gender, LookingFor, lookingForOptions, UserPreferences } from "@/types";
import { useFullUser } from "@/hooks/user/useFullUser";
import { FilterContext, useFilterContext } from ".";

interface FilterItemProps {
    preferences: UserPreferences, 
    setPreferences: (newValue: UserPreferences) => void,
}
export function DistanceFilter({preferences, setPreferences} : FilterItemProps) {
    const isImperial = usesImperialUnits();
    const isDark = useColorScheme() === 'dark';

    function setDistance(newValue: number) {
        setPreferences({...preferences, distance: newValue})
    }


            
    return (
        <VStack space="xl" className="pb-1">
            <HStack space="md" className="items-center">
                <Text className="text-typography-950 bg-background-200 rounded-lg px-5 py-2">
                {isImperial
                    ? `${(preferences.distance * 0.6).toFixed(1)} mile`
                    : `${preferences.distance} km`}
                </Text>
            </HStack>

            <RNSlider
                style={{
                    width: "100%",
                }}
                minimumValue={20}
                value={preferences.distance}
                onValueChange={(value) => {
                    triggerHaptic("select")
                    setDistance(value)
                }}
                maximumValue={300}
                step={5}
                minimumTrackTintColor="#F472B6"
                maximumTrackTintColor={isDark ? '#535252' : '#E5E7EB'}
                thumbTintColor="#EC4899"
            />
        </VStack>
    );
}

export function AgeFilter({preferences, setPreferences} : FilterItemProps) {
    const isDark = useColorScheme() === 'dark';

    function setMaxAge(newValue: number) {
        if (newValue < preferences.min_age) {
            setPreferences({...preferences, max_age: newValue, min_age: newValue - 1})
        } else {
            setPreferences({...preferences, max_age: newValue})
        }
    }

    function setMinAge(newValue: number) {
        if (newValue > preferences.max_age) {
            setPreferences({...preferences, min_age: newValue, max_age: newValue + 1})
        } else {
            setPreferences({...preferences, min_age: newValue})
        }
    }



    return (
        <VStack space="xl" className="pb-1">
            <HStack space="md" className="items-center">
                <Text className="text-typography-950 rounded-lg bg-background-200 px-5 py-2">
                {preferences.min_age}
                </Text>
                <Box className="bg-background-200 w-3.5 h-[1px] rounded-full" />
                <Text className="text-typography-950 rounded-lg bg-background-200 px-5 py-2">
                {preferences.max_age}
                </Text>
            </HStack>

            <Text className="text-sm ">Minimum Age</Text>
            <RNSlider
            style={{ width: "100%" }}
            value={preferences.min_age}
            onValueChange={(val) => {
                triggerHaptic("select")
                setMinAge(val)
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
            value={preferences.max_age}
            onValueChange={(val) => {
                triggerHaptic("select")
                setMaxAge(val)
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

export function InterestFilter({preferences, setPreferences} : FilterItemProps) {

    function setInterest(newValue: Gender[]) {
        setPreferences({...preferences, interest: newValue})
    }
    return(
        //  <VStack className="gap-4">
            <CheckboxGroup
                value={preferences.interest}
                onChange={(values: Gender[]) => {
                    triggerHaptic("select")
                    setInterest(values)
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
    )
}

export function LookingForFilter({preferences, setPreferences} : FilterItemProps) {

    function setLookingFor(newValue: LookingFor) {
        setPreferences({...preferences, looking_for: newValue})
    }
    return(
        <RadioGroup  
        className="gap-3"
        value={preferences.looking_for} 
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
