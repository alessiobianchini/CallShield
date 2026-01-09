import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  price: string | null;
  active: boolean;
  accent: string;
  cardBg: string;
  onOpen: () => void;
  message?: string | null;
};

export const PaywallCard: React.FC<Props> = ({ title, subtitle, price, active, accent, cardBg, onOpen, message }) => {
  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}> 
      <View style={[styles.rowBetween]}> 
        <Text style={[styles.sectionTitle]}>{title}</Text>
        <View
          style={[
            styles.pill,
            {
              backgroundColor: active ? accent : cardBg,
              borderWidth: 1,
              borderColor: accent,
            },
          ]}
        >
          <Text style={[styles.pillText, { color: active ? '#fff' : accent }]}>{active ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      <Text style={[styles.meta]}>{subtitle}</Text>
      <TouchableOpacity style={[styles.primaryButton, { backgroundColor: accent }]} onPress={onOpen}>
        <Text style={[styles.primaryText, { color: '#fff' }]}>
          Start {price ? `- ${price}` : ''}
        </Text>
      </TouchableOpacity>
      {message ? <Text style={[styles.meta, { marginTop: 8 }]}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
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
});

