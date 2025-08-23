import React from 'react';
import { VideoEntry } from '@/types/video';

interface StatsHeaderProps {
  videos: VideoEntry[];
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ videos }) => {
  const currentStreak = () => {
    let streak = 0;
    const sortedVideos = [...videos].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    for (const video of sortedVideos) {
      if (video.processWins >= 3) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const totalProcessWins = videos.reduce((sum, video) => sum + video.processWins, 0);

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">YouTube Craft Tracker</h1>
            <p className="text-sm text-muted-foreground">Script + Sound — 1% improvements per upload</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Streak (≥3 wins):</span>
              <span className="font-bold text-success">{currentStreak()}</span>
              <div className="w-2 h-2 rounded-full bg-success"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total Process Wins:</span>
              <span className="font-bold">{totalProcessWins}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};