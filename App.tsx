import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
  const [lastFatal, setLastFatal] = useState<{ message?: string; stack?: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@callshield_last_fatal');
        if (raw) {
          setLastFatal(JSON.parse(raw));
          await AsyncStorage.removeItem('@callshield_last_fatal');
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>CallShield minimal</Text>
      <Text style={styles.subtitle}>Schermo di test per isolare crash.</Text>
      {lastFatal ? (
        <ScrollView style={styles.errorBox}>
          <Text style={styles.errorTitle}>Last JS fatal:</Text>
          <Text style={styles.errorText}>{lastFatal.message || 'Unknown error'}</Text>
          {lastFatal.stack ? <Text style={styles.errorStack}>{lastFatal.stack}</Text> : null}
        </ScrollView>
      ) : null}
    </SafeAreaView>
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
  errorBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 6,
  },
  errorStack: {
    fontSize: 12,
    color: '#475569',
  },
});

export default App;





