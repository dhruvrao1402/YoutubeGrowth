const API_BASE_URL = 'http://localhost:5000/api';

export interface VideoEntry {
  id?: string;
  title: string;
  playlist: 'Building' | 'Body' | 'Mind' | 'Reflections';
  script: {
    hookEffectiveness: number;
    structureClarity: number;
    concision: number;
    specificity: number;
    audienceBridge: number;
    newExperiment: boolean;
    experimentNotes?: string;
  };
  sound: {
    cueAlignment: number;
    silencePlacement: number;
    mixBalance: number;
    emotionalFit: number;
    newExperiment: boolean;
    experimentNotes?: string;
  };
  experienceInputs: {
    retention30s: number;
    avgWatchTime: number;
    craftMentions: number;
  };
  distributionMetrics?: {
    views?: number;
    ctr?: number;
  };
  createdAt?: Date;
  craftScore?: number;
  experienceScore?: number;
  deltaScore?: number;
}

export interface AnalyticsData {
  totalVideos: number;
  overallAverages: {
    craftScore: number;
    experienceScore: number;
    deltaScore: number;
  };
  recentAverages: {
    craftScore: number;
    experienceScore: number;
    deltaScore: number;
  };
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('authToken');
        window.location.reload();
        throw new Error('Authentication required');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Video CRUD operations
  async getAllVideos(): Promise<VideoEntry[]> {
    return this.request<VideoEntry[]>('/videos');
  }

  async getVideoById(id: string): Promise<VideoEntry> {
    return this.request<VideoEntry>(`/videos/${id}`);
  }

  async createVideo(video: Omit<VideoEntry, 'id' | 'createdAt' | 'craftScore' | 'experienceScore' | 'deltaScore'>): Promise<VideoEntry> {
    return this.request<VideoEntry>('/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
  }

  async updateVideo(id: string, video: Partial<VideoEntry>): Promise<VideoEntry> {
    return this.request<VideoEntry>(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(video),
    });
  }

  async deleteVideo(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/videos/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return this.request<AnalyticsData>('/videos/stats/analytics');
  }
}

export const apiService = new ApiService();
export default apiService;
