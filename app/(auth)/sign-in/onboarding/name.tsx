import { i18n } from "@/app/_layout";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { VStack } from "@/components/ui/vstack";
import { ONBOARDING_PAGES } from "@/constants/constants";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function name() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {data: user, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", firstName, lastName),
        onError: (error) => {
            console.error(error.message)
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })
    

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name ?? ''); // adjust to match your user schema
            setLastName(user.last_name ?? '');
        }
    }, [user]);

    const insets = useSafeAreaInsets();
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">
                <Progress
                    value={(1 / ONBOARDING_PAGES) * 100}
                    className="w-1/2 mx-auto rounded-full h-1 bg-background-600"
                >
                    <ProgressFilledTrack />
                </Progress>

                <VStack className="gap-6 w-full">
                    <Heading className="font-roboto font-semibold text-2xl">
                        {i18n.t("onboarding.name.whatIsYourName")}
                    </Heading>

                    <VStack className="gap-4">
                        <Input className="rounded-lg" size="lg">
                            <InputField placeholder={i18n.t('onboarding.name.firstName')} value={firstName} onChangeText={setFirstName} />
                        </Input>
                        <Input className="rounded-lg" size="lg">
                            <InputField placeholder={i18n.t('onboarding.name.lastName')}value={lastName} onChangeText={setLastName} />
                        </Input>
                    </VStack>

                    {/* <InfoOnboarding info="This will be used to match you to people" /> */}
                </VStack>
            </Box>
            <Fab
                size="lg"
                disabled={firstName.length === 0 || lastName.length === 0 }
                onPress={() => {
                    router.push("/sign-in/onboarding/date-of-birth");
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

async function updateUser(userId: string, firstName: string, lastName: string) {
    const {error} = await supabase.from('users').update({first_name: firstName, last_name: lastName}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}
