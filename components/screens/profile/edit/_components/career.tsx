import { i18n } from "@/app/_layout";

import { Box } from "@/components/ui/box";

import { Text } from "@/components/ui/text";
import { EducationSection } from "./_sections/education";
import { OccupationSection } from "./_sections/occupation";


export function CareerSections() {

    return (
        <Box className="gap-1">
            <Text className="text-typography-950 text-base font-medium mb-1">
                {i18n.t("editProfile.titles.career")}
            </Text>

            <EducationSection/>
            <OccupationSection/>
   
        </Box>
    );
}

