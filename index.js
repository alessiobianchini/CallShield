import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Config injection (can be set via env at bundle time or overridden nativamente).
global.__APP_CONFIG__ = {
  baseUrl:
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.EXPO_PUBLIC_API_BASE_URL) ||
    '',
  functionKey:
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.EXPO_PUBLIC_FUNCTION_KEY) ||
    '',
};

// Minimal registration, no global handlers (avoid extra native deps).
AppRegistry.registerComponent(appName, () => App);
