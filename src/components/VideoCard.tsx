import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoEntry } from '@/types/video';
import { format } from 'date-fns';

interface VideoCardProps {
  video: VideoEntry;
  onClick?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
          <Badge variant="outline" className="ml-2 shrink-0">
            {video.playlist}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(video.createdAt), 'MMM d, yyyy')}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Green Zone - Process Wins */}
        <div className="bg-success-light p-3 rounded-lg border border-success/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-success">Process Wins</span>
            <div className="text-xl font-bold text-success">
              {video.processWins}
            </div>
          </div>
          <div className="text-xs text-success/70 mt-1">
            Script & Sound improvements
          </div>
        </div>

        {/* Yellow Zone - Experience Signals */}
        <div className="bg-warning-light p-3 rounded-lg border border-warning/20">
          <div className="text-sm font-medium text-warning mb-2">Experience Signals</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-warning/70">Retention:</span>
              <span className="text-warning">{video.experienceSignals.retentionSnapshot || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warning/70">Avg Watch:</span>
              <span className="text-warning">{video.experienceSignals.avgWatchTime || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warning/70">Comments/DMs:</span>
              <span className="text-warning">{video.experienceSignals.commentsMentions || '—'}</span>
            </div>
          </div>
        </div>

        {/* Gray Zone - Distribution Chaos */}
        <div className="bg-neutral-light p-3 rounded-lg border border-neutral/20 opacity-75">
          <div className="text-sm font-medium text-neutral mb-2">Distribution Chaos</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral/70">Views:</span>
              <span className="text-neutral">{video.distributionMetrics.views?.toLocaleString() || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral/70">CTR:</span>
              <span className="text-neutral">{video.distributionMetrics.ctr ? `${video.distributionMetrics.ctr}%` : '—'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};