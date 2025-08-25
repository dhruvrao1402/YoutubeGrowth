import { getApiUrl } from '../config/environment';

const API_BASE_URL = getApiUrl();

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
    
    console.log('🔍 API Request:', {
      url: `${this.baseUrl}${endpoint}`,
      method: options.method || 'GET',
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'None'
    });
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    console.log('🔍 Request config:', {
      headers: config.headers,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        console.log('❌ 401 Unauthorized - removing token');
        localStorage.removeItem('authToken');
        window.location.reload();
        throw new Error('Authentication required');
      }
      const errorText = await response.text();
      console.log('❌ API Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Video CRUD operations
  async getAllVideos(): Promise<VideoEntry[]> {
    return this.request('/videos');
  }

  async getVideoById(id: string): Promise<VideoEntry> {
    return this.request(`/videos/${id}`);
  }

  async createVideo(video: Omit<VideoEntry, 'id' | 'createdAt' | 'craftScore' | 'experienceScore' | 'deltaScore'>): Promise<VideoEntry> {
    return this.request('/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
  }

  async updateVideo(id: string, video: Partial<VideoEntry>): Promise<VideoEntry> {
    return this.request(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(video),
    });
  }

  async deleteVideo(id: string): Promise<{ message: string }> {
    return this.request('/videos/${id}', {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return this.request('/videos/stats/analytics');
  }
}

export const apiService = new ApiService();
export default apiService;
