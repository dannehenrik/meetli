
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

export type Gender = "male" | "woman" | "non-binary"
export type LookingFor = "serious" | "serious-casual" | "casual-serious" | "casual" | "not-sure" | "friends"


export interface ExtendedUser {
    id: string, 
    intro: string,
}