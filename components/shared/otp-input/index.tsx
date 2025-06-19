import React, { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { Box } from "@/components/ui/box";

interface OTPComponentProps {
  onComplete: (otp: string) => void;
}

export const OTPComponent = ({ onComplete }: OTPComponentProps) => {
  const [otpValue, setOtpValue] = useState("");
  const colorScheme = useColorScheme(); // 'light' | 'dark'

  const isDarkMode = colorScheme === "dark";

  return (
    <Box>
      <OtpInput
        numberOfDigits={6}
        focusColor={isDarkMode ? "#D5D4D4" : "#404040"}
        focusStickBlinkingDuration={500}
        autoFocus={false}
        blurOnFilled
        type="numeric"
        placeholder="----"
        onTextChange={(text) => setOtpValue(text)}
        onFilled={(text) => {
          onComplete(text);
        }}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        theme={{
          containerStyle: styles.container,
          pinCodeContainerStyle: {
            ...styles.pinCodeContainer,
            borderColor: isDarkMode ? "#747474" : "#CFCFCF",
            backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
          },
          pinCodeTextStyle: {
            ...styles.pinCodeText,
            color: isDarkMode ? "#F5F5F5" : "#1C1C1E",
          },
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: {
            ...styles.activePinCodeContainer,
            borderColor: isDarkMode ? "#D5D4D4" : "#404040",
          },
          placeholderTextStyle: {
            ...styles.placeholderTextStyle,
            color: isDarkMode ? "#A3A3A3" : "#A0A0A0",
          },
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  pinCodeContainer: {
    borderWidth: 1,
    borderRadius: 4,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  pinCodeText: {
    fontSize: 18,
    fontWeight: "400",
  },
  focusStick: {},
  activePinCodeContainer: {
    borderWidth: 1,
  },
  placeholderTextStyle: {
    fontSize: 18,
    fontWeight: "400",
  },
});
