// ============================================================
// src/components/ui/GradientText.tsx
// Texte avec dégradé corail → orange via un SVG mask
// ============================================================

import Svg, { Defs, LinearGradient, Stop, Text } from "react-native-svg";

interface GradientTextProps {
  children: string;
  fontSize?: number;
  fontWeight?: string;
  width?: number;
  height?: number;
}

export function GradientText({
  children,
  fontSize = 52,
  fontWeight = "800",
  width = 220,
  height = 72,
}: GradientTextProps) {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#f87171" />
          <Stop offset="1" stopColor="#fb923c" />
        </LinearGradient>
      </Defs>
      <Text
        fill="url(#textGrad)"
        fontSize={fontSize}
        fontWeight={fontWeight}
        x="0"
        y={height - 8}
      >
        {children}
      </Text>
    </Svg>
  );
}
