// Set the key-value pairs for the different languages you want to support.

import lookingFor from "@/app/(auth)/sign-in/onboarding/looking-for";

const englishLanguage = {
    cancel: "Cancel",
    accept: "Accept",
    confirm: "Confirm",
    delete: "Delete",
    skip: "Skip",
    continue: "Continue",
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
            dataUpdated: "Data updated",
        },
        info: {
            onlyThree: "You can only select 3 at a time",
            unselect: "You will need to unselect one before selecting a new."
        }
    },
    editProfilePage: {
        edit: "Edit",
        preview: "Preview",
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
        skipButton: {
            skipOnboardingTitle: "Skip Optional Setup?",
            skipOnboardingDescription: "You're about to skip the rest of the onboarding steps. You can complete them later from your profile.",
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
            otpSubInstruction: "We have sent you a verification code to your email",
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
            woman: "Woman 👩",
            male: "Man 👨",
            nonBinary: "Nonbinary ⚧️",
            genderInterestInfo: "❤️ I would like to meet",
        },
        lookingFor: {
            lookingForInstruction: "🎯 What are you looking for on Meetli?",
            lookingForClarification: "This will help us match you to people who align to what you are looking for",
            options: {
                serious: "Serious 💍",
                seriousCasual: "Serious, but open to casual 🌹",
                casualSerious: "Casual, but open to a serious relationship 🍹",
                casual: "Casual 🔥",
                notSure: "Not sure 🤷‍♂️",
                friends: "Friends 🤝"
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
            everythingIsSkippable: "You can skip everything from now on",
            intro: {
                title: "💬 Write a small intro to yourself!",
                placeholder: "Write your cool intro here.",
                wordError: "Too many words!",
                words: "words"
            },
            interests: {
                title: "🏀 What are your interests?",
                instructions: "Choose up to 6 different interests so you can find like-minded people.",
                placeholder: "Search your interests",
                requestInterestPrompt: "Didn’t find your interests here? Request it here!",
                request: "Request"
            },
            training: {
                // title: "💪 How often do you work out?",
                title: "💪 How often do you work out?",
                options: {
                    serious: "I'm very serious about my training 🔥",
                    regularly: "Regularly (4+ times a week) 🏋️‍♂️",
                    occasionally: "Occasionally (1–3 times a week) 🏃‍♀️",
                    everydayActive: "Active in daily life (walking, moving) 🚶‍♂️",
                    whenMotivated: "I work out from time to time 😅",
                    notMyThing: "Working out? (never) 🍿",
                }
            },
            foodChoice: {
                title: "🍽️ What's your eating habits?",
                options: {
                    everything: "Eat everything – no restrictions 🍕",
                    healthy: "Mostly healthy 🥗",
                    vegetarian: "Vegetarian 🥦",
                    vegan: "Vegan 🌱",
                    picky: "Picky eater 🙈",
                    allergies: "Dietary restrictions (allergies etc...) 🤧",
                    fitnessFocused: "Fitness-focused 🍗",
                    halal: "Halal 🕌",
                    kosher: "Kosher ✡️",
                    other: "Other 🍽️"
                }
            },
            smoking: {
                title: "🚬 Do you smoke?",
                options: {
                    no: "No ❌",
                    socially: "Only socially 🍷",
                    occasionally: "Occasionally 🚬",
                    regularly: "Regularly 💨",
                    tryingToQuit: "Trying to quit 🛑",
                    preferNotToSay: "Prefer not to say 🙊"
                }
            },
            drinking: {
                title: "🍷 Do you drink alcohol?",
                options: {
                    no: "Never 🚫",
                    socially: "Socially 🥂",
                    occasionally: "Occasionally 🍸",
                    regularly: "Regularly 🍻",
                    sober: "I'm sober 🧘",
                    preferNotToSay: "Prefer not to say 🙊"
                }
            },
            religion: {
                title: "🙏 Do you identify with a religion?",
                options: {
                    none: "Not religious 🚫",
                    spiritual: "Spiritual but not religious 🌌",
                    christianity: "Christianity ✝️",
                    islam: "Islam 🕌",
                    judaism: "Judaism ✡️",
                    hinduism: "Hinduism 🕉️",
                    buddhism: "Buddhism ☸️",
                    other: "Other religion 🔎",
                    preferNotToSay: "Prefer not to say 🙊"
                }
            },
            politicalView: {
                title: "🗳️ What's your political views?",
                options: {
                    apolitical: "Not into politics 🙅",
                    moderate: "Moderate ⚖️",
                    left: "Left-leaning 🌹",
                    right: "Right-leaning 🦅",
                    progressive: "Progressive 🌈",
                    conservative: "Conservative 🏛️",
                    other: "Other 🧭",
                    preferNotToSay: "Prefer not to say 🙊"
                }
            },
            children: {
                title: "👶 Do you want children?",
                options: {
                    no: "No 🚫",
                    yes: "Yes ✅",
                    many: "Many kids! 🎉",
                    haveMore: "Have kids & want more 👨‍👩‍👧",
                    haveNoMore: "Have kids & don’t want more 👨‍👩‍👧",
                    undecided: "Not decided yet 🤔"
                }
            },
            pets: {
                title: "🐾 Do you have any pets?",
                options: {
                    no: "No pets 🚫",
                    dog: "Dog 🐶",
                    cat: "Cat 🐱",
                    reptile: "Reptile 🦎",
                    amphibian: "Amphibian 🐸",
                    bird: "Bird 🐦",
                    fish: "Fish 🐠",
                    hamster: "Hamster 🐹",
                    rabbit: "Rabbit 🐰",
                    want: "Want pets ❤️",
                    dontWant: "No pets for me 🙅",
                    multiple: "Multiple pets 🐕🐈",
                    allergic: "Allergic to pets 🤧"
                }
            },
            occupation: {
                title: "💼 What occupation do you have?",
                description: "Tell us your job title first, then choose the industry that best describes your field.",
                placeholder: "Jobtitle",
                options: {
                    technology: "Technology 💻",
                    healthcare: "Healthcare 🏥",
                    education: "Education 📚",
                    finance: "Finance 💰",
                    artsEntertainment: "Arts & Entertainment 🎨",
                    business: "Business & Management 👔",
                    salesMarketing: "Sales & Marketing 📈",
                    scienceEngineering: "Science & Engineering 🔬",
                    legal: "Legal ⚖️",
                    hospitality: "Hospitality 🍽️",
                    realEstate: "Real Estate 🏢",
                    manufacturing: "Manufacturing 🏭",
                    retail: "Retail 🛒",
                    transportation: "Transportation ✈️",
                    agriculture: "Agriculture 🌱",
                    government: "Government 🏛️",
                    nonProfit: "Non-Profit ❤️",
                    media: "Media & Communications 🎥",
                    sportsFitness: "Sports & Fitness ⚽",
                    student: "Student 🎓",
                    creative: "Creative Arts 🎭",
                    military: "Military 🎖️",
                    notEmployed: "Not Employed 🏠",
                    retired: "Retired 🌴",
                    other: "Other 🧩",
                    preferNotToSay: "Prefer not to say 🙊"
                },
                instruction: "You choose an industry to enable filtering!"
            },
            education: {
                title: "🎓 What is your highest level of education?",
                options: {
                    highSchool: "High school 🏫",
                    college: "College / University 📘",
                    bachelors: "Bachelor's degree 🎓",
                    masters: "Master's degree 🎓",
                    phd: "PhD or Doctorate 📚",
                    other: "Other 🧠",
                    preferNotToSay: "Prefer not to say 🙊"
                }
            },
            profilePrompts: {
                title: "✨ More about your personality",
                instructions: "Select 1-3 prompts that excites you from the list below and write your answers!",
                saveAnswer: "Save answer",
                
                prompts: {
                    friend_description: {
                        question: "🧑‍🤝‍🧑 How would your friends describe you?",
                        placeholder: `"Unpredictable" – half tech nerd, half wilderness explorer. Never a dull moment.`
                    },
                    two_truths_one_lie: {
                        question: "🕵️‍♂️ Two truths and a lie...",
                        placeholder: `"1. I’ve been skydiving. 2. I hate pizza. 3. I once met Rihanna in an elevator." Can you guess? 😉`
                    },
                    perfect_date: {
                        question: "🌇 My perfect date looks like...",
                        placeholder: `"Somewhere between coffee at a quirky bookstore and losing track of time in conversation." ☕📚`
                    },
                    life_passion: {
                        question: "🔥 My biggest passion in life is...",
                        placeholder: `"Creating things that make people smile – from apps to awful puns."`
                    },
                    partner_trait: {
                        question: "💘 One thing I'm looking for in a partner is...",
                        placeholder: `"Someone who laughs at my jokes… even the questionable ones." 😂`
                    },
                    weird_talent: {
                        question: "🎯 Weirdest talent that might surprise you?",
                        placeholder: `"I can fold a fitted sheet like a hotel maid. It's my oddly specific superpower." 🛏️✨`
                    },
                    hot_take: {
                        question: "🌶️ My hot take is...",
                        placeholder: `"Pineapple absolutely belongs on pizza. And I’ll fight (playfully) for it." 🍍🍕`
                    },
                    perfect_day: {
                        question: "🌞 If I could describe the perfect day...",
                        placeholder: `"Morning swim, messy brunch, spontaneous road trip, sunset with someone fun." 🌞🚗🌅`
                    },
                    guilty_pleasure: {
                        question: "😅 My guilty pleasure is...",
                        placeholder: `"Rewatching 'The Office' for the 17th time like it’s a brand new show." 📺🫠`
                    },
                    love_about_you: {
                        question: "💖 One thing I’d probably love about you is...",
                        placeholder: `"Your taste in memes... unless you're still into Minions. Then we need to talk." 😂🙃`
                    },
                    random_object: {
                        question: "🎁 The most random thing I own is...",
                        placeholder: `"A tiny chair for my houseplants. Don’t ask." 🌱🪑`
                    },
                    toxic_trait: {
                        question: "⚠️ My toxic trait is...",
                        placeholder: `"Saying 'I’m 5 minutes away' when I’m still in the shower." 🫣⏱️`
                    },
                    way_to_heart: {
                        question: "💓 The way to my heart is...",
                        placeholder: `"Through tacos, memes, and someone who laughs at my terrible puns." 🌮💘`
                    },
                    swipe_right_reason: {
                        question: "👉 What instantly makes me swipe right is...",
                        placeholder: `"Dogs in profile pictures. Works every time." 🐶💯`
                    },
                    biggest_ick: {
                        question: "🙅‍♂️ My biggest ick is...",
                        placeholder: `"When people clap when the plane lands. Just… why?" ✈️😬`
                    },
                    perfect_weekend: {
                        question: "🍝 A perfect weekend includes...",
                        placeholder: `"Sleeping in, no plans, and probably some form of pasta." 🍝🛋️`
                    },
                    debate_opinion: {
                        question: "🤔 One opinion that always starts debates with my friends...",
                        placeholder: `"Croissants are just overrated bread. Sorry, not sorry." 🥐🔥`
                    }
                },
            },
            profileFavorites: {
                title: "💖 Your favorites, in three picks",
                instructions: "Choose up to 3 favorites to share! These little things say a lot about you.",
                saveAnswer: "Save answer",

                options: {
                    // 🎬 Entertainment
                    favorite_movie: {
                        question: "🎬 My favorite movie is...",
                        placeholder: `"The Grand Budapest Hotel" – quirky, colorful, and chaotic. Just like me. 😉`
                    },
                    favorite_tv_show: {
                        question: "📺 My favorite TV show is...",
                        placeholder: `"The Bear" – intense, heartfelt, and somehow calming amid the chaos."`
                    },
                    favorite_movie_genre: {
                        question: "🍿 My favorite movie genre is...",
                        placeholder: `"Psychological thrillers – keep me on edge in the best way."`
                    },
                    favorite_actor: {
                        question: "🎭 My favorite actor is...",
                        placeholder: `"Pedro Pascal – charming, funny, and always steals the scene."`
                    },
                    favorite_actress: {
                        question: "🌟 My favorite actress is...",
                        placeholder: `"Zendaya – style, talent, and presence. Total icon."`
                    },
                    favorite_director: {
                        question: "🎬 My favorite director is...",
                        placeholder: `"Greta Gerwig – stories that stick with you." 🎞️`
                    },
                    favorite_music_genre: {
                        question: "🎧 My favorite music genre is...",
                        placeholder: `"Indie pop with a hint of nostalgia and dancing in the kitchen vibes."`
                    },
                    favorite_song: {
                        question: "🎶 My favorite song is...",
                        placeholder: `"Electric Feel" by MGMT – instant serotonin boost. ⚡"`
                    },
                    favorite_album: {
                        question: "💿 My favorite album is...",
                        placeholder: `"Channel Orange" – Frank Ocean is my emotional support artist."`
                    },
                    favorite_music_artist: {
                        question: "🎤 My favorite music artist is...",
                        placeholder: `"Lana Del Rey. Melancholy but make it glamorous." 💔✨`
                    },
                    favorite_video_game: {
                        question: "🎮 My favorite video game is...",
                        placeholder: `"Zelda: Breath of the Wild – because who doesn't want to ride horses and fight goblins?"`
                    },
                    favorite_book: {
                        question: "📚 My favorite book is...",
                        placeholder: `"The Night Circus" – magical, slow-burning, and dreamy." ✨`
                    },
                    favorite_author: {
                        question: "✍️ My favorite author is...",
                        placeholder: `"Murakami – surreal, weird, and oddly comforting."`
                    },

                    // 🍔 Lifestyle & Taste
                    favorite_food: {
                        question: "🍣 My favorite food is...",
                        placeholder: `"Sushi. Forever and always. Extra wasabi, please."`
                    },
                    favorite_cuisine: {
                        question: "🌮 My favorite cuisine is...",
                        placeholder: `"Mexican – spicy, flavorful, and full of soul." 🌶️`
                    },
                    favorite_drink: {
                        question: "🍹 My favorite drink is...",
                        placeholder: `"Spicy margarita. Sweet, salty, and a little chaotic." 🔥`
                    },
                    favorite_dessert: {
                        question: "🍰 My favorite dessert is...",
                        placeholder: `"Tiramisu – classy, creamy, and just a bit naughty." 😋`
                    },
                    favorite_snack: {
                        question: "🍿 My favorite snack is...",
                        placeholder: `"Popcorn with too much butter. Judge me."`
                    },

                    // 🌍 Personality & Vibes
                    favorite_animal: {
                        question: "🦦 My favorite animal is...",
                        placeholder: `"Otters. They hold hands while sleeping. My emotional blueprint."`
                    },
                    favorite_color: {
                        question: "🎨 My favorite color is...",
                        placeholder: `"Forest green – earthy, calm, mysterious." 🌲`
                    },
                    favorite_season: {
                        question: "🍂 My favorite season is...",
                        placeholder: `"Autumn – cozy vibes, crisp air, and golden leaves."`
                    },
                    favorite_holiday: {
                        question: "🎄 My favorite holiday is...",
                        placeholder: `"Halloween – spooky, fun, and full of candy and creativity!" 🎃`
                    },
                    favorite_place: {
                        question: "🌍 My favorite place on Earth is...",
                        placeholder: `"Tokyo at night – neon lights, midnight ramen, and quiet chaos."`
                    },
                    favorite_city: {
                        question: "🏙️ My favorite city is...",
                        placeholder: `"Barcelona – beach by day, tapas by night."`
                    },
                    favorite_trip: {
                        question: "🧳 My favorite trip I’ve taken is...",
                        placeholder: `"Backpacking through Vietnam. Life-changing views, food, and moments."`
                    },

                    // ✨ Personal & Fun
                    favorite_hobby: {
                        question: "🎨 My favorite hobby is...",
                        placeholder: `"Watercolor painting on Sundays with jazz in the background." 🎷"`
                    },
                    favorite_sport: {
                        question: "⚽ My favorite sport is...",
                        placeholder: `"Tennis. I'm not good, but I look great trying." 🎾`
                    },
                    favorite_athlete: {
                        question: "🏅 My favorite athlete is...",
                        placeholder: `"Serena Williams. Power, grace, and total dominance." 💪`
                    },
                    favorite_outdoor_activity: {
                        question: "⛺ My favorite outdoor activity is...",
                        placeholder: `"Camping under the stars – smores included." 🌌`
                    },
                    favorite_thing_to_collect: {
                        question: "📦 My favorite thing to collect is...",
                        placeholder: `"Vintage postcards. I like imagining the stories behind them." ✉️`
                    },
                    favorite_smell: {
                        question: "👃 My favorite smell is...",
                        placeholder: `"Books, coffee, and the air after it rains." ☕📖🌧️`
                    },
                    favorite_sound: {
                        question: "🔊 My favorite sound is...",
                        placeholder: `"Waves crashing + someone laughing hard enough to snort." 🌊😂`
                    },
                    favorite_feeling: {
                        question: "💭 My favorite feeling is...",
                        placeholder: `"That spark when you really *click* with someone." ✨`
                    },
                    favorite_quote: {
                        question: "📝 My favorite quote is...",
                        placeholder: `"“Be messy and complicated and afraid, and show up anyway.” – Glennon Doyle"`
                    },

                    // Persons
                    favorite_comedian: {
                        question: "🤣 My favorite comedian is...",
                        placeholder: `"Bo Burnham – clever, awkward, and painfully real."`
                    },
                    favorite_influencer: {
                        question: "📱 My favorite influencer is...",
                        placeholder: `"Emma Chamberlain. Relatable chaos and aesthetic coffee shots." ☕`
                    },
                    favorite_youtuber: {
                        question: "📹 My favorite YouTuber is...",
                        placeholder: `"Mark Rober – smart, funny, and builds glitter bombs for justice."`
                    },
                    favorite_podcaster: {
                        question: "🎙️ My favorite podcaster is...",
                        placeholder: `"Jay Shetty – soft voice, deep thoughts, good vibes."`
                    },
                }

            }

        }
    },
    editProfile: {
        emptyMessages: {
            emptyInterests: "You haven't chosen any interests yet...", 
            emptyIntro: "You haven't written your cool intro yet...",
            emptyPrompts: "You haven't chosen any prompts yet...",
            emptyFavorites: "You haven't chosen any favorites yet..."
        },
        titles: {
            pictures: "Photos",
            favorites: "My favorites",
            prompts: "Prompts",
            interests: "Interests",
            intro: "Profile description",
            lifestyle: "Lifestyle",
            beliefsAndValues: "Beliefs & Values",
            family: "Family",
            career: "Career",
            aboutMe: "About me"
        }
    },

    profilePreviewTitles: {
        training: "💪 Training",
        foodChoice: "🍽️ Eating Habits",
        smoking: "🚬 Smoking",
        drinking: "🍷 Drinking",
        religion: "🙏 Religion",
        politicalView: "🗳️ Politics",
        children: "👶 Kids",
        pets: "🐾 Pets",
        occupation: "💼 Occupation",
        education: "🎓 Education"
    },
    interests: {
        groups: {
            sports_fitness: "🏃 Sports & Fitness",
            music_audio: "🎵 Music & Audio",
            arts_creativity: "🎨 Arts & Creativity",
            food_drink: "🍕 Food & Drink",
            games_tech: "🎮 Games & Tech",
            entertainment: "🎬 Entertainment",
            travel_adventure: "✈️ Travel & Adventure",
            learning_knowledge: "📚 Learning & Knowledge",
            wellness_mindfulness: "🌱 Wellness & Mindfulness",
            nature_outdoors: "🌍 Nature & Outdoors",
            relationships_social: "❤️ Relationships & Social",
            pets_animals: "🐾 Pets & Animals",
            lifestyle_values: "🌟 Lifestyle & Values"
        },
        interests: {
            running: "Running",
            yoga: "Yoga",
            gym: "Gym Workouts",
            cycling: "Cycling",
            swimming: "Swimming",
            hiking: "Hiking",
            rock_climbing: "Rock Climbing",
            dancing: "Dancing",
            martial_arts: "Martial Arts",
            skiing: "Skiing/Snowboarding",
            surfing: "Surfing",
            golf: "Golf",
            tennis: "Tennis",
            basketball: "Basketball",
            soccer: "Soccer",
            volleyball: "Volleyball",
            pilates: "Pilates",
            crossfit: "CrossFit",
            boxing: "Boxing",
            kayaking: "Kayaking",
            zumba: "Zumba",
            ice_skating: "Ice Skating",
            rollerblading: "Rollerblading",
            archery: "Archery",
            horseback_riding: "Horseback Riding",
            table_tennis: "Table Tennis",
            bowling: "Bowling",
            live_music: "Live Music",
            concerts: "Concerts",
            festivals: "Music Festivals",
            vinyl: "Vinyl Records",
            play_instrument: "Playing Instruments",
            singing: "Singing",
            songwriting: "Songwriting",
            podcasts: "Podcasts",
            audiobooks: "Audiobooks",
            dj: "DJing",
            rock_music: "Rock Music",
            hip_hop: "Hip Hop",
            electronic: "Electronic Music",
            jazz: "Jazz",
            classical: "Classical Music",
            indie: "Indie Music",
            karaoke: "Karaoke",
            music_production: "Music Production",
            painting: "Painting",
            photography: "Photography",
            pottery: "Pottery",
            sculpting: "Sculpting",
            drawing: "Drawing",
            digital_art: "Digital Art",
            crafting: "Crafting",
            knitting: "Knitting/Crochet",
            woodworking: "Woodworking",
            graphic_design: "Graphic Design",
            interior_design: "Interior Design",
            fashion_design: "Fashion Design",
            tattoos: "Tattoo Art",
            calligraphy: "Calligraphy",
            museums: "Museums",
            art_galleries: "Art Galleries",
            street_art: "Street Art",
            theater: "Theater",
            standup: "Stand-Up Comedy",
            improv: "Improv Theater",
            poetry: "Poetry",
            writing: "Creative Writing",
            cooking: "Cooking",
            baking: "Baking",
            coffee: "Coffee Culture",
            tea: "Tea Appreciation",
            wine_tasting: "Wine Tasting",
            cocktails: "Cocktail Making",
            craft_beer: "Craft Beer",
            whiskey: "Whiskey Tasting",
            foodie: "Food Exploration",
            vegan_cuisine: "Vegan Cuisine",
            sushi: "Sushi",
            bbq: "BBQ/Grilling",
            farmers_markets: "Farmers Markets",
            food_trucks: "Food Trucks",
            brunch: "Brunch",
            chocolate: "Chocolate Making",
            cheese: "Cheese Tasting",
            mixology: "Mixology",
            fermentation: "Fermentation",
            dim_sum: "Dim Sum",
            pizza_making: "Pizza Making",
            ramen: "Ramen",
            tacos: "Tacos",
            cooking_classes: "Cooking Classes",
            video_games: "Video Games",
            board_games: "Board Games",
            puzzles: "Puzzles",
            escape_rooms: "Escape Rooms",
            vr_gaming: "VR Gaming",
            arcades: "Arcades",
            dnd: "Dungeons & Dragons",
            chess: "Chess",
            poker: "Poker",
            coding: "Coding",
            ai: "Artificial Intelligence",
            robotics: "Robotics",
            drones: "Drones",
            printing_3d: "3D Printing",
            gadgets: "Tech Gadgets",
            esports: "eSports",
            retro_gaming: "Retro Gaming",
            mobile_gaming: "Mobile Gaming",
            game_dev: "Game Development",
            crypto: "Crypto/NFTs",
            movies: "Movies",
            tv_shows: "TV Series",
            anime: "Anime",
            manga: "Manga",
            documentaries: "Documentaries",
            reality_tv: "Reality TV",
            k_dramas: "K-Dramas",
            sci_fi: "Sci-Fi",
            fantasy: "Fantasy",
            horror: "Horror",
            romcoms: "Romantic Comedies",
            indie_films: "Independent Films",
            film_festivals: "Film Festivals",
            youtube: "YouTube",
            twitch: "Twitch",
            netflix: "Netflix",
            disney_plus: "Disney+",
            true_crime: "True Crime",
            backpacking: "Backpacking",
            road_trips: "Road Trips",
            beaches: "Beach Getaways",
            mountains: "Mountain Trips",
            city_breaks: "City Exploration",
            camping: "Camping",
            glamping: "Glamping",
            scuba_diving: "Scuba Diving",
            safaris: "Safaris",
            cruises: "Cruises",
            food_travel: "Food Tourism",
            historical_sites: "Historical Sites",
            national_parks: "National Parks",
            solo_travel: "Solo Travel",
            van_life: "Van Life",
            language_immersion: "Language Immersion",
            reading: "Reading",
            book_clubs: "Book Clubs",
            languages: "Language Learning",
            history: "History",
            philosophy: "Philosophy",
            psychology: "Psychology",
            neuroscience: "Neuroscience",
            astronomy: "Astronomy",
            economics: "Economics",
            personal_finance: "Personal Finance",
            entrepreneurship: "Entrepreneurship",
            online_courses: "Online Courses",
            ted_talks: "TED Talks",
            trivia: "Trivia",
            science: "Science",
            cultural_studies: "Cultural Studies",
            meditation: "Meditation",
            mindfulness: "Mindfulness",
            spa: "Spa Treatments",
            massage: "Massage Therapy",
            reiki: "Reiki",
            sound_baths: "Sound Baths",
            forest_bathing: "Forest Bathing",
            breathwork: "Breathwork",
            yoga_nidra: "Yoga Nidra",
            crystals: "Crystals",
            aromatherapy: "Aromatherapy",
            journaling: "Journaling",
            gratitude_practice: "Gratitude Practice",
            sleep_hygiene: "Sleep Hygiene",
            gardening: "Gardening",
            plant_care: "Plant Care",
            bird_watching: "Bird Watching",
            stargazing: "Stargazing",
            foraging: "Foraging",
            fishing: "Fishing",
            beach_combing: "Beach Combing",
            sunrise_chasing: "Sunrise Chasing",
            nature_photography: "Nature Photography",
            botanical_gardens: "Botanical Gardens",
            picnics: "Picnics",
            dating: "Dating",
            relationship_coaching: "Relationship Coaching",
            social_events: "Social Events",
            speed_dating: "Speed Dating",
            friend_dates: "Friend Dates",
            community_service: "Community Service",
            volunteering: "Volunteering",
            networking: "Networking",
            lgbtq_community: "LGBTQ+ Community",
            cultural_exchange: "Cultural Exchange",
            parenting: "Parenting",
            marriage: "Marriage",
            polyamory: "Polyamory",
            social_dancing: "Social Dancing",
            dogs: "Dogs",
            cats: "Cats",
            pet_training: "Pet Training",
            dog_parks: "Dog Parks",
            animal_rescue: "Animal Rescue",
            wildlife: "Wildlife",
            aquariums: "Aquariums",
            pet_photography: "Pet Photography",
            sustainability: "Sustainability",
            minimalism: "Minimalism",
            frugal_living: "Frugal Living",
            zero_waste: "Zero Waste",
            veganism: "Veganism",
            vegetarianism: "Vegetarianism",
            spirituality: "Spirituality",
            astrology: "Astrology",
            tarot: "Tarot",
            feminism: "Feminism",
            social_justice: "Social Justice",
            environmentalism: "Environmentalism",
            mental_health: "Mental Health",
            fitness_lifestyle: "Fitness Lifestyle"
        }
  }
}




export const translations = {
    en: englishLanguage,
};
