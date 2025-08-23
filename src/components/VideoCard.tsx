import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { VideoEntry } from '@/services/api';

interface VideoCardProps {
  video: VideoEntry;
  onDelete: () => void;
  onUpdate: (videoData: Partial<VideoEntry>) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this video entry?')) {
      onDelete();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{video.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{video.playlist}</Badge>
              <span className="text-sm text-muted-foreground">
                {video.createdAt ? format(new Date(video.createdAt), 'MMM d, yyyy') : 'No date'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Scores Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{video.craftScore || 0}</div>
            <div className="text-xs text-muted-foreground">Craft Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{video.experienceScore || 0}</div>
            <div className="text-xs text-muted-foreground">Experience</div>
          </div>
          <div className="text-center">
            <Badge 
              variant={video.deltaScore && video.deltaScore >= 0 ? "default" : "destructive"}
              className="text-lg px-3 py-1"
            >
              {video.deltaScore && video.deltaScore >= 0 ? '+' : ''}{video.deltaScore || 0}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">Δ</div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Script Ratings */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-success">Script Ratings</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Hook: {video.script.hookEffectiveness}/5</div>
                <div>Structure: {video.script.structureClarity}/5</div>
                <div>Concision: {video.script.concision}/5</div>
                <div>Specificity: {video.script.specificity}/5</div>
                <div>Audience Bridge: {video.script.audienceBridge}/5</div>
              </div>
              {video.script.newExperiment && video.script.experimentNotes && (
                <div className="mt-2 p-2 bg-muted rounded text-xs">
                  <strong>Experiment:</strong> {video.script.experimentNotes}
                </div>
              )}
            </div>

            {/* Sound Ratings */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-success">Sound Ratings</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Cue Alignment: {video.sound.cueAlignment}/5</div>
                <div>Silence: {video.sound.silencePlacement}/5</div>
                <div>Mix: {video.sound.mixBalance}/5</div>
                <div>Emotional Fit: {video.sound.emotionalFit}/5</div>
              </div>
              {video.sound.newExperiment && video.sound.experimentNotes && (
                <div className="mt-2 p-2 bg-muted rounded text-xs">
                  <strong>Experiment:</strong> {video.sound.experimentNotes}
                </div>
              )}
            </div>

            {/* Experience Inputs */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-warning">Experience Metrics</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>Retention: {video.experienceInputs.retention30s}%</div>
                <div>Watch Time: {video.experienceInputs.avgWatchTime}%</div>
                <div>Mentions: {video.experienceInputs.craftMentions}</div>
              </div>
            </div>

            {/* Distribution Metrics */}
            {video.distributionMetrics && (video.distributionMetrics.views || video.distributionMetrics.ctr) && (
              <div>
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">Distribution</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {video.distributionMetrics.views && <div>Views: {video.distributionMetrics.views.toLocaleString()}</div>}
                  {video.distributionMetrics.ctr && <div>CTR: {video.distributionMetrics.ctr}%</div>}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};