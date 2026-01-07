module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['EXPO_PUBLIC_API_BASE_URL', 'EXPO_PUBLIC_FUNCTION_KEY', 'BASE_URL', 'FUNCTION_KEY'],
      },
    ],
  ],
};
