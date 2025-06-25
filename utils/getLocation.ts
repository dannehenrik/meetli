import { LocationType } from "@/types";
import * as Location from "expo-location";

export async function getCoordinates() : Promise<LocationType> {
    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    return {latitude: latitude, longitude: longitude}
}


export async function checkAndFetchCoordinates() : Promise<LocationType | null>{
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null

    const loc = await Location.getCurrentPositionAsync({});

    return loc.coords
}

interface LocationObject {
    placeName: string,
    coordinates: {latitude: number, longitude: number}
}

export async function checkAndFetchLocation() : Promise<LocationObject | null>{
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null

    const loc = await Location.getCurrentPositionAsync({});
    const reverse = await Location.reverseGeocodeAsync(loc.coords);

    const place = reverse?.[0];
    const placeName = `${place?.city ?? ""}, ${place?.region ?? ""}`;

    return {placeName: placeName, coordinates: loc.coords}
}


