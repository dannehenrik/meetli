import { InfoOnboarding } from "@/components/shared/info-onboarding";
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import {
    CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@/components/ui/icon";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import React, { useState } from "react";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";

export default function profilePrompts() {
  
    const prompts = [
        {
        id: "1",
        question: "If your friends could describe you in one word?",
        placeholder: `"Unpredictable" - Half tech nerd, half wilderness explorer. Never a dull moment.`,
        },
        {
        id: "2",
        question: "Two truths and a lie...",
        placeholder: "Write three statements, make one false...",
        },
        {
        id: "3",
        question: "My perfect Sunday looks like...",
        placeholder: "Describe your ideal Sunday...",
        },
        {
        id: "4",
        question: "My biggest passion in life is...",
        placeholder: "Tell us what drives you...",
        },
        {
        id: "5",
        question: "One thing I'm looking for in a partner...",
        placeholder: "Share what matters most to you...",
        },
        {
        id: "6",
        question: "Weirdest talent that might surprise you?",
        placeholder:
            "I can make the world's most perfect pancake stack AND solve a Rubik's cube in under 3 minutes. Breakfast + brain skills combo! 🥞🧩",
        },
        {
        id: "7",
        question: "Most embarrassing travel moment?",
        placeholder:
            "Got completely lost in Tokyo, accidentally joined a traditional dance parade. Ended up becoming an unexpected tourist attraction! 😂",
        },
    ];

    return (
        // <KeyboardAvoidingView
        //                 behavior={Platform.OS === "ios" ? "padding" : "height"}
        //                 className="flex-1"
        //                 >
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">
               
                <VStack className="gap-[18px] flex-1 w-full pb-4">
                    <VStack className="gap-3">
                        <Heading className="font-roboto font-semibold text-2xl">
                        Write your profile answers
                        </Heading>
                        <VStack className="gap-2">
                        <Text className="font-roboto font-normal text-base text-typography-400 leading-6">
                            Select a prompt that excites you from the list below and write
                            your answer!
                        </Text>
                        </VStack>
                    </VStack>
                    <VStack className="gap-[16px] flex-1 ">
                        {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 200 }}> */}
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 150 }}>
                            <Pressable>
                                <Box className="bg-background-0">
                                <Accordion className="w-full bg-background-0 gap-4 pb-8">
                                    {prompts.map((prompt) => (
                                        <PromptItem key={prompt.id} prompt={prompt} />
                                    ))}
                                </Accordion>
                                </Box>
                                <Box className="bg-background-0">
                                    <InfoOnboarding info="Pick a maximum of 3 questions" />
                                </Box>
                            </Pressable>
                        </ScrollView>
                    </VStack>
                </VStack>
            </Box>
        
        </Box>
        // </KeyboardAvoidingView>
    );
};

function PromptItem({prompt} : {prompt: {id: string, question: string, placeholder: string}}) {
    const [isEditing, setIsEditing] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [answer, setAnswer] = useState("");
    return(
    <>
         <AccordionItem
        value={`item-${prompt.id}`}
        className="rounded-lg bg-background-50"
        >
            <AccordionHeader>
                <AccordionTrigger className="focus:web:rounded-lg">
                    {({ isExpanded } : {isExpanded: boolean}) => {
                    return (
                        <>
                        <Box className="pr-3">
                            {isExpanded ? (
                            <AccordionIcon
                            as={ChevronUpIcon}
                            className="py-3 pr-4 text-background-400"
                            size="md"
                            />
                        ) : (
                            <AccordionIcon
                            as={ChevronDownIcon}
                            className="py-3 pr-4 text-background-400"
                            size="md"
                            />
                        )}
                        </Box>
                        <AccordionTitleText
                            className={`font-roboto font-medium text-sm leading-4 ${
                            isExpanded ? "text-typography-400" : ""
                            }`}
                        >
                            {prompt.question}
                        </AccordionTitleText>

                        <Checkbox >
                            <CheckboxIndicator>
                                <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                        </Checkbox>
                        
                        </>
                    );
                    }}
                </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
                    <AccordionContentText onPress={() => setIsModalOpen(true)} className="font-semibold font-roboto text-2xl text-typography-800 leading-7">
                        {prompt.placeholder}
                    </AccordionContentText>
            </AccordionContent>
        </AccordionItem>

        <PromptEditModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prompt={prompt}
        onSave={(value) => setAnswer(value)}
        />
    </>
    )
}



import { Modal, View, TextInput, Button } from 'react-native';

function PromptEditSheet({ visible, onClose, prompt, onSave } : {visible: boolean, onClose: () => void, prompt: {id: string, question: string, placeholder: string}, onSave: (newValue: string) => void}) {
  const [value, setValue] = useState('');

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{prompt.question}</Text>
          <TextInput
            multiline
            style={{ height: 120, borderColor: '#ccc', borderWidth: 1, marginTop: 12, padding: 10 }}
            placeholder={prompt.placeholder}
            value={value}
            onChangeText={setValue}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={() => { onSave(value); onClose(); }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
