import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  summary: string;
  accent: string;
  textColor: string;
  subColor: string;
  onOpen: () => void;
};

export const GdprCard: React.FC<Props> = ({ title, summary, accent, textColor, subColor, onOpen }) => {
  return (
    <View style={{ padding: 0 }}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.meta, { color: subColor, marginBottom: 8 }]}>{summary}</Text>
      <TouchableOpacity style={[styles.outlineButton, { borderColor: accent }]} onPress={onOpen}>
        <Text style={[styles.reportText, { color: accent }]}>Open</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
  },
  outlineButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  reportText: {
    fontWeight: '700',
  },
});

