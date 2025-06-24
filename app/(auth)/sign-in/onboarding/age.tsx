import React, { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressFilledTrack } from "@/components/ui/progress";
import { FormControl } from "@/components/ui/form-control";
import { Progress } from "@/components/ui/progress";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { InfoIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Input, InputField } from "@/components/ui/input";
import { i18n } from "@/app/_layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";

export default function age() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {data: user, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", Number(age)),
        onError: (error) => {
            console.error(error.message)
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    const [age, setAge] = useState('');

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.age) {
            setAge(String(user.age) ?? ''); // adjust to match your user schema
        }
    }, [user]);

    const insets = useSafeAreaInsets();
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">
                <Progress
                    value={(2 / 9) * 100}
                    className="w-1/2 mx-auto rounded-full h-1 bg-background-600"
                >
                    <ProgressFilledTrack />
                </Progress>

                <FormControl className="w-full">
                    <VStack className="gap-6">
                        <Heading className="font-roboto font-semibold text-2xl">
                            {i18n.t('onboarding.age.whatIsYourAge')}
                        </Heading>

                        <VStack className="gap-4">
                            <Input className="rounded-lg" size="lg">
                                <InputField placeholder={i18n.t('onboarding.age.age')} inputMode="numeric" value={age} onChangeText={setAge}/>
                            </Input>
                        </VStack>

                        {/* <HStack className="gap-1.5">
                            <Icon as={InfoIcon} className="text-typography-300" />
                            <Text className="font-roboto font-normal text-xs text-typography-300">
                                Lorem ipsum dolor sit amet consectetur. Purus eu nunc
                            </Text>
                        </HStack> */}
                    </VStack>
                </FormControl>
            </Box>
            <Fab
                size="lg"
                disabled={age.length === 0}
                onPress={() => {
                    router.push("/sign-in/onboarding/gender");
                    mutation.mutate();
                }}
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
};



async function updateUser(userId: string, age: number) {
    const {error} = await supabase.from('users').update({age: age}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}