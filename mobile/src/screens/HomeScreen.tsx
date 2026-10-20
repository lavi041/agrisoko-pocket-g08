import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { APP_VERSION, GROUP_CODE } from '../config';
import { cache } from '../storage';
import type { AskResult, RootStackParamList } from '../types';
import { useNetwork } from '../useNetwork';
import { AppButton, Badge, Body, Card, Heading, sourceBadge } from '../components/ui';
import { Screen } from '../components/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const online = useNetwork();
  const [last, setLast] = useState<AskResult | null>(null);
  useFocusEffect(useCallback(() => { cache.loadLastResult().then(setLast); }, []));

  return (
    <Screen>
      <Card>
        <Heading>{`AgriSoko Pocket ${GROUP_CODE}`}</Heading>
        <Body>Ask about any team member by name, nickname, role, skill or feature and get a profile backed by repository and test evidence.</Body>
        <Body muted>Made for potato cooperatives, employers and innovation partners in Musanze.</Body>
        <Badge label={online ? 'Online' : 'Offline: name and role lookup still works'} tone={online ? 'ok' : 'warn'} />
        <Text style={{ color: '#4A5A50', fontSize: 14 }}>{`Version ${APP_VERSION}  |  Team code ${GROUP_CODE}`}</Text>
      </Card>
      <AppButton label="Ask the team" onPress={() => navigation.navigate('Ask')} hint="Type a question about a member" />
      <AppButton label="Browse member directory" variant="secondary" onPress={() => navigation.navigate('Directory')} />
      <AppButton label="About and evidence" variant="secondary" onPress={() => navigation.navigate('About')} />
      {last ? (
        <Card>
          <Heading>Last result</Heading>
          {sourceBadge(last.source === 'live' ? 'cached' : last.source)}
          <Body>{last.matched && last.member ? `${last.member.fullName}: ${last.member.role}` : `No confident match for "${last.query}"`}</Body>
          <AppButton label="Open last result" variant="secondary" onPress={() => navigation.navigate('Result', { result: { ...last, source: last.source === 'live' ? 'cached' : last.source } })} />
        </Card>
      ) : null}
    </Screen>
  );
}
