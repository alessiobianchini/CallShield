import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

/**
 * Simple error boundary to avoid blank screen on render errors.
 * Shows the error message in release so we can diagnose without Metro.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const payload = {
      message: error?.message,
      stack: info?.componentStack || error?.stack,
      ts: Date.now(),
    };
    console.error('[ErrorBoundary]', payload);
    // Persist so we can inspect on next launch if needed.
    AsyncStorage.setItem('@callshield_last_render_error', JSON.stringify(payload)).catch(() => undefined);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
          <ScrollView style={styles.stackBox}>
            <Text style={styles.stack} selectable>
              {this.state.error.stack}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 10,
  },
  stackBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  stack: {
    fontSize: 12,
    color: '#0f172a',
  },
});
