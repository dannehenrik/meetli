import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';



import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop } from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

// Supabase
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
	
function ActionSheetTest(){
        const [showActionsheet, setShowActionsheet] = React.useState(false);
        const handleClose = () => setShowActionsheet(false);
          return (
            <>
              <Button onPress={() => setShowActionsheet(true)}>
                <ButtonText>Open Actionsheet</ButtonText>
              </Button>
              <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                  <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                  </ActionsheetDragIndicatorWrapper>
                  <ActionsheetItem onPress={handleClose}>
                    <ActionsheetItemText>Edit Message</ActionsheetItemText>
                  </ActionsheetItem>
                  <ActionsheetItem onPress={handleClose}>
                    <ActionsheetItemText>Mark Unread</ActionsheetItemText>
                  </ActionsheetItem>
                  <ActionsheetItem onPress={handleClose}>
                    <ActionsheetItemText>Remind Me</ActionsheetItemText>
                  </ActionsheetItem>
                  <ActionsheetItem onPress={handleClose}>
                    <ActionsheetItemText>Add to Saved Items</ActionsheetItemText>
                  </ActionsheetItem>
                  <ActionsheetItem isDisabled onPress={handleClose}>
                    <ActionsheetItemText>Delete</ActionsheetItemText>
                  </ActionsheetItem>
                </ActionsheetContent>
              </Actionsheet>
            </>
          );
        }

export default function SettingsScreen() {

    const {data, error, isPending, refetch} = useQuery({
        queryKey: ["test"],
        queryFn: async () => await fetchTestData()
    })

    useRefreshOnFocus(refetch)
    

    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#F9A18E', dark: '#353636' }}
        headerImage={
            <IconSymbol
            size={310}
            color="#FF5733"
            name="gearshape"
            style={styles.headerImage}
            />
        }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Inställningar</ThemedText>
            </ThemedView>
            <ActionSheetTest/>
            {error && <ThemedText lightColor='#f54242'>Något gick fel...</ThemedText>}
            {isPending && ( <ThemedText>Laddar...</ThemedText>)}
            
            {data && data.map((d, i) => <ThemedText key={i}>{d}</ThemedText>)}
      
    </ParallaxScrollView>
  );
}

async function fetchTestData() : Promise<string[]>{
    console.log("Nu hämtades data")
    const {data, error} = await supabase.from('test').select('text')

    if (error) { throw new Error("Något gick fel när vi försökte hämta data: " + error.message)}

    return data.map((r) => r.text)
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
