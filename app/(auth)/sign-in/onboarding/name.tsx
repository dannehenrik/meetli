import { i18n } from "@/app/_layout";
import { useFab } from "@/components/shared/floating-fab/FabContext";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";

import { VStack } from "@/components/ui/vstack";
import { useAwesomeToast } from "@/hooks/toasts";
import { useCoreUser } from "@/hooks/user/useCoreUser";
import { supabase } from "@/utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInRight,
} from 'react-native-reanimated';
const AnimatedHeader = Animated.createAnimatedComponent(Heading)
const AnimatedInput = Animated.createAnimatedComponent(Input);

export default function name() {
    const {showErrorToast, showSuccessToast} = useAwesomeToast();

    const queryClient = useQueryClient();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const {data: user} = useCoreUser()

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", firstName, lastName),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messages.error.somethingWentWrong"),i18n.t("messages.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'core']})
        }
    })

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name ?? ''); // adjust to match your user schema
            setLastName(user.last_name ?? '');
        }
    }, [user]);

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/name") {
            setFabState({
                isDisabled: !firstName|| !lastName ,
                onPress: () => {
                    router.push("/sign-in/onboarding/date-of-birth");
                    if (firstName !== user?.first_name || lastName !== user?.last_name) {
                        mutation.mutate();
                    }
                }
            })
        }

    }, [firstName, lastName, user, pathName])

    if (!user) return null

    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <VStack className="gap-6 w-full">
                
                    <AnimatedHeader 
                    entering={FadeInDown.delay(100).duration(600).springify().delay(100)} 
                    className="font-roboto font-semibold text-2xl"
                    >
                        {i18n.t("onboarding.name.whatIsYourName")}
                    </AnimatedHeader>

                    <VStack className="gap-4">

                        <AnimatedInput 
                        className="rounded-lg" 
                        size="lg"
                        entering={FadeInLeft.delay(300).duration(500).springify()} 
                        >
                            <InputField placeholder={i18n.t('onboarding.name.firstName')} value={firstName} onChangeText={setFirstName} />
                        </AnimatedInput>
                    
                        <AnimatedInput 
                        size="lg"
                        className="rounded-lg" 
                        entering={FadeInRight.delay(500).duration(500).springify()} 
                        >
                            <InputField placeholder={i18n.t('onboarding.name.lastName')}value={lastName} onChangeText={setLastName} />
                        </AnimatedInput>

                    </VStack>

                    {/* <InfoOnboarding info="This will be used to match you to people" /> */}
                {/* </VStack> */}
                </VStack>
            </Box>
        </Box>
    );
};


async function updateUser(userId: string, firstName: string, lastName: string) {
    const {error} = await supabase.from('users').update({first_name: firstName, last_name: lastName}).eq('id', userId);
    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}