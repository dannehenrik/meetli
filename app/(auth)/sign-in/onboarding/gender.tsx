import { i18n } from "@/app/_layout";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, CircleIcon } from "@/components/ui/icon";
import {
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
} from "@/components/ui/radio";
import { VStack } from "@/components/ui/vstack";
import { usePathname, useRouter } from "expo-router";
import React from "react";

import { useEffect, useState } from "react";


import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { Gender } from "@/types";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFab } from "@/components/shared/floating-fab/FabContext";

export default function gender() {
    const {showErrorToast} = useAwesomeToast();
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
            showErrorToast(i18n.t("messaged.error.somethingWentWrong"),i18n.t("messaged.error.updateProfileError"));
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

    // Setting the fab
    const pathName = usePathname();
    const { setFabState } = useFab();
    useEffect(() => {
        if (pathName === "/sign-in/onboarding/gender") {
            setFabState({
                isDisabled: gender.length === 0,
                onPress: () => {
                    router.push("/sign-in/onboarding/interest");
                    if (gender !== user?.gender) {
                        mutation.mutate()
                    }
                }
            })
        } else {
            setFabState({
                isDisabled: false,
                onPress: undefined,
            })
        }
    }, [gender, user, pathName])

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
        </Box>
    );
};


async function updateUser(userId: string, gender: Gender) {
    const {error} = await supabase.from('users').update({gender: gender}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}