import { i18n } from "@/app/_layout";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Box } from "@/components/ui/box";
import {
    Checkbox,
    CheckboxGroup,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
} from "@/components/ui/checkbox";
import { Fab, FabIcon } from "@/components/ui/fab";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { CheckIcon, ChevronRightIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";



import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { Gender } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function interest() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {showErrorToast} = useAwesomeToast();

    const {data: user, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", genders as Gender[]),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messaged.error.somethingWentWrong"),i18n.t("messaged.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    const [genders, setGenders] = useState<string[]>([]);

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.gender_preferences) {
            setGenders(user.gender_preferences); // adjust to match your user schema
        }
    }, [user]);

    

    if (!user) return null
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full">
                    <VStack className="gap-6">
                        <Heading className="font-roboto font-semibold text-2xl">
                            {i18n.t("onboarding.gender.genderInterestInfo")}
                        </Heading>

                        <VStack className="gap-4">
                            <CheckboxGroup
                                value={genders}
                                onChange={(keys) => setGenders(keys)}
                                className="gap-3"
                            >
                                <Checkbox
                                value="woman"
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
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
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <CheckboxLabel className="font-roboto font-medium text-typography-950">
                                        {i18n.t("onboarding.gender.male")}
                                    </CheckboxLabel>
                                    <CheckboxIndicator>
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                </Checkbox>

                                <Checkbox
                                value="non-binary"  
                                size="md"
                                className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                                >
                                    <CheckboxLabel className="font-roboto font-medium text-typography-950">
                                        {i18n.t("onboarding.gender.nonBinary")}
                                    </CheckboxLabel>
                                    <CheckboxIndicator>
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                </Checkbox>
                            </CheckboxGroup>
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
                onPress={() => {
                    router.push("/sign-in/onboarding/looking-for");
                    if (genders !== user.gender_preferences) {
                        mutation.mutate()
                    }
                }}
                className="bg-background-950 rounded-lg data-[active=true]:bg-background-900"
            >
                <FabIcon as={ChevronRightIcon} />
            </Fab>
        </Box>
    );
};


async function updateUser(userId: string, gender: Gender[]) {
    const {error} = await supabase.from('users').update({gender_preferences: gender}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}
