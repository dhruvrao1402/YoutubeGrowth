import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { CheckCircle, Circle } from 'lucide-react';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { VideoEntry } from '@/services/api';
import { AnalyticsData } from '@/services/api';

interface StatsHeaderProps {
  videos: VideoEntry[];
  analytics?: AnalyticsData | null;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ videos, analytics }) => {
  const { user, logout } = useAuth();
  
  const getWeeklyStreak = () => {
    const last7Weeks = Array.from({ length: 7 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      
      const hasGoodVideo = videos.some(video => {
        const videoDate = new Date(video.createdAt || '');
        return videoDate >= weekStart && videoDate <= weekEnd && (video.craftScore || 0) >= 60;
      });
      
      return {
        key: i,
        label: format(weekStart, 'MMM d'),
        hasGoodVideo,
      };
    }).reverse();

    let streak = 0;
    for (let i = last7Weeks.length - 1; i >= 0; i--) {
      if (last7Weeks[i].hasGoodVideo) {
        streak++;
      } else {
        break;
      }
    }

    return { streak, weeklyData: last7Weeks };
  };

  const { streak, weeklyData } = getWeeklyStreak();
  
  // Use analytics data if available, otherwise calculate from videos
  const avgCraftScore = analytics?.recentAverages.craftScore || 
    (videos.length > 0 ? Math.round(videos.reduce((sum, video) => sum + (video.craftScore || 0), 0) / videos.length) : 0);
  
  const avgExperienceScore = analytics?.recentAverages.experienceScore || 
    (videos.length > 0 ? Math.round(videos.reduce((sum, video) => sum + (video.experienceScore || 0), 0) / videos.length) : 0);
  
  const avgDeltaScore = analytics?.recentAverages.deltaScore || 
    (videos.length > 0 ? Math.round(videos.reduce((sum, video) => sum + (video.deltaScore || 0), 0) / videos.length) : 0);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">YouTube Craft Tracker</h1>
          <div className="text-sm text-gray-500">
            Logged in as: <span className="font-medium">{user?.username}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              {user?.username}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Widget */}
      <div className="bg-card border rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Craft Score */}
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-1">{avgCraftScore}</div>
            <div className="text-sm text-muted-foreground">Avg Craft Score</div>
            <div className="text-xs text-success/70">Script + Sound</div>
          </div>

          {/* Experience Score */}
          <div className="text-center">
            <div className="text-3xl font-bold text-warning mb-1">{avgExperienceScore}</div>
            <div className="text-sm text-muted-foreground">Avg Experience</div>
            <div className="text-xs text-warning/70">Audience metrics</div>
          </div>

          {/* Delta Score */}
          <div className="text-center">
            <div className={`text-3xl font-bold mb-1 ${avgDeltaScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {avgDeltaScore >= 0 ? '+' : ''}{avgDeltaScore}
            </div>
            <div className="text-sm text-muted-foreground">Avg Delta</div>
            <div className={`text-xs ${avgDeltaScore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {avgDeltaScore >= 0 ? 'Exp > Craft' : 'Craft > Exp'}
            </div>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-2 mx-auto">
              <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-success-foreground"></div>
              </div>
            </div>
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-sm text-muted-foreground">week streak</div>
            <div className="text-xs text-muted-foreground mt-1">Craft ≥60</div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-center gap-3">
            {weeklyData.map((week) => (
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
      </div>
    </header>
  );
};