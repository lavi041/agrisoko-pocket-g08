import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ApiError, api } from '../api';
import { MAX_QUERY_LENGTH } from '../config';
import { localLookup, offlineSuggestions } from '../offline';
import { cache } from '../storage';
import { colors, space } from '../theme';
import type { AskResult, RootStackParamList } from '../types';
import { AppButton, Body, Card, Heading, Loading, Notice, sourceBadge } from '../components/ui';
import { Screen } from '../components/Screen';

type Props = NativeStackScreenProps<RootStackParamList, 'Ask'>;
const EXAMPLES = ['Who built offline mode?', 'Tell me about Aisha', 'Who is the AI and data engineer?'];

export default function AskScreen({ navigation }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ kind: string; msg: string } | null>(null);
  const [validation, setValidation] = useState('');
  const [offlineMiss, setOfflineMiss] = useState(false);
  const [last, setLast] = useState<AskResult | null>(null);

  useEffect(() => { cache.loadLastResult().then(setLast); }, []);

  const submit = async () => {
    const q = text.trim();
    setError(null); setOfflineMiss(false);
    if (!q) return setValidation('Type a question first, for example "Who built offline mode?".');
    if (q.length > MAX_QUERY_LENGTH) return setValidation(`Please shorten your question to ${MAX_QUERY_LENGTH} characters.`);
    setValidation('');
    setLoading(true);
    const net = await NetInfo.fetch();
    const online = !!net.isConnected && net.isInternetReachable !== false;
    try {
      if (!online) throw new ApiError('network', 'You are offline.');
      const res = await api.ask(q);
      const result: AskResult = { ...res, source: 'live' };
      await cache.saveLastResult(result);
      setLast(result);
      navigation.navigate('Result', { result });
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError('network', 'Something went wrong.');
      const local = localLookup(q);
      if (local) {
        await cache.saveLastResult(local);
        setLast(local);
        navigation.navigate('Result', { result: local });
      } else {
        setOfflineMiss(true);
        setError({ kind: err.kind, msg: online ? err.message : 'You are offline. Only exact name, nickname or role lookups work offline.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Heading>Ask the team</Heading>
        <Text style={s.label} nativeID="askLabel">Your question</Text>
        <TextInput
          accessibilityLabel="Question about a team member" accessibilityLabelledBy="askLabel"
          style={s.input} value={text} onChangeText={setText} placeholder="Who built offline mode?"
          placeholderTextColor="#5E6B63" multiline maxLength={MAX_QUERY_LENGTH + 20}
        />
        <Text style={s.count}>{`${text.length}/${MAX_QUERY_LENGTH}`}</Text>
        {validation ? <Notice tone="warn" text={validation} /> : null}
        <AppButton label={loading ? 'Searching...' : 'Ask'} onPress={submit} disabled={loading} />
        {EXAMPLES.map((ex) => (
          <AppButton key={ex} label={ex} variant="secondary" onPress={() => setText(ex)} />
        ))}
      </Card>

      {loading ? <Loading text="Searching the team profiles..." /> : null}
      {error ? (
        <Notice
          tone="err"
          text={`${error.msg}${offlineMiss ? ' No offline match was found.' : ''}`}
          actionLabel={error.kind === 'client' ? undefined : 'Retry'} onAction={submit}
        />
      ) : null}
      {offlineMiss ? (
        <Card>
          <Heading>Try one of these</Heading>
          {offlineSuggestions().map((s2) => <Body key={s2}>{s2}</Body>)}
          <AppButton label="Open member directory" variant="secondary" onPress={() => navigation.navigate('Directory')} />
        </Card>
      ) : null}

      {last ? (
        <Card>
          <Heading>Last useful result</Heading>
          {sourceBadge(last.source === 'live' ? 'cached' : last.source)}
          <Body>{last.matched && last.member ? `${last.member.fullName} (${last.member.role})` : `No confident match for "${last.query}"`}</Body>
          <AppButton label="Open it again" variant="secondary" onPress={() => navigation.navigate('Result', { result: { ...last, source: last.source === 'live' ? 'cached' : last.source } })} />
        </Card>
      ) : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 16, fontWeight: '700', color: colors.ink },
  input: { minHeight: 90, borderWidth: 2, borderColor: colors.line, borderRadius: 10, padding: space.md, fontSize: 17, color: colors.ink, textAlignVertical: 'top', backgroundColor: '#FBFCFA' },
  count: { alignSelf: 'flex-end', color: colors.muted, fontSize: 13 },
});
