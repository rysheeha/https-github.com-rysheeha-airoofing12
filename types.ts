
export enum AppView {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  ANALYSIS = 'analysis',
  VISUAL_STUDIO = 'visual_studio',
  LIVE = 'live',
  GROUNDING = 'grounding',
  TRANSCRIPTION = 'transcription'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  id: string;
  isThinking?: boolean;
}

export interface GroundingResult {
  title: string;
  uri: string;
  snippet?: string;
}

export interface AnalysisResult {
  summary: string;
  codeViolations: string[];
  suggestedAction: string;
  mediaUrl?: string;
}
