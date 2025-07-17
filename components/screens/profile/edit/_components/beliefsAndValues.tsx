import { i18n } from "@/app/_layout";

import { Box } from "@/components/ui/box";

import { Text } from "@/components/ui/text";
import { ReligionSection } from "./_sections/religion";
import { PoliticsSection } from "./_sections/politics";


export function BeliefsAndValuesSections() {

    return (
        <Box className="gap-1">
            <Text className="text-typography-950 text-base font-medium mb-1">
                {i18n.t("editProfile.titles.beliefsAndValues")}
            </Text>

            <ReligionSection/>
            <PoliticsSection/>
   
        </Box>
    );
}

