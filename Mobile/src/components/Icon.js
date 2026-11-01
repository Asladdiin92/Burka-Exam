import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/theme.js";

export function Icon({ name, size = 18, color = COLORS.text, style }) {
  return <Ionicons color={color} name={name} size={size} style={style} />;
}
