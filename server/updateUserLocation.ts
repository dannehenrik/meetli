import { checkAndFetchCoordinates } from "@/utils/getLocation";
import { supabase } from "@/utils/supabase";


export async function updateUserLocation(userId: string) {
    const coordinates = await checkAndFetchCoordinates();

    if (!coordinates) return

    const point = `POINT(${coordinates.longitude} ${coordinates.latitude})`

    const {error} = await supabase
        .from('users')
        .update({location: {latitude: coordinates.latitude, longitude: coordinates.longitude}, location_point: point})
        .eq('id', userId);

    if (error) throw new Error("Something went wrong when updating the user location: " + error.message);

}