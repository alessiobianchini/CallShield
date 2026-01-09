import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Minimal registration, no global handlers (avoid extra native deps).
AppRegistry.registerComponent(appName, () => App);
