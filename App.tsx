// ============================================================
// App.tsx — Point d'entrée principal de l'application LifeDrop
// ============================================================

import { registerRootComponent } from "expo";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { LogBox, StyleSheet } from "react-native";
import "react-native-gesture-handler"; // doit être le 1er import
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { RootNavigator } from "./src/navigation";
import config from "./src/theme/tamagui.config";

// ─── Supprimer les avertissements non bloquants en dev ──────────────────────
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "ViewPropTypes will be removed from React Native",
]);

// ─── Configuration du comportement de notification en premier plan ───────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// ─── Composant racine ───────────────────────────────────────────────────────
export default function App() {
  /** Ref pour stocker la souscription afin de la nettoyer au démontage */
  const notifListenerRef = useRef<Notifications.Subscription | null>(null);

  // ─── Charger les polices d'icônes au démarrage ──────────────────────────────
  // Les fonts sont copiées dans assets/fonts par le custom-font-loader plugin
  // avec les BONS NOMS : material-community.ttf, ionicons.ttf, material.ttf
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "material-community": require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"),
          ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
          material: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
        });

        if (__DEV__) {
          console.log("[LifeDrop] Icon fonts loaded successfully");
        }
      } catch (e) {
        console.warn("[LifeDrop] Icon font loading failed (non-blocking):", e);
      }
    }
    loadFonts();
  }, []);

  useEffect(() => {
    // Listener : notification reçue en premier plan (app ouverte)
    notifListenerRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // En production, on pourrait afficher un toast interne ici
        if (__DEV__) {
          console.log(
            "[LifeDrop] Notification reçue en FG:",
            notification.request.content.title,
          );
        }
      },
    );

    // Listener : l'utilisateur tape sur une notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (__DEV__) {
          console.log(
            "[LifeDrop] Tap notification:",
            response.notification.request.content.title,
          );
        }
        // La navigation vers l'écran de don pourrait être déclenchée ici
        // en utilisant une ref de navigation globale si besoin.
      });

    return () => {
      notifListenerRef.current?.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <TamaguiProvider config={config} defaultTheme="dark">
            {/* StatusBar toujours clair sur fond sombre */}
            <StatusBar style="light" backgroundColor="#0f0f0f" translucent />

            {/* Navigateur racine : Onboarding OU Main tabs */}
            <RootNavigator />
          </TamaguiProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0f0f0f" },
});

// Enregistrer le composant racine auprès d'AppRegistry
registerRootComponent(App);
