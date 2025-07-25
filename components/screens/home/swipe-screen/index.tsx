import React, { useCallback, useEffect, useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ThreeDotsIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Badge } from "@/components/ui/badge";
import { ImageBackground } from "@/components/ui/image-background";
import { LinearGradient } from "expo-linear-gradient";
import { LocationBadge, LoveBadge } from "@/components/shared/badge";
import { Text } from "@/components/ui/text";

import { HeartIcon } from "@/components/shared/icons";
import { CloseIcon } from "@/components/ui/icon";
import { LoveMatchBottomSheet } from "@/components/screens/home/love-match";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  withTiming,
  FadeInDown,
  withSequence,
  withDelay,
  interpolateColor,
  Easing,
  FadeOut,
  SlideInUp,
  SlideOutUp,
} from "react-native-reanimated";
import { Dimensions, useColorScheme } from "react-native";
import { ProfileScreen } from "../../profile";
import { SwipeType, User } from "@/types";
import { supabase } from "@/utils/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { useAwesomeToast } from "@/hooks/toasts";
import { i18n } from "@/app/_layout";
import { handleSwipeUpload } from "./handleSwipeUpload";
import { triggerHaptic } from "@/utils/haptics";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedText = Animated.createAnimatedComponent(Text);

// Pre-warm the animation system
Animated.addWhitelistedNativeProps({ text: true });

// Improved ActionFeedback component with better animations
const ActionFeedback = React.memo(({ 
    action, 
    visible, 
    onComplete 
    }: { 
    action: SwipeType | null, 
    visible: boolean,
    onComplete: () => void 
    }) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const rotation = useSharedValue(-10);

    React.useEffect(() => {
        if (visible && action) {
        // Animate in
        scale.value = withSequence(
            withTiming(1.3, { duration: 200, easing: Easing.back(2) }),
            withTiming(1, { duration: 150 })
        );
        opacity.value = withTiming(1, { duration: 200 });
        rotation.value = withSpring(0, { damping: 8 });

        // Auto-hide after 1.2 seconds
        const timeout = setTimeout(() => {
            scale.value = withTiming(0.8, { duration: 200 });
            opacity.value = withTiming(0, { 
            duration: 200,
            easing: Easing.out(Easing.quad)
            }, (finished) => {
            if (finished) {
                runOnJS(onComplete)();
            }
            });
        }, 1200);

        return () => clearTimeout(timeout);
        } else {
        // Reset when not visible
        scale.value = 0;
        opacity.value = 0;
        rotation.value = -10;
        }
    }, [visible, action]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
        ],
        opacity: opacity.value,
    }));

    if (!visible || !action) return null;

    return (
        <Box className="absolute inset-0 justify-center items-center z-50 pointer-events-none">
            <AnimatedBox style={animatedStyle}>
                <Box className={`
                px-8 py-4 rounded-2xl shadow-2xl items-center justify-center
                ${action === 'like' ? 'bg-red-500/90' : 'bg-gray-600/90'}
                `}>
                <Text className="text-white text-2xl font-bold mb-1">
                    {action === 'like' ? '💕' : '👋'}
                </Text>
                <Text className="text-white text-lg font-semibold">
                    {action === 'like' ? 'Liked!' : 'Passed'}
                </Text>
                </Box>
            </AnimatedBox>
        </Box>
    );
});

// SwipeCard interface for better type safety
interface SwipeCardRef {
  triggerDislike: () => void;
  triggerLike: () => void;
  resetPosition: () => void;
}

type SwipeCardProps = {
    user: User;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    isActive?: boolean;
    ref?: React.RefObject<SwipeCardRef>;
};

