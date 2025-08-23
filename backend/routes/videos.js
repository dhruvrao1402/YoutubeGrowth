const express = require('express');
const supabase = require('../supabase');
const { verifyToken } = require('./auth');
const router = express.Router();

// Apply authentication to all video routes
router.use(verifyToken);

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', req.user.username) // Only get videos for current user
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
});

// Get video by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.username) // Only get videos for current user
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Failed to fetch video', error: error.message });
  }
});

// Create new video
router.post('/', async (req, res) => {
  try {
    const videoData = {
      title: req.body.title,
      playlist: req.body.playlist,
      script: req.body.script,
      sound: req.body.sound,
      experience_inputs: req.body.experienceInputs,
      distribution_metrics: req.body.distributionMetrics || {},
      created_at: new Date().toISOString(),
      user_id: req.user.username // Add user ID from JWT token
    };

    // Calculate scores
    const scriptRatings = [
      videoData.script.hookEffectiveness,
      videoData.script.structureClarity,
      videoData.script.concision,
      videoData.script.specificity,
      videoData.script.audienceBridge
    ];
    const soundRatings = [
      videoData.sound.cueAlignment,
      videoData.sound.silencePlacement,
      videoData.sound.mixBalance,
      videoData.sound.emotionalFit
    ];
    const allRatings = [...scriptRatings, ...soundRatings];
    
    videoData.craft_score = Math.round((allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length) * 20);

    const retentionWeight = 0.6;
    const watchTimeWeight = 0.3;
    const mentionsWeight = 0.1;

    videoData.experience_score = Math.round(
      (videoData.experience_inputs.retention30s * retentionWeight) +
      (videoData.experience_inputs.avgWatchTime * watchTimeWeight) +
      (Math.min(videoData.experience_inputs.craftMentions * 10, 100) * mentionsWeight)
    );

    videoData.delta_score = videoData.experience_score - videoData.craft_score;

    const { data, error } = await supabase
      .from('videos')
      .insert([videoData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(400).json({ message: 'Failed to create video', error: error.message });
  }
});

// Update video
router.put('/:id', async (req, res) => {
  try {
    const videoData = {
      title: req.body.title,
      playlist: req.body.playlist,
      script: req.body.script,
      sound: req.body.sound,
      experience_inputs: req.body.experienceInputs,
      distribution_metrics: req.body.distributionMetrics || {},
      updated_at: new Date().toISOString(),
      user_id: req.user.username // Add user ID from JWT token
    };

    // Recalculate scores
    const scriptRatings = [
      videoData.script.hookEffectiveness,
      videoData.script.structureClarity,
      videoData.script.concision,
      videoData.script.specificity,
      videoData.script.audienceBridge
    ];
    const soundRatings = [
      videoData.sound.cueAlignment,
      videoData.sound.silencePlacement,
      videoData.sound.mixBalance,
      videoData.sound.emotionalFit
    ];
    const allRatings = [...scriptRatings, ...soundRatings];
    
    videoData.craft_score = Math.round((allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length) * 20);

    const retentionWeight = 0.6;
    const watchTimeWeight = 0.3;
    const mentionsWeight = 0.1;

    videoData.experience_score = Math.round(
      (videoData.experience_inputs.retention30s * retentionWeight) +
      (videoData.experience_inputs.avgWatchTime * watchTimeWeight) +
      (Math.min(videoData.experience_inputs.craftMentions * 10, 100) * mentionsWeight)
    );

    videoData.delta_score = videoData.experience_score - videoData.craft_score;

    const { data, error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', req.params.id)
      .eq('user_id', req.user.username) // Only update videos owned by current user
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(400).json({ message: 'Failed to update video', error: error.message });
  }
});

// Delete video
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.username); // Only delete videos owned by current user

    if (error) throw error;
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: 'Failed to delete video', error: error.message });
  }
});

// Get analytics
router.get('/stats/analytics', async (req, res) => {
  try {
    // Get total videos for current user
    const { count: totalVideos, error: countError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.username); // Only count videos for current user

    if (countError) throw countError;

    // Get all videos for current user for calculations
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('craft_score, experience_score, delta_score, created_at')
      .eq('user_id', req.user.username) // Only get videos for current user
      .order('created_at', { ascending: false });

    if (videosError) throw videosError;

    if (!videos || videos.length === 0) {
      return res.json({
        totalVideos: 0,
        overallAverages: { craftScore: 0, experienceScore: 0, deltaScore: 0 },
        recentAverages: { craftScore: 0, experienceScore: 0, deltaScore: 0 }
      });
    }

    // Calculate overall averages
    const overallAverages = {
      craftScore: Math.round(videos.reduce((sum, v) => sum + (v.craft_score || 0), 0) / videos.length),
      experienceScore: Math.round(videos.reduce((sum, v) => sum + (v.experience_score || 0), 0) / videos.length),
      deltaScore: Math.round(videos.reduce((sum, v) => sum + (v.delta_score || 0), 0) / videos.length)
    };

    // Calculate recent averages (last 5 videos)
    const recentVideos = videos.slice(0, 5);
    const recentAverages = {
      craftScore: Math.round(recentVideos.reduce((sum, v) => sum + (v.craft_score || 0), 0) / recentVideos.length),
      experienceScore: Math.round(recentVideos.reduce((sum, v) => sum + (v.experience_score || 0), 0) / recentVideos.length),
      deltaScore: Math.round(recentVideos.reduce((sum, v) => sum + (v.delta_score || 0), 0) / recentVideos.length)
    };

    res.json({
      totalVideos,
      overallAverages,
      recentAverages
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

module.exports = router;
