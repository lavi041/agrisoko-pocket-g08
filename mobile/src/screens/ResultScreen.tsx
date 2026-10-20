import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { AppButton, Body, Card, EvidenceLinkButton, Heading, Notice, sourceBadge } from '../components/ui';
import { Screen } from '../components/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ route, navigation }: Props) {
  const r = route.params.result;
  if (!r.matched || !r.member) {
    return (
      <Screen>
        <Card>
          <Heading>No confident match found</Heading>
          {sourceBadge(r.source)}
          <Notice tone="warn" text={r.reason} />
          <Body>{`You asked: "${r.query}"`}</Body>
          <Body muted>Try a member's name, nickname, role or feature. For example:</Body>
          {r.suggestions.map((s) => <Body key={s}>{`- ${s}`}</Body>)}
        </Card>
        <AppButton label="Ask a different question" onPress={() => navigation.navigate('Ask')} />
        <AppButton label="Browse member directory" variant="secondary" onPress={() => navigation.navigate('Directory')} />
      </Screen>
    );
  }
  return (
    <Screen>
      <Card>
        {sourceBadge(r.source)}
        <Heading>{r.member.fullName}</Heading>
        <Body muted>{`${r.member.role}  |  ${r.member.feature}`}</Body>
        <Body>{`Confidence: ${Math.round(r.confidence * 100)}%  (threshold ${Math.round(r.threshold * 100)}%)`}</Body>
        <Body muted>{`Why this match: ${r.reason}`}</Body>
      </Card>
      <Card>
        <Heading>Introduction</Heading>
        <Body>{r.introduction ?? ''}</Body>
      </Card>
      <Card>
        <Heading>Evidence links</Heading>
        {r.evidence_links.length ? r.evidence_links.map((l) => <EvidenceLinkButton key={l.url} label={l.label} url={l.url} />) : <Body muted>No evidence links are recorded.</Body>}
      </Card>
      <Body muted>{`Model ${r.model_version}  |  Team ${r.group_code}`}</Body>
      <AppButton label="Open full profile" onPress={() => navigation.navigate('Profile', { memberId: r.member!.id })} />
    </Screen>
  );
}
