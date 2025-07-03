// import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
// import { useRouter, usePathname } from "expo-router";
// import { ChevronRight } from "lucide-react-native";
// import { useFab } from "./FabContext";
// import { Spinner } from "@/components/ui/spinner";
// import { i18n } from "@/app/_layout";
// import * as Haptics from 'expo-haptics';


// export default function FloatingFab() {
//     const router = useRouter();
//     const pathname = usePathname();
//     const { isDisabled = false, onPress, label, isLoading } = useFab().fabState;

//     const defaultText = getDefaultFabLabel(pathname);
//     function defaultOnPress() {
//         const nextRoute = getReroutePath(pathname);
//         if (nextRoute) {
//             router.push(nextRoute);
//         }
//     }

//     const currentLabel = label ?? defaultText

//     return (
//         <Fab
//         size={currentLabel ? "md" : "lg"}
//         disabled={isDisabled ?? false}
//         onPress={() => { 
//             // Haptics.selectionAsync();
//             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              
//             (onPress ?? defaultOnPress)() 
//         }}
//         className="bg-background-950 rounded-lg data-[active=true]:bg-background-900"
//         >
//             {isLoading ? (
//                 <Spinner/>
//             ) : (
//             <>
//             {(label || defaultText) && (
//                 <FabLabel>{label ?? defaultText}</FabLabel>
//             )}
//                 <FabIcon as={ChevronRight} />
//             </>
//             )}
//         </Fab>
//     )
// }


// const onboardingRoutes = [
//     "/sign-in/onboarding/email",
//     "/sign-in/onboarding/otp",
//     "/sign-in/onboarding/verified",
//     "/sign-in/onboarding/name",
//     "/sign-in/onboarding/date-of-birth",
//     "/sign-in/onboarding/gender",
//     "/sign-in/onboarding/interest",
//     "/sign-in/onboarding/looking-for",
//     "/sign-in/onboarding/location",
//     "/sign-in/onboarding/pictures",
//     "/sign-in/onboarding/profile-base-completed",
// ] as const;

// function getDefaultFabLabel(pathname: string) {
//     const shortPath = pathname.replace("/sign-in/onboarding/", "");
//     switch (shortPath) {
//         case "email":
//             return i18n.t('onboarding.fab.sendCode')
//         case "otp":
//             return i18n.t('onboarding.fab.verify')
//         case "verified":
//             return i18n.t('onboarding.fab.enterDetails')
//         case "profile-base-completed":
//             return i18n.t('onboarding.fab.continue')
//         default:
//             return null
//     }
// }

// function getReroutePath(pathname: string) {
//     const currentIndex = onboardingRoutes.findIndex((route) => route === pathname);
//     return onboardingRoutes[currentIndex + 1];
// }



