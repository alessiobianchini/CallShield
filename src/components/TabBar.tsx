import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TabKey = 'home' | 'reports' | 'plus' | 'checklist';

type Props = {
  active: TabKey;
  onSelect: (tab: TabKey) => void;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  accent: string;
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'reports', label: 'Reports' },
  { key: 'plus', label: 'Plus' },
  { key: 'checklist', label: 'Checklist' },
];

export const TabBar: React.FC<Props> = ({ active, onSelect, backgroundColor, borderColor, textColor, accent }) => {
  return (
    <View style={[styles.tabBar, { backgroundColor, borderColor }]}> 
      {TABS.map(item => {
        const selected = active === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.tabItem, selected && { backgroundColor: accent }]}
            onPress={() => onSelect(item.key)}
          >
            <Text style={[styles.tabText, { color: selected ? '#fff' : textColor }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

