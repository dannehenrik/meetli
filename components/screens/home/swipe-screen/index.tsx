import React, { useCallback, useEffect, useState } from "react";
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
import { User } from "@/types";
import { supabase } from "@/utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedText = Animated.createAnimatedComponent(Text);

// Pre-warm the animation system
Animated.addWhitelistedNativeProps({ text: true });

// Memoized ActionFeedback component
const ActionFeedback = React.memo(({ 
  action, 
  visible, 
  onComplete 
}: { 
  action: 'like' | 'dislike' | null, 
  visible: boolean,
  onComplete: () => void 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (visible && action) {
      // Reset values before animation
      scale.value = 0;
      opacity.value = 0;
      rotation.value = -10;
      
      // Start animation
      scale.value = withSequence(
        withTiming(1.3, { duration: 200, easing: Easing.back(2) }),
        withTiming(1, { duration: 150 })
      );
      opacity.value = withTiming(1, { duration: 200 });
      rotation.value = withSpring(0, { damping: 8 });

      const timeout = setTimeout(() => {
        scale.value = withTiming(0.8, { duration: 200 });
        opacity.value = withTiming(0, { 
          duration: 200,
          easing: Easing.out(Easing.quad)
        }, () => {
          runOnJS(onComplete)();
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
  }), []);

  return (
    <Box className="absolute inset-0 justify-center items-center z-50 pointer-events-none">
      <AnimatedBox 
        style={[animatedStyle, { display: visible && action ? 'flex' : 'none' }]}
      >
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

type SwipeCardProps = {
    user: User;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    isActive?: boolean;
};

const SwipeCard = React.memo(({
    user,
    onSwipeLeft,
    onSwipeRight,
    isActive = false,
}: SwipeCardProps) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

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
        }, () => {
          if (onSwipeLeft) {
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
        }, () => {
          if (onSwipeRight) {
            runOnJS(onSwipeRight)();
          }
        });
    }, [onSwipeRight]);

    React.useEffect(() => {
        if (isActive) {
            (SwipeCard as any).triggerDislike = triggerDislike;
            (SwipeCard as any).triggerLike = triggerLike;
        }
    }, [isActive, triggerDislike, triggerLike]);

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
    }, []);

    const overlayStyle = useAnimatedStyle(() => {
        const overlayOpacity = Math.min(Math.abs(translateX.value) / (SCREEN_WIDTH * 0.2), 0.3);
        const isLike = translateX.value > 0;
        
        return {
            opacity: overlayOpacity,
            backgroundColor: isLike ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 114, 128, 0.3)',
        };
    }, []);

    return (
        <AnimatedBox
            entering={FadeIn.duration(300)}
            className="absolute left-0 right-0 top-0 bottom-0 bg-background-0 rounded-3xl overflow-hidden"
            style={[rStyle]}
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
}: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
}) => {
    const theme = useColorScheme();
    const [isOpen, setIsOpen] = useState(false);
    
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
    }), []);

    const likeButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: likeScale.value }],
    }), []);

    const handleDislike = useCallback(() => {
        animateButton(dislikeScale);
        onSwipeLeft?.();
    }, [onSwipeLeft, animateButton]);

    const handleLike = useCallback(() => {
        animateButton(likeScale);
        onSwipeRight?.();
        setIsOpen(true);
    }, [onSwipeRight, animateButton]);

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
                    >
                        <ButtonIcon as={CloseIcon} className="w-6 h-6" />
                    </Button>
                </Animated.View>
                
                <Animated.View style={likeButtonStyle}>
                    <Button
                        className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.right}`}
                        size="xl"
                        onPress={handleLike}
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

    const {data: users, error, isPending} = useQuery({
        queryKey: ['users'],
        queryFn: () => fetchUsers(),
        staleTime: 1000 * 60 * 15
        
    })

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEndReached, setIsEndReached] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentAction, setCurrentAction] = useState<'like' | 'dislike' | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 300);
        return () => clearTimeout(timer);
    }, []);


    const handleSwipe = useCallback(() => {
        setTimeout(() => {
            setCurrentIndex((prev) => {
                const nextIndex = prev + 1;
                if (nextIndex >= (users ?? []).length) {
                    setIsEndReached(true);
                }
                return nextIndex;
            });
        }, 100);
    }, [users]);

    const currentUser = users?.[currentIndex];
    const nextUser = users?.[currentIndex + 1];

    const showActionFeedback = useCallback((action: 'like' | 'dislike') => {
        setCurrentAction(action);
        setShowFeedback(true);
    }, []);

    const hideActionFeedback = useCallback(() => {
        setShowFeedback(false);
        setCurrentAction(null);
    }, []);

    const handleDislike = useCallback(() => {
        showActionFeedback('dislike');
        if ((SwipeCard as any).triggerDislike) {
            (SwipeCard as any).triggerDislike();
        } else {
            handleSwipe();
        }
    }, [handleSwipe, showActionFeedback]);

    const handleLike = useCallback(() => {
        showActionFeedback('like');
        if ((SwipeCard as any).triggerLike) {
            (SwipeCard as any).triggerLike();
        } else {
            handleSwipe();
        }
    }, [handleSwipe, showActionFeedback]);

    React.useEffect(() => {
        if (setSwipeFunctions) {
            setSwipeFunctions(handleDislike, handleLike);
        }
    }, [setSwipeFunctions, handleDislike, handleLike]);

    function refetch() {
        console.log("Refetch!")
        queryClient.invalidateQueries({queryKey: ['users']})
    }

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
                    <ButtonText>
                    Retry
                    </ButtonText>
                </Button>
            </Box>
        </AnimatedBox>
    )
}


     if (isPending) return (
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
)

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
                    <ButtonText>
                    Check for new matches
                    </ButtonText>
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
                    user={currentUser}
                    onSwipeLeft={handleSwipe}
                    onSwipeRight={handleSwipe}
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
            />
        </Box>
    );
}

async function fetchUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*, ...user_additional_info(*, interests:user_interests(interest))');

    if (error) throw new Error("Something went wrong when fetching users: " + error.message);

    if (!data) return [];

    console.log("Nu hämtades mer user data");

    return data;
}