const SwipeCard = React.forwardRef<SwipeCardRef, SwipeCardProps>(({
    user,
    onSwipeLeft,
    onSwipeRight,
    isActive = false,
}, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const resetPosition = useCallback(() => {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
        rotation.value = withSpring(0, { damping: 15, stiffness: 150 });
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
        opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, []);

    const triggerDislike = useCallback(() => {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.2, { 
          duration: 600, 
          easing: Easing.out(Easing.cubic) 
        });
        translateY.value = withTiming(-50, { duration: 300 });
        rotation.value = withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(-25, { duration: 500 })
        );
        scale.value = withSequence(
          withTiming(1.02, { duration: 100 }),
          withTiming(0.8, { duration: 500 })
        );
        opacity.value = withTiming(0, { 
          duration: 600 
        }, (finished) => {
          if (finished && onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          }
        });
    }, [onSwipeLeft]);

    const triggerLike = useCallback(() => {
        translateX.value = withTiming(SCREEN_WIDTH * 1.2, { 
          duration: 600,
          easing: Easing.out(Easing.cubic) 
        });
        translateY.value = withTiming(20, { duration: 300 });
        rotation.value = withSequence(
          withTiming(5, { duration: 100 }),
          withTiming(25, { duration: 500 })
        );
        scale.value = withSequence(
          withTiming(1.05, { duration: 150, easing: Easing.back(2) }),
          withTiming(1.02, { duration: 100 }),
          withTiming(0.9, { duration: 450 })
        );
        opacity.value = withTiming(0, { 
          duration: 600 
        }, (finished) => {
          if (finished && onSwipeRight) {
            runOnJS(onSwipeRight)();
          }
        });
    }, [onSwipeRight]);

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
        triggerDislike,
        triggerLike,
        resetPosition,
    }), [triggerDislike, triggerLike, resetPosition]);

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotation.value}deg` },
                { scale: scale.value },
            ],
            opacity: opacity.value,
        };
    });

    const overlayStyle = useAnimatedStyle(() => {
        const overlayOpacity = Math.min(Math.abs(translateX.value) / (SCREEN_WIDTH * 0.2), 0.3);
        const isLike = translateX.value > 0;
        
        return {
            opacity: overlayOpacity,
            backgroundColor: isLike ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 114, 128, 0.3)',
        };
    });

    return (
        <AnimatedBox
            entering={FadeIn.duration(300)}
            className="absolute left-0 right-0 top-0 bottom-0 bg-background-0 rounded-3xl overflow-hidden"
            style={rStyle}
        >
            <AnimatedBox 
                className="absolute inset-0 rounded-3xl"
                style={overlayStyle}
            />
            
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Box className="flex-1 gap-5 w-full pt-0 pb-20">
                    <ProfileScreen user={user} />
                </Box>
            </ScrollView>
        </AnimatedBox>
    );
});

const ChooseButtonLayout = React.memo(({
    onSwipeLeft,
    onSwipeRight,
    disabled = false,
}: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    disabled?: boolean;
}) => {
    const theme = useColorScheme();
    
    const dislikeScale = useSharedValue(1);
    const likeScale = useSharedValue(1);
    
    const BUTTON_STYLES = {
        base: "h-[56px] w-[99px] rounded-lg",
        left: "bg-typography-950 data-[active=true]:bg-typography-800",
        right: "",
    };

    const animateButton = useCallback((scaleValue: Animated.SharedValue<number>) => {
        scaleValue.value = withSequence(
            withTiming(0.9, { duration: 100 }),
            withSpring(1.1, { damping: 3 }),
            withTiming(1, { duration: 200 })
        );
    }, []);

    const dislikeButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: dislikeScale.value }],
    }));

    const likeButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: likeScale.value }],
    }));

    const handleDislike = useCallback(() => {
        if (disabled) return;
        animateButton(dislikeScale);
        onSwipeLeft?.();
    }, [onSwipeLeft, animateButton, disabled]);

    const handleLike = useCallback(() => {
        if (disabled) return;
        animateButton(likeScale);
        onSwipeRight?.();
    }, [onSwipeRight, animateButton, disabled]);

    return (
        <LinearGradient
            colors={theme === "dark" ? ["#12121200", "#121212"] : ["#FFFFFF00", "#FFFFFF"]}
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: 24,
                paddingBottom: 24,
                paddingTop: 16,
                zIndex: 50
            }}
        >
            <HStack className="justify-center items-center gap-4">
                <Animated.View style={dislikeButtonStyle}>
                    <Button
                        className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.left}`}
                        size="xl"
                        onPress={handleDislike}
                        disabled={disabled}
                    >
                        <ButtonIcon as={CloseIcon} className="w-6 h-6" />
                    </Button>
                </Animated.View>
                
                <Animated.View style={likeButtonStyle}>
                    <Button
                        className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.right}`}
                        size="xl"
                        onPress={handleLike}
                        disabled={disabled}
                    >
                        <ButtonIcon
                            as={HeartIcon}
                            className="w-6 h-6 text-white fill-white stroke-white"
                        />
                    </Button>
                </Animated.View>
            </HStack>
        </LinearGradient>
    );
});

export default function SwipeScreen({ setSwipeFunctions }: { setSwipeFunctions?: (left: () => void, right: () => void) => void }) {
    const queryClient = useQueryClient();
    const { showErrorToast } = useAwesomeToast();

    // Refs for card control
    const currentCardRef = useRef<SwipeCardRef>(null);

    const { data: users, error, isPending } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 1000 * 60 * 15
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEndReached, setIsEndReached] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentAction, setCurrentAction] = useState<SwipeType | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const advanceToNextCard = useCallback(() => {
        setCurrentIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= (users ?? []).length) {
                setIsEndReached(true);
            }
            return nextIndex;
        });
    }, [users?.length]);


    const currentUser = users?.[currentIndex];
    const nextUser = users?.[currentIndex + 1];

    const showActionFeedback = useCallback((action: SwipeType) => {
        setCurrentAction(action);
        setShowFeedback(true);
    }, []);

    const hideActionFeedback = useCallback(() => {
        setShowFeedback(false);
        setCurrentAction(null);
    }, []);

    const swipeMutation = useMutation({
        mutationFn: async ({ userId, type }: { userId: string; type: SwipeType }) => {
            await handleSwipeUpload(userId, type);
        },
        onError: (error) => {
            console.error("Swipe error:", error.message);
            showErrorToast(i18n.t("messages.error.somethingWentWrong"));
            
            // Hide feedback and reset card position
            setShowFeedback(false);
            setCurrentAction(null);
            
            // Reset card animation
            setTimeout(() => {
                currentCardRef.current?.resetPosition();
            }, 100);
        },
        onSuccess: () => {
            
            // Only advance on successful upload
            setTimeout(() => {
                advanceToNextCard()
            }, 600); // Wait for animation to complete
        },
    });

    const handleDislike = useCallback(() => {
        if (swipeMutation.isPending || !currentUser?.id) return;
        
        showActionFeedback('pass');
        triggerHaptic("buttonImportant")
        currentCardRef.current?.triggerDislike();
        swipeMutation.mutate({ userId: currentUser.id, type: "pass" });
    }, [currentUser?.id, swipeMutation.isPending, swipeMutation.mutate, showActionFeedback]);

    const handleLike = useCallback(() => {
        if (swipeMutation.isPending || !currentUser?.id) return;
        
        showActionFeedback('like');
        triggerHaptic("success")
        currentCardRef.current?.triggerLike();
        swipeMutation.mutate({ userId: currentUser.id, type: "like" });
    }, [currentUser?.id, swipeMutation.isPending, swipeMutation.mutate, showActionFeedback]);

    // Use useRef to store the latest functions and avoid infinite re-renders
    const swipeFunctionsRef = useRef({ dislike: handleDislike, like: handleLike });
    swipeFunctionsRef.current = { dislike: handleDislike, like: handleLike };

    React.useEffect(() => {
        if (setSwipeFunctions) {
            setSwipeFunctions(
                () => swipeFunctionsRef.current.dislike(),
                () => swipeFunctionsRef.current.like()
            );
        }
    }, [setSwipeFunctions]);

    // This is not currently working as it should... It only looks like it
    const refetch = useCallback(() => {
        console.log("Refetch!");
        setCurrentIndex(0);
        setIsEndReached(false);
        queryClient.invalidateQueries({ queryKey: ['users'] });
    }, [queryClient]);

    // Error state
    if (error) {
        return (
            <AnimatedBox
                className="flex-1 justify-center items-center p-4"
                entering={FadeInDown.duration(400)}
            >
                <Box className="items-center gap-6">
                    <Heading size="2xl" className="text-center">
                        Oops, something went wrong!
                    </Heading>
                    <Text className="text-typography-500 text-center">
                        {error.message || "We couldn't load user data. Please check your connection and try again."}
                    </Text>
                    <Button 
                        onPress={refetch} 
                        className="mt-4"
                        variant="outline"
                    >
                        <ButtonText>Retry</ButtonText>
                    </Button>
                </Box>
            </AnimatedBox>
        );
    }

    // Loading state
    if (isPending) {
        return (
            <AnimatedBox
                className="flex-1 justify-center items-center p-4"
                entering={FadeInDown.duration(400)}
            >
                <Box className="items-center gap-4">
                    <Spinner size="large" />
                    <Text className="text-typography-400">
                        Finding great matches for you...
                    </Text>
                </Box>
            </AnimatedBox>
        );
    }

    // End reached state
    if (isEndReached || !currentUser) {
        return (
            <AnimatedBox
                className="flex-1 justify-center items-center p-4"
                entering={FadeInDown.duration(400)}
            >
                <Box className="items-center gap-6">
                    <Heading size="2xl" className="text-center">
                        You've seen everyone!
                    </Heading>
                    <Text className="text-typography-500 text-center">
                        There are no more profiles in your area right now. 
                        New people join regularly, so check back soon!
                    </Text>
                    <Button 
                        onPress={refetch} 
                        className="mt-4"
                        variant="outline"
                    >
                        <ButtonText>Check for new matches</ButtonText>
                    </Button>
                </Box>
            </AnimatedBox>
        );
    }

    return (
        <Box className="flex-1 relative">
            <AnimatedBox
                className="flex-1"
                entering={FadeInDown.duration(400).delay(400)}
            >
                {nextUser && (
                    <SwipeCard
                        key={`${currentIndex + 1}-${nextUser.id}`}
                        user={nextUser}
                        isActive={false}
                    />
                )}
                
                <SwipeCard
                    key={`${currentIndex}-${currentUser.id}`}
                    ref={currentCardRef}
                    user={currentUser}
                    isActive={true}
                />
            </AnimatedBox>

            {isReady && (
                <ActionFeedback 
                    action={currentAction}
                    visible={showFeedback}
                    onComplete={hideActionFeedback}
                />
            )}
            
            <ChooseButtonLayout 
                onSwipeLeft={handleDislike} 
                onSwipeRight={handleLike}
                disabled={swipeMutation.isPending}
            />
        </Box>
    );
}

async function fetchUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*, ...user_additional_info(*, interests:user_interests(interest))');

    if (error) {
        throw new Error("Something went wrong when fetching users: " + error.message);
    }

    if (!data) return [];

    return data;
}