import React, {useCallback, useEffect, useState} from 'react';
import {BlurView} from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import ErrorBoundary from './src/ErrorBoundary';
import {fetchHealth} from './src/api';

function App(): React.JSX.Element {
  const [counter, setCounter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<string>('pending...');
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('debug_counter');
        setCounter(raw ? Number(raw) : 0);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetchHealth();
        setHealth(res.message);
        setHealthError(null);
      } catch (e) {
        setHealthError((e as Error).message);
      }
    };
    check();
  }, []);

  const bump = useCallback(async () => {
    try {
      const next = (counter ?? 0) + 1;
      await AsyncStorage.setItem('debug_counter', String(next));
      setCounter(next);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [counter]);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.card}>
          <Text style={styles.title}>CallShield minimale</Text>
          <Text style={styles.subtitle}>
            Verifica bridging nativo (AsyncStorage + BlurView).
          </Text>
          <View style={styles.box}>
            <BlurView style={styles.blur} blurType="light" blurAmount={12} />
            {loading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Text style={styles.counterLabel}>Counter persistito:</Text>
                <Text style={styles.counterValue}>{counter ?? 'n/d'}</Text>
                <Pressable style={styles.button} onPress={bump}>
                  <Text style={styles.buttonText}>Incrementa e salva</Text>
                </Pressable>
              </>
            )}
          </View>
          {error ? <Text style={styles.error}>Errore: {error}</Text> : null}
          <View style={styles.apiCard}>
            <Text style={styles.sectionTitle}>Backend health</Text>
            {healthError ? (
              <Text style={styles.error}>Errore: {healthError}</Text>
            ) : (
              <Text style={styles.apiText}>{health}</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
  },
  box: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: '#e2e8f0',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  counterLabel: {
    fontSize: 14,
    color: '#334155',
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  error: {
    color: '#b91c1c',
  },
  apiCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  apiText: {
    color: '#0f172a',
  },
});

export default App;





