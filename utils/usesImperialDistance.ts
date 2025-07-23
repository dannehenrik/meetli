import * as Localization from 'expo-localization';

/**
 * Returns true if the user prefers imperial units (e.g., miles), false otherwise.
 */
export function usesImperialUnits() {
    const region = (Localization.getLocales())[0].regionCode || '';

    // Countries that use imperial or miles for distance
    const milesCountries = ['US', 'LR', 'MM', 'GB'];

    // Check if region is one of those
    return milesCountries.includes(region.toUpperCase());
}
