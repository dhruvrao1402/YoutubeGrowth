export type Playlist = 'Building' | 'Body' | 'Mind' | 'Reflections';

export interface ScriptChecklist {
  hookClear: boolean;
  storyStructure: boolean;
  fluffCut: boolean;
  concreteExample: boolean;
  audienceBridge: boolean;
}

export interface SoundChecklist {
  musicAligned: boolean;
  intentionalSilence: boolean;
  mixBalanced: boolean;
  moodFitRating: number; // 1-5
  newExperiment: boolean;
  experimentNotes?: string;
}

export interface ExperienceSignals {
  retentionSnapshot?: string;
  avgWatchTime?: string;
  commentsMentions?: string;
}

export interface DistributionMetrics {
  views?: number;
  ctr?: number;
}

export interface VideoEntry {
  id: string;
  title: string;
  playlist: Playlist;
  script: ScriptChecklist;
  sound: SoundChecklist;
  experienceSignals: ExperienceSignals;
  distributionMetrics: DistributionMetrics;
  createdAt: Date;
  processWins: number;
}

export const PLAYLISTS: Playlist[] = ['Building', 'Body', 'Mind', 'Reflections'];

export const SCRIPT_ITEMS = [
  { key: 'hookClear' as keyof ScriptChecklist, label: 'Hook clear?' },
  { key: 'storyStructure' as keyof ScriptChecklist, label: 'Story structure chosen?' },
  { key: 'fluffCut' as keyof ScriptChecklist, label: 'Fluff line cut?' },
  { key: 'concreteExample' as keyof ScriptChecklist, label: 'Concrete example added?' },
  { key: 'audienceBridge' as keyof ScriptChecklist, label: 'Audience bridge after "I"?' },
];

export const SOUND_ITEMS = [
  { key: 'musicAligned' as keyof SoundChecklist, label: 'Music aligned with beats?' },
  { key: 'intentionalSilence' as keyof SoundChecklist, label: 'Intentional silence used?' },
  { key: 'mixBalanced' as keyof SoundChecklist, label: 'Mix balanced?' },
  { key: 'newExperiment' as keyof SoundChecklist, label: 'New experiment tried?' },
];