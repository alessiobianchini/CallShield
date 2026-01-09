import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import ErrorBoundary from './src/ErrorBoundary';

function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>CallShield minimal</Text>
        <Text style={styles.subtitle}>App base senza dipendenze extra.</Text>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
  },
});

export default App;





