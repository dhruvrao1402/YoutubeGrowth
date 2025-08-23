import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProcessZones } from './ProcessZones';
import { VideoEntry, Playlist, PLAYLISTS, SCRIPT_ITEMS, SOUND_ITEMS, ScriptChecklist, SoundChecklist } from '@/types/video';
import { useToast } from '@/hooks/use-toast';

interface CompactVideoEntryFormProps {
  onSubmit: (video: Omit<VideoEntry, 'id' | 'createdAt' | 'processWins'>) => void;
}

export const CompactVideoEntryForm: React.FC<CompactVideoEntryFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [playlist, setPlaylist] = useState<Playlist | ''>('');
  const [script, setScript] = useState<ScriptChecklist>({
    hookClear: false,
    storyStructure: false,
    fluffCut: false,
    concreteExample: false,
    audienceBridge: false,
  });
  const [sound, setSound] = useState<SoundChecklist>({
    musicAligned: false,
    intentionalSilence: false,
    mixBalanced: false,
    moodFitRating: 1,
    newExperiment: false,
    experimentNotes: '',
  });
  const [experienceSignals, setExperienceSignals] = useState({
    retentionSnapshot: '',
    avgWatchTime: '',
    commentsMentions: '',
  });
  const [distributionMetrics, setDistributionMetrics] = useState({
    views: 0,
    ctr: 0,
  });

  const handleScriptChange = (key: keyof ScriptChecklist, value: boolean) => {
    setScript(prev => ({ ...prev, [key]: value }));
  };

  const handleSoundChange = (key: keyof SoundChecklist, value: boolean | number | string) => {
    setSound(prev => ({ ...prev, [key]: value }));
  };

  const handleExperienceChange = (field: string, value: string) => {
    setExperienceSignals(prev => ({ ...prev, [field]: value }));
  };

  const handleDistributionChange = (field: string, value: string | number) => {
    setDistributionMetrics(prev => ({ ...prev, [field]: value }));
  };

  const calculateProcessWins = () => {
    const scriptWins = Object.values(script).filter(Boolean).length;
    const soundWins = Object.entries(sound).filter(([key, value]) => 
      key !== 'moodFitRating' && key !== 'experimentNotes' && Boolean(value)
    ).length + (sound.moodFitRating >= 4 ? 1 : 0);
    return scriptWins + soundWins;
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
      experienceSignals: {
        retentionSnapshot: experienceSignals.retentionSnapshot || undefined,
        avgWatchTime: experienceSignals.avgWatchTime || undefined,
        commentsMentions: experienceSignals.commentsMentions || undefined,
      },
      distributionMetrics: {
        views: distributionMetrics.views || undefined,
        ctr: distributionMetrics.ctr || undefined,
      },
    });

    // Reset form
    setTitle('');
    setPlaylist('');
    setScript({
      hookClear: false,
      storyStructure: false,
      fluffCut: false,
      concreteExample: false,
      audienceBridge: false,
    });
    setSound({
      musicAligned: false,
      intentionalSilence: false,
      mixBalanced: false,
      moodFitRating: 1,
      newExperiment: false,
      experimentNotes: '',
    });
    setExperienceSignals({
      retentionSnapshot: '',
      avgWatchTime: '',
      commentsMentions: '',
    });
    setDistributionMetrics({
      views: 0,
      ctr: 0,
    });

    toast({
      title: "Video entry saved!",
      description: `Process Wins: +${calculateProcessWins()}`,
    });
  };

  const handleReset = () => {
    setTitle('');
    setPlaylist('');
    setScript({
      hookClear: false,
      storyStructure: false,
      fluffCut: false,
      concreteExample: false,
      audienceBridge: false,
    });
    setSound({
      musicAligned: false,
      intentionalSilence: false,
      mixBalanced: false,
      moodFitRating: 1,
      newExperiment: false,
      experimentNotes: '',
    });
  };

  const processWins = calculateProcessWins();
  const currentVideo = {
    title,
    playlist: playlist as Playlist,
    script,
    sound,
    experienceSignals,
    distributionMetrics,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            New Video Entry
            <div className="text-sm font-normal">
              Process Wins: <span className="text-success font-bold">+{processWins}</span>
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
        {/* Script — Process Check */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Script — Process Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm">Story Structure</Label>
              <Select 
                value={script.storyStructure ? "Problem → Struggle → Shift → Proof" : ""} 
                onValueChange={(value) => handleScriptChange('storyStructure', !!value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Choose structure..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Problem → Struggle → Shift → Proof">Problem → Struggle → Shift → Proof</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {SCRIPT_ITEMS.filter(item => item.key !== 'storyStructure').map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <Checkbox
                  id={item.key}
                  checked={script[item.key]}
                  onCheckedChange={(checked) => handleScriptChange(item.key, !!checked)}
                />
                <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
              </div>
            ))}

            <div className="space-y-2 pt-2">
              <Label htmlFor="scriptNotes" className="text-sm">Notes — what I improved in the script</Label>
              <Textarea
                id="scriptNotes"
                placeholder=""
                rows={3}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sound — Process Check */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sound — Process Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SOUND_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <Checkbox
                  id={item.key}
                  checked={sound[item.key] as boolean}
                  onCheckedChange={(checked) => handleSoundChange(item.key, !!checked)}
                />
                <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
              </div>
            ))}
            
            <div className="space-y-2 pt-2">
              <Label className="text-sm">Mood fit (1–5)</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant={sound.moodFitRating === rating ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => handleSoundChange('moodFitRating', rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Current: {sound.moodFitRating}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experimentNotes" className="text-sm">
                Experiment notes — e.g., added a subtle tick at 90 BPM
              </Label>
              <Textarea
                id="experimentNotes"
                value={sound.experimentNotes || ''}
                onChange={(e) => handleSoundChange('experimentNotes', e.target.value)}
                rows={3}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Three Zones */}
      <ProcessZones 
        currentVideo={currentVideo}
        onUpdateExperience={handleExperienceChange}
        onUpdateDistribution={handleDistributionChange}
        processWins={processWins}
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