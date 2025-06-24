// Set the key-value pairs for the different languages you want to support.


const swedishLanguage = {
    onboarding: {
        or: "eller",
        changeInformationLaterInfo: "Du kan ändra dessa uppgifter även efter onboarding!",
        signIn: {
            welcomeBack: "Välkommen tillbaka",
            signInToContinue: "Logga in för att fortsätta",
            continueWithGoogle: "Fortsätt med Google",
            continueWithApple: "Fortsätt med Apple",
            continueWithEmail: "Fortsätt med e-post",
            agreeToTermsAndPolicy: "Genom att fortsätta godkänner du våra användarvillkor och vår integritetspolicy.",
            or: "eller",
        },
        email: {
            loginInstruction: "Ange din e-postadress",
            loginSubInstruction: "Vi skickar en verifieringskod för att bekräfta din e-postadress",
            enterPhoneNumber: "Ange telefonnummer",
            enterPhoneNumberError: "Vänligen ange ett giltigt 10-siffrigt telefonnummer",
            enterEmail: "Ange e-post",
            emailExample: "exempel@gmail.com",
            enterEmailError: "Måste vara en giltig e-postadress",
        },
        otp: {
            otpInstruction: "Ange verifieringskoden",
            otpSubInstruction: "Vi har skickat en verifieringskod till ditt mobilnummer",
        },
        verified: {
            accountVerifiedText: "Yay! Ditt konto är verifierat!",
            accountVerifiedSubText: "Din e-post har verifierats. Nu sätter vi upp din profil så att du kan börja.",
            enterDetails: "Fyll i dina uppgifter",
        },
        name: {
            firstName: "Förnamn",
            lastName: "Efternamn",
            whatIsYourName: "Vad heter du?",
        },
        age: {
            whatIsYourAge: "Hur gammal är du?",
            age: "Ålder",
        },
        gender: {
            howDoYouIdentify: "Hur identifierar du dig?",
            woman: "Kvinna",
            male: "Man",
            nonBinary: "Icke-binär",
            genderInterestInfo: "Jag vill träffa",
        },
        lookingFor: {
            lookingForInstruction: "Vad letar du efter på Meetli?",
            lookingForClarification: "Detta hjälper oss att matcha dig med personer som passar dina önskemål",
        },
        location: {
            title: "För att hitta personer nära dig behöver vi tillgång till din plats.",
            granted: "Platsåtkomst beviljad. Tack!",
            denied: "Platsåtkomst nekad",
            undetermined: "Platsåtkomst krävs för appens funktionalitet.",
            accessRequired:
                "Platsåtkomst krävs för att appen ska fungera. Utan den kan du inte hitta matchningar eller synas för andra. Du kan aktivera platsåtkomst senare i inställningarna, eller följa instruktionerna nedan.",
            iosInstructionsTitle: "Så här aktiverar du platsåtkomst på iOS:",
            iosInstructions: [
                "Öppna Inställningar",
                "Bläddra ner och välj den här appen",
                "Tryck på 'Plats'",
                "Välj 'När appen används' eller 'Alltid'",
            ],
            androidInstructionsTitle: "Så här aktiverar du platsåtkomst på Android:",
            androidInstructions: [
                "Öppna Inställningar",
                "Gå till 'Appar och aviseringar'",
                "Välj den här appen",
                "Tryck på 'Behörigheter'",
                "Aktivera 'Plats'",
            ],
            allowButton: "Tillåt platsåtkomst",
            grantedButton: "Platsåtkomst beviljad",
            openSettingsButton: "Öppna inställningar",
            info: "Vi delar aldrig din plats och använder den endast för att visa matchningar i närheten.",
        }
    }
};



const englishLanguage = {
    onboarding: {
        or: "or",
        changeInformationLaterInfo: "You can change these details after onboarding as well!",
        signIn: {
            welcomeBack: "Welcome Back",
            signInToContinue: "Sign in to continue",
            continueWithGoogle: "Continue with Google",
            continueWithApple: "Continue with Apple",
            continueWithEmail: "Continue with Email",
            agreeToTermsAndPolicy: "By continuing, you agree to our Terms and Privacy Policy.",
            or: "or",
        },
        email: {
            loginInstruction: "Please enter your email adress",
            loginSubInstruction: "We'll send you a verification code to confirm your email address",
            enterPhoneNumber: "Enter phone number",
            enterPhoneNumberError: "Please enter a valid 10-digit phone number",
            enterEmail: "Enter email",
            emailExample: "example@gmail.com",
            enterEmailError: "Must be a valid email adress",
        },
        otp: {
            otpInstruction: "Enter verification code",
            otpSubInstruction: "We have sent you a verification code to your mobile number",
        },
        verified: {
            accountVerifiedText: "Yayy! Your account is verified!",
            accountVerifiedSubText: "Your email has been successfully verified. Now, let's set up your profile details to get started.",
            enterDetails: "Enter Details",
        },
        name: {
            firstName: "First name",
            lastName: "Last name",
            whatIsYourName: "What is your name?",
        },
        age: {
            whatIsYourAge: "What is your age?",
            age: "Age",
        },
        gender: {
            howDoYouIdentify: "How do you identify yourself?",
            woman: "Woman",
            male: "Man",
            nonBinary: "Nonbinary",
            genderInterestInfo: "I would like to meet",
        },
        lookingFor: {
            lookingForInstruction: "What are you looking for on Meetli?",
            lookingForClarification: "This will help us match you to people who align to what you are looking for",
        },
        location: {
            title: "To find people near you, we need access to your location.",
            granted: "Location access granted. Thank you!",
            denied: "Location permission not granted",
            undetermined: "Location permission required for app functionality.",
            accessRequired:
                "Location access is required for all app functionality. Without it, you won't be able to find matches or appear in others' searches. You can enable location later in settings for full functionality or you can follow the instructions below.",
            iosInstructionsTitle: "To enable location on iOS:",
            iosInstructions: [
                "Open Settings",
                "Scroll down and select this app",
                "Tap 'Location'",
                "Select 'While Using the App' or 'Always'",
            ],
            androidInstructionsTitle: "To enable location on Android:",
            androidInstructions: [
                "Open Settings",
                "Go to 'Apps & notifications'",
                "Select this app",
                "Tap 'Permissions'",
                "Enable 'Location'",
            ],
            allowButton: "Allow Location Access",
            grantedButton: "Location Access Granted",
            openSettingsButton: "Open Settings",
            info: "We never share your location and only use it to show nearby matches.",
        }
    }
}



export const translations = {
    en: englishLanguage,
    ja: { welcome: 'こんにちは' },
    sv: swedishLanguage
};