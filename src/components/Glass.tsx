import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';

type GlassProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  blurType?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
};

export const GlassCard: React.FC<GlassProps> = ({ children, backgroundColor, borderColor, blurType, style }) => {
  const bg = backgroundColor ?? 'rgba(255,255,255,0.75)';
  const bc = borderColor ?? 'rgba(255,255,255,0.35)';
  const bt = blurType ?? 'light';
  return (
    <View style={[styles.card, style, { borderColor: bc }]}>
      <BlurView style={StyleSheet.absoluteFill} blurType={bt} blurAmount={12} blurRadius={10} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: bg,
            borderRadius: 18,
            borderColor: bc,
            borderWidth: 1,
          },
        ]}
      />
      <View style={styles.cardInner}>{children}</View>
    </View>
  );
};

export const GlassPanel: React.FC<GlassProps> = ({ children, backgroundColor, borderColor, blurType, style }) => {
  const bg = backgroundColor ?? 'rgba(255,255,255,0.75)';
  const bc = borderColor ?? 'rgba(255,255,255,0.35)';
  const bt = blurType ?? 'light';
  return (
    <View style={[styles.modalCard, style, { borderColor: bc }]}>
      <BlurView style={StyleSheet.absoluteFill} blurType={bt} blurAmount={12} blurRadius={10} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: bg,
            borderRadius: 16,
            borderColor: bc,
            borderWidth: 1,
          },
        ]}
      />
      <View style={styles.modalInner}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
