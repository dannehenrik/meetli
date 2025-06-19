// Set the key-value pairs for the different languages you want to support.


const swedishLanguage = {
    loginInstruction: "Ange ditt mobilnummer",
    loginSubInstruction: "Vi skickar en verifieringskod för att bekräfta ditt nummer",
    enterPhoneNumber: "Skriv telefonnummer",
}

const englishLanguage = {
    loginInstruction: "Please enter your mobile number",
    loginSubInstruction: "We'll send you a verification code to confirm your number",
    enterPhoneNumber: "Enter phone number",
    enterPhoneNumberError: "Please enter a valid 10-digit phone number"
}



export const translations = {
    en: englishLanguage,
    ja: { welcome: 'こんにちは' },
    sv: swedishLanguage
};