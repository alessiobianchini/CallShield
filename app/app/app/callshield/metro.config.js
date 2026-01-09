const { getDefaultConfig } = require('expo/metro-config');

// Use the Expo default Metro config scoped to this app directory.
const config = getDefaultConfig(__dirname);

module.exports = config;
