import React, { createContext, ReactElement, useContext, useEffect, useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { CheckIcon, CircleIcon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
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

import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
} from "@/components/shared/bottom-sheet";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionTitleText,
  AccordionItem,
  AccordionTrigger,
  AccordionIcon,
} from "@/components/ui/accordion";
import { Button, ButtonText } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ScrollView } from "react-native-gesture-handler";
// import { filterItems } from "./filterItems";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useFullUser } from "@/hooks/user/useFullUser";
import { UserPreferences } from "@/types";
import { usePreferences } from "@/hooks/user/usePreferences";
import { AgeFilter, DistanceFilter, InterestFilter, LookingForFilter } from "./filterItems";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { P } from "@expo/html-elements";
import lookingFor from "@/app/(auth)/sign-in/onboarding/looking-for";
import { useAwesomeToast } from "@/hooks/toasts";


// 1. Define context type
interface FilterContextType {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

// 2. Create context with default value (use undefined to force use inside Provider)
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilterContext = () => {
  const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilterContext must be used within a FilterContext.Provider");
    }
    return context;
};


export const FilterBottomSheet = ({
    isOpen,
    setIsOpen,
    defaultOpen = undefined,
  }: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    defaultOpen?: string[];
}) => {
    const {showErrorToast, showSuccessToast} = useAwesomeToast();
    const queryClient = useQueryClient();
    const {data} = usePreferences();

    const [preferences, setPreferences] = useState<UserPreferences>(
        data ?? {
            id: "",
            interest: [],
            looking_for: "seriousCasual", // or whatever the default is
            distance: 50,
            min_age: 18,
            max_age: 99,
        }
    );

    useEffect(() => {
        if (data) setPreferences(data)
    }, [isOpen, data])

     const mutation = useMutation({
        mutationFn: async () => updateUserPreferences(preferences),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"));
        },
        onSuccess: () => {
            showSuccessToast(i18n.t("messages.success.filterUpdated"))
            queryClient.invalidateQueries({ queryKey: ['user', 'preferences']})
        }
    })


    return (
        <BottomSheet
        isOpen={isOpen}
        snapPoints={["70%"]}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        enableOverDrag={false}
        keyboardBehavior="extend"
        index={0}
        onClose={() => setIsOpen(false)}   
        backdropComponent={BottomSheetBackdrop}
        handleComponent={() => {
            return (
                <BottomSheetDragIndicator
                className="border-background-0 bg-background-0 rounded-t-xl"
                indicatorStyle={{
                    backgroundColor: "gray",
                    width: 64,
                    height: 4,
                    marginTop: 15,
                    marginBottom: 15,
                }}
                />
            );
        }}
        >
        
            <BottomSheetContent className="border-primary-0 bg-background-0 px-5 flex-1 h-full pb-8" >
            <Text className="text-typography-950 font-semibold text-lg mb-4">
                Filter
            </Text>
            <BottomSheetScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{paddingBottom: 40}}>
                <Accordion
                size="md"
                type="multiple"
                isCollapsible={true}
                className="bg-transparent gap-3"
                defaultValue={defaultOpen}
                >
                    <FilterItem title="Age" filterKey="age">
                        <AgeFilter preferences={preferences} setPreferences={setPreferences}/>
                    </FilterItem>

                    <FilterItem title="Distance" filterKey="distance">
                        <DistanceFilter preferences={preferences} setPreferences={setPreferences} />
                    </FilterItem>

                    <FilterItem title="Who you want to date?" filterKey="gender">
                        <InterestFilter preferences={preferences} setPreferences={setPreferences}/>
                    </FilterItem>

                    <FilterItem title="Looking for" filterKey="looking-for">
                        <LookingForFilter preferences={preferences} setPreferences={setPreferences}/>
                    </FilterItem>
                
                </Accordion>
            </BottomSheetScrollView>
            <Button
                size="lg"
                className="w-full"
                isDisabled={JSON.stringify(preferences) === JSON.stringify(data)}
                onPress={() => {
                    triggerHaptic("button")
                    mutation.mutate();
                    setIsOpen(false);
                }}
            >
                    <ButtonText className="text-typography-950 data-[active=true]:text-typography-900">
                        Apply Filter
                    </ButtonText>
            </Button>
                
            </BottomSheetContent>
        </BottomSheet>
    );
};



function FilterItem({children, title, filterKey} : {children: ReactElement, title: string, filterKey: string}) {
    return(
        <AccordionItem
        value={filterKey}
        key={filterKey}
        className="bg-background-50 rounded-lg"
        >
            <AccordionHeader>
                <AccordionTrigger>
                    {({ isExpanded } : {isExpanded: boolean}) => (
                    <>
                        <AccordionTitleText className="text-[18px]">
                        {title}
                        </AccordionTitleText>
                        <AccordionIcon
                        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                        className="ml-3"
                        />
                    </>
                    )}
                </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
                {children}
            </AccordionContent>
        </AccordionItem>
    )
}


async function updateUserPreferences(preferences: UserPreferences) {
    const {error: preferencesError} = await supabase
        .from('user_preferences')
        .upsert({user_id: preferences.id, min_age: preferences.min_age, max_age: preferences.max_age, distance: preferences.distance})
        .eq('user_id', preferences.id);
    
    if (preferencesError) throw new Error("Something went wrong when updating the user preferences: " + preferencesError.message);

    const {error} = await supabase
        .from('users')
        .update({looking_for: preferences.looking_for, gender_preferences: preferences.interest})
        .eq('id', preferences.id);
    
    if (error) throw new Error("Something went wrong when updating the user: " + error.message);
}



