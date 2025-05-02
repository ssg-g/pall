import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import {
  getInstagramUserData,
  getInstagramMediaInsights,
  getInstagramFollowerHistory,
  getInstagramAudienceData
} from '../services/instagram';
import { InstagramUser, MediaInsight, FollowerHistoryEntry, AudienceData } from '../types';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  UsersIcon, 
  GlobeAltIcon,
  ClockIcon,
  CalendarDaysIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { currentUser, instagramConnected } = useAuth();
  const [userData, setUserData] = useState<InstagramUser | null>(null);
  const [mediaInsights, setMediaInsights] = useState<MediaInsight[]>([]);
  const [followerHistory, setFollowerHistory] = useState<FollowerHistoryEntry[]>([]);
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('audience');
  
  useEffect(() => {
    const fetchData = async () => {
      if (instagramConnected) {
        try {
          const [user, media, history, audience] = await Promise.all([
            getInstagramUserData(),
            getInstagramMediaInsights(),
            getInstagramFollowerHistory(),
            getInstagramAudienceData(),
          ]);
          
          setUserData(user);
          setMediaInsights(media);
          setFollowerHistory(history);
          setAudienceData(audience);
        } catch (error) {
          console.error('Error fetching Instagram data:', error);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [instagramConnected]);
  
  // Common chart options
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: true,
        boxPadding: 6,
        borderColor: 'rgba(147, 197, 253, 0.3)',
        borderWidth: 1,
      },
    },
  };
  
  // Audience Demographics - Age Distribution
  const ageDistributionData = {
    labels: audienceData?.age_ranges || [],
    datasets: [
      {
        label: 'Age Distribution',
        data: audienceData?.age_data || [],
        backgroundColor: [
          'rgba(14, 165, 233, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(217, 70, 239, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(234, 179, 8, 0.7)',
        ],
        borderColor: [
          'rgba(14, 165, 233, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(217, 70, 239, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Gender distribution data
  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        label: 'Gender',
        data: [
          audienceData?.gender?.male || 0,
          audienceData?.gender?.female || 0,
          audienceData?.gender?.other || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Locations distribution data
  const topLocations = audienceData?.locations || [];
  const locationData = {
    labels: topLocations.map(loc => loc.name),
    datasets: [
      {
        label: 'Followers by Location',
        data: topLocations.map(loc => loc.count),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Best time to post
  const activeHoursData = {
    labels: audienceData?.active_hours?.map(hour => 
      (hour.hour % 12 === 0 ? 12 : hour.hour % 12) + (hour.hour < 12 ? ' AM' : ' PM')
    ) || [],
    datasets: [
      {
        label: 'Active Followers',
        data: audienceData?.active_hours?.map(hour => hour.count) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Active days data
  const activeDaysData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Active Followers',
        data: audienceData?.active_days?.map(day => day.count) || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Historical engagement rate
  const engagementHistory = followerHistory.map((entry, index) => {
    const mediaInRange = mediaInsights.filter(media => {
      const mediaDate = new Date(media.timestamp);
      const entryDate = new Date(entry.date);
      return mediaDate <= entryDate && (index === 0 || mediaDate > new Date(followerHistory[index - 1].date));
    });
    
    const totalEngagement = mediaInRange.reduce((sum, media) => sum + media.insights.engagement, 0);
    const avgEngagement = mediaInRange.length > 0 ? totalEngagement / mediaInRange.length : 0;
    
    return {
      date: entry.date,
      followers: entry.followers_count,
      avgEngagement,
      engagementRate: entry.followers_count > 0 ? (avgEngagement / entry.followers_count) * 100 : 0,
    };
  });
  
  // Calculate follower growth percentage
  const followerGrowth = followerHistory.length > 1 
    ? followerHistory[followerHistory.length - 1].followers_count - followerHistory[0].followers_count
    : 0;
  
  const followerGrowthPercentage = followerHistory.length > 1
    ? ((followerGrowth / followerHistory[0].followers_count) * 100).toFixed(1)
    : '0.0';
  
  // Find best performing content type
  const mediaTypeEngagement = mediaInsights.reduce((acc, media) => {
    if (!acc[media.media_type]) {
      acc[media.media_type] = { total: 0, count: 0 };
    }
    acc[media.media_type].total += media.insights.engagement;
    acc[media.media_type].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);
  
  let bestPerformingType = '';
  let bestAvgEngagement = 0;
  
  Object.entries(mediaTypeEngagement).forEach(([type, data]) => {
    const avgEngagement = data.total / data.count;
    if (avgEngagement > bestAvgEngagement) {
      bestAvgEngagement = avgEngagement;
      bestPerformingType = type;
    }
  });

  const engagementRateData = {
    labels: engagementHistory.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Engagement Rate (%)',
        data: engagementHistory.map(entry => entry.engagementRate),
        fill: true,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderColor: 'rgba(249, 115, 22, 1)',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: 'rgba(249, 115, 22, 1)',
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };
  
  // Content performance by type
  const contentPerformanceByType = Object.entries(mediaInsights.reduce((acc, media) => {
    if (!acc[media.media_type]) {
      acc[media.media_type] = { 
        engagement: 0, 
        reach: 0, 
        impressions: 0, 
        count: 0 
      };
    }
    acc[media.media_type].engagement += media.insights.engagement;
    acc[media.media_type].reach += media.insights.reach;
    acc[media.media_type].impressions += media.insights.impressions;
    acc[media.media_type].count += 1;
    return acc;
  }, {} as Record<string, { engagement: number, reach: number, impressions: number, count: number }>))
  .map(([type, data]) => ({
    type,
    averageEngagement: data.count > 0 ? data.engagement / data.count : 0,
    averageReach: data.count > 0 ? data.reach / data.count : 0,
    averageImpressions: data.count > 0 ? data.impressions / data.count : 0,
  }));
  
  const contentTypePerformanceData = {
    labels: contentPerformanceByType.map(item => item.type.replace('_', ' ')),
    datasets: [
      {
        label: 'Avg. Engagement',
        data: contentPerformanceByType.map(item => item.averageEngagement),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
      },
      {
        label: 'Avg. Reach',
        data: contentPerformanceByType.map(item => item.averageReach),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
      },
      {
        label: 'Avg. Impressions',
        data: contentPerformanceByType.map(item => item.averageImpressions),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
    ],
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
          
          {instagramConnected && userData && (
            <div className="flex items-center rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-gray-800">
              <img 
                src={userData.profile_picture_url} 
                alt={userData.username} 
                className="mr-2 h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700" 
              />
              <div>
                <span className="text-sm font-medium">@{userData.username}</span>
              </div>
            </div>
          )}
        </div>
        
        {!instagramConnected ? (
          <div className="card-gradient">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Instagram Not Connected</h3>
            <p className="mt-2 text-yellow-700 dark:text-yellow-300">
              Please connect your Instagram account in the settings to view your analytics.
            </p>
            <div className="mt-4">
              <a 
                href="/settings" 
                className="inline-flex items-center rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:hover:bg-yellow-900/50"
              >
                Go to Settings
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ) : loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-primary-900 dark:border-t-primary-400"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading your Instagram data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Analytics Tabs */}
            <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('audience')}
                className={`tab-button ${activeTab === 'audience' ? 'tab-active' : ''}`}
              >
                <UsersIcon className="h-4 w-4" />
                Audience Insights
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`tab-button ${activeTab === 'content' ? 'tab-active' : ''}`}
              >
                <MegaphoneIcon className="h-4 w-4" />
                Content Performance
              </button>
              <button
                onClick={() => setActiveTab('timing')}
                className={`tab-button ${activeTab === 'timing' ? 'tab-active' : ''}`}
              >
                <ClockIcon className="h-4 w-4" />
                Posting Times
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`tab-button ${activeTab === 'trends' ? 'tab-active' : ''}`}
              >
                <CalendarDaysIcon className="h-4 w-4" />
                Trends & Patterns
              </button>
            </div>
            
            {/* Audience Insights Tab */}
            {activeTab === 'audience' && (
              <div className="space-y-6">
                <div className="card-gradient">
                  <h2 className="section-title flex items-center">
                    <UsersIcon className="mr-2 h-5 w-5 text-primary-500" />
                    Audience Demographics
                  </h2>
                  
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <div className="card">
                      <h3 className="mb-4 text-lg font-medium">Age Distribution</h3>
                      <div className="h-64">
                        <Bar 
                          data={ageDistributionData} 
                          options={commonChartOptions} 
                        />
                      </div>
                    </div>
                    
                    <div className="card">
                      <h3 className="mb-4 text-lg font-medium">Gender Distribution</h3>
                      <div className="h-64">
                        <Pie 
                          data={genderData} 
                          options={commonChartOptions} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h2 className="section-title flex items-center">
                    <GlobeAltIcon className="mr-2 h-5 w-5 text-primary-500" />
                    Geographic Distribution
                  </h2>
                  
                  <div className="mt-4">
                    <h3 className="mb-4 text-lg font-medium">Top Locations</h3>
                    <div className="h-64">
                      <Bar 
                        data={locationData} 
                        options={{
                          ...commonChartOptions,
                          indexAxis: 'y' as const,
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Content Performance Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="section-title flex items-center">
                    <MegaphoneIcon className="mr-2 h-5 w-5 text-primary-500" />
                    Content Type Performance
                  </h2>
                  
                  <div className="mt-4">
                    <div className="h-80">
                      <Bar 
                        data={contentTypePerformanceData} 
                        options={commonChartOptions} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h2 className="section-title flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Average Metrics by Content Type
                  </h2>
                  
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-2 text-left">Content Type</th>
                          <th className="px-4 py-2 text-right">Avg. Engagement</th>
                          <th className="px-4 py-2 text-right">Avg. Reach</th>
                          <th className="px-4 py-2 text-right">Avg. Impressions</th>
                          <th className="px-4 py-2 text-right">Engagement Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentPerformanceByType.map(item => (
                          <tr key={item.type} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-3 font-medium">{item.type.replace('_', ' ')}</td>
                            <td className="px-4 py-3 text-right">{Math.round(item.averageEngagement).toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">{Math.round(item.averageReach).toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">{Math.round(item.averageImpressions).toLocaleString()}</td>
                            <td className="px-4 py-3 text-right">
                              {((item.averageEngagement / item.averageReach) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Posting Times Tab */}
            {activeTab === 'timing' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="section-title flex items-center">
                    <ClockIcon className="mr-2 h-5 w-5 text-primary-500" />
                    Best Time to Post
                  </h2>
                  
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-lg font-medium">Active Hours (Follower Activity)</h3>
                      <div className="h-64">
                        <Bar 
                          data={activeHoursData} 
                          options={commonChartOptions} 
                        />
                      </div>
                      <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h4 className="ml-2 font-medium text-green-800 dark:text-green-300">Recommended Posting Time</h4>
                        </div>
                        <p className="mt-2 text-sm text-green-800 dark:text-green-200">
                          {audienceData?.peak_hours?.map(hour => 
                            (hour.hour % 12 === 0 ? 12 : hour.hour % 12) + (hour.hour < 12 ? ' AM' : ' PM')
                          ).join(', ')}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-4 text-lg font-medium">Active Days</h3>
                      <div className="h-64">
                        <Bar 
                          data={activeDaysData} 
                          options={commonChartOptions} 
                        />
                      </div>
                      <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h4 className="ml-2 font-medium text-blue-800 dark:text-blue-300">Recommended Posting Days</h4>
                        </div>
                        <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                          {audienceData?.peak_days?.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Trends & Patterns Tab */}
            {activeTab === 'trends' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="section-title flex items-center">
                    <CalendarDaysIcon className="mr-2 h-5 w-5 text-primary-500" />
                    Engagement Rate Over Time
                  </h2>
                  
                  <div className="mt-4">
                    <div className="h-72">
                      <Line 
                        data={engagementRateData} 
                        options={{
                          ...commonChartOptions,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Engagement Rate (%)'
                              }
                            },
                            x: {
                              title: {
                                display: true,
                                text: 'Date'
                              }
                            }
                          }
                        }} 
                      />
                    </div>
                  </div>
                </div>
                
                {/* AI-Powered Recommendations */}
                <div className="card-gradient">
                  <h2 className="section-title flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI-Powered Growth Recommendations
                  </h2>
                  
                  <div className="mt-4 space-y-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                      <h3 className="mb-2 text-base font-medium">Content Strategy</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {bestPerformingType ? 
                          `Focus on creating more ${bestPerformingType.replace('_', ' ').toLowerCase()} content, as it's your best performing content type with the highest engagement rate.` : 
                          'Post more consistently to get personalized content recommendations.'
                        }
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                      <h3 className="mb-2 text-base font-medium">Audience Growth</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {followerHistory.length > 1 ? 
                          `Your audience growth rate is ${followerGrowthPercentage}% over the last 30 days. ${
                            parseFloat(followerGrowthPercentage) > 5 ? 'This is a strong growth rate, keep up the good work!' : 
                            parseFloat(followerGrowthPercentage) > 0 ? 'Consider increasing posting frequency to accelerate growth.' : 
                            'Focus on engagement and content quality to reverse this trend.'
                          }` : 
                          'We need more historical data to provide growth recommendations.'
                        }
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                      <h3 className="mb-2 text-base font-medium">Engagement Optimization</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Try posting at {audienceData?.peak_hours?.map(hour => 
                          (hour.hour % 12 === 0 ? 12 : hour.hour % 12) + (hour.hour < 12 ? ' AM' : ' PM')
                        ).join(', ')} on {audienceData?.peak_days?.join(', ')} to reach your most active audience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analytics; 