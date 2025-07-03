// Set the key-value pairs for the different languages you want to support.

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
            otpError: "Wrong code",
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
            accountVerifiedText: "Yayy! Your profile is verified!",
            accountVerifiedSubText: "Your email has been successfully verified. Now, let's set up your profile details to get started 🕺🏻",
            enterDetails: "Enter Details",
        },
        name: {
            firstName: "First name",
            lastName: "Last name",
            whatIsYourName: "👋 What is your name?",
        },
        dob: {
            whatIsYourDOB: "🎂 What is your date of birth?",
            dob: "Date of birth"
        },
        age: {
            whatIsYourAge: "What is your age?",
            age: "Age",
        },
        gender: {
            howDoYouIdentify: "🌈 How do you identify yourself?",
            woman: "👩 Woman",
            male: "👨 Man",
            nonBinary: "⚧️ Nonbinary",
            genderInterestInfo: "❤️ I would like to meet",
        },
        lookingFor: {
            lookingForInstruction: "🎯 What are you looking for on Meetli?",
            lookingForClarification: "This will help us match you to people who align to what you are looking for",
            options: {
                serious: "💍 Serious",
                seriousCasual: "🌹 Serious, but open to casual",
                casualSerious: "🍹 Casual, but open to a serious relationship",
                casual: "🔥 Casual",
                notSure: "🤷‍♂️ Not sure",
                friends: "🤝 Friends"
            }
        },
        location: {
            title: "📍 We need access to your location!",
            granted: "✅ Location access granted. Thank you!",
            denied: "❌ Location permission not granted",
            undetermined: "Location permission required for you to find people nearby 🌎.",
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
            title: "📸 Add your pictures",
            instructions: "Help others get to know you through your photos! Choose 3-6 pictures that show who you are - a clear close-up, some full-body shots, and photos of you doing things you enjoy. Natural smiles and good lighting work best! Please avoid blurry or dark images.",
            dndInstructions: "Hold and draw photo/video to reorder",
            main: "Main",
            deleteImage: "Delete image",
            replaceImage: "Replace image",
        },
        profileBaseCompleted: {
            title: "Your profile is ready! 🤩",
            description: "Now we’ll continue with a few more questions to get to know you even better and to make your profile shine 🌟"
        },
        moreAboutYou: {
            intro: {
                title: "Write a small intro to yourself!",
                placeholder: "Write your cool intro here.",
                wordError: "Too many words!",
                words: "words"
            }
        }

    }
}








export const translations = {
    en: englishLanguage,
};
