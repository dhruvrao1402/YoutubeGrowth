import React, { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { VideoEntryForm } from '@/components/VideoEntryForm';
import { VideoEntry } from '@/types/video';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const [videos, setVideos] = useLocalStorage<VideoEntry[]>('youtube-craft-videos', []);
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-entry' | 'video-detail'>('dashboard');
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry | null>(null);

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
    setCurrentView('dashboard');
  };

  const handleVideoClick = (video: VideoEntry) => {
    setSelectedVideo(video);
    setCurrentView('video-detail');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            videos={videos}
            onNewVideo={() => setCurrentView('new-entry')}
            onVideoClick={handleVideoClick}
          />
        )}

        {currentView === 'new-entry' && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <VideoEntryForm
              onSubmit={handleNewVideo}
              onCancel={() => setCurrentView('dashboard')}
            />
          </div>
        )}

        {currentView === 'video-detail' && selectedVideo && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">{selectedVideo.title}</h1>
              <div className="bg-card p-6 rounded-lg border space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Playlist:</span> {selectedVideo.playlist}
                  </div>
                  <div>
                    <span className="font-medium">Process Wins:</span> {selectedVideo.processWins}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
