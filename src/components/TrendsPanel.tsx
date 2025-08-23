import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoCard } from './VideoCard';
import { VideoEntry } from '@/services/api';

interface TrendsPanelProps {
  videos: VideoEntry[];
  onDeleteVideo: (id: string) => void;
  onUpdateVideo: (id: string, videoData: Partial<VideoEntry>) => void;
}

export const TrendsPanel: React.FC<TrendsPanelProps> = ({ videos, onDeleteVideo, onUpdateVideo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Video Archive</span>
          <span className="text-sm font-normal text-muted-foreground">
            {videos.length} {videos.length === 1 ? 'entry' : 'entries'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No videos yet. Create your first entry above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDelete={() => video.id && onDeleteVideo(video.id)}
                onUpdate={(videoData) => video.id && onUpdateVideo(video.id, videoData)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};