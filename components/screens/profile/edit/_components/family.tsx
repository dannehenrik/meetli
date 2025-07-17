import { i18n } from "@/app/_layout";

import { Box } from "@/components/ui/box";

import { Text } from "@/components/ui/text";
import { ChildrenSection } from "./_sections/children";
import { PetsSection } from "./_sections/pets";


export function FamilySections() {

    return (
        <Box className="gap-1">
            <Text className="text-typography-950 text-base font-medium mb-1">
                {i18n.t("editProfile.titles.family")}
            </Text>

            <ChildrenSection/>
            <PetsSection/>
   
        </Box>
    );
}

