import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ONBOARDING_BASE_PAGES, ONBOARDING_PAGES } from '@/constants/constants';


const BAR_WIDTH = 200; // Adjust as needed

export function ProgressBar({ pathName }: { pathName: string }) {

    const onboardingRoutes = [
        { progress: null, route: "/sign-in" },
        { progress: null, route: "/sign-in/onboarding/email" },
        { progress: null, route: "/sign-in/onboarding/otp" },
        { progress: null, route: "/sign-in/onboarding/verified" },
        { progress: 0, route: "/sign-in/onboarding/name" },
        { progress: 1, route: "/sign-in/onboarding/date-of-birth" },
        { progress: 2, route: "/sign-in/onboarding/gender" },
        { progress: 3, route: "/sign-in/onboarding/interest" },
        { progress: 4, route: "/sign-in/onboarding/looking-for" },
        { progress: 5, route: "/sign-in/onboarding/location" },
        { progress: 6, route: "/sign-in/onboarding/pictures" },
        { progress: null, route: "/sign-in/onboarding/profile-base-completed" },
        { progress: 0, route: "/sign-in/onboarding/more-about-you/intro" },
        { progress: 1, route: "/sign-in/onboarding/more-about-you/interests" },
        { progress: 2, route: "/sign-in/onboarding/more-about-you/training-habits" },
        { progress: 3, route: "/sign-in/onboarding/more-about-you/food-choice" },
        { progress: 4, route: "/sign-in/onboarding/more-about-you/smoking-habits" },
        { progress: 5, route: "/sign-in/onboarding/more-about-you/drinking-habits" },
        { progress: 6, route: "/sign-in/onboarding/more-about-you/religion" },
        { progress: 7, route: "/sign-in/onboarding/more-about-you/political-view" },
    ];

    const currentRoute = onboardingRoutes.find(r => r.route === pathName);
    const isVisible = currentRoute?.progress !== null;

    const isBaseOnboarding = !pathName.startsWith("/sign-in/onboarding/more-about-you");
    const maxSteps = isBaseOnboarding ? ONBOARDING_BASE_PAGES : ONBOARDING_PAGES;

    const progressPercent = ((currentRoute?.progress ?? 0) / maxSteps) * 100;

    // Reanimated shared value
    const progress = useSharedValue(0);

    // Animate to new progress when pathName changes
    useEffect(() => {
        if (isVisible) {
            progress.value = withTiming(progressPercent, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            });
        }
    }, [progressPercent, isVisible]);

    // Animated style for bar width
    const progressStyle = useAnimatedStyle(() => {
        return {width: `${progress.value}%`};
    });

    return (
        <View style={[styles.container, {opacity: isVisible ? 100 : 0}]}>
            <View style={styles.backgroundBar}>
                <Animated.View style={[styles.filledBar, progressStyle, {backgroundColor: "#be185d"}]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    backgroundBar: {
        width: BAR_WIDTH,
        height: 6,
        backgroundColor: '#e5e7eb', // Tailwind gray-200
        borderRadius: 999,
        overflow: 'hidden',
    },
    filledBar: {
        height: '100%',
        borderRadius: 999,
    },
});
