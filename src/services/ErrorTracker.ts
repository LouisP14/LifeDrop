// ============================================================
// src/services/ErrorTracker.ts
// Service de suivi d'erreurs — prêt pour Sentry ou autre.
// En dev : console. En prod : à connecter via init().
// ============================================================

type ErrorContext = Record<string, string | undefined>;

interface ErrorTrackerProvider {
  captureException: (error: Error, context?: ErrorContext) => void;
  captureMessage: (message: string, context?: ErrorContext) => void;
}

class ErrorTracker {
  private provider: ErrorTrackerProvider | null = null;

  /** Connecter un provider externe (Sentry, Bugsnag, etc.) */
  init(provider: ErrorTrackerProvider) {
    this.provider = provider;
  }

  captureException(error: Error, context?: ErrorContext) {
    if (__DEV__) {
      console.error("[ErrorTracker]", error.message, context);
    }

    this.provider?.captureException(error, context);
  }

  captureMessage(message: string, context?: ErrorContext) {
    if (__DEV__) {
      console.warn("[ErrorTracker]", message, context);
    }

    this.provider?.captureMessage(message, context);
  }
}

export const errorTracker = new ErrorTracker();
