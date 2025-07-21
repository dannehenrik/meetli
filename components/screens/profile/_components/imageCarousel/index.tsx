import { Spinner } from "@/components/ui/spinner";
import { User } from "@/types";
import { Image } from "expo-image";
import { Box } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const screenWidth = Dimensions.get("window").width;

export default function ImageCarousel({user, shouldLoad }: {user: User, shouldLoad?: boolean }) {
  const [picturesReady, setPicturesReady] = useState(false);
  
  useEffect(() => {
    if (shouldLoad) {
      const timeout = setTimeout(() => {
        setPicturesReady(true);
      }, 500); // simulate a delay for loading or animation
      return () => clearTimeout(timeout);
    }
  }, [shouldLoad]);

  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const horizontalPadding = 16;
  const carouselWidth = screenWidth - horizontalPadding * 2;
  const data = user?.images.slice(0, 3) ?? [];

  if (!user || (shouldLoad && !picturesReady)) return (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: horizontalPadding,
    }}
  >
    <View
      style={{
        width: carouselWidth,
        height: carouselWidth,
        position: 'relative',
      }}
    >
      {/* <Image
        source={user.images[0]?.url}
        alt="profile-carousel"
        contentFit="cover"
        cachePolicy="memory"
        blurRadius={20}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 20,
        }}
      /> */}

      {/* Overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 20,
          zIndex: 10,
        }}
      >
        <Spinner />
      </View>
    </View>
  </View>
);


  

  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', // Center the carousel container
      paddingHorizontal: horizontalPadding // Apply padding to the parent
    }}>
      {/* Carousel with overlayed pagination */}
      <View style={{ 
        width: carouselWidth, 
        height: carouselWidth, 
        position: "relative" 
      }}>
        <Carousel
          ref={ref}
          width={carouselWidth}
          height={carouselWidth}
          
          data={data}
          onProgressChange={progress}
          loop={true}
          style={{borderRadius: 20}}
          renderItem={({ item }) => (
            <Image
              source={item.url ?? undefined}
              placeholder={require("@/assets/images/placeholder-image.webp")}
              placeholderContentFit="cover"
              allowDownscaling
              alt="profile-carousel"
              contentFit="cover"
              cachePolicy="memory"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
              }}
            />
          )}
        />
        {/* Overlayed pagination at bottom center */}
        <View
  style={{
    position: "absolute",
    bottom: 12,
    left: 150,
    right: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
  }}
>
  <Pagination.Basic
    progress={progress}
    data={data}
    dotStyle={{
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      width: 8,
      height: 8,
      borderRadius: 4,
    }}
    containerStyle={{ gap: 6 }}
    onPress={onPressPagination}
  />
</View>

      </View>
    </View>
  );
}