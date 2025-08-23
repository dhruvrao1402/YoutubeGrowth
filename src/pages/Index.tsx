import React from 'react';
import { StatsHeader } from '@/components/StatsHeader';
import { CompactVideoEntryForm } from '@/components/CompactVideoEntryForm';
import { TrendsPanel } from '@/components/TrendsPanel';
import { VideoEntry } from '@/types/video';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const [videos, setVideos] = useLocalStorage<VideoEntry[]>('youtube-craft-videos', []);

  const calculateProcessWins = (video: Omit<VideoEntry, 'id' | 'createdAt' | 'processWins'>) => {
    const scriptWins = Object.values(video.script).filter(Boolean).length;
    const soundWins = Object.entries(video.sound).filter(([key, value]) => 
      key !== 'moodFitRating' && key !== 'experimentNotes' && Boolean(value)
    ).length + (video.sound.moodFitRating >= 4 ? 1 : 0);
    return scriptWins + soundWins;
  };

  const handleNewVideo = (videoData: Omit<VideoEntry, 'id' | 'createdAt' | 'processWins'>) => {
    const newVideo: VideoEntry = {
      ...videoData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      processWins: calculateProcessWins(videoData),
    };

    setVideos(prev => [newVideo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <StatsHeader videos={videos} />
      
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Side - Video Entry Form */}
          <div className="xl:col-span-2">
            <CompactVideoEntryForm onSubmit={handleNewVideo} />
          </div>
          
          {/* Right Side - Trends & Archive */}
          <div className="xl:col-span-1">
            <TrendsPanel videos={videos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
