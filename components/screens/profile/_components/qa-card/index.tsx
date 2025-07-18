import React from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { User } from "@/types";
import { i18n } from "@/app/_layout";

export const PromptCard = ({user, order}: {user: User, order: number}) => {
    const prompt = getActivePromptByOrder(user, order);
    if (!prompt) return null 
    const question = i18n.t(`onboarding.moreAboutYou.profilePrompts.prompts.${prompt.id}.question`)
    const answer = prompt.answer
    
    return (
        <Box className="bg-background-50 rounded-lg px-5 py-11 gap-4">
            <Text className="font-roboto font-medium text-typography-500 leading-[18.75px]">
                {question}
            </Text>
            <Heading className="font-roboto font-medium text-typography-950 text-2xl leading-[37.5px]">
                {answer}
            </Heading>
        </Box>
    );
};


function getActivePromptByOrder(user: User, order: number) {
    const activePrompts = user.prompts.filter(prompt => prompt.active);
    return activePrompts[order - 1] ?? null;
}




export const FavoriteCard = ({user, order}: {user: User, order: number}) => {
    const favorite = getActiveFavoriteByOrder(user, order);
    if (!favorite) return null 
    const question = i18n.t(`onboarding.moreAboutYou.profileFavorites.options.${favorite.id}.question`)
    const answer = favorite.answer
    
    return (
        <Box className="bg-background-50 rounded-lg px-5 py-11 gap-4">
            <Text className="font-roboto font-medium text-typography-500 leading-[18.75px]">
                {question}
            </Text>
            <Heading className="font-roboto font-medium text-typography-950 text-2xl leading-[37.5px]">
                {answer}
            </Heading>
        </Box>
    );
};

function getActiveFavoriteByOrder(user: User, order: number) {
    const activeFavorites = user.favorites.filter(favorite => favorite.active);
    return activeFavorites[order - 1] ?? null;
}
