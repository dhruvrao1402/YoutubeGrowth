import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VideoEntry } from '@/types/video';

interface ProcessZonesProps {
  currentVideo?: Partial<VideoEntry>;
  onUpdateExperience?: (field: string, value: number) => void;
  onUpdateDistribution?: (field: string, value: string | number) => void;
  processWins: number; // This is now the Craft Score
}

export const ProcessZones: React.FC<ProcessZonesProps> = ({ 
  currentVideo, 
  onUpdateExperience,
  onUpdateDistribution,
  processWins 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Process (Green Zone) - Now Craft Score */}
      <Card className="border-success/20 bg-success-light">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm font-medium text-success mb-1">CRAFT SCORE (GREEN ZONE)</div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-success/70">Script</div>
                <div className="text-lg font-bold text-success">
                  {currentVideo?.script ? 
                    Math.round((Object.values(currentVideo.script).filter(val => typeof val === 'number').reduce((sum, rating) => sum + (rating as number), 0) / Object.values(currentVideo.script).filter(val => typeof val === 'number').length) / 5 * 100) : 
                    0
                  }
                </div>
              </div>
              <div>
                <div className="text-xs text-success/70">Sound</div>
                <div className="text-lg font-bold text-success">
                  {currentVideo?.sound ? 
                    Math.round(([currentVideo.sound.cueAlignment, currentVideo.sound.silencePlacement, currentVideo.sound.mixBalance, currentVideo.sound.emotionalFit].filter(rating => typeof rating === 'number').reduce((sum, rating) => sum + (rating as number), 0) / 4) / 5 * 100) :
                    0
                  }
                </div>
              </div>
              <div className="pt-2 border-t border-success/20">
                <div className="text-xs text-success/70">Craft Score</div>
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
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                className="h-8 text-center bg-warning/10 border-warning/20"
                value={currentVideo?.experienceInputs?.retention30s || ''}
                onChange={(e) => onUpdateExperience?.('retention30s', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="watchtime" className="text-xs text-warning/70">Avg Watch Time (%)</Label>
              <Input
                id="watchtime"
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                className="h-8 text-center bg-warning/10 border-warning/20"
                value={currentVideo?.experienceInputs?.avgWatchTime || ''}
                onChange={(e) => onUpdateExperience?.('avgWatchTime', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="mentions" className="text-xs text-warning/70">Craft Mentions (#)</Label>
              <Input
                id="mentions"
                type="number"
                min="0"
                placeholder="0"
                className="h-8 text-center bg-warning/10 border-warning/20"
                value={currentVideo?.experienceInputs?.craftMentions || ''}
                onChange={(e) => onUpdateExperience?.('craftMentions', parseInt(e.target.value) || 0)}
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