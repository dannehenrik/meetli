// import { useFab } from "@/components/shared/floating-fab/FabContext";
// import { Box } from "@/components/ui/box";
// import { Button, ButtonText } from "@/components/ui/button";
// import { Fab, FabIcon } from "@/components/ui/fab";
// import { Heading } from "@/components/ui/heading";
// import { HStack } from "@/components/ui/hstack";
// import { ChevronRightIcon, SearchIcon } from "@/components/ui/icon";
// import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
// import { Pressable } from "@/components/ui/pressable";
// import { Text } from "@/components/ui/text";
// import { VStack } from "@/components/ui/vstack";
// import { router, usePathname } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { interestsList, InterestType } from "@/constants/interests";

// export default function interests() {

//     // Setting the fab
//     const pathName = usePathname();
//     const { setFabState } = useFab();
//     useEffect(() => {
//         if (pathName === "/sign-in/onboarding/more-about-you/intro") {
//             setFabState({
//                 label: undefined,
//                 isLoading: false,
//                 isDisabled: false,
//                 onPress: () => {
//                     router.push("/home");
//                 }
//             })
//         }
//     }, [pathName])

//     const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([]);
//     const [searchQuery, setSearchQuery] = useState<string>("");

//     function toggleInterest(interest: InterestType) {
//         setSelectedInterests((prev) =>
//         prev.includes(interest)
//             ? prev.filter((item) => item.value !== interest.value)
//             : [...prev, interest]
//         );
//     };

//     const filteredInterests = interestsList.filter((interest) =>
//         interest.label.toLowerCase().includes(searchQuery.toLowerCase())
//     );
    

//     return (
//         <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
//             <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">
    
//                 <Box className="w-full gap-6">
//                 <Heading className="font-roboto font-semibold text-2xl">
//                     What are your interests?
//                 </Heading>

//                 <VStack className="gap-[72px]">
//                     <VStack className="gap-8">
//                     <Input className="border-typography-200" size="lg">
//                         <InputField
//                         placeholder="Search your interests"
//                         className=" font-normal font-roboto py-2"
//                         value={searchQuery}
//                         onChangeText={setSearchQuery}
//                         />
//                         <InputSlot className="pr-3.5">
//                         <InputIcon as={SearchIcon} className="text-typography-300" />
//                         </InputSlot>
//                     </Input>
//                     <Box className="flex flex-row flex-wrap gap-2">
//                         {filteredInterests.map((interest, index) => {
//                             const isSelected = selectedInterests.includes(interest)
//                             return(
//                                 <Pressable
//                                     key={index}
//                                     onPress={() => toggleInterest(interest)}
//                                     className={`bg-background-50 py-2 px-4 rounded-3xl border border-background-100 ${
//                                     isSelected ? "border border-primary-800 bg-primary-700" : "" }`}
//                                 >
//                                     <Text className={`font-sfpro text-sm font-normal ${isSelected ? "text-white" : ""}`}>
//                                     {interest.label}
//                                     </Text>
//                                 </Pressable>
//                             )
//                         })}
//                     </Box>
//                     </VStack>
//                     <HStack className="justify-between items-center bg-background-50 p-3 rounded-lg w-full gap-2">
//                     <Text className="flex-1">
//                         Didn’t find your interests here? Just go on add it!
//                     </Text>
//                     <Button className="bg-background-900 px-4 rounded-[4px] data-[active=true]:bg-background-700">
//                         <ButtonText className="text-typography-50 data-[active=true]:text-typography-0 font-roboto font-medium text-sm">
//                         Add New
//                         </ButtonText>
//                     </Button>
//                     </HStack>
//                 </VStack>
//                 </Box>
//             </Box>
            
//         </Box>
//     );
// };


import { useFab } from "@/components/shared/floating-fab/FabContext";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { interestsList, InterestType } from "@/constants/interests";
import { ScrollView } from "react-native";

// 🧱 Extracted badge component
const InterestBadge = ({
  interest,
  isSelected,
  onToggle,
}: {
  interest: InterestType;
  isSelected: boolean;
  onToggle: (interest: InterestType) => void;
}) => (
  <Pressable
    onPress={() => onToggle(interest)}
    className={`bg-background-50 py-2 px-4 rounded-3xl border border-background-100 ${
      isSelected ? "border-primary-800/40 bg-primary-700/60" : ""
    }`}
  >
    <Text className={`font-sfpro text-sm font-normal ${isSelected ? "text-white" : ""}`}>
      {interest.label}
    </Text>
  </Pressable>
);

export default function Interests() {
  const pathName = usePathname();
  const { setFabState } = useFab();

  useEffect(() => {
    if (pathName === "/sign-in/onboarding/more-about-you/intro") {
      setFabState({
        label: undefined,
        isLoading: false,
        isDisabled: false,
        onPress: () => {
          router.push("/home");
        },
      });
    }
  }, [pathName]);

  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toggleInterest = (interest: InterestType) => {
    setSelectedInterests((prev) =>
      prev.some((item) => item.value === interest.value)
        ? prev.filter((item) => item.value !== interest.value)
        : [...prev, interest]
    );
  };

  const filteredInterests = interestsList.filter((interest) =>
    interest.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouped with emoji group names
  const groupedInterests = interestsList.reduce((acc, interest) => {
    if (!acc[interest.group]) acc[interest.group] = [];
    acc[interest.group].push(interest);
    return acc;
  }, {} as Record<string, InterestType[]>);

  return (
    <Box className="flex-1 bg-background-0">
      <Box className="px-5 pt-11 pb-4 bg-background-0 z-10">
        <Heading className="font-roboto font-semibold text-2xl mb-6">
          What are your interests?
        </Heading>

        <Input className="border-typography-200" size="lg">
          <InputField
            placeholder="Search your interests"
            className="font-normal font-roboto py-2"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <InputSlot className="pr-3.5">
            <InputIcon as={SearchIcon} className="text-typography-300" />
          </InputSlot>
        </Input>
      </Box>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
        <Pressable>
        <VStack className="gap-12 mt-4 mb-8">
          {searchQuery.length > 0 ? (
            <Box className="flex flex-row flex-wrap gap-2">
              {filteredInterests.map((interest) => {
                const isSelected = selectedInterests.some((item) => item.value === interest.value);
                return (
                  <InterestBadge
                    key={interest.value}
                    interest={interest}
                    isSelected={isSelected}
                    onToggle={toggleInterest}
                  />
                );
              })}
            </Box>
          ) : (
            <VStack className="gap-10">
              {Object.entries(groupedInterests).map(([group, items]) => (
                <VStack key={group} className="gap-4">
                  <Text className="font-roboto font-medium text-lg text-typography-800">
                    {group}
                  </Text>
                  <Box className="flex flex-row flex-wrap gap-2">
                    {items.map((interest) => {
                      const isSelected = selectedInterests.some((item) => item.value === interest.value);
                      return (
                        <InterestBadge
                          key={interest.value}
                          interest={interest}
                          isSelected={isSelected}
                          onToggle={toggleInterest}
                        />
                      );
                    })}
                  </Box>
                </VStack>
              ))}
            </VStack>
          )}

          <HStack className="justify-between items-center bg-background-50 p-3 rounded-lg w-full gap-2">
            <Text className="flex-1">
              Didn’t find your interests here? Just go on add it!
            </Text>
            <Button className="bg-background-900 px-4 rounded-[4px] data-[active=true]:bg-background-700">
              <ButtonText className="text-typography-50 data-[active=true]:text-typography-0 font-roboto font-medium text-sm">
                Add New
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
        </Pressable>
      </ScrollView>
    </Box>
  );
}
