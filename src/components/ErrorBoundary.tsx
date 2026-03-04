// ============================================================
// src/components/ErrorBoundary.tsx
// Composant Error Boundary global — empêche le crash complet
// de l'application en cas d'erreur non attrapée dans le rendu.
// ============================================================

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { errorTracker } from "../services/ErrorTracker";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorTracker.captureException(error, {
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={64}
                color="#f87171"
              />
            </View>

            <Text style={styles.title}>Oups, une erreur est survenue</Text>
            <Text style={styles.subtitle}>
              L'application a rencontré un problème inattendu. Tes données sont
              en sécurité.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {this.state.error.message}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.retryBtn}
              onPress={this.handleReset}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="refresh" size={18} color="#ffffff" />
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  iconWrap: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f5f5f5",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.3)",
    borderRadius: 12,
    padding: 14,
    width: "100%",
  },
  errorText: {
    fontSize: 12,
    color: "#f87171",
    fontFamily: "monospace",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: "#f87171",
    marginTop: 8,
    shadowColor: "#f87171",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },
});
