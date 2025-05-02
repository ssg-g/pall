import axios from 'axios';

// In a real app, this would be using the real Instagram Graph API
// For MVP demonstration purposes, we're using mock data

const mockUserData = {
  id: '17841436574394309',
  username: 'kyayrsam',
  name: 'SAMARTH',
  followers_count: 15432,
  follows_count: 542,
  media_count: 127,
  profile_picture_url: 'https://via.placeholder.com/150'
};

const mockMediaInsights = [
  {
    id: 'media_1',
    timestamp: '2025-04-20T12:00:00Z',
    media_type: 'IMAGE',
    media_url: 'https://via.placeholder.com/640x640',
    permalink: 'https://instagram.com/p/mock1',
    caption: 'Beautiful sunset #travel #nature',
    insights: {
      impressions: 2534,
      reach: 2187,
      engagement: 432,
      saved: 87,
      likes: 345
    }
  },
  {
    id: 'media_2',
    timestamp: '2025-04-15T14:30:00Z',
    media_type: 'CAROUSEL_ALBUM',
    media_url: 'https://via.placeholder.com/640x640',
    permalink: 'https://instagram.com/p/mock2',
    caption: 'Product review - swipe to see more! #review #sponsored',
    insights: {
      impressions: 3245,
      reach: 2879,
      engagement: 567,
      saved: 132,
      likes: 435
    }
  },
  {
    id: 'media_3',
    timestamp: '2025-04-10T18:45:00Z',
    media_type: 'VIDEO',
    media_url: 'https://via.placeholder.com/640x640',
    permalink: 'https://instagram.com/p/mock3',
    caption: 'My morning routine #lifestyle #routine',
    insights: {
      impressions: 5421,
      reach: 4876,
      engagement: 876,
      saved: 234,
      likes: 642,
      video_views: 3245
    }
  },
  {
    id: 'media_4',
    timestamp: '2025-04-05T09:15:00Z',
    media_type: 'REEL',
    media_url: 'https://via.placeholder.com/640x640',
    permalink: 'https://instagram.com/p/mock4',
    caption: 'Quick tip for content creators! #creatortips #socialmedia',
    insights: {
      impressions: 8765,
      reach: 7432,
      engagement: 1243,
      saved: 456,
      likes: 787,
      video_views: 6543
    }
  }
];

const mockFollowerDemographics = {
  age_ranges: [
    { range: '18-24', percentage: 32 },
    { range: '25-34', percentage: 41 },
    { range: '35-44', percentage: 18 },
    { range: '45-54', percentage: 6 },
    { range: '55+', percentage: 3 }
  ],
  gender: [
    { gender: 'female', percentage: 68 },
    { gender: 'male', percentage: 30 },
    { gender: 'other', percentage: 2 }
  ],
  top_locations: [
    { city: 'New York', country: 'USA', percentage: 14 },
    { city: 'Los Angeles', country: 'USA', percentage: 11 },
    { city: 'London', country: 'UK', percentage: 8 },
    { city: 'Toronto', country: 'Canada', percentage: 7 },
    { city: 'Sydney', country: 'Australia', percentage: 5 }
  ],
  active_times: [
    { day: 'Monday', hour: '19:00', engagement_rate: 3.2 },
    { day: 'Wednesday', hour: '18:00', engagement_rate: 3.5 },
    { day: 'Friday', hour: '20:00', engagement_rate: 4.1 },
    { day: 'Saturday', hour: '11:00', engagement_rate: 3.8 },
    { day: 'Sunday', hour: '15:00', engagement_rate: 3.9 }
  ]
};

// Mock audience data for analytics
const mockAudienceData = {
  age_ranges: ['18-24', '25-34', '35-44', '45-54', '55+'],
  age_data: [32, 41, 18, 6, 3],
  gender: {
    male: 30,
    female: 68,
    other: 2
  },
  locations: [
    { name: 'New York, USA', count: 2160 },
    { name: 'Los Angeles, USA', count: 1697 },
    { name: 'London, UK', count: 1235 },
    { name: 'Toronto, Canada', count: 1080 },
    { name: 'Sydney, Australia', count: 772 },
    { name: 'Chicago, USA', count: 694 },
    { name: 'Berlin, Germany', count: 540 }
  ],
  active_hours: [
    { hour: 0, count: 205 },
    { hour: 1, count: 125 },
    { hour: 2, count: 85 },
    { hour: 3, count: 65 },
    { hour: 4, count: 45 },
    { hour: 5, count: 75 },
    { hour: 6, count: 145 },
    { hour: 7, count: 320 },
    { hour: 8, count: 560 },
    { hour: 9, count: 780 },
    { hour: 10, count: 945 },
    { hour: 11, count: 1085 },
    { hour: 12, count: 1240 },
    { hour: 13, count: 1180 },
    { hour: 14, count: 1085 },
    { hour: 15, count: 1140 },
    { hour: 16, count: 1250 },
    { hour: 17, count: 1380 },
    { hour: 18, count: 1520 },
    { hour: 19, count: 1640 },
    { hour: 20, count: 1580 },
    { hour: 21, count: 1320 },
    { hour: 22, count: 980 },
    { hour: 23, count: 580 }
  ],
  active_days: [
    { day: 0, count: 1850 }, // Sunday
    { day: 1, count: 1650 }, // Monday
    { day: 2, count: 1570 }, // Tuesday
    { day: 3, count: 1780 }, // Wednesday
    { day: 4, count: 1820 }, // Thursday
    { day: 5, count: 2150 }, // Friday
    { day: 6, count: 2320 }  // Saturday
  ],
  peak_hours: [
    { hour: 19, count: 1640 },
    { hour: 18, count: 1520 },
    { hour: 20, count: 1580 }
  ],
  peak_days: ['Saturday', 'Friday', 'Sunday']
};

