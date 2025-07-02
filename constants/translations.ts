// Set the key-value pairs for the different languages you want to support.


const swedishLanguage = {
    cancel: "Avbryt",
    accept: "Acceptera",
    confirm: "Bekräfta",
    messages: {
        error: {
            somethingWentWrong: "Något gick fel!",
            updateProfileError: "Vi kunde inte uppdatera din profil",
            locationError: "Vi kunde inte hämta din plats",
            emailError: "Något gick fel när e-postmeddelandet skulle skickas"
        },
        success: {
            emailSent: "E-post skickad!",
            emailValidationInstructions: "Ange den 6-siffriga koden du just fick",
        }
    },
    onboarding: {
        or: "eller",
        changeInformationLaterInfo: "Du kan ändra dessa uppgifter även efter onboarding!",

        fab: {
            sendCode: "Skicka kod",
            verify: "Verifiera",
            enterDetails: "Ange uppgifter",
            continue: "Fortsätt"
        },
    
        signIn: {
            welcomeBack: "Välkommen tillbaka",
            signInToContinue: "Logga in för att fortsätta",
            continueWithGoogle: "Fortsätt med Google",
            continueWithApple: "Fortsätt med Apple",
            continueWithEmail: "Fortsätt med e-post",
            agreeToTermsAndPolicy: "Genom att fortsätta godkänner du våra villkor och vår integritetspolicy.",
            or: "eller",
        },
        email: {
            loginInstruction: "Ange din e-postadress",
            loginSubInstruction: "Vi skickar en verifieringskod för att bekräfta din e-postadress",
            enterPhoneNumber: "Ange telefonnummer",
            enterPhoneNumberError: "Ange ett giltigt telefonnummer med 10 siffror",
            enterEmail: "Ange e-post",
            emailExample: "exempel@gmail.com",
            enterEmailError: "Måste vara en giltig e-postadress",
        },
        otp: {
            otpInstruction: "Ange verifieringskod",
            otpSubInstruction: "Vi har skickat en verifieringskod till din email",
        },
        verified: {
            accountVerifiedText: "Yay! Ditt konto är verifierat!",
            accountVerifiedSubText: "Din e-post har verifierats. Nu sätter vi upp din profil för att komma igång 🕺🏻",
            enterDetails: "Ange uppgifter",
        },
        name: {
            firstName: "Förnamn",
            lastName: "Efternamn",
            whatIsYourName: "Vad heter du?",
        },
        dob: {
            whatIsYourDOB: "När är du född?",
            dob: "Födelsedatum"
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
            lookingForClarification: "Detta hjälper oss att matcha dig med personer som delar dina intentioner",
            options: {
                serious: "Seriöst",
                seriousCasual: "Seriöst, men öppen för avslappnat",
                casualSerious: "Avslappnat, men öppen för seriöst förhållande",
                casual: "Avslappnat",
                notSure: "Osäker",
                friends: "Vänner"
            }
        },
        location: {
            title: "Vi behöver tillgång till din plats!",
            granted: "Platsåtkomst beviljad. Tack!",
            denied: "Platsåtkomst inte beviljad",
            undetermined: "Platsåtkomst krävs för att hitta personer i närheten.",
            accessRequired:
                "Platsåtkomst krävs för att appen ska fungera fullt ut. Utan det kan du inte hitta matcher eller synas för andra. Du kan aktivera platsåtkomst senare i inställningarna, eller följa instruktionerna nedan.",
            iosInstructionsTitle: "Så aktiverar du platsåtkomst på iOS:",
            iosInstructions: [
                "Öppna Inställningar",
                "Bläddra ner och välj denna app",
                "Tryck på 'Plats'",
                "Välj 'När appen används' eller 'Alltid'",
            ],
            androidInstructionsTitle: "Så aktiverar du platsåtkomst på Android:",
            androidInstructions: [
                "Öppna Inställningar",
                "Gå till 'Appar och aviseringar'",
                "Välj denna app",
                "Tryck på 'Behörigheter'",
                "Aktivera 'Plats'",
            ],
            allowButton: "Tillåt platsåtkomst",
            grantedButton: "Platsåtkomst beviljad",
            openSettingsButton: "Öppna inställningar",
            info: "Vi delar aldrig din plats och använder den endast för att visa personer i närheten.",
        },
        pictures: {
            title: "Lägg till dina bilder",
            instructions: "Hjälp andra att lära känna dig genom dina bilder! Välj 3–6 foton som visar vem du är – en tydlig närbild, några helkroppsbilder och bilder på dig när du gör saker du tycker om. Naturliga leenden och bra belysning fungerar bäst! Undvik gärna suddiga eller mörka bilder.",
            dndInstructions: "Håll och dra foto/video för att ändra ordning",
        }
    }
}



const englishLanguage = {
    cancel: "Cancel",
    accept: "Accept",
    confirm: "Confirm",
    messages: {
        error: {
            somethingWentWrong: "Something went wrong!",
            updateProfileError: "We could not update your profile",
            locationError: "We could not fetch your location",
            emailError: "Something went wrong when sending the email",
            removeImageError: "Could not remove image",
            sortImageError: "Could not reorder images",
            replaceImageError: "Could not replace image",
            uploadImageError: "Could not upload the image" 
        },
        success: {
            emailSent: "Email sent!",
            emailValidationInstructions: "Enter the 6 digit code you just received",
        }
    },
    onboarding: {
        or: "or",
        changeInformationLaterInfo: "You can change these details after onboarding as well!",
        fab: {
            sendCode: "Send code",
            verify: "Verify",
            enterDetails: "Enter details",
            continue: "Continue"
        },
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
            accountVerifiedSubText: "Your email has been successfully verified. Now, let's set up your profile details to get started 🕺🏻",
            enterDetails: "Enter Details",
        },
        name: {
            firstName: "First name",
            lastName: "Last name",
            whatIsYourName: "What is your name?",
        },
        dob: {
            whatIsYourDOB: "What is your date of birth?",
            dob: "Date of birth"
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
            options: {
                serious: "Serious",
                seriousCasual: "Serious, but open to casual",
                casualSerious: "Casual, but open to a serious relationship",
                casual: "Casual",
                notSure: "Not sure",
                friends: "Friends"
            }
        },
        location: {
            title: "We need access to your location!",
            granted: "Location access granted. Thank you!",
            denied: "Location permission not granted",
            undetermined: "Location permission required for you to find people nearby .",
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
        },
        pictures: {
            title: "Add your pictures",
            instructions: "Help others get to know you through your photos! Choose 3-6 pictures that show who you are - a clear close-up, some full-body shots, and photos of you doing things you enjoy. Natural smiles and good lighting work best! Please avoid blurry or dark images.",
            dndInstructions: "Hold and draw photo/video to reorder",
            main: "Main",
            deleteImage: "Delete image",
            replaceImage: "Replace image",
        },
        profileBaseCompleted: {
            title: "Your profile is ready!",
            description: "Now we’ll continue with a few more questions to get to know you even better and to make your profile shine 🤩"
        }
    }
}



export const translations = {
    en: englishLanguage,
    ja: { welcome: 'こんにちは' },
    sv: swedishLanguage
};