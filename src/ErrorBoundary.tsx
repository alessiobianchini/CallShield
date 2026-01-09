import React from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';

type Props = {
  children: React.ReactNode;
};

type State = {
  error?: Error;
};

/**
 * Minimal error boundary to avoid silent white screens in release.
 * Shows the error message and stack so we can surface JS failures on device.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return {error};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught', error, info.componentStack);
  }

  reset = () => this.setState({error: undefined});

  render(): React.ReactNode {
    const {error} = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Si è verificato un errore</Text>
        <Text style={styles.message}>{error.message}</Text>
        {error.stack ? (
          <Text style={styles.stack} selectable>
            {error.stack}
          </Text>
        ) : null}
        <Button title="Riprova" onPress={this.reset} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    color: '#f1f5f9',
    fontSize: 16,
  },
  stack: {
    color: '#cbd5e1',
    fontFamily: 'Menlo',
    fontSize: 12,
  },
});
