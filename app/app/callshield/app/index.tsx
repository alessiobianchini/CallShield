import { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Switch,
} from 'react-native';
import { fetchList, reportCall } from '@/src/api';

type RiskLevel = 'low' | 'medium' | 'high';

type RecentCall = {
  id: string;
  number: string;
  label: string;
  risk: RiskLevel;
  timeAgo: string;
};

type ProtectionState = {
  blockingEnabled: boolean;
  identificationEnabled: boolean;
  lastUpdate: string;
  reportsThisWeek: number;
};

const mockCalls: RecentCall[] = [
  { id: '1', number: '+39 02 1234 5678', label: 'Telemarketing', risk: 'high', timeAgo: '3m fa' },
  { id: '2', number: '+39 06 4432 1189', label: 'Possibile spam', risk: 'medium', timeAgo: '25m fa' },
  { id: '3', number: '+39 320 987 6543', label: 'Sospetto robo-call', risk: 'high', timeAgo: 'Ieri' },
];

export default function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const [protection, setProtection] = useState<ProtectionState>({
    blockingEnabled: true,
    identificationEnabled: true,
    lastUpdate: 'oggi, 09:42',
    reportsThisWeek: 12,
  });
  const [calls, setCalls] = useState<RecentCall[]>(mockCalls);
  const [version, setVersion] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const palette = useMemo(
    () =>
      isDarkMode
        ? {
            bg: '#0c0f14',
            card: '#151a24',
            text: '#f5f7fb',
            sub: '#9aa4b5',
            accent: '#5da9f6',
            danger: '#ff6b6b',
            warn: '#f5c542',
            success: '#2ecc71',
          }
        : {
            bg: '#f4f6fb',
            card: '#ffffff',
            text: '#0d1b2a',
            sub: '#4a5568',
            accent: '#2563eb',
            danger: '#ef4444',
            warn: '#f59e0b',
            success: '#16a34a',
          },
    [isDarkMode],
  );

  const riskToColor = (risk: RiskLevel) => {
    if (risk === 'high') return palette.danger;
    if (risk === 'medium') return palette.warn;
    return palette.success;
  };

  const handleReload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchList(version);
      const now = new Date().toLocaleTimeString();
      const incoming: RecentCall[] = data.add.map((item, idx) => ({
        id: `${item.number}-${data.version}-${idx}`,
        number: item.number,
        label: item.label ?? 'Spam',
        risk: (item.risk as RiskLevel) ?? 'medium',
        timeAgo: 'ora',
      }));
      setCalls(incoming.length ? incoming : calls);
      setVersion(data.version);
      setProtection(prev => ({ ...prev, lastUpdate: now }));
    } catch (e: any) {
      setError(e.message ?? 'Aggiornamento fallito');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (call: RecentCall) => {
    try {
      await reportCall({ number: call.number, category: call.label || 'spam' });
      setProtection(prev => ({ ...prev, reportsThisWeek: prev.reportsThisWeek + 1 }));
      setCalls(prev => prev.filter(c => c.id !== call.id));
    } catch (e: any) {
      setError(e.message ?? 'Segnalazione fallita');
    }
  };

  const toggleBlocking = (next: boolean) => setProtection(prev => ({ ...prev, blockingEnabled: next }));
  const toggleIdentification = (next: boolean) =>
    setProtection(prev => ({ ...prev, identificationEnabled: next }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>CallShield</Text>
        <Text style={[styles.subtitle, { color: palette.sub }]}>
          Blocca spam, identifica chi chiama e raccogli segnalazioni.
        </Text>
        {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}

        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Protezione</Text>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: palette.text }]}>Blocco numeri spam</Text>
            <Switch
              value={protection.blockingEnabled}
              onValueChange={toggleBlocking}
              thumbColor={palette.card}
              trackColor={{ true: palette.accent, false: '#b8c2d1' }}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: palette.text }]}>Identificazione chiamante</Text>
            <Switch
              value={protection.identificationEnabled}
              onValueChange={toggleIdentification}
              thumbColor={palette.card}
              trackColor={{ true: palette.accent, false: '#b8c2d1' }}
            />
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: palette.sub }]}>
              Ultimo aggiornamento · {protection.lastUpdate}
            </Text>
            <TouchableOpacity
              style={[styles.pill, { backgroundColor: palette.accent }]}
              onPress={handleReload}
              disabled={loading}
            >
              <Text style={[styles.pillText, { color: '#fff' }]}>{loading ? '...' : 'Aggiorna'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Segnalazioni</Text>
            <Text style={[styles.badge, { color: palette.accent }]}>
              Questa settimana: {protection.reportsThisWeek}
            </Text>
          </View>
          <Text style={[styles.meta, { color: palette.sub }]}>
            Invia segnalazioni per migliorare i punteggi di rischio condivisi.
          </Text>
          {calls.length === 0 ? (
            <Text style={[styles.meta, { color: palette.sub, marginTop: 12 }]}>
              Nessuna chiamata recente da segnalare.
            </Text>
          ) : (
            calls.map(call => (
              <View key={call.id} style={[styles.callRow, { borderColor: palette.bg }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.callNumber, { color: palette.text }]}>{call.number}</Text>
                  <Text style={[styles.callLabel, { color: palette.sub }]}>
                    {call.label} · {call.timeAgo}
                  </Text>
                </View>
                <View style={[styles.riskDot, { backgroundColor: riskToColor(call.risk) }]} />
                <TouchableOpacity
                  style={[styles.reportButton, { borderColor: palette.accent }]}
                  onPress={() => handleReport(call)}
                >
                  <Text style={[styles.reportText, { color: palette.accent }]}>Segnala</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={[styles.card, { backgroundColor: palette.card }]}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Checklist iOS</Text>
          <Text style={[styles.meta, { color: palette.sub }]}>
            Aggiungi un Call Directory Extension in Xcode e richiama `CXCallDirectoryManager.reloadExtension()`
            dall’app per applicare la lista.
          </Text>
          <Text style={[styles.meta, { color: palette.sub, marginTop: 8 }]}>
            Percorso utente: Impostazioni › Telefono › Blocco e identificazione › abilita “CallShield”.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  meta: {
    fontSize: 14,
  },
  badge: {
    fontSize: 14,
    fontWeight: '700',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  callNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  callLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  riskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  reportButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  reportText: {
    fontWeight: '700',
  },
  error: {
    fontSize: 14,
    fontWeight: '600',
  },
});
