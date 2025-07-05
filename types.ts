import { InterestType } from "./constants/interests"

export interface CoreUser {
    id: string,
    onboarding_completed: boolean,
    created_at: string,
    email: string,
    phone_number: string,
    first_name: string,
    last_name: string,
    age: number, 
    gender: Gender
    gender_preferences: Gender[],
    location: LocationType,
    looking_for: LookingFor,
    dob: Date, //Date of birth
    images: ImageType[],
}


export interface ImageType {
    filePath: string,
    url: string | null
    tempUrl: string | null,
}

export interface LocationType {
    longitude: number,
    latitude: number,
}

export type Gender = "male" | "woman" | "nonBinary"
export const genderOptions = ["male", "woman", "nonBinary"]

export type LookingFor = "serious" | "seriousCasual" | "casualSerious" | "casual" | "notSure" | "friends"
export const lookingForOptions = ["serious", "seriousCasual", "casualSerious", "casual", "notSure", "friends"]


export interface ExtendedUser {
    id: string, 
    intro: string,
    interests: {interest: string}[],
    training_habits: TrainingHabit,
    food_choice: FoodChoice,
    drinking_habits: DrinkingHabits,
    smoking_habits: SmokingHabits,
    religion: Religion,
    political_view: PoliticalView
}


export type TrainingHabit = "regularly" | "occasionally" | "everydayActive" | "whenMotivated" | "notMyThing"
export const trainingHabitsOptions = ["regularly", "occasionally", "everydayActive", "whenMotivated", "notMyThing"];


export type FoodChoice = "everything" | "healthy" | "vegetarian" | "vegan" | "picky" | "allergies" | "fitnessFocused" | "halal" | "kosher"
export const foodChoicesOptions = ["everything", "healthy","fitnessFocused", "picky", "vegetarian", "vegan",  "halal", "kosher", "allergies"]

export type SmokingHabits = "no" | "socially" | "occasionally" | "regularly" | "tryingToQuit"
export const smokingHabitsOptions = ["no", "socially", "occasionally", "regularly", "tryingToQuit"]

export type DrinkingHabits = "no" | "socially" | "occasionally" | "regularly" | "sober"
export const drinkingHabitsOptions = ["no", "socially", "occasionally", "regularly", "sober"]

export type Religion = "none" | "spiritual" | "christianity" | "islam" | "judaism" | "hinduism" | "buddhism" | "other" | "preferNotToSay"
export const religionOptions = ["none", "spiritual", "christianity", "islam", "judaism", "hinduism", "buddhism", "other", "preferNotToSay"]

export type PoliticalView = "apolitical" | "moderate" | "left" | "right" | "progressive" | "conservative" | "other" | "preferNotToSay";
export const politicalViewOptions = ["apolitical", "moderate", "left", "right", "progressive", "conservative", "other", "preferNotToSay"];
