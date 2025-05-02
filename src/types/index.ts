// Instagram user data
export interface InstagramUser {
  id: string;
  username: string;
  name: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string;
}

// Instagram media insights
export interface MediaInsight {
  id: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REEL';
  media_url: string;
  permalink: string;
  caption: string;
  insights: {
    impressions: number;
    reach: number;
    engagement: number;
    saved: number;
    likes: number;
    video_views?: number;
  };
}

// Demographics
export interface AgeRange {
  range: string;
  percentage: number;
}

export interface GenderStat {
  gender: string;
  percentage: number;
}

export interface Location {
  city: string;
  country: string;
  percentage: number;
}

export interface ActiveTime {
  day: string;
  hour: string;
  engagement_rate: number;
}

export interface FollowerDemographics {
  age_ranges: AgeRange[];
  gender: GenderStat[];
  top_locations: Location[];
  active_times: ActiveTime[];
}

// Audience Data (for Analytics page)
export interface AudienceData {
  age_ranges: string[];
  age_data: number[];
  gender: {
    male: number;
    female: number;
    other: number;
  };
  locations: Array<{
    name: string;
    count: number;
  }>;
  active_hours: Array<{
    hour: number;
    count: number;
  }>;
  active_days: Array<{
    day: number;
    count: number;
  }>;
  peak_hours: Array<{
    hour: number;
    count: number;
  }>;
  peak_days: string[];
}

// Follower history
export interface FollowerHistoryEntry {
  date: string;
  followers_count: number;
}

// Optimal posting time
export interface OptimalPostingTime {
  day: string;
  hour: string;
  engagement_rate: number;
  recommendation: string;
}

// Content idea
export interface ContentIdea {
  type: string;
  title: string;
  description: string;
  performance_prediction: string;
  engagement_estimate: string;
}

// Settings
export interface UserSettings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  language: string;
}

// Route
export interface AppRoute {
  path: string;
  label: string;
  icon?: string;
} 