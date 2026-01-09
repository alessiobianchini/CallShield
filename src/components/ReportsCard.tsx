import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type RiskLevel = 'low' | 'medium' | 'high';
export type RecentCall = { id: string; number: string; label: string; risk: RiskLevel; timeAgo: string };

type Props = {
  title: string;
  subtitle: string;
  badge: string;
  calls: RecentCall[];
  onReport: (c: RecentCall) => void;
  riskToColor: (risk: RiskLevel) => string;
  palette: {
    text: string;
    sub: string;
    bg: string;
    accent: string;
  };
  emptyText: string;
};

export const ReportsCard: React.FC<Props> = ({ title, subtitle, badge, calls, onReport, riskToColor, palette, emptyText }) => {
  return (
    <View style={{ padding: 0 }}>
      <View style={styles.rowBetween}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.badge, { color: palette.accent }]}>{badge}</Text>
      </View>
      <Text style={[styles.meta, { color: palette.sub }]}>{subtitle}</Text>
      {calls.length === 0 ? (
        <Text style={[styles.meta, { color: palette.sub, marginTop: 12 }]}>{emptyText}</Text>
      ) : (
        calls.map(call => (
          <View key={call.id} style={[styles.callRow, { borderColor: palette.bg }]}> 
            <View style={{ flex: 1 }}>
              <Text style={[styles.callNumber, { color: palette.text }]}>{call.number}</Text>
              <Text style={[styles.callLabel, { color: palette.sub }]}>{`${call.label} - ${call.timeAgo}`}</Text>
            </View>
            <View style={[styles.riskDot, { backgroundColor: riskToColor(call.risk) }]} />
            <TouchableOpacity style={[styles.reportButton, { borderColor: palette.accent }]} onPress={() => onReport(call)}>
              <Text style={[styles.reportText, { color: palette.accent }]}>Report</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  badge: {
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    fontSize: 14,
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
});
