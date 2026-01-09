/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorBoundary } from './src/ErrorBoundary';

const LAST_FATAL_KEY = '@callshield_last_fatal';

// Global handler to capture fatal JS errors (useful on iOS/TestFlight without Metro).
const defaultHandler = ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((err, isFatal) => {
  try {
    if (isFatal) {
      const payload = {
        message: err?.message,
        stack: err?.stack,
        isFatal: true,
        ts: Date.now(),
      };
      AsyncStorage.setItem(LAST_FATAL_KEY, JSON.stringify(payload)).catch(() => undefined);
    }
  } catch {
    // ignore storage errors
  }
  if (defaultHandler) {
    defaultHandler(err, isFatal);
  }
});

// Wrap App with an error boundary to surface render errors instead of blank screen.
AppRegistry.registerComponent(appName, () => () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
));
