import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api';
import { BUNDLED_MEMBERS } from '../offline';
import { cache } from '../storage';
import type { Member, RootStackParamList } from '../types';
import { Badge, Body, Card, EvidenceLinkButton, Heading, Loading, Notice } from '../components/ui';
import { Screen } from '../components/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ route }: Props) {
  const { memberId } = route.params;
  const [m, setM] = useState<Member | null>(null);
  const [source, setSource] = useState<'live' | 'cached' | 'offline'>('live');
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    (async () => {
      const bundled = BUNDLED_MEMBERS.find((x) => x.id === memberId) ?? null;
      try {
        const live = await api.member(memberId);
        await cache.saveMember(live);
        setM({ ...live, introduction: bundled?.introduction }); setSource('live');
      } catch {
        const cached = await cache.loadMember(memberId);
        if (cached) { setM({ ...cached, introduction: bundled?.introduction }); setSource('cached'); }
        else if (bundled) { setM(bundled); setSource('offline'); }
        else setMissing(true);
      }
    })();
  }, [memberId]);

  if (missing) return <Screen><Notice tone="err" text="This profile is not available. Go back and choose a member from the directory." /></Screen>;
  if (!m) return <Screen><Loading text="Loading profile..." /></Screen>;
  const consented = m.testerFeedback.filter((t) => t.consent);

  return (
    <Screen>
      <Card>
        <Badge tone={source === 'live' ? 'ok' : source === 'cached' ? 'info' : 'warn'}
          label={source === 'live' ? 'Live profile' : source === 'cached' ? 'Cached profile' : 'Bundled profile (offline)'} />
        <Heading>{m.fullName}</Heading>
        <Body muted>{`${m.role}  |  GitHub: ${m.githubUsername}`}</Body>
        <Body muted>{`Also known as: ${m.aliases.join(', ') || 'none recorded'}`}</Body>
      </Card>
      <Card><Heading>Introduction</Heading><Body>{m.introduction ?? m.introductionDraft}</Body></Card>
      <Card>
        <Heading>Owned contribution</Heading>
        <Body>{m.feature}</Body><Body>{m.contribution}</Body>
        <Body muted>{`For: ${m.targetUser}`}</Body><Body muted>{`Problem: ${m.problem}`}</Body>
      </Card>
      <Card><Heading>Skills</Heading><Body>{m.skills.join(', ') || 'None recorded'}</Body></Card>
      <Card>
        <Heading>Measured evidence</Heading>
        <Body>{m.outcomeMetric.trim() ? m.outcomeMetric : 'No verified outcome metric is recorded yet.'}</Body>
        {consented.map((t, i) => <Body key={i} muted>{`${t.category}: ${t.comment}`}</Body>)}
      </Card>
      <Card>
        <Heading>Repository and demo evidence</Heading>
        {m.evidenceLinks.length ? m.evidenceLinks.map((l) => <EvidenceLinkButton key={l.url} label={l.label} url={l.url} />) : <Body muted>No evidence links recorded.</Body>}
      </Card>
    </Screen>
  );
}
