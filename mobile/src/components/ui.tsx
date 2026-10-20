import React from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, space } from '../theme';
import type { ResultSource } from '../types';

export function AppButton({ label, onPress, variant = 'primary', disabled, hint }: {
  label: string; onPress: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean; hint?: string;
}) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button" accessibilityLabel={label} accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.btn, primary ? styles.btnPrimary : styles.btnSecondary, disabled && { opacity: 0.5 }, pressed && { opacity: 0.8 }]}>
      <Text style={[styles.btnText, { color: primary ? colors.onPrimary : colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Heading({ children }: { children: React.ReactNode }) {
  return <Text accessibilityRole="header" style={styles.h}>{children}</Text>;
}

export function Body({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <Text style={[styles.body, muted && { color: colors.muted }]}>{children}</Text>;
}

export function Badge({ label, tone }: { label: string; tone: 'ok' | 'warn' | 'err' | 'info' }) {
  const map = { ok: [colors.okBg, colors.okInk], warn: [colors.warnBg, colors.warnInk], err: [colors.errBg, colors.errInk], info: [colors.infoBg, colors.infoInk] }[tone];
  return (
    <View accessible accessibilityLabel={label} style={[styles.badge, { backgroundColor: map[0] }]}>
      <Text style={[styles.badgeText, { color: map[1] }]}>{label}</Text>
    </View>
  );
}

export const sourceBadge = (s: ResultSource) =>
  s === 'live' ? <Badge label="Live result from server" tone="ok" />
  : s === 'cached' ? <Badge label="Cached result (saved earlier)" tone="info" />
  : <Badge label="Offline match (bundled directory)" tone="warn" />;

export function Notice({ tone, text, actionLabel, onAction }: { tone: 'warn' | 'err'; text: string; actionLabel?: string; onAction?: () => void }) {
  const bg = tone === 'err' ? colors.errBg : colors.warnBg;
  const ink = tone === 'err' ? colors.errInk : colors.warnInk;
  return (
    <View accessibilityRole="alert" style={[styles.notice, { backgroundColor: bg }]}>
      <Text style={{ color: ink, fontSize: 16 }}>{text}</Text>
      {actionLabel && onAction ? <View style={{ marginTop: space.sm }}><AppButton label={actionLabel} variant="secondary" onPress={onAction} /></View> : null}
    </View>
  );
}

export function Loading({ text }: { text: string }) {
  return (
    <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md }}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

/** Opens an external URL; handles unsupported or failing links without crashing. */
export async function openLink(url: string) {
  try {
    if (!(await Linking.canOpenURL(url))) throw new Error('unsupported');
    await Linking.openURL(url);
  } catch {
    Alert.alert('Link unavailable', 'This link could not be opened on this phone. Check the address or your connection.');
  }
}

export function EvidenceLinkButton({ label, url }: { label: string; url: string }) {
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={`Open ${label}`} onPress={() => openLink(url)} style={styles.link}>
      <Text style={styles.linkText}>{label}</Text>
      <Text style={styles.linkUrl} numberOfLines={1}>{url}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { minHeight: 48, paddingHorizontal: space.md, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.primary },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: 'transparent' },
  btnText: { fontSize: 17, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: space.md, gap: space.sm },
  h: { fontSize: 22, fontWeight: '800', color: colors.ink },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  badge: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  badgeText: { fontSize: 14, fontWeight: '700' },
  notice: { padding: space.md, borderRadius: 10 },
  link: { minHeight: 48, justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: space.sm },
  linkText: { fontSize: 16, fontWeight: '700', color: colors.accent },
  linkUrl: { fontSize: 13, color: colors.muted },
});
