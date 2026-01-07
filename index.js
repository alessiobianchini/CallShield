/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_FATAL_KEY = '@callshield_last_fatal';

// Global handler to capture fatal JS errors (useful on iOS/TestFlight without Metro).
const defaultHandler = ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((err, isFatal) => {
  try {
    const payload = {
      message: err?.message,
      stack: err?.stack,
      isFatal: !!isFatal,
      ts: Date.now(),
    };
    AsyncStorage.setItem(LAST_FATAL_KEY, JSON.stringify(payload)).catch(() => undefined);
  } catch {
    // ignore storage errors
  }
  if (defaultHandler) {
    defaultHandler(err, isFatal);
  }
});

AppRegistry.registerComponent(appName, () => App);
