import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VideoEntry, Playlist, PLAYLISTS, SCRIPT_ITEMS, SOUND_ITEMS, ScriptChecklist, SoundChecklist } from '@/types/video';
import { useToast } from '@/hooks/use-toast';

interface VideoEntryFormProps {
  onSubmit: (video: Omit<VideoEntry, 'id' | 'createdAt' | 'processWins'>) => void;
  onCancel?: () => void;
}

export const VideoEntryForm: React.FC<VideoEntryFormProps> = ({ onSubmit, onCancel }) => {
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

  const handleScriptChange = (key: keyof ScriptChecklist, value: boolean) => {
    setScript(prev => ({ ...prev, [key]: value }));
  };

  const handleSoundChange = (key: keyof SoundChecklist, value: boolean | number | string) => {
    setSound(prev => ({ ...prev, [key]: value }));
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
      experienceSignals: {},
      distributionMetrics: {},
    });

    toast({
      title: "Video entry created!",
      description: `Logged ${calculateProcessWins()} process wins.`,
    });
  };

  const processWins = calculateProcessWins();

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
          <CardTitle className="text-success">Script Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SCRIPT_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox
                id={item.key}
                checked={script[item.key]}
                onCheckedChange={(checked) => handleScriptChange(item.key, !!checked)}
              />
              <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-success/20">
        <CardHeader>
          <CardTitle className="text-success">Sound Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="moodRating">Mood fit rating (1-5)</Label>
            <Select 
              value={sound.moodFitRating.toString()} 
              onValueChange={(value) => handleSoundChange('moodFitRating', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>{rating}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      <Card className="bg-success-light border-success/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {processWins}
            </div>
            <div className="text-sm text-success/80">Process Wins</div>
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