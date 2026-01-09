import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  body: string;
  path: string;
  smsInfo: string;
  accent: string;
  textColor: string;
  subColor: string;
  onOpenSettings: () => void;
};

export const ChecklistCard: React.FC<Props> = ({ title, body, path, smsInfo, accent, textColor, subColor, onOpenSettings }) => {
  return (
    <View style={{ padding: 0 }}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.meta, { color: subColor }]}>{body}</Text>
      <Text style={[styles.meta, { color: subColor, marginTop: 8 }]}>{path}</Text>
      <Text style={[styles.meta, { color: subColor, marginTop: 8 }]}>{smsInfo}</Text>
      <TouchableOpacity style={[styles.outlineButton, { borderColor: accent, marginTop: 10 }]} onPress={onOpenSettings}>
        <Text style={[styles.reportText, { color: accent }]}>Open settings</Text>
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

