// ============================================================
// src/navigation/index.tsx
// Arbre de navigation racine de LifeDrop
// Onboarding → App principale (BottomTabs) + modals
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";

import { useAppStore } from "../store/useAppStore";
import type {
  MainTabParamList,
  OnboardingStackParamList,
  RootStackParamList,
} from "./types";

// ─── Écrans Onboarding ────────────────────────────────────────
import { BloodTypeScreen } from "../screens/onboarding/BloodTypeScreen";
import { LastDonationScreen } from "../screens/onboarding/LastDonationScreen";
import { NotificationsSetupScreen } from "../screens/onboarding/NotificationsSetupScreen";
import { WelcomeScreen } from "../screens/onboarding/WelcomeScreen";

// ─── Écrans principaux ────────────────────────────────────────
import { DashboardScreen } from "../screens/dashboard/DashboardScreen";
import { EducationScreen } from "../screens/education/EducationScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";

// ─── Écrans modaux ────────────────────────────────────────────
import { DonationSuccessScreen } from "../screens/donation/DonationSuccessScreen";
import { RegisterDonationScreen } from "../screens/donation/RegisterDonationScreen";
import { ShareImpactScreen } from "../screens/donation/ShareImpactScreen";
import { ShareProfileScreen } from "../screens/profile/ShareProfileScreen";
import { TeamDashboardScreen } from "../screens/profile/TeamDashboardScreen";
import { TeamJoinScreen } from "../screens/profile/TeamJoinScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// ─── Sous-navigateur Onboarding ───────────────────────────────
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="BloodType" component={BloodTypeScreen} />
      <OnboardingStack.Screen
        name="LastDonation"
        component={LastDonationScreen}
      />
      <OnboardingStack.Screen
        name="NotificationsSetup"
        component={NotificationsSetupScreen}
      />
    </OnboardingStack.Navigator>
  );
}

// ─── Tabs principaux de l'app ─────────────────────────────────
function MainTabNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const bg = isDark ? "#1C1917" : "#FFFFFF";
  const active = "#C53030";
  const inactive = isDark ? "#78716C" : "#A8A29E";

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: isDark ? "#44403C" : "#E7E5E4",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <MainTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Accueil — tableau de bord",
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Profil utilisateur",
        }}
      />
      <MainTab.Screen
        name="Education"
        component={EducationScreen}
        options={{
          tabBarLabel: "Infos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Informations et éducation",
        }}
      />
    </MainTab.Navigator>
  );
}

// ─── Navigateur racine ────────────────────────────────────────
export function RootNavigator() {
  const isOnboardingCompleted = useAppStore((s) => s.isOnboardingCompleted);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        {!isOnboardingCompleted ? (
          // L'utilisateur n'a pas encore fait l'onboarding
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          // App principale
          <>
            <RootStack.Screen name="Main" component={MainTabNavigator} />
            <RootStack.Screen
              name="RegisterDonation"
              component={RegisterDonationScreen}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <RootStack.Screen
              name="DonationSuccess"
              component={DonationSuccessScreen}
              options={{
                presentation: "fullScreenModal",
                animation: "fade_from_bottom",
                gestureEnabled: false,
              }}
            />
            <RootStack.Screen
              name="ShareProfile"
              component={ShareProfileScreen}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <RootStack.Screen
              name="TeamJoin"
              component={TeamJoinScreen}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <RootStack.Screen
              name="TeamDashboard"
              component={TeamDashboardScreen}
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <RootStack.Screen
              name="ShareImpact"
              component={ShareImpactScreen}
              options={{
                presentation: "fullScreenModal",
                animation: "slide_from_bottom",
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
