import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VideoCard } from './VideoCard';
import { VideoEntry, Playlist, PLAYLISTS } from '@/types/video';
import { Plus, Filter, TrendingUp } from 'lucide-react';

interface DashboardProps {
  videos: VideoEntry[];
  onNewVideo: () => void;
  onVideoClick: (video: VideoEntry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ videos, onNewVideo, onVideoClick }) => {
  const [playlistFilter, setPlaylistFilter] = useState<Playlist | 'all'>('all');
  const [improvementFilter, setImprovementFilter] = useState<'all' | 'script' | 'sound'>('all');

  const filteredVideos = videos.filter(video => {
    if (playlistFilter !== 'all' && video.playlist !== playlistFilter) return false;
    // Note: Improvement filtering would require more detailed tracking
    return true;
  });

  const currentStreak = () => {
    let streak = 0;
    const sortedVideos = [...videos].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    for (const video of sortedVideos) {
      if (video.craftScore >= 60) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateLast5Averages = () => {
    const sortedVideos = [...videos].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const last5Videos = sortedVideos.slice(0, 5);
    
    if (last5Videos.length === 0) return { craftScore: 0, experienceScore: 0, delta: 0 };
    
    const avgCraftScore = last5Videos.reduce((sum, video) => sum + video.craftScore, 0) / last5Videos.length;
    const avgExperienceScore = last5Videos.reduce((sum, video) => sum + video.experienceScore, 0) / last5Videos.length;
    const avgDelta = last5Videos.reduce((sum, video) => sum + video.deltaScore, 0) / last5Videos.length;
    
    return {
      craftScore: Math.round(avgCraftScore),
      experienceScore: Math.round(avgExperienceScore),
      delta: Math.round(avgDelta)
    };
  };

  const averages = calculateLast5Averages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">YouTube Craft Tracker</h1>
          <p className="text-muted-foreground">Track your 1% improvements in every video</p>
        </div>
        <Button onClick={onNewVideo} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-success-light p-4 rounded-lg border border-success/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-success">Current Streak</span>
          </div>
          <div className="text-2xl font-bold text-success mt-1">
            {currentStreak()}
          </div>
          <div className="text-xs text-success/70">Videos with Craft Score ≥60</div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm font-medium text-muted-foreground">Total Videos</div>
          <div className="text-2xl font-bold mt-1">{videos.length}</div>
        </div>
        
        <div className="bg-success-light p-4 rounded-lg border border-success/20">
          <div className="text-sm font-medium text-success">Avg Craft Score</div>
          <div className="text-2xl font-bold text-success mt-1">{averages.craftScore}</div>
          <div className="text-xs text-success/70">Last 5 videos</div>
        </div>

        <div className="bg-warning-light p-4 rounded-lg border border-warning/20">
          <div className="text-sm font-medium text-warning">Avg Experience Score</div>
          <div className="text-2xl font-bold text-warning mt-1">{averages.experienceScore}</div>
          <div className="text-xs text-warning/70">Last 5 videos</div>
        </div>
      </div>

      {/* Delta Score */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="text-center">
          <div className="text-sm font-medium text-muted-foreground mb-2">Average Delta Score (Last 5 Videos)</div>
          <div className={`text-3xl font-bold ${averages.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {averages.delta >= 0 ? '+' : ''}{averages.delta}
          </div>
          <div className={`text-sm ${averages.delta >= 0 ? 'text-green-600' : 'text-red-600'} opacity-80`}>
            {averages.delta >= 0 ? 'Experience > Craft' : 'Craft > Experience'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={playlistFilter} onValueChange={(value) => setPlaylistFilter(value as Playlist | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Playlists</SelectItem>
            {PLAYLISTS.map((playlist) => (
              <SelectItem key={playlist} value={playlist}>{playlist}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={improvementFilter} onValueChange={(value) => setImprovementFilter(value as 'all' | 'script' | 'sound')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Improvements</SelectItem>
            <SelectItem value="script">Script Focus</SelectItem>
            <SelectItem value="sound">Sound Focus</SelectItem>
          </SelectContent>
        </Select>

        {(playlistFilter !== 'all' || improvementFilter !== 'all') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setPlaylistFilter('all');
              setImprovementFilter('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick(video)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {videos.length === 0 
              ? "No videos tracked yet. Create your first entry!" 
              : "No videos match your current filters."
            }
          </div>
          {videos.length === 0 && (
            <Button onClick={onNewVideo}>
              Create First Entry
            </Button>
          )}
        </div>
      )}
    </div>
  );
};