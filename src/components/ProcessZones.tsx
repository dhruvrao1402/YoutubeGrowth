import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VideoEntry } from '@/types/video';

interface ProcessZonesProps {
  currentVideo?: Partial<VideoEntry>;
  onUpdateExperience?: (field: string, value: string) => void;
  onUpdateDistribution?: (field: string, value: string | number) => void;
  processWins: number;
}

export const ProcessZones: React.FC<ProcessZonesProps> = ({ 
  currentVideo, 
  onUpdateExperience,
  onUpdateDistribution,
  processWins 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Process (Green Zone) */}
      <Card className="border-success/20 bg-success-light">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-success mb-1">PROCESS (GREEN ZONE)</div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-success/70">Script</div>
                <div className="text-lg font-bold text-success">
                  {currentVideo?.script ? 
                    Object.values(currentVideo.script).filter(Boolean).length : 
                    Math.floor(processWins * 0.6)
                  }
                </div>
              </div>
              <div>
                <div className="text-xs text-success/70">Sound</div>
                <div className="text-lg font-bold text-success">
                  {currentVideo?.sound ? 
                    Object.entries(currentVideo.sound).filter(([key, value]) => 
                      key !== 'moodFitRating' && key !== 'experimentNotes' && Boolean(value)
                    ).length + (currentVideo.sound.moodFitRating >= 4 ? 1 : 0) :
                    Math.ceil(processWins * 0.4)
                  }
                </div>
              </div>
              <div className="pt-2 border-t border-success/20">
                <div className="text-xs text-success/70">Total Wins</div>
                <div className="text-xl font-bold text-success">{processWins}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience (Yellow Zone) */}
      <Card className="border-warning/20 bg-warning-light">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-warning mb-3 text-center">EXPERIENCE (YELLOW ZONE)</div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="retention" className="text-xs text-warning/70">Retention at 30s (%)</Label>
              <Input
                id="retention"
                type="text"
                placeholder="—"
                className="h-8 text-center bg-warning/10 border-warning/20"
                value={currentVideo?.experienceSignals?.retentionSnapshot || ''}
                onChange={(e) => onUpdateExperience?.('retentionSnapshot', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="watchtime" className="text-xs text-warning/70">Avg Watch Time (sec)</Label>
              <Input
                id="watchtime"
                type="text"
                placeholder="—"
                className="h-8 text-center bg-warning/10 border-warning/20"
                value={currentVideo?.experienceSignals?.avgWatchTime || ''}
                onChange={(e) => onUpdateExperience?.('avgWatchTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mentions" className="text-xs text-warning/70">Mentions of Craft (#)</Label>
              <Input
                id="mentions"
                type="text"
                placeholder="—"
                className="h-8 text-center bg-warning/10 border-warning/20"
                value={currentVideo?.experienceSignals?.commentsMentions || ''}
                onChange={(e) => onUpdateExperience?.('commentsMentions', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution (Gray Zone) */}
      <Card className="border-neutral/20 bg-neutral-light opacity-75">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-neutral mb-3 text-center">DISTRIBUTION (GRAY ZONE)</div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="views" className="text-xs text-neutral/70">Views</Label>
              <Input
                id="views"
                type="number"
                placeholder="—"
                className="h-8 text-center bg-neutral/10 border-neutral/20"
                value={currentVideo?.distributionMetrics?.views || ''}
                onChange={(e) => onUpdateDistribution?.('views', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="ctr" className="text-xs text-neutral/70">CTR (%)</Label>
              <Input
                id="ctr"
                type="number"
                step="0.1"
                placeholder="—"
                className="h-8 text-center bg-neutral/10 border-neutral/20"
                value={currentVideo?.distributionMetrics?.ctr || ''}
                onChange={(e) => onUpdateDistribution?.('ctr', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="impressions" className="text-xs text-neutral/70">Impressions</Label>
              <Input
                id="impressions"
                type="text"
                placeholder="—"
                className="h-8 text-center bg-neutral/10 border-neutral/20"
                disabled
              />
            </div>
            <div className="text-xs text-neutral/50 text-center pt-2">
              Note: tracked, not worshipped.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};