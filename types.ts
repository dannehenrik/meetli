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
    political_view: PoliticalView,
    children: Children,
    pets: Pets,
    education: Education,
    job_title: string,
    occupation_industry: OccupationIndustry,
    prompts: Prompt[],
    favorites: Favorite[],
}

export interface Favorite {
    id: string,
    question: string,
    active: boolean
}

export interface Prompt {
    id: string,
    question: string,
    active: boolean
}



export type TrainingHabit = "serious" | "regularly" | "occasionally" | "everydayActive" | "whenMotivated" | "notMyThing"
export const trainingHabitsOptions: TrainingHabit[] = ["serious", "regularly", "occasionally", "everydayActive", "whenMotivated", "notMyThing"];


export type FoodChoice = "everything" | "healthy" | "vegetarian" | "vegan" | "picky" | "allergies" | "fitnessFocused" | "halal" | "kosher" | "other"
export const foodChoicesOptions: FoodChoice[] = ["everything", "healthy","fitnessFocused", "picky", "vegetarian", "vegan",  "halal", "kosher", "allergies", "other"]

export type SmokingHabits = "no" | "socially" | "occasionally" | "regularly" | "tryingToQuit" | "preferNotToSay"
export const smokingHabitsOptions: SmokingHabits[] = ["no", "socially", "occasionally", "regularly", "tryingToQuit", "preferNotToSay"]

export type DrinkingHabits = "no" | "socially" | "occasionally" | "regularly" | "sober" | "preferNotToSay"
export const drinkingHabitsOptions: DrinkingHabits[] = ["no", "socially", "occasionally", "regularly", "sober", "preferNotToSay"]

export type Religion = "none" | "spiritual" | "christianity" | "islam" | "judaism" | "hinduism" | "buddhism" | "other" | "preferNotToSay"
export const religionOptions: Religion[] = ["none", "spiritual", "christianity", "islam", "judaism", "hinduism", "buddhism", "other", "preferNotToSay"]

export type PoliticalView = "apolitical" | "moderate" | "left" | "right" | "progressive" | "conservative" | "other" | "preferNotToSay";
export const politicalViewOptions: PoliticalView[] = ["apolitical", "moderate", "left", "right", "progressive", "conservative", "other", "preferNotToSay"];


export type Education = "highSchool" | "college" | "bachelors" | "masters" | "phd" | "other" | "preferNotToSay";
export const educationOptions: Education[] = ["highSchool", "college", "bachelors", "masters", "phd", "other", "preferNotToSay"];

export type Pets = "no" | "dog" | "cat" | "reptile" | "amphibian" | "bird" | "fish" | "hamster" | "rabbit" | "want" | "dontWant" | "multiple" | "allergic";
export const petsOptions: Pets[] = ["no", "dog", "cat", "reptile", "amphibian", "bird", "fish", "hamster", "rabbit", "multiple", "want", "dontWant", "allergic"];

export type Children = "no" | "yes" | "many" | "haveMore" | "haveNoMore" | "undecided";
export const childrenOptions: Children[] = ["no", "yes", "many", "haveMore", "haveNoMore", "undecided"];




export type OccupationIndustry = 
  | "technology" 
  | "healthcare" 
  | "education" 
  | "finance" 
  | "artsEntertainment" 
  | "business" 
  | "salesMarketing" 
  | "scienceEngineering" 
  | "legal" 
  | "hospitality" 
  | "realEstate" 
  | "manufacturing" 
  | "retail" 
  | "transportation" 
  | "agriculture" 
  | "government" 
  | "nonProfit" 
  | "media" 
  | "sportsFitness" 
  | "student" 
  | "creative" 
  | "military" 
  | "notEmployed" 
  | "retired" 
  | "other" 
  | "preferNotToSay";

export const occupationIndustries: OccupationIndustry[] = [
  "technology",
  "healthcare",
  "education",
  "finance",
  "artsEntertainment",
  "business",
  "salesMarketing",
  "scienceEngineering",
  "legal",
  "hospitality",
  "realEstate",
  "manufacturing",
  "retail",
  "transportation",
  "agriculture",
  "government",
  "nonProfit",
  "media",
  "sportsFitness",
  "student",
  "creative",
  "military",
  "notEmployed",
  "retired",
  "other",
  "preferNotToSay"
];

