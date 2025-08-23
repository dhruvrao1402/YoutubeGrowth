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

interface VideoEntryFormProps {
  onSubmit: (video: Omit<VideoEntry, 'id' | 'createdAt' | 'craftScore' | 'experienceScore' | 'deltaScore'>) => void;
  onCancel?: () => void;
}

export const VideoEntryForm: React.FC<VideoEntryFormProps> = ({ onSubmit, onCancel }) => {
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

  const handleScriptChange = (key: keyof ScriptRatings, value: number | boolean | string) => {
    setScript(prev => ({ ...prev, [key]: value }));
  };

  const handleSoundChange = (key: keyof SoundRatings, value: number | boolean | string) => {
    setSound(prev => ({ ...prev, [key]: value }));
  };

  const handleExperienceChange = (key: keyof ExperienceInputs, value: number) => {
    setExperienceInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculateCraftScore = (): number => {
    const scriptRatings = Object.values(script);
    const soundRatings = [sound.cueAlignment, sound.silencePlacement, sound.mixBalance, sound.emotionalFit];
    const allRatings = [...scriptRatings, ...soundRatings];
    const average = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
    return Math.round((average / 5) * 100);
  };

  const calculateExperienceScore = (): number => {
    // Weight retention higher than watch time
    const retentionWeight = 0.6;
    const watchTimeWeight = 0.3;
    const mentionsWeight = 0.1;
    
    const score = (
      (experienceInputs.retention30s * retentionWeight) +
      (experienceInputs.avgWatchTime * watchTimeWeight) +
      (Math.min(experienceInputs.craftMentions * 10, 100) * mentionsWeight)
    );
    
    return Math.round(score);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !playlist) {
      toast({
        title: "Missing fields",
        description: "Please fill in the title and select a playlist.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      title: title.trim(),
      playlist: playlist as Playlist,
      script,
      sound,
      experienceInputs,
      distributionMetrics: {},
    });

    const craftScore = calculateCraftScore();
    const experienceScore = calculateExperienceScore();
    const deltaScore = experienceScore - craftScore;

    toast({
      title: "Video entry created!",
      description: `Craft Score: ${craftScore}, Experience Score: ${experienceScore}, Delta: ${deltaScore >= 0 ? '+' : ''}${deltaScore}`,
    });
  };

  const craftScore = calculateCraftScore();
  const experienceScore = calculateExperienceScore();
  const deltaScore = experienceScore - craftScore;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New Video Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="playlist">Playlist</Label>
            <Select value={playlist} onValueChange={(value) => setPlaylist(value as Playlist)}>
              <SelectTrigger>
                <SelectValue placeholder="Select playlist..." />
              </SelectTrigger>
              <SelectContent>
                {PLAYLISTS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-success/20">
        <CardHeader>
          <CardTitle className="text-success">Script Ratings</CardTitle>
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
              <Label htmlFor="scriptExperimentNotes">Experiment Notes</Label>
              <Textarea
                id="scriptExperimentNotes"
                value={script.experimentNotes || ''}
                onChange={(e) => handleScriptChange('experimentNotes', e.target.value)}
                placeholder="What experiment did you try?"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-success/20">
        <CardHeader>
          <CardTitle className="text-success">Sound Ratings</CardTitle>
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
              <Label htmlFor="experimentNotes">Experiment Notes</Label>
              <Textarea
                id="experimentNotes"
                value={sound.experimentNotes || ''}
                onChange={(e) => handleSoundChange('experimentNotes', e.target.value)}
                placeholder="What experiment did you try?"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-warning/20">
        <CardHeader>
          <CardTitle className="text-warning">Experience Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {EXPERIENCE_INPUT_ITEMS.map((item) => (
            <div key={item.key} className="space-y-2">
              <Label htmlFor={item.key}>{item.label}</Label>
              <Input
                id={item.key}
                type="number"
                min={item.key === 'craftMentions' ? 0 : 0}
                max={item.key === 'craftMentions' ? 999 : 100}
                value={experienceInputs[item.key]}
                onChange={(e) => handleExperienceChange(item.key, parseInt(e.target.value) || 0)}
                placeholder={item.placeholder}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-success-light border-success/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-success">
              {craftScore}
            </div>
            <div className="text-sm text-success/80">Craft Score</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Save Video Entry
        </Button>
      </div>
    </form>
  );
};