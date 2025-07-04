export interface InterestType {
    value: string,
    label: string,
    group: string,
}


export const interestsList: InterestType[] = [
    // 🏃 Sports & Fitness
    { value: "running", label: "Running", group: "Sports & Fitness" },
    { value: "yoga", label: "Yoga", group: "Sports & Fitness" },
    { value: "gym", label: "Gym Workouts", group: "Sports & Fitness" },
    { value: "cycling", label: "Cycling", group: "Sports & Fitness" },
    { value: "swimming", label: "Swimming", group: "Sports & Fitness" },
    { value: "football", label: "Football / Soccer", group: "Sports & Fitness" },
    { value: "basketball", label: "Basketball", group: "Sports & Fitness" },
    { value: "tennis", label: "Tennis", group: "Sports & Fitness" },
    { value: "hiking", label: "Hiking", group: "Sports & Fitness" },
    { value: "climbing", label: "Climbing", group: "Sports & Fitness" },
    { value: "pilates", label: "Pilates", group: "Sports & Fitness" },
    { value: "dancing", label: "Dancing", group: "Sports & Fitness" },
    { value: "martial_arts", label: "Martial Arts", group: "Sports & Fitness" },
    { value: "skiing", label: "Skiing / Snowboarding", group: "Sports & Fitness" },
    { value: "surfing", label: "Surfing", group: "Sports & Fitness" },
    { value: "golf", label: "Golf", group: "Sports & Fitness" },

    // 🎵 Arts & Culture
    { value: "live_music", label: "Live Music", group: "Arts & Culture" },
    { value: "concerts", label: "Concerts", group: "Arts & Culture" },
    { value: "theatre", label: "Theatre", group: "Arts & Culture" },
    { value: "museums", label: "Museums", group: "Arts & Culture" },
    { value: "photography", label: "Photography", group: "Arts & Culture" },
    { value: "painting", label: "Painting", group: "Arts & Culture" },
    { value: "design", label: "Design", group: "Arts & Culture" },
    { value: "fashion", label: "Fashion", group: "Arts & Culture" },
    { value: "tattoos", label: "Tattoos", group: "Arts & Culture" },
    { value: "writing", label: "Creative Writing", group: "Arts & Culture" },
    { value: "poetry", label: "Poetry", group: "Arts & Culture" },

    // 🍕 Food & Drink
    { value: "cooking", label: "Cooking", group: "Food & Drink" },
    { value: "baking", label: "Baking", group: "Food & Drink" },
    { value: "coffee", label: "Coffee Culture", group: "Food & Drink" },
    { value: "tea", label: "Tea Lover", group: "Food & Drink" },
    { value: "wine", label: "Wine Tasting", group: "Food & Drink" },
    { value: "cocktails", label: "Mixology / Cocktails", group: "Food & Drink" },
    { value: "vegan", label: "Vegan Cooking", group: "Food & Drink" },
    { value: "foodie", label: "Trying New Restaurants", group: "Food & Drink" },
    { value: "bbq", label: "BBQ", group: "Food & Drink" },
    { value: "breweries", label: "Craft Beer", group: "Food & Drink" },

    // 🎮 Hobbies & Games
    { value: "gaming", label: "Video Games", group: "Hobbies & Games" },
    { value: "board_games", label: "Board Games", group: "Hobbies & Games" },
    { value: "chess", label: "Chess", group: "Hobbies & Games" },
    { value: "puzzles", label: "Puzzles", group: "Hobbies & Games" },
    { value: "lego", label: "LEGO", group: "Hobbies & Games" },
    { value: "collecting", label: "Collecting", group: "Hobbies & Games" },
    { value: "trivia", label: "Trivia Nights", group: "Hobbies & Games" },
    { value: "magic", label: "Magic Tricks", group: "Hobbies & Games" },

    // 🎬 Entertainment
    { value: "movies", label: "Movies", group: "Entertainment" },
    { value: "tv_series", label: "TV Series", group: "Entertainment" },
    { value: "anime", label: "Anime", group: "Entertainment" },
    { value: "podcasts", label: "Podcasts", group: "Entertainment" },
    { value: "standup", label: "Stand-Up Comedy", group: "Entertainment" },
    { value: "youtube", label: "YouTube", group: "Entertainment" },
    { value: "true_crime", label: "True Crime", group: "Entertainment" },

    // ✈️ Travel & Adventure
    { value: "travel", label: "Traveling", group: "Travel & Adventure" },
    { value: "backpacking", label: "Backpacking", group: "Travel & Adventure" },
    { value: "road_trips", label: "Road Trips", group: "Travel & Adventure" },
    { value: "beaches", label: "Beaches", group: "Travel & Adventure" },
    { value: "camping", label: "Camping", group: "Travel & Adventure" },
    { value: "airbnb", label: "Airbnb Stays", group: "Travel & Adventure" },
    { value: "city_exploring", label: "City Exploring", group: "Travel & Adventure" },

    // 📚 Learning & Personal Growth
    { value: "reading", label: "Reading", group: "Learning & Growth" },
    { value: "languages", label: "Learning Languages", group: "Learning & Growth" },
    { value: "self_improvement", label: "Self Improvement", group: "Learning & Growth" },
    { value: "philosophy", label: "Philosophy", group: "Learning & Growth" },
    { value: "history", label: "History", group: "Learning & Growth" },
    { value: "finance", label: "Personal Finance", group: "Learning & Growth" },
    { value: "meditation", label: "Meditation", group: "Learning & Growth" },
    { value: "journaling", label: "Journaling", group: "Learning & Growth" },

    // 🧑‍💻 Tech & Creative
    { value: "tech", label: "Tech & Gadgets", group: "Tech & Creative" },
    { value: "coding", label: "Coding", group: "Tech & Creative" },
    { value: "ai", label: "AI & Future Tech", group: "Tech & Creative" },
    { value: "music_production", label: "Music Production", group: "Tech & Creative" },
    { value: "video_editing", label: "Video Editing", group: "Tech & Creative" },
    { value: "graphic_design", label: "Graphic Design", group: "Tech & Creative" },

    // 🐶 Pets & Animals
    { value: "dogs", label: "Dogs", group: "Pets & Animals" },
    { value: "cats", label: "Cats", group: "Pets & Animals" },
    { value: "animals", label: "Animal Lover", group: "Pets & Animals" },
    { value: "volunteering_animals", label: "Animal Volunteering", group: "Pets & Animals" },

    // ❤️ Lifestyle & Values
    { value: "sustainability", label: "Sustainability", group: "Lifestyle & Values" },
    { value: "volunteering", label: "Volunteering", group: "Lifestyle & Values" },
    { value: "spirituality", label: "Spirituality", group: "Lifestyle & Values" },
    { value: "astrology", label: "Astrology", group: "Lifestyle & Values" },
    { value: "minimalism", label: "Minimalism", group: "Lifestyle & Values" },
    { value: "politics", label: "Politics", group: "Lifestyle & Values" },
    { value: "feminism", label: "Feminism", group: "Lifestyle & Values" },
    { value: "environment", label: "Environment", group: "Lifestyle & Values" },
];
