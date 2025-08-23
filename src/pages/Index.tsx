import React from 'react';
import { StatsHeader } from '@/components/StatsHeader';
import { CompactVideoEntryForm } from '@/components/CompactVideoEntryForm';
import { TrendsPanel } from '@/components/TrendsPanel';
import { useVideos } from '@/hooks/useVideos';
import { useAnalytics } from '@/hooks/useAnalytics';
import { VideoEntry } from '@/services/api';

export default function Index() {
  const { videos, createVideo, deleteVideo, updateVideo } = useVideos();
  const { analytics, refreshAnalytics } = useAnalytics();

  const handleNewVideo = async (videoData: Omit<VideoEntry, 'id' | 'createdAt' | 'craftScore' | 'experienceScore' | 'deltaScore'>) => {
    try {
      await createVideo(videoData);
      // Refresh analytics after creating a new video
      refreshAnalytics();
    } catch (error) {
      console.error('Failed to create video:', error);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo(id);
      // Refresh analytics after deleting a video
      refreshAnalytics();
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleUpdateVideo = async (id: string, videoData: Partial<VideoEntry>) => {
    try {
      await updateVideo(id, videoData);
      // Refresh analytics after updating a video
      refreshAnalytics();
    } catch (error) {
      console.error('Failed to update video:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StatsHeader videos={videos} analytics={analytics} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <CompactVideoEntryForm onSubmit={handleNewVideo} />
        
        <TrendsPanel 
          videos={videos}
          onDeleteVideo={handleDeleteVideo}
          onUpdateVideo={handleUpdateVideo}
        />
      </main>
    </div>
  );
}
