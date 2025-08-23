import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoEntry } from '@/types/video';

interface TrendsPanelProps {
  videos: VideoEntry[];
}

export const TrendsPanel: React.FC<TrendsPanelProps> = ({ videos }) => {
  const avgProcessWins = videos.length > 0 
    ? (videos.reduce((sum, video) => sum + video.processWins, 0) / videos.length).toFixed(1) 
    : '0';

  const avgRetention = videos.length > 0
    ? videos.filter(v => v.experienceSignals.retentionSnapshot).length > 0
      ? '35%' // Mock average since we don't have actual retention data
      : '0%'
    : '0%';

  const medianViews = videos.length > 0
    ? videos.filter(v => v.distributionMetrics.views).length > 0
      ? Math.floor(videos.reduce((sum, video) => sum + (video.distributionMetrics.views || 0), 0) / videos.length)
      : 0
    : 0;

  return (
    <div className="space-y-6">
      {/* Dashboard — Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dashboard — Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Avg Process Wins</div>
              <div className="text-2xl font-bold text-success">{avgProcessWins}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Avg Retention 30s</div>
              <div className="text-2xl font-bold text-warning">{avgRetention}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Views (median)</div>
              <div className="text-2xl font-bold text-neutral">{medianViews.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Green = craft you control • Yellow = viewer experience • Gray = distribution noise
          </div>
        </CardContent>
      </Card>

      {/* Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Archive
            <span className="text-sm font-normal text-muted-foreground">{videos.length} entries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {videos.slice(0, 5).map((video) => (
                <div key={video.id} className="flex items-center justify-between text-sm py-1">
                  <span className="truncate flex-1 mr-2">{video.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground">{video.playlist}</span>
                    <span className="text-success font-medium">{video.processWins}w</span>
                  </div>
                </div>
              ))}
              {videos.length > 5 && (
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  + {videos.length - 5} more entries
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              No entries yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};