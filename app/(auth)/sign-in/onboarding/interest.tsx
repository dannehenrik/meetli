import React, { useState, useEffect} from "react";
import { ProgressFilledTrack } from "@/components/ui/progress";
import { FormControl } from "@/components/ui/form-control";
import { Progress } from "@/components/ui/progress";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { CheckIcon, ChevronRightIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Fab, FabIcon } from "@/components/ui/fab";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxLabel,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { ONBOARDING_PAGES } from "@/constants/constants";
import { i18n } from "@/app/_layout";
import { supabase } from "@/utils/supabase";
import { router, useRouter } from "expo-router";



import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { getUser } from "@/server/auth/getUser";
import { Gender } from "@/types";

export default function interest() {

      const queryClient = useQueryClient();
    const router = useRouter();

    const {data: user, error, isPending} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", genders as Gender[]),
        onError: (error) => {
            console.error(error.message)
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

    const insets = useSafeAreaInsets();

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
                className="bg-background-950 rounded-lg absolute bottom-11 right-5 data-[active=true]:bg-background-900"
                style={{ marginBottom: -1 * insets.bottom }}
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