const mockFollowerHistory = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  
  // Generate a slightly random growth trend (generally upward)
  const followersCount = 15000 + Math.floor(i * 15 + Math.random() * 20 - 5);
  
  return {
    date: date.toISOString().split('T')[0],
    followers_count: followersCount
  };
});

export const getInstagramUserData = async () => {
  // In a real app, this would be a call to the Instagram Graph API
  // For MVP, we'll simulate a delay to mimic an API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockUserData;
};

export const getInstagramMediaInsights = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockMediaInsights;
};

export const getInstagramFollowerDemographics = async () => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return mockFollowerDemographics;
};

export const getInstagramFollowerHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 900));
  return mockFollowerHistory;
};

export const getInstagramAudienceData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1100));
  return mockAudienceData;
};

export const getOptimalPostingTimes = async () => {
  await new Promise(resolve => setTimeout(resolve, 1100));
  
  // Generate posting time recommendations based on engagement
  return mockFollowerDemographics.active_times.map(time => ({
    day: time.day,
    hour: time.hour,
    engagement_rate: time.engagement_rate,
    recommendation: time.engagement_rate > 3.5 ? 'Highly Recommended' : 'Good'
  })).sort((a, b) => b.engagement_rate - a.engagement_rate);
};

export const suggestHashtags = async (caption?: string) => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Different hashtag suggestions based on content type
  const hashtagSets = {
    lifestyle: ['#lifestyle', '#dailylife', '#livingwell', '#everyday', '#lifestyleblogger'],
    travel: ['#travel', '#wanderlust', '#explore', '#adventure', '#travelphotography'],
    beauty: ['#beauty', '#skincare', '#makeup', '#beautytips', '#glowingskin'],
    fashion: ['#fashion', '#style', '#ootd', '#outfitinspo', '#fashionblogger'],
    fitness: ['#fitness', '#workout', '#healthylifestyle', '#fitnessmotivation', '#wellness'],
    food: ['#food', '#foodie', '#homecooking', '#healthyeating', '#foodphotography'],
    tech: ['#tech', '#technology', '#gadgets', '#innovation', '#digitallife']
  };
  
  // If a caption is provided, try to determine the most relevant category
  if (caption) {
    const caption_lower = caption.toLowerCase();
    if (caption_lower.includes('travel') || caption_lower.includes('trip') || caption_lower.includes('explore')) {
      return hashtagSets.travel;
    }
    if (caption_lower.includes('makeup') || caption_lower.includes('skin') || caption_lower.includes('beauty')) {
      return hashtagSets.beauty;
    }
    if (caption_lower.includes('outfit') || caption_lower.includes('style') || caption_lower.includes('fashion')) {
      return hashtagSets.fashion;
    }
    if (caption_lower.includes('workout') || caption_lower.includes('fitness') || caption_lower.includes('gym')) {
      return hashtagSets.fitness;
    }
    if (caption_lower.includes('food') || caption_lower.includes('recipe') || caption_lower.includes('cooking')) {
      return hashtagSets.food;
    }
    if (caption_lower.includes('tech') || caption_lower.includes('device') || caption_lower.includes('gadget')) {
      return hashtagSets.tech;
    }
  }
  
  // Default to lifestyle if no caption or no matches
  return hashtagSets.lifestyle;
};

export const suggestContentIdeas = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // AI-suggested content ideas based on user performance
  return [
    {
      type: 'REEL',
      title: 'Day in the Life',
      description: 'Show your daily routine as a creator. Your previous behind-the-scenes content has high engagement.',
      performance_prediction: 'High',
      engagement_estimate: '+20% above average'
    },
    {
      type: 'CAROUSEL',
      title: '5 Tips for Better Content',
      description: 'Educational carousel with 5 slides sharing your best content creation tips.',
      performance_prediction: 'Medium-High',
      engagement_estimate: '+15% above average'
    },
    {
      type: 'IMAGE',
      title: 'Product Showcase',
      description: 'Lifestyle shot with your current favorite product. Your product recommendations get high save rates.',
      performance_prediction: 'Medium',
      engagement_estimate: '+5% above average'
    },
    {
      type: 'REEL',
      title: 'Tutorial/How-To',
      description: 'Create a short tutorial showing how to achieve a specific result in your niche.',
      performance_prediction: 'High',
      engagement_estimate: '+25% above average'
    }
  ];
};

export default {
  getInstagramUserData,
  getInstagramMediaInsights,
  getInstagramFollowerDemographics,
  getInstagramFollowerHistory,
  getInstagramAudienceData,
  getOptimalPostingTimes,
  suggestHashtags,
  suggestContentIdeas
}; 