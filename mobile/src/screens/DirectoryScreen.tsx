import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api';
import { BUNDLED_MEMBERS } from '../offline';
import { cache } from '../storage';
import { colors } from '../theme';
import type { MemberSummary, RootStackParamList } from '../types';
import { Badge, Body, Card, Heading, Loading, Notice } from '../components/ui';
import { Screen } from '../components/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'Directory'>;
const toSummary = (): MemberSummary[] => BUNDLED_MEMBERS.map(({ id, fullName, aliases, role, feature }) => ({ id, fullName, aliases, role, feature }));

export default function DirectoryScreen({ navigation }: Props) {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [source, setSource] = useState<'live' | 'cached' | 'offline'>('live');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const live = await api.members();
      await cache.saveDirectory(live);
      setMembers(live); setSource('live');
    } catch {
      const cached = await cache.loadDirectory();
      if (cached?.length) { setMembers(cached); setSource('cached'); }
      else { setMembers(toSummary()); setSource('offline'); }
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <Screen>
      <Heading>Team directory</Heading>
      <Body muted>Pick a member directly. No AI search is used here.</Body>
      {loading ? <Loading text="Loading directory..." /> : (
        <>
          <Badge tone={source === 'live' ? 'ok' : source === 'cached' ? 'info' : 'warn'}
            label={source === 'live' ? 'Live directory' : source === 'cached' ? 'Cached directory' : 'Bundled directory (offline)'} />
          {source !== 'live' ? <Notice tone="warn" text="Showing saved data because the server could not be reached." actionLabel="Retry" onAction={load} /> : null}
        </>
      )}
      {members.map((m) => (
        <Pressable key={m.id} accessibilityRole="button" accessibilityLabel={`Open profile of ${m.fullName}, ${m.role}`}
          onPress={() => navigation.navigate('Profile', { memberId: m.id })}>
          <Card>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.ink }}>{m.fullName}</Text>
            <Body muted>{m.role}</Body>
            <Body>{m.feature}</Body>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
