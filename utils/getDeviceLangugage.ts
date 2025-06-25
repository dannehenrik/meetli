import { getLocales } from 'expo-localization';

export function getDeviceLangugage() {
    const deviceLanguage = getLocales()[0].languageCode;

    
    return deviceLanguage ?? "es-ES"
}