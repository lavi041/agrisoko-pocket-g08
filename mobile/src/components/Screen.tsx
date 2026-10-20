import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { colors, space } from '../theme';

export function Screen({ children }: { children: React.ReactNode }) {
  return <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={s.c} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}
const s = StyleSheet.create({ c: { padding: space.md, gap: space.md, flexGrow: 1 } });
