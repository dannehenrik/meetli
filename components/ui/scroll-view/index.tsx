"use client";

import { ScrollView } from "react-native";
import { cssInterop } from "nativewind";

cssInterop(ScrollView, { target: "style" });

export { ScrollView } from "react-native";
