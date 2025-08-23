import { useState, useEffect, useCallback } from 'react';
import { apiService, VideoEntry } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useVideos = () => {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all videos
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllVideos();
      setVideos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch videos';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create new video
  const createVideo = useCallback(async (videoData: Omit<VideoEntry, 'id' | 'createdAt' | 'craftScore' | 'experienceScore' | 'deltaScore'>) => {
    try {
      const newVideo = await apiService.createVideo(videoData);
      setVideos(prev => [newVideo, ...prev]);
      toast({
        title: "Success",
        description: "Video entry created successfully!",
      });
      return newVideo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create video';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Update video
  const updateVideo = useCallback(async (id: string, videoData: Partial<VideoEntry>) => {
    try {
      const updatedVideo = await apiService.updateVideo(id, videoData);
      setVideos(prev => prev.map(video => 
        video.id === id ? updatedVideo : video
      ));
      toast({
        title: "Success",
        description: "Video updated successfully!",
      });
      return updatedVideo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update video';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Delete video
  const deleteVideo = useCallback(async (id: string) => {
    try {
      await apiService.deleteVideo(id);
      setVideos(prev => prev.filter(video => video.id !== id));
      toast({
        title: "Success",
        description: "Video deleted successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete video';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Get video by ID
  const getVideoById = useCallback(async (id: string) => {
    try {
      return await apiService.getVideoById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch video';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    loading,
    error,
    createVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    fetchVideos,
  };
};
