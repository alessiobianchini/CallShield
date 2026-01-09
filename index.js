/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_FATAL_KEY = '@callshield_last_fatal';
global.__CALLSHIELD_LAST_FATAL = null;

// Global handler to capture fatal JS errors (even before render) and persist them for next launch.
ErrorUtils.setGlobalHandler((err, isFatal) => {
  try {
    const payload = {
      message: err?.message,
      stack: err?.stack,
      isFatal: !!isFatal,
      ts: Date.now(),
    };
    global.__CALLSHIELD_LAST_FATAL = payload;
    AsyncStorage.setItem(LAST_FATAL_KEY, JSON.stringify(payload)).catch(() => undefined);
  } catch {
    // ignore storage errors
  }
  // Intentionally do NOT call the default handler to avoid app termination; we want to see the screen.
});

// Wrap App with an error boundary to surface render errors instead of blank screen.
AppRegistry.registerComponent(appName, () => App);
