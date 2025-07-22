import { supabase } from "@/utils/supabase";

export async function handleSwipeUpload(swipedUserId: string, swipeType: "like" | "pass") {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // throw new Error("Fake error!");
    const {error} = await supabase.from('swipes').insert({swiped_user: swipedUserId, swipe_type: swipeType});

    if (error) throw new Error("Something went wrong when adding swipe data: " + error.message)
}