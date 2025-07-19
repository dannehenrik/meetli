import { Box } from "@/components/ui/box"
import { Spinner } from "@/components/ui/spinner";
import { User } from "@/types";
import { Image } from "expo-image"
import { useEffect, useState } from "react";
export default function ProfileImage({user, order} : {user: User, order: number}) {
    const [pictureReady, setPictureReady] = useState(false);
      useEffect(() => {
        
        const timeout = setTimeout(() => {
            setPictureReady(true);
        }, 500); // simulate a delay for loading or animation
        

        return () => clearTimeout(timeout);
    
      }, []);

    const image = user.images[order - 1]
    
    if (!image) return null

    if (!pictureReady) return <Spinner/>


    return (
        <Box className="w-full rounded-lg aspect-square overflow-hidden">
            <Image
            alt="profile-image-4"
            contentFit="cover"
            cachePolicy="memory"
            source={image.url}
                style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
            }}
            />
        </Box>
    )
}