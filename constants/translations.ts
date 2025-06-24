// Set the key-value pairs for the different languages you want to support.


const swedishLanguage = {
    welcomeBack: "Välkommen tillbaka",
    signInToContinue: "Logga in för att fortsätta",
    continueWithGoogle: "Fortsätt med Google",
    continueWithApple: "Fortsätt med Apple",
    continueWithEmail: "Fortsätt med e‑post",
    agreeToTermsAndPolicy: "Genom att fortsätta godkänner du våra villkor och sekretesspolicy.",
    loginInstruction: "Ange din e‑postadress",
    loginSubInstruction: "Vi skickar en verifieringskod för att bekräfta din e‑postadress",
    enterPhoneNumber: "Ange telefonnummer",
    enterPhoneNumberError: "Ange ett giltigt 10‑siffrigt telefonnummer",
    enterEmail: "Ange e‑postadress",
    emailExample: "exempel@gmail.com",
    enterEmailError: "Måste vara en giltig e‑postadress",
    otpInstruction: "Ange verifieringskod",
    otpSubInstruction: "Vi har skickat en verifieringskod till ditt mobilnummer",
    or: "eller",
    accountVerifiedText: "Yay! Ditt konto är verifierat!",
    accountVerifiedSubText: "Din e‑post har verifierats. Nu kan vi sätta upp din profil för att komma igång.",
    enterDetails: "Fyll i dina uppgifter",
    changeInformationLaterInfo: "Du kan ändra dessa uppgifter efter onboarding också!",
    
    // Onboarding – namn
    firstName: "Förnamn",
    lastName: "Efternamn",
    whatIsYourName: "Vad heter du?",

    // Onboarding – ålder
    whatIsYourAge: "Hur gammal är du?",
    age: "Ålder",

    // Onboarding – kön och intresse
    howDoYouIdentify: "Hur identifierar du dig själv?",
    woman: "Kvinna",
    male: "Man",
    nonBinary: "Icke-binär",
    genderInterestInfo: "Jag vill träffa",


};


const englishLanguage = {
    welcomeBack: "Welcome Back",
    signInToContinue: "Sign in to continue",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    continueWithEmail: "Continue with Email",
    agreeToTermsAndPolicy: "By continuing, you agree to our Terms and Privacy Policy.",
    loginInstruction: "Please enter your email adress",
    loginSubInstruction: "We'll send you a verification code to confirm your email address",
    enterPhoneNumber: "Enter phone number",
    enterPhoneNumberError: "Please enter a valid 10-digit phone number",
    enterEmail: "Enter email",
    emailExample: "example@gmail.com",
    enterEmailError: "Must be a valid email adress",
    otpInstruction: "Enter verification code",
    otpSubInstruction: "We have sent you a verification code to your mobile number",
    or: "or",
    accountVerifiedText: "Yayy! Your account is verified!",
    accountVerifiedSubText: "Your email has been successfully verified. Now, let's set up your profile details to get started.",
    enterDetails: "Enter Details",
    
    changeInformationLaterInfo: "You can change these details after onboarding as well!",

    // Onboarding -name- page
    firstName: "First name",
    lastName: "Last name",
    whatIsYourName: "What is your name?",

    // Onboarding -age- page
    whatIsYourAge: "What is your age?",
    age: "Age",

    // Onboarding -gender & gender interest- page
    howDoYouIdentify: "How do you identify yourself?",
    woman: "Woman",
    male: "Man",
    nonBinary: "Nonbinary",
    genderInterestInfo: "I would like to meet",

    // Onboarding -looking for- page
    lookingForInstruction: "What are you looking for on Meetli?",
    lookingForClarification: "This will help us match you to people who align to what you are looking for",

    // Onboarding -location- page
    chooseLocationInstruction: "Choose which location you will be in the most",
    chooseLocationSubInstruction: "Meetli will later use your real location, if you allow it."
}



export const translations = {
    en: englishLanguage,
    ja: { welcome: 'こんにちは' },
    sv: swedishLanguage
};