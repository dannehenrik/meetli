import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticTypes =
  | "button"
  | "select"
  | "success"
  | "warning"
  | "error"
  | "buttonImportant"
  | "dragStart"
  | "buttonLight"

export function triggerHaptic(type: HapticTypes) {
    switch (type) {
        case "button":
            buttonHaptic();
            break;
        case "select":
            selectHaptic();
            break;
        case "success":
            successHaptic();
            break;
        case "warning":
            warningHaptic();
            break;
        case "error":
            errorHaptic();
            break;
        case "buttonImportant":
            buttonImportantHaptic();
            break;
        case "buttonLight":
            buttonLightHaptic();
            break;
        case "dragStart":
            dragStartHaptic();
            break;
        default:
            break;
    }
}

function buttonHaptic() {
    if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click);
    } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
}

function buttonLightHaptic() {
    if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick);
    } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }
}

function selectHaptic() {
    if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick);
    } else {
        Haptics.selectionAsync();
    }
}

function successHaptic() {
    if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
    } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
}

function warningHaptic() {
    if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press);
    } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
}

function errorHaptic() {
    if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject);
    } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
}

function buttonImportantHaptic() {
  if (Platform.OS === "android") {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key);
  } else {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

function dragStartHaptic() {
    if (Platform.OS === "android") {
        Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Drag_Start);
    } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
}
