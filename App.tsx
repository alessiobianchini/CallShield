import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  Linking,
  View,
  Switch,
  TextInput,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchList, reportCall } from './src/api';
import { Lang, t } from './src/i18n';
import {
  cleanupIap,
  fetchPlusProduct,
  initIap,
  platformSupportsIap,
  purchasePlus,
  restorePurchases,
} from './src/subscriptions';

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

const LAST_FATAL_KEY = '@callshield_last_fatal';
const STATE_KEY = '@callshield_state_v1';

type PersistedState = {
  version: number;
  calls: RecentCall[];
  protection: ProtectionState;
};

const mockCalls: RecentCall[] = [
  { id: '1', number: '+39 02 1234 5678', label: 'Telemarketing', risk: 'high', timeAgo: '3m' },
  { id: '2', number: '+39 06 4432 1189', label: 'Possibile spam', risk: 'medium', timeAgo: '25m' },
  { id: '3', number: '+39 320 987 6543', label: 'Sospetto robo-call', risk: 'high', timeAgo: '1d' },
];

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [protection, setProtection] = useState<ProtectionState>({
    blockingEnabled: true,
    identificationEnabled: true,
    lastUpdate: '—',
    reportsThisWeek: 0,
  });
  const [calls, setCalls] = useState<RecentCall[]>([]);
  const [version, setVersion] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const [plusActive, setPlusActive] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [iapReady, setIapReady] = useState(false);
  const [paywallPrice, setPaywallPrice] = useState<string | null>(null);
  const [iapMessage, setIapMessage] = useState<string | null>(null);
  const [reportVisible, setReportVisible] = useState(false);
  const [gdprVisible, setGdprVisible] = useState(false);
  const [reportNumber, setReportNumber] = useState('');
  const [reportCategory, setReportCategory] = useState('');
  const [lastFatal, setLastFatal] = useState<{ message?: string; stack?: string; ts?: number } | null>(null);
  const blockingEnabled = plusActive && protection.blockingEnabled;

  const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <View style={styles.card}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={isDarkMode ? 'dark' : 'light'}
        blurAmount={12}
        blurRadius={10}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: palette.card, borderRadius: 18, borderColor: palette.cardBorder, borderWidth: 1 },
        ]}
      />
      <View style={styles.cardInner}>{children}</View>
    </View>
  );

  const GlassPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <View style={styles.modalCard}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={isDarkMode ? 'dark' : 'light'}
        blurAmount={12}
        blurRadius={10}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: palette.card, borderRadius: 16, borderColor: palette.cardBorder, borderWidth: 1 },
        ]}
      />
      <View style={styles.modalInner}>{children}</View>
    </View>
  );

  const palette = useMemo(
    () =>
      isDarkMode
        ? {
            bg: '#0c0f14',
            card: 'rgba(255,255,255,0.08)',
            cardBorder: 'rgba(255,255,255,0.18)',
            text: '#f5f7fb',
            sub: '#9aa4b5',
            accent: '#5da9f6',
            danger: '#ff6b6b',
            warn: '#f5c542',
            success: '#2ecc71',
          }
        : {
            bg: '#f4f6fb',
            card: 'rgba(255,255,255,0.75)',
            cardBorder: 'rgba(255,255,255,0.35)',
            text: '#0d1b2a',
            sub: '#4a5568',
            accent: '#2563eb',
            danger: '#ef4444',
            warn: '#f59e0b',
            success: '#16a34a',
          },
    [isDarkMode],
  );

  useEffect(() => {
    // Hermes on Android may not ship Intl by default; guard to avoid a startup crash.
    const sysLocale =
      typeof Intl !== 'undefined' && Intl.DateTimeFormat
        ? Intl.DateTimeFormat().resolvedOptions().locale
        : 'en';
    const lc = sysLocale.toLowerCase();
    if (lc.startsWith('it')) setLang('it');
    else if (lc.startsWith('es')) setLang('es');
    else if (lc.startsWith('fr')) setLang('fr');
    else if (lc.startsWith('de')) setLang('de');
    else if (lc.startsWith('pt')) setLang('pt');
    else setLang('en');
  }, []);

  // Carica stato persistito e trigger initial sync
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STATE_KEY);
        if (raw && mounted) {
          const parsed: PersistedState = JSON.parse(raw);
          setCalls(parsed.calls || []);
          setVersion(parsed.version || 0);
          setProtection(parsed.protection || protection);
        }
      } catch {
        // ignore
      }
      await handleReload(true).catch(() => undefined);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { ready, isMock } = await initIap().catch(() => ({ ready: false, isMock: true }));
      if (!mounted) return;
      setIapReady(ready);
      const product = await fetchPlusProduct().catch(() => null);
      if (mounted && product?.price) setPaywallPrice(product.price);
      if (isMock) {
        setIapMessage('Sandbox mode: purchases are mocked on this device.');
      }
    })();
    return () => {
      mounted = false;
      cleanupIap().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LAST_FATAL_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const fresh = parsed?.ts ? Date.now() - parsed.ts < 10 * 60 * 1000 : true;
          if (fresh) {
            setLastFatal(parsed);
            console.log('[LAST_FATAL]', parsed);
          }
          await AsyncStorage.removeItem(LAST_FATAL_KEY);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;
      try {
        const parsed = new URL(url);
        if (parsed.protocol.startsWith('callshield')) {
          const n = parsed.searchParams.get('number');
          if (n) {
            setReportNumber(n);
            setReportVisible(true);
          }
        }
      } catch {
        // ignore
      }
    };
    Linking.getInitialURL().then(handleUrl);
    const sub = Linking.addEventListener('url', evt => handleUrl(evt.url));
    return () => {
      sub.remove();
    };
  }, []);

  const riskToColor = (risk: RiskLevel) => {
    if (risk === 'high') return palette.danger;
    if (risk === 'medium') return palette.warn;
    return palette.success;
  };

  const handleReload = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchList(version);
      const now = new Date().toLocaleTimeString();
      const incoming: RecentCall[] = data.add.map((item, idx) => ({
        id: `${item.number}-${data.version}-${idx}`,
        number: item.number,
        label: item.label ?? 'Spam',
        risk: (item.risk as RiskLevel) ?? 'medium',
        timeAgo: 'now',
      }));
      const merged = incoming.length ? incoming : calls;
      setCalls(merged);
      setVersion(data.version);
      const nextProtection = { ...protection, lastUpdate: now };
      setProtection(nextProtection);
      await AsyncStorage.setItem(
        STATE_KEY,
        JSON.stringify({ version: data.version, calls: merged, protection: nextProtection }),
      );
    } catch (e: any) {
      setError(e.message ?? 'Update failed');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleReport = async (call: RecentCall) => {
    try {
      await reportCall({ number: call.number, category: call.label || 'spam' });
      setProtection(prev => ({ ...prev, reportsThisWeek: prev.reportsThisWeek + 1 }));
      const nextCalls = calls.filter(c => c.id !== call.id);
      setCalls(nextCalls);
      await AsyncStorage.setItem(
        STATE_KEY,
        JSON.stringify({ version, calls: nextCalls, protection }),
      );
    } catch (e: any) {
      setError(e.message ?? 'Report failed');
    }
  };

  const submitReportModal = async () => {
    if (!reportNumber.trim()) {
      setReportVisible(false);
      return;
    }
    try {
      await reportCall({ number: reportNumber.trim(), category: reportCategory || 'spam' });
      setProtection(prev => ({ ...prev, reportsThisWeek: prev.reportsThisWeek + 1 }));
      setReportVisible(false);
      setReportNumber('');
      setReportCategory('');
    } catch (e: any) {
      setError(e.message ?? 'Report failed');
    }
  };

  const toggleBlocking = (next: boolean) => setProtection(prev => ({ ...prev, blockingEnabled: next }));
  const toggleIdentification = (next: boolean) =>
    setProtection(prev => ({ ...prev, identificationEnabled: next }));

  const handleStartPlus = async () => {
    setIapMessage(null);
    try {
      const result = await purchasePlus();
      if (result.entitlementActive) {
        setPlusActive(true);
        setPaywallVisible(false);
        setIapMessage(result.message || t(lang, 'entitlementActive'));
      } else if (result.message) {
        setIapMessage(result.message);
      }
    } catch (e: any) {
      setIapMessage(e?.message || 'Purchase failed');
    }
  };

  const handleRestore = async () => {
    setIapMessage(null);
    try {
      const res = await restorePurchases();
      if (res.entitlementActive) {
        setPlusActive(true);
        setPaywallVisible(false);
        setIapMessage(res.message || t(lang, 'entitlementActive'));
      } else {
        setIapMessage(res.message || t(lang, 'entitlementInactive'));
      }
    } catch (e: any) {
      setIapMessage(e?.message || 'Restore failed');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.content}>
        {lastFatal ? (
          <GlassCard>
            <Text style={[styles.sectionTitle, { color: palette.danger }]}>Last crash (debug info)</Text>
            <Text style={[styles.meta, { color: palette.text, marginTop: 4 }]}>
              {lastFatal.message || 'Unknown fatal error'}
            </Text>
            {lastFatal.stack ? (
              <Text style={[styles.meta, { color: palette.sub, marginTop: 6 }]} numberOfLines={5}>
                {lastFatal.stack}
              </Text>
            ) : null}
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: palette.sub, marginTop: 8 }]}
              onPress={() => setLastFatal(null)}
            >
              <Text style={[styles.reportText, { color: palette.sub }]}>Dismiss</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : null}

        <Text style={[styles.title, { color: palette.text }]}>{t(lang, 'title')}</Text>
        <Text style={[styles.subtitle, { color: palette.sub }]}>{t(lang, 'subtitle')}</Text>
        {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}

        <GlassCard>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>{t(lang, 'paywallTitle')}</Text>
            <View
              style={[
                styles.pill,
                { backgroundColor: plusActive ? palette.success : palette.card, borderWidth: 1, borderColor: palette.accent },
              ]}
            >
              <Text style={[styles.pillText, { color: plusActive ? '#fff' : palette.accent }]}>
                {plusActive ? t(lang, 'entitlementActive') : t(lang, 'entitlementInactive')}
              </Text>
            </View>
          </View>
          <Text style={[styles.meta, { color: palette.sub }]}>{t(lang, 'paywallSubtitle')}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: palette.accent }]}
            onPress={() => setPaywallVisible(true)}
          >
            <Text style={[styles.primaryText, { color: '#fff' }]}>
              {t(lang, 'ctaStart')} {paywallPrice ? `- ${paywallPrice}` : ''}
            </Text>
          </TouchableOpacity>
          {iapMessage ? <Text style={[styles.meta, { color: palette.sub, marginTop: 8 }]}>{iapMessage}</Text> : null}
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t(lang, 'protection')}</Text>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: palette.text }]}>{t(lang, 'blockToggle')}</Text>
            <Switch
              value={blockingEnabled}
              onValueChange={next => {
                if (!plusActive) {
                  setPaywallVisible(true);
                  return;
                }
                toggleBlocking(next);
              }}
              thumbColor={palette.card}
              trackColor={{ true: palette.accent, false: '#b8c2d1' }}
            />
          </View>
          {!plusActive ? <Text style={[styles.meta, { color: palette.sub }]}>{t(lang, 'entitlementUpgrade')}</Text> : null}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: palette.text }]}>{t(lang, 'identifyToggle')}</Text>
            <Switch
              value={protection.identificationEnabled}
              onValueChange={toggleIdentification}
              thumbColor={palette.card}
              trackColor={{ true: palette.accent, false: '#b8c2d1' }}
            />
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: palette.sub }]}>{`${t(lang, 'lastUpdate')} - ${protection.lastUpdate}`}</Text>
            <TouchableOpacity
              style={[styles.pill, { backgroundColor: palette.accent }]}
              onPress={handleReload}
              disabled={loading}
            >
              <Text style={[styles.pillText, { color: '#fff' }]}>{loading ? t(lang, 'updateLoading') : t(lang, 'update')}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>{t(lang, 'reportsTitle')}</Text>
            <Text style={[styles.badge, { color: palette.accent }]}>{`${t(lang, 'reportsWeek')} ${protection.reportsThisWeek}`}</Text>
          </View>
          <Text style={[styles.meta, { color: palette.sub }]}>{t(lang, 'reportHint')}</Text>
          {calls.length === 0 ? (
            <Text style={[styles.meta, { color: palette.sub, marginTop: 12 }]}>{t(lang, 'noCalls')}</Text>
          ) : (
            calls.map(call => (
              <View key={call.id} style={[styles.callRow, { borderColor: palette.bg }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.callNumber, { color: palette.text }]}>{call.number}</Text>
                  <Text style={[styles.callLabel, { color: palette.sub }]}>{`${call.label} - ${call.timeAgo}`}</Text>
                </View>
                <View style={[styles.riskDot, { backgroundColor: riskToColor(call.risk) }]} />
                <TouchableOpacity style={[styles.reportButton, { borderColor: palette.accent }]} onPress={() => handleReport(call)}>
                  <Text style={[styles.reportText, { color: palette.accent }]}>{t(lang, 'reportButton')}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t(lang, 'checklistTitle')}</Text>
          <Text style={[styles.meta, { color: palette.sub }]}>{t(lang, 'checklistBody')}</Text>
          <Text style={[styles.meta, { color: palette.sub, marginTop: 8 }]}>{t(lang, 'checklistPath')}</Text>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t(lang, 'gdprTitle')}</Text>
          <Text style={[styles.meta, { color: palette.sub, marginBottom: 8 }]}>{t(lang, 'gdprSummary')}</Text>
          <TouchableOpacity
            style={[styles.outlineButton, { borderColor: palette.accent }]}
            onPress={() => setGdprVisible(true)}
          >
            <Text style={[styles.reportText, { color: palette.accent }]}>{t(lang, 'gdprOpen')}</Text>
          </TouchableOpacity>
        </GlassCard>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t(lang, 'reportNumber')}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: palette.accent }]}
            onPress={() => setReportVisible(true)}
          >
            <Text style={[styles.primaryText, { color: '#fff' }]}>{t(lang, 'reportNumber')}</Text>
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>

      <Modal visible={paywallVisible} animationType="slide" transparent onRequestClose={() => setPaywallVisible(false)}>
        <View style={styles.modalBackdrop}>
          <GlassPanel>
            <Text style={[styles.title, { color: palette.text, fontSize: 24 }]}>{t(lang, 'paywallTitle')}</Text>
            <Text style={[styles.meta, { color: palette.sub, marginVertical: 8 }]}>{t(lang, 'paywallSubtitle')}</Text>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>{paywallPrice || t(lang, 'paywallPrice')}</Text>

            <View style={{ gap: 8, marginVertical: 12 }}>
              <Text style={[styles.meta, { color: palette.text }]}>- {t(lang, 'benefitFast')}</Text>
              <Text style={[styles.meta, { color: palette.text }]}>- {t(lang, 'benefitPriority')}</Text>
              <Text style={[styles.meta, { color: palette.text }]}>- {t(lang, 'benefitReports')}</Text>
              <Text style={[styles.meta, { color: palette.text }]}>- {t(lang, 'benefitSync')}</Text>
              <Text style={[styles.meta, { color: palette.text }]}>- {t(lang, 'benefitAdFree')}</Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: palette.accent }]}
              onPress={handleStartPlus}
              disabled={!iapReady || !platformSupportsIap()}
            >
              <Text style={[styles.primaryText, { color: '#fff' }]}>{t(lang, 'ctaStart')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.outlineButton, { borderColor: palette.accent }]} onPress={handleRestore}>
              <Text style={[styles.reportText, { color: palette.accent }]}>{t(lang, 'ctaRestore')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.outlineButton, { borderColor: palette.sub }]} onPress={() => setPaywallVisible(false)}>
              <Text style={[styles.reportText, { color: palette.sub }]}>{t(lang, 'ctaClose')}</Text>
            </TouchableOpacity>
          </GlassPanel>
        </View>
      </Modal>

      <Modal visible={reportVisible} animationType="slide" transparent onRequestClose={() => setReportVisible(false)}>
        <View style={styles.modalBackdrop}>
          <GlassPanel>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>{t(lang, 'reportNumber')}</Text>
            <TextInput
              style={[styles.input, { borderColor: palette.sub, color: palette.text }]}
              placeholder={t(lang, 'reportNumber')}
              placeholderTextColor={palette.sub}
              value={reportNumber}
              onChangeText={setReportNumber}
              keyboardType="phone-pad"
            />
            <Text style={[styles.label, { color: palette.text, marginTop: 12 }]}>{t(lang, 'spamType')}</Text>
            <TextInput
              style={[styles.input, { borderColor: palette.sub, color: palette.text }]}
              placeholder={t(lang, 'spamType')}
              placeholderTextColor={palette.sub}
              value={reportCategory}
              onChangeText={setReportCategory}
            />
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: palette.accent, marginTop: 12 }]}
              onPress={submitReportModal}
            >
              <Text style={[styles.primaryText, { color: '#fff' }]}>{t(lang, 'submit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.outlineButton, { borderColor: palette.sub }]} onPress={() => setReportVisible(false)}>
              <Text style={[styles.reportText, { color: palette.sub }]}>{t(lang, 'ctaClose')}</Text>
            </TouchableOpacity>
          </GlassPanel>
        </View>
      </Modal>

      <Modal visible={gdprVisible} animationType="slide" transparent onRequestClose={() => setGdprVisible(false)}>
        <View style={styles.modalBackdrop}>
          <GlassPanel>
            <ScrollView style={styles.modalScroll}>
              <Text style={[styles.title, { color: palette.text, fontSize: 24 }]}>{t(lang, 'gdprTitle')}</Text>
              <Text style={[styles.meta, { color: palette.sub, marginVertical: 8 }]}>{t(lang, 'gdprSummary')}</Text>
              <Text style={[styles.meta, { color: palette.text, marginTop: 8 }]}>{`• ${t(lang, 'gdprData')}`}</Text>
              <Text style={[styles.meta, { color: palette.text, marginTop: 8 }]}>{`• ${t(lang, 'gdprRights')}`}</Text>
              <Text style={[styles.meta, { color: palette.text, marginTop: 8 }]}>{`• ${t(lang, 'gdprContact')}`}</Text>
            </ScrollView>
            <TouchableOpacity style={[styles.outlineButton, { borderColor: palette.sub }]} onPress={() => setGdprVisible(false)}>
              <Text style={[styles.reportText, { color: palette.sub }]}>{t(lang, 'ctaClose')}</Text>
            </TouchableOpacity>
          </GlassPanel>
        </View>
      </Modal>
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
    borderRadius: 18,
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
  },
  cardInner: {
    padding: 16,
    position: 'relative',
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
    borderWidth: 1,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  outlineButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
  },
  modalInner: {
    padding: 16,
    position: 'relative',
  },
  modalScroll: {
    maxHeight: 320,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

export default App;





