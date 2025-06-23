
export interface User {
    id: string,
    onboarding_completed: boolean,
    created_at: string,
    email: string,
    phone_number: string,
    name: string,
    age: number, 
    gender: Gender
    gender_preference: Gender,
    location: Location,
    looking_for: LookingFor
}

export interface Location {
    longitude: string,
    latitude: string,
}

export type Gender = "male" | "woman" | "non-binary" | "other" 
export type LookingFor = "serious" | "serious-casual" | "casual-serious" | "casual" | "not-sure" | "friends"