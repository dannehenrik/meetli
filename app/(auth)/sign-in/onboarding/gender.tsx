import React, { useContext } from "react";
import { router, useRouter } from "expo-router";
import { ProgressFilledTrack } from "@/components/ui/progress";
import { FormControl } from "@/components/ui/form-control";
import { Progress } from "@/components/ui/progress";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, CircleIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Fab, FabIcon } from "@/components/ui/fab";
import {
  Radio,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
  RadioGroup,
} from "@/components/ui/radio";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { ONBOARDING_PAGES } from "@/constants/constants";
import { i18n } from "@/app/_layout";

import { useEffect, useState } from "react";


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import { Gender } from "@/types";

export default function gender() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {data: user, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", gender as Gender),
        onError: (error) => {
            console.error(error.message)
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    const [gender, setGender] = useState('');

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.gender) {
            setGender(user.gender); // adjust to match your user schema
        }
    }, [user]);

    const insets = useSafeAreaInsets();

    if (!user) return null
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full">
                    <VStack className="gap-6">
                        <Heading className="font-roboto font-semibold text-2xl">
                            {i18n.t("onboarding.gender.howDoYouIdentify")}
                        </Heading>

                        <VStack className="gap-4">
                            <RadioGroup className="gap-3" value={gender} onChange={setGender}>
                                <Radio
                                value="woman"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <RadioLabel className="font-roboto font-medium text-typography-950">
                                        {i18n.t("onboarding.gender.woman")}
                                    </RadioLabel>
                                    <RadioIndicator>
                                        <RadioIcon as={CircleIcon} />
                                    </RadioIndicator>
                                </Radio>

                                <Radio
                                value="male"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <RadioLabel className="font-roboto font-medium text-typography-950">
                                        {i18n.t("onboarding.gender.male")}
                                    </RadioLabel>
                                    <RadioIndicator>
                                        <RadioIcon as={CircleIcon} />
                                    </RadioIndicator>
                                </Radio>

                                <Radio
                                    value="non-binary"
                                    size="md"
                                    className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                    >
                                    <RadioLabel className="font-roboto font-medium text-typography-950">
                                        {i18n.t("onboarding.gender.nonBinary")}
                                    </RadioLabel>
                                    <RadioIndicator>
                                        <RadioIcon as={CircleIcon} />
                                    </RadioIndicator>
                                </Radio>
                            </RadioGroup>
                        </VStack>

                        <InfoOnboarding
                        info={i18n.t("onboarding.changeInformationLaterInfo")}
                        classNameIcon="mt-1"
                        />
                    </VStack>
                </FormControl>
            </Box>
            <Fab
                size="lg"
                disabled={gender.length === 0}
                onPress={() => {
                    router.push("/sign-in/onboarding/interest");
                    if (gender !== user.gender) {
                        mutation.mutate()
                    }
                }}
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
};


async function updateUser(userId: string, gender: Gender) {
    const {error} = await supabase.from('users').update({gender: gender}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}