import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useFab } from './FabContext';
import { Spinner } from '@/components/ui/spinner';
import { i18n } from '@/app/_layout';
import { useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { triggerHaptic } from '@/utils/haptics';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AnimatedFloatingFab() {
    const router = useRouter();
    const pathname = usePathname();
    const { isDisabled, onPress, label, isLoading } = useFab().fabState;

    const colorTheme = useColorScheme();
    // const backgroundColor = colorTheme === 'dark' ? '#ffffff' : '#1a1a1a';  // dark bg vs light bg
    const backgroundColor = colorTheme === 'dark' ? '#ffffff' : '#000000';  // dark bg vs light bg
    const textColor = colorTheme === 'dark' ? '#000000' : '#ffffff';        // white text vs black text
    const iconColor = colorTheme === 'dark' ? '#000000' : '#ffffff';

    // Disabled styles
    const disabledBgColor = colorTheme === 'dark' ? '#cccccc' : '#333333';
    const disabledTextColor = colorTheme === 'dark' ? '#888888' : '#aaaaaa';
    const disabledIconColor = disabledTextColor;

    
    const defaultText = getDefaultFabLabel(pathname);
    const currentLabel = label ?? defaultText;
    const hasLabel = Boolean(currentLabel);
    
    // Animated values
    const labelAnimation = useSharedValue(hasLabel ? 1 : 0);
    const fabWidth = useSharedValue(hasLabel ? 200 : 56); // Increased width for full text
    
    // Less bouncy spring configuration
    const bouncySpringConfig = {
        damping: 18,
        stiffness: 180,
        mass: 1.2,
    };
    
    useEffect(() => {
        if (hasLabel) {
        labelAnimation.value = withSpring(1, bouncySpringConfig);
        // Dynamic width calculation based on text length
        const estimatedWidth = Math.max(140, (currentLabel?.length || 0) * 8 + 60);
        fabWidth.value = withSpring(estimatedWidth, bouncySpringConfig);
        } else {
        labelAnimation.value = withSpring(0, bouncySpringConfig);
        fabWidth.value = withSpring(56, bouncySpringConfig);
        }
    }, [hasLabel, currentLabel]);
    
    function defaultOnPress() {
        const nextRoute = getReroutePath(pathname);
        if (nextRoute) {
            router.push(nextRoute);
        }
    }
    
    // Animated styles
    const fabAnimatedStyle = useAnimatedStyle(() => {
        return {
        width: fabWidth.value,
        transform: [
            {
            scale: interpolate(
                labelAnimation.value,
                [0, 1],
                [1, 1.05],
                Extrapolation.CLAMP
            ),
            },
        ],
        };
    });
    
    const labelAnimatedStyle = useAnimatedStyle(() => {
        return {
        opacity: interpolate(
            labelAnimation.value,
            [0, 0.98, 1],
            [0, 0, 1],
            Extrapolation.CLAMP
        ),
        transform: [
            {
            translateX: interpolate(
                labelAnimation.value,
                [0, 1],
                [20, 0],
                Extrapolation.CLAMP
            ),
            },
            {
            scale: interpolate(
                labelAnimation.value,
                [0, 0.5, 1],
                [0.9, 0.95, 1],
                Extrapolation.CLAMP
            ),
            },
        ],
        };
    });
    
    const iconAnimatedStyle = useAnimatedStyle(() => {
        return {
        transform: [
            {
            translateX: interpolate(
                labelAnimation.value,
                [0, 1],
                [0, 6],
                Extrapolation.CLAMP
            ),
            },
            {
            rotate: interpolate(
                labelAnimation.value,
                [0, 1],
                [0, 5],
                Extrapolation.CLAMP
            ) + 'deg',
            },
        ],
        };
    });

    if (pathname === "/sign-in") return null

    return (
        <View style={styles.container}>
        <AnimatedTouchableOpacity
            style={[styles.fab, fabAnimatedStyle, {backgroundColor: isDisabled ? disabledBgColor : backgroundColor, opacity: isDisabled ? 0.6 : 1},
            ]}

            onPress={() => {
                if (isDisabled) return
                
                triggerHaptic("buttonImportant");
                (onPress ?? defaultOnPress)();
            }}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {isLoading ? (
            <View style={styles.spinnerContainer}>
                <Spinner />
            </View>
            ) : (
            <View style={styles.fabContent}>
                <Animated.View style={[styles.labelContainer, labelAnimatedStyle]}>
                {hasLabel && (
                    <Text style={[styles.fabLabel, {color: isDisabled ? disabledTextColor : textColor}]} numberOfLines={1}>

                    {currentLabel}
                    </Text>
                )}
                </Animated.View>
                <Animated.View style={iconAnimatedStyle}>
                <ChevronRight size={20} color={isDisabled ? disabledIconColor : iconColor} />
                </Animated.View>
            </View>
            )}
        </AnimatedTouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
  },
  fab: {
    height: 56,
    // backgroundColor: '#1a1a1a', // Equivalent to bg-background-950
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    flexShrink: 0, // Prevent text from shrinking
    textAlign: 'center',
  },
  labelContainer: {
    overflow: 'hidden', // Förhindrar "hackning"
  },
  spinnerContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Your existing helper functions
const onboardingRoutes = [
  "/sign-in/onboarding/email",
  "/sign-in/onboarding/otp",
  "/sign-in/onboarding/verified",
  "/sign-in/onboarding/name",
  "/sign-in/onboarding/date-of-birth",
  "/sign-in/onboarding/gender",
  "/sign-in/onboarding/interest",
  "/sign-in/onboarding/looking-for",
  "/sign-in/onboarding/location",
  "/sign-in/onboarding/pictures",
  "/sign-in/onboarding/profile-base-completed",
] as const;

function getDefaultFabLabel(pathname: string) {
  const shortPath = pathname.replace("/sign-in/onboarding/", "");
  switch (shortPath) {
    case "email":
      return i18n.t('onboarding.fab.sendCode');
    case "otp":
      return i18n.t('onboarding.fab.verify');
    case "verified":
      return i18n.t('onboarding.fab.enterDetails');
    case "profile-base-completed":
      return i18n.t('onboarding.fab.continue');
    default:
      return null;
  }
}

function getReroutePath(pathname: string) {
  const currentIndex = onboardingRoutes.findIndex((route) => route === pathname);
  return onboardingRoutes[currentIndex + 1];
}