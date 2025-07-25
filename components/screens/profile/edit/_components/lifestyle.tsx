import { i18n } from "@/app/_layout";

import { Box } from "@/components/ui/box";

import { Text } from "@/components/ui/text";
import { SmokingSection } from "./_sections/smoking";
import { DrinkingSection } from "./_sections/drinking";
import { TrainingSection } from "./_sections/training";
import { FoodSection } from "./_sections/food";
import { ReligionSection } from "./_sections/religion";
import { PoliticsSection } from "./_sections/politics";
import { ChildrenSection } from "./_sections/children";
import { PetsSection } from "./_sections/pets";
import { EducationSection } from "./_sections/education";
import { OccupationSection } from "./_sections/occupation";


export function LifestyleSections() {

    return (
        <Box className="gap-1">
            <Text className="text-typography-950 text-base font-medium mb-1">
                {i18n.t("editProfile.titles.lifestyle")}
            </Text>

            <SmokingSection/>
            <DrinkingSection/>
            <TrainingSection/>
            <FoodSection/>
   
        </Box>
    );
}

