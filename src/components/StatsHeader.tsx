import React from 'react';
import { VideoEntry } from '@/types/video';
import { CheckCircle, Circle } from 'lucide-react';

interface StatsHeaderProps {
  videos: VideoEntry[];
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ videos }) => {
  const getWeeklyStreak = () => {
    // Group videos by week
    const weeklyData = new Map<string, VideoEntry[]>();
    
    videos.forEach(video => {
      const date = new Date(video.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, []);
      }
      weeklyData.get(weekKey)!.push(video);
    });

    // Calculate streak of weeks with 3+ process wins
    let streak = 0;
    const sortedWeeks = Array.from(weeklyData.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
    
    for (const [, weekVideos] of sortedWeeks) {
      const weekHasGoodVideo = weekVideos.some(video => video.processWins >= 3);
      if (weekHasGoodVideo) {
        streak++;
      } else {
        break;
      }
    }
    
    return { streak, weeklyData };
  };

  const totalProcessWins = videos.reduce((sum, video) => sum + video.processWins, 0);
  const targetWins = Math.max(100, Math.ceil(totalProcessWins / 50) * 50); // Dynamic target
  const progressPercentage = Math.min(100, (totalProcessWins / targetWins) * 100);
  
  const { streak, weeklyData } = getWeeklyStreak();
  
  // Get last 7 weeks for display
  const getLast7Weeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + (i * 7)));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      const weekVideos = weeklyData.get(weekKey) || [];
      const hasGoodVideo = weekVideos.some(video => video.processWins >= 3);
      
      // Get week abbreviation
      const weekDate = new Date(weekStart);
      const weekLabel = `W${Math.ceil((weekDate.getDate() + weekDate.getDay()) / 7)}`;
      
      weeks.push({
        key: weekKey,
        label: weekLabel,
        hasGoodVideo,
        videoCount: weekVideos.length
      });
    }
    
    return weeks;
  };

  const last7Weeks = getLast7Weeks();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">YouTube Craft Tracker</h1>
            <p className="text-sm text-muted-foreground">Script + Sound — 1% improvements per upload</p>
          </div>
        </div>

        {/* Stats Widget */}
        <div className="bg-card border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-8">
            {/* Process Wins Progress */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold">{totalProcessWins}</span>
                <span className="text-lg text-muted-foreground">/ {targetWins}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Weekly Calendar */}
              <div className="flex items-center gap-3">
                {last7Weeks.map((week) => (
                  <div key={week.key} className="flex flex-col items-center gap-1">
                    {week.hasGoodVideo ? (
                      <CheckCircle className="w-5 h-5 text-success fill-success/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground font-medium">
                      {week.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Display */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-success-foreground"></div>
                </div>
              </div>
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-sm text-muted-foreground">week streak</div>
              <div className="text-xs text-muted-foreground mt-1">3+ wins</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};