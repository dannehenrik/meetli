import * as Location from "expo-location";

interface LocationObject {
    placeName: string,
    coordinates: {latitude: number, longitude: number}
}
export async function getLocation() : Promise<LocationObject | null>{
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null

    const loc = await Location.getCurrentPositionAsync({});
    const reverse = await Location.reverseGeocodeAsync(loc.coords);

    const place = reverse?.[0];
    const placeName = `${place?.city ?? ""}, ${place?.region ?? ""}`;

    return {placeName: placeName, coordinates: loc.coords}
}