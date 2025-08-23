import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RatingButton } from '@/components/ui/rating-button';
import { ProcessZones } from './ProcessZones';
import { 
  VideoEntry, 
  Playlist, 
  PLAYLISTS, 
  SCRIPT_RATING_ITEMS, 
  SOUND_RATING_ITEMS, 
  EXPERIENCE_INPUT_ITEMS,
  ScriptRatings, 
  SoundRatings,
  ExperienceInputs
} from '@/types/video';
import { useToast } from '@/hooks/use-toast';

interface CompactVideoEntryFormProps {
  onSubmit: (video: Omit<VideoEntry, 'id' | 'createdAt' | 'craftScore' | 'experienceScore' | 'deltaScore'>) => void;
}

export const CompactVideoEntryForm: React.FC<CompactVideoEntryFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [playlist, setPlaylist] = useState<Playlist | ''>('');
  const [script, setScript] = useState<ScriptRatings>({
    hookEffectiveness: 3,
    structureClarity: 3,
    concision: 3,
    specificity: 3,
    audienceBridge: 3,
    newExperiment: false,
    experimentNotes: '',
  });
  const [sound, setSound] = useState<SoundRatings>({
    cueAlignment: 3,
    silencePlacement: 3,
    mixBalance: 3,
    emotionalFit: 3,
    newExperiment: false,
    experimentNotes: '',
  });
  const [experienceInputs, setExperienceInputs] = useState<ExperienceInputs>({
    retention30s: 0,
    avgWatchTime: 0,
    craftMentions: 0,
  });
  const [distributionMetrics, setDistributionMetrics] = useState({
    views: 0,
    ctr: 0,
  });

  const handleScriptChange = (key: keyof ScriptRatings, value: number | boolean | string) => {
    setScript(prev => ({ ...prev, [key]: value }));
  };

  const handleSoundChange = (key: keyof SoundRatings, value: number | boolean | string) => {
    setSound(prev => ({ ...prev, [key]: value }));
  };

  const handleExperienceChange = (field: string, value: number) => {
    setExperienceInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleDistributionChange = (field: string, value: string | number) => {
    setDistributionMetrics(prev => ({ ...prev, [field]: value }));
  };

  const calculateCraftScore = () => {
    const scriptRatings = [
      script.hookEffectiveness,
      script.structureClarity,
      script.concision,
      script.specificity,
      script.audienceBridge
    ];
    const soundRatings = [sound.cueAlignment, sound.silencePlacement, sound.mixBalance, sound.emotionalFit];
    const allRatings = [...scriptRatings, ...soundRatings];
    const average = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
    return Math.round((average / 5) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !playlist) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title and select a playlist.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        playlist: playlist as Playlist,
        script,
        sound,
        experienceInputs,
        distributionMetrics: {
          views: distributionMetrics.views || undefined,
          ctr: distributionMetrics.ctr || undefined,
        },
      });

      // Reset form after successful submission
      setTitle('');
      setPlaylist('');
      setScript({
        hookEffectiveness: 3,
        structureClarity: 3,
        concision: 3,
        specificity: 3,
        audienceBridge: 3,
        newExperiment: false,
        experimentNotes: '',
      });
      setSound({
        cueAlignment: 3,
        silencePlacement: 3,
        mixBalance: 3,
        emotionalFit: 3,
        newExperiment: false,
        experimentNotes: '',
      });
      setExperienceInputs({
        retention30s: 0,
        avgWatchTime: 0,
        craftMentions: 0,
      });
      setDistributionMetrics({
        views: 0,
        ctr: 0,
      });
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  const handleReset = () => {
    setTitle('');
    setPlaylist('');
    setScript({
      hookEffectiveness: 3,
      structureClarity: 3,
      concision: 3,
      specificity: 3,
      audienceBridge: 3,
      newExperiment: false,
      experimentNotes: '',
    });
    setSound({
      cueAlignment: 3,
      silencePlacement: 3,
      mixBalance: 3,
      emotionalFit: 3,
      newExperiment: false,
      experimentNotes: '',
    });
    setExperienceInputs({
      retention30s: 0,
      avgWatchTime: 0,
      craftMentions: 0,
    });
    setDistributionMetrics({
      views: 0,
      ctr: 0,
    });
  };

  const craftScore = calculateCraftScore();
  const currentVideo = {
    title,
    playlist: playlist as Playlist,
    script,
    sound,
    experienceInputs,
    distributionMetrics,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            New Video Entry
            <div className="text-sm font-normal">
              Craft Score: <span className="text-success font-bold">{craftScore}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Why I Killed 3 Side Projects"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playlist">Playlist</Label>
              <Select value={playlist} onValueChange={(value) => setPlaylist(value as Playlist)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAYLISTS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Script — Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Script — Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SCRIPT_RATING_ITEMS.map((item) => (
              <RatingButton
                key={item.key}
                value={script[item.key] as number}
                onChange={(value) => handleScriptChange(item.key, value)}
                label={item.label}
              />
            ))}
            
            <Separator />
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scriptNewExperiment"
                checked={script.newExperiment}
                onCheckedChange={(checked) => handleScriptChange('newExperiment', !!checked)}
              />
              <Label htmlFor="scriptNewExperiment" className="text-sm">New experiment tried?</Label>
            </div>

            {script.newExperiment && (
              <div className="space-y-2">
                <Label htmlFor="scriptExperimentNotes" className="text-sm">
                  Experiment notes — e.g., tried a new hook structure
                </Label>
                <Textarea
                  id="scriptExperimentNotes"
                  value={script.experimentNotes || ''}
                  onChange={(e) => handleScriptChange('experimentNotes', e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sound — Ratings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sound — Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOUND_RATING_ITEMS.map((item) => (
              <RatingButton
                key={item.key}
                value={sound[item.key] as number}
                onChange={(value) => handleSoundChange(item.key, value)}
                label={item.label}
              />
            ))}
            
            <Separator />
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newExperiment"
                checked={sound.newExperiment}
                onCheckedChange={(checked) => handleSoundChange('newExperiment', !!checked)}
              />
              <Label htmlFor="newExperiment" className="text-sm">New experiment tried?</Label>
            </div>

            {sound.newExperiment && (
              <div className="space-y-2">
                <Label htmlFor="experimentNotes" className="text-sm">
                  Experiment notes — e.g., added a subtle tick at 90 BPM
                </Label>
                <Textarea
                  id="experimentNotes"
                  value={sound.experimentNotes || ''}
                  placeholder="What experiment did you try?"
                  onChange={(e) => handleSoundChange('experimentNotes', e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Three Zones */}
      <ProcessZones 
        currentVideo={currentVideo}
        onUpdateExperience={handleExperienceChange}
        onUpdateDistribution={handleDistributionChange}
        processWins={craftScore}
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!title.trim() || !playlist}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
};