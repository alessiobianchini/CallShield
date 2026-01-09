import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  blockLabel: string;
  identifyLabel: string;
  lastUpdate: string;
  accent: string;
  subColor: string;
  textColor: string;
  cardBg: string;
  blockingEnabled: boolean;
  identificationEnabled: boolean;
  onToggleBlock: (next: boolean) => void;
  onToggleIdentify: (next: boolean) => void;
  onUpdate: () => void;
  loading?: boolean;
  plusActive?: boolean;
  upgradeHint?: string | null;
};

export const ProtectionCard: React.FC<Props> = ({
  title,
  blockLabel,
  identifyLabel,
  lastUpdate,
  accent,
  subColor,
  textColor,
  cardBg,
  blockingEnabled,
  identificationEnabled,
  onToggleBlock,
  onToggleIdentify,
  onUpdate,
  loading,
  plusActive,
  upgradeHint,
}) => {
  return (
    <View style={{ padding: 0 }}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: textColor }]}>{blockLabel}</Text>
        <Switch
          value={blockingEnabled}
          onValueChange={onToggleBlock}
          thumbColor={cardBg}
          trackColor={{ true: accent, false: '#b8c2d1' }}
        />
      </View>
      {!plusActive && upgradeHint ? <Text style={[styles.meta, { color: subColor }]}>{upgradeHint}</Text> : null}
      <View style={styles.rowBetween}>
        <Text style={[styles.label, { color: textColor }]}>{identifyLabel}</Text>
        <Switch
          value={identificationEnabled}
          onValueChange={onToggleIdentify}
          thumbColor={cardBg}
          trackColor={{ true: accent, false: '#b8c2d1' }}
        />
      </View>
      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: subColor }]}>{lastUpdate}</Text>
        <TouchableOpacity style={[styles.pill, { backgroundColor: accent }]} onPress={onUpdate} disabled={!!loading}>
          <Text style={[styles.pillText, { color: '#fff' }]}>{loading ? '...' : 'Update'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

