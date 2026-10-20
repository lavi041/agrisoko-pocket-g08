export type EvidenceLink = { label: string; url: string };
export type TesterFeedback = { category: string; consent: boolean; comment: string };

export type Member = {
  id: string;
  fullName: string;
  registrationNumber: string;
  aliases: string[];
  githubUsername: string;
  role: string;
  skills: string[];
  targetUser: string;
  problem: string;
  contribution: string;
  feature: string;
  outcomeMetric: string;
  evidenceLinks: EvidenceLink[];
  testerFeedback: TesterFeedback[];
  introductionDraft: string;
  introduction?: string; // only in the bundled file
};

export type MemberSummary = Pick<Member, 'id' | 'fullName' | 'aliases' | 'role' | 'feature'>;

export type ResultSource = 'live' | 'cached' | 'offline';

export type AskResult = {
  query: string;
  matched: boolean;
  confidence: number;
  threshold: number;
  reason: string;
  matched_terms: string[];
  member: MemberSummary | null;
  introduction: string | null;
  evidence_links: EvidenceLink[];
  suggestions: string[];
  model_version: string;
  group_code: string;
  source: ResultSource;
};

export type RootStackParamList = {
  Home: undefined;
  Ask: undefined;
  Result: { result: AskResult };
  Directory: undefined;
  Profile: { memberId: string };
  About: undefined;
};
