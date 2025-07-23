import React from "react";
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
import { accordionItems } from "./accordionItems";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";




export const FilterBottomSheet = ({
  isOpen,
  setIsOpen,
  defaultOpen = undefined,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  defaultOpen?: string[];
}) => {
    

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
              <BottomSheetScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <Accordion
                  size="md"
                  type="multiple"
                  isCollapsible={true}
                  className="bg-transparent gap-3"
                  defaultValue={defaultOpen}
                >
                  {accordionItems.map((item) => {
                    const FormComponent = item.content;
                    return (
                      <AccordionItem
                        value={item.key}
                        key={item.key}
                        className="bg-background-50 rounded-lg"
                      >
                        <AccordionHeader>
                          <AccordionTrigger>
                            {({ isExpanded } : {isExpanded: boolean}) => (
                              <>
                                <AccordionTitleText className="text-[18px]">
                                  {item.title}
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
                          <FormComponent />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </BottomSheetScrollView>
              <Button
                size="lg"
                className="w-full"
                onPress={() => {
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
