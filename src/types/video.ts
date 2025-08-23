export type Playlist = 'Building' | 'Body' | 'Mind' | 'Reflections';

export interface ScriptRatings {
  hookEffectiveness: number; // 1-5
  structureClarity: number; // 1-5
  concision: number; // 1-5 (fluff trimmed)
  specificity: number; // 1-5 (vague → concrete)
  audienceBridge: number; // 1-5 (after "I")
  newExperiment: boolean;
  experimentNotes?: string;
}

export interface SoundRatings {
  cueAlignment: number; // 1-5 (with beats)
  silencePlacement: number; // 1-5
  mixBalance: number; // 1-5
  emotionalFit: number; // 1-5 (mood)
  newExperiment: boolean;
  experimentNotes?: string;
}

export interface ExperienceInputs {
  retention30s: number; // percentage
  avgWatchTime: number; // percentage of video
  craftMentions: number; // count of craft mentions in comments
}

export interface DistributionMetrics {
  views?: number;
  ctr?: number;
}

export interface VideoEntry {
  id: string;
  title: string;
  playlist: Playlist;
  script: ScriptRatings;
  sound: SoundRatings;
  experienceInputs: ExperienceInputs;
  distributionMetrics: DistributionMetrics;
  createdAt: Date;
  craftScore: number; // 0-100
  experienceScore: number; // 0-100
  deltaScore: number; // Experience - Craft
}

export const PLAYLISTS: Playlist[] = ['Building', 'Body', 'Mind', 'Reflections'];

export const SCRIPT_RATING_ITEMS = [
  { key: 'hookEffectiveness' as keyof ScriptRatings, label: 'Hook effectiveness' },
  { key: 'structureClarity' as keyof ScriptRatings, label: 'Structure clarity' },
  { key: 'concision' as keyof ScriptRatings, label: 'Concision (fluff trimmed)' },
  { key: 'specificity' as keyof ScriptRatings, label: 'Specificity (vague → concrete)' },
  { key: 'audienceBridge' as keyof ScriptRatings, label: 'Audience bridge after "I"' },
];

export const SOUND_RATING_ITEMS = [
  { key: 'cueAlignment' as keyof SoundRatings, label: 'Cue alignment with beats' },
  { key: 'silencePlacement' as keyof SoundRatings, label: 'Silence placement' },
  { key: 'mixBalance' as keyof SoundRatings, label: 'Mix balance' },
  { key: 'emotionalFit' as keyof SoundRatings, label: 'Emotional fit (mood)' },
];

export const EXPERIENCE_INPUT_ITEMS = [
  { key: 'retention30s' as keyof ExperienceInputs, label: 'Retention at 30s (%)', placeholder: '0-100' },
  { key: 'avgWatchTime' as keyof ExperienceInputs, label: 'Average Watch Time (%)', placeholder: '0-100' },
  { key: 'craftMentions' as keyof ExperienceInputs, label: 'Craft mentions in comments', placeholder: '0' },
];

// Migration helper for old checkbox data
export const migrateFromCheckboxes = (oldScript: any, oldSound: any): { script: ScriptRatings, sound: SoundRatings } => {
  const defaultRating = 3; // Neutral rating for migrated data
  
  const script: ScriptRatings = {
    hookEffectiveness: oldScript?.hookClear ? 4 : defaultRating,
    structureClarity: oldScript?.storyStructure ? 4 : defaultRating,
    concision: oldScript?.fluffCut ? 4 : defaultRating,
    specificity: oldScript?.concreteExample ? 4 : defaultRating,
    audienceBridge: oldScript?.audienceBridge ? 4 : defaultRating,
    newExperiment: false,
    experimentNotes: '',
  };

  const sound: SoundRatings = {
    cueAlignment: oldSound?.musicAligned ? 4 : defaultRating,
    silencePlacement: oldSound?.intentionalSilence ? 4 : defaultRating,
    mixBalance: oldSound?.mixBalanced ? 4 : defaultRating,
    emotionalFit: oldSound?.moodFitRating || defaultRating,
    newExperiment: oldSound?.newExperiment || false,
    experimentNotes: oldSound?.experimentNotes || '',
  };

  return { script, sound };
};