import { i18n } from "@/app/_layout";
import { InfoOnboarding } from "@/components/shared/info-onboarding";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { ChevronRightIcon, CircleIcon } from "@/components/ui/icon";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import {
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
} from "@/components/ui/radio";
import { USER_STALE_TIME } from "@/constants/staleTimes";
import { useAwesomeToast } from "@/hooks/toasts";
import { getUser } from "@/server/auth/getUser";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const lookingForOptions = [
    {value: "serious", label: "Serious"},
    {value: "serious-casual", label: "Serious, but open to casual"},
    {value: "casual-serious", label: "Casual, but open to a serious relationship"},
    {value: "casual", label: "Casual"},
    {value: "not-sure", label: "Not sure"},
    {value: "friends", label: "Friends"},
]

export type LookingFor = "serious" | "serious-casual" | "casual-serious" | "casual" | "not-sure" | "friends"

export default function lookingFor() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const {showErrorToast} = useAwesomeToast();

    const [lookingFor, setLookingfor] = useState('');


    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: async () => await getUser(),
        staleTime: USER_STALE_TIME,
    })

    const mutation = useMutation({
        mutationFn: async () => updateUser(user?.id ?? "", lookingFor as LookingFor),
        onError: (error) => {
            console.error(error.message)
            showErrorToast(i18n.t("messaged.error.somethingWentWrong"),i18n.t("messaged.error.updateProfileError"));
            router.back();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user']})
        }
    })

    // Set initial values when user data is loaded
    useEffect(() => {
        if (user && user.looking_for) {
            setLookingfor(user.looking_for); // adjust to match your user schema
        }
    }, [user]);

    const insets = useSafeAreaInsets();

    if (!user) return null
    return (
        <Box className="flex-1 bg-background-0 gap-4 justify-start items-center pb-[100px]">
            <Box className="flex-1 justify-start items-start gap-11 px-5 top-11 w-[100%]">

                <FormControl className="w-full gap-6">
                    <Heading className="font-roboto font-semibold text-2xl">
                        {i18n.t("onboarding.lookingFor.lookingForInstruction")}
                    </Heading>

                    <RadioGroup className="gap-3" value={lookingFor} onChange={setLookingfor}>
                        {lookingForOptions.map((option) => 
                            <Radio
                            value={option.value}
                            size="md"
                            key={option.value}
                            className="bg-background-50 py-3 px-4 rounded-lg justify-between"
                            >
                                <RadioLabel className="font-roboto font-medium text-typography-950 flex-1">
                                    {option.label}
                                </RadioLabel>
                                <RadioIndicator>
                                    <RadioIcon as={CircleIcon} />
                                </RadioIndicator>
                            </Radio>
                        )}
                    </RadioGroup>

                    <InfoOnboarding
                        info={i18n.t("onboarding.lookingFor.lookingForClarification")}
                        classNameIcon="mt-1"
                    />
                </FormControl>
            </Box>
            <Fab
                size="lg"
                disabled={lookingFor.length === 0}
                onPress={() => {
                    router.push("/sign-in/onboarding/location");
                    if (lookingFor !== user.looking_for) {
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

async function updateUser(userId: string, lookingFor: LookingFor) {
    const {error} = await supabase.from('users').update({looking_for: lookingFor}).eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user: " + error.message)
}
