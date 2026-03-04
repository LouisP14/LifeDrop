// ============================================================
// src/components/ui/CountdownRing.tsx
// Anneau SVG circulaire pour le compte à rebours (design mockup)
// ============================================================

import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

interface CountdownRingProps {
  /** Nombre de jours restants */
  daysRemaining: number;
  /** Délai total en jours (pour calculer le %) */
  totalDays: number;
  /** Diamètre du composant */
  size?: number;
}

export function CountdownRing({
  daysRemaining,
  totalDays,
  size = 80,
}: CountdownRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  // Progression : on montre ce qui est déjà "consommé" (jours passés)
  const elapsed = Math.max(0, totalDays - daysRemaining);
  const fraction = Math.min(elapsed / totalDays, 1);
  const strokeDashoffset = circumference * (1 - fraction);
  const cx = size / 2;
  const cy = size / 2;

  // Couleur en fonction de l'urgence
  const isClose = daysRemaining <= 7;
  const arcColor = isClose ? "#34d399" : "#fb923c";

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#f87171" />
            <Stop offset="1" stopColor="#fb923c" />
          </LinearGradient>
        </Defs>
        {/* Piste de fond */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth={5}
        />
        {/* Arc de progression */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={isClose ? arcColor : "url(#ringGrad)"}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Valeur centrale */}
        <SvgText
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          fill={arcColor}
          fontSize={size * 0.24}
          fontWeight="800"
        >
          {daysRemaining}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
