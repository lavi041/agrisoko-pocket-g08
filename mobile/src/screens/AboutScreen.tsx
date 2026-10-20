import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { API_BASE_URL, APP_VERSION, GITHUB_URL, GROUP_CODE, VERIFICATION_CODE } from '../config';
import { Badge, Body, Card, EvidenceLinkButton, Heading, Loading } from '../components/ui';
import { Screen } from '../components/Screen';

type Info = Awaited<ReturnType<typeof api.modelInfo>>;

export default function AboutScreen() {
  const [status, setStatus] = useState<'checking' | 'up' | 'down'>('checking');
  const [info, setInfo] = useState<Info | null>(null);
  useEffect(() => {
    api.health().then(() => setStatus('up')).catch(() => setStatus('down'));
    api.modelInfo().then(setInfo).catch(() => setInfo(null));
  }, []);

  return (
    <Screen>
      <Card>
        <Heading>About and evidence</Heading>
        {status === 'checking' ? <Loading text="Checking API status..." /> : <Badge tone={status === 'up' ? 'ok' : 'err'} label={status === 'up' ? 'API is reachable' : 'API is not reachable'} />}
        <Body muted>{`API address: ${API_BASE_URL}`}</Body>
      </Card>
      <Card>
        <Heading>Data source</Heading>
        <Body>Approved member records in ai-api/data/members.json, each reviewed and signed by the member. Nothing is invented by the app.</Body>
      </Card>
      <Card>
        <Heading>Model approach</Heading>
        <Body>Deterministic TF-IDF retrieval with cosine similarity, an IDF-weighted coverage score and a documented name or alias boost. No external generative AI is used.</Body>
        {info ? (<>
          <Body muted>{`Model: ${info.model_version}  |  Threshold: ${info.threshold}`}</Body>
          <Body muted>{`Dataset fingerprint (SHA-256): ${info.dataset_fingerprint_sha256}`}</Body>
          <Body muted>{`Build commit: ${info.build_commit}`}</Body>
        </>) : <Body muted>Model details load when the server is reachable.</Body>}
      </Card>
      <Card>
        <Heading>Limitations</Heading>
        {(info?.limitations ?? ["Covers only this group's approved profiles.", 'Offline mode matches exact names, nicknames and roles only.', 'Vocabulary-based: synonyms may be missed.']).map((l) => <Body key={l}>{`- ${l}`}</Body>)}
      </Card>
      <Card>
        <Heading>Release</Heading>
        <Body>{`APK version: ${APP_VERSION}`}</Body>
        <Body>{`Group code: ${GROUP_CODE}`}</Body>
        <Body>{`Verification code: ${VERIFICATION_CODE || 'not set'}`}</Body>
        {GITHUB_URL ? <EvidenceLinkButton label="GitHub repository" url={GITHUB_URL} /> : null}
      </Card>
    </Screen>
  );
}
