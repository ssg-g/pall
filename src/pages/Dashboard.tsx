import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import {
  getInstagramUserData,
  getInstagramMediaInsights,
  getInstagramFollowerHistory
} from '../services/instagram';
import { InstagramUser, MediaInsight, FollowerHistoryEntry } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  UsersIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { currentUser, instagramConnected } = useAuth();
  const [userData, setUserData] = useState<InstagramUser | null>(null);
  const [mediaInsights, setMediaInsights] = useState<MediaInsight[]>([]);
  const [followerHistory, setFollowerHistory] = useState<FollowerHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (instagramConnected) {
        try {
          const [user, media, history] = await Promise.all([
            getInstagramUserData(),
            getInstagramMediaInsights(),
            getInstagramFollowerHistory(),
          ]);
          
          setUserData(user);
          setMediaInsights(media);
          setFollowerHistory(history);
        } catch (error) {
          console.error('Error fetching Instagram data:', error);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [instagramConnected]);
  
  // Follower growth chart data
  const followerChartData = {
    labels: followerHistory.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Followers',
        data: followerHistory.map(entry => entry.followers_count),
        fill: true,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderColor: 'rgba(14, 165, 233, 1)',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        displayColors: false,
        borderColor: 'rgba(147, 197, 253, 0.3)',
        borderWidth: 1,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(160, 160, 160, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 0,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };
  
  // Calculate total engagement
  const totalEngagement = mediaInsights.reduce(
    (sum, media) => sum + media.insights.engagement,
    0
  );
  
  // Get top performing post
  const topPost = mediaInsights.length > 0
    ? mediaInsights.reduce((top, current) => 
        current.insights.engagement > top.insights.engagement ? current : top
      )
    : null;
  
  // Calculate follower growth
  const followerGrowth = followerHistory.length > 1 
    ? followerHistory[followerHistory.length - 1].followers_count - followerHistory[0].followers_count
    : 0;
  
  const followerGrowthPercentage = followerHistory.length > 1
    ? ((followerGrowth / followerHistory[0].followers_count) * 100).toFixed(1)
    : '0.0';
  
  // Media types distribution for analytics insights
  const mediaTypeCounts = mediaInsights.reduce((counts, media) => {
    counts[media.media_type] = (counts[media.media_type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Find media type with highest average engagement
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
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          {instagramConnected && userData && (
            <div className="flex items-center rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-gray-800">
              <img 
                src={userData.profile_picture_url} 
                alt={userData.username} 
                className="mr-2 h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700" 
              />
              <div>
                <span className="text-sm font-medium">@{userData.username}</span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {followerGrowth >= 0 ? (
                      <span className="flex items-center text-green-600 dark:text-green-400">
                        <ArrowUpIcon className="mr-1 h-3 w-3" />
                        {followerGrowthPercentage}%
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 dark:text-red-400">
                        <ArrowDownIcon className="mr-1 h-3 w-3" />
                        {Math.abs(parseFloat(followerGrowthPercentage))}%
                      </span>
                    )}
                  </span>
                  <span className="mx-1 text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</span>
                </div>
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
            {/* Account Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="stat-card group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400 dark:group-hover:bg-primary-500">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <p className="mt-3 stat-value">{userData?.followers_count.toLocaleString()}</p>
                <p className="stat-label">Followers</p>
                <div className="mt-2 text-xs">
                  {followerGrowth > 0 ? (
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                      {followerGrowth} new
                    </span>
                  ) : followerGrowth < 0 ? (
                    <span className="flex items-center text-red-600 dark:text-red-400">
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                      {Math.abs(followerGrowth)} lost
                    </span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">No change</span>
                  )}
                </div>
              </div>
              
              <div className="stat-card group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 transition-colors group-hover:bg-secondary-600 group-hover:text-white dark:bg-secondary-900/30 dark:text-secondary-400 dark:group-hover:bg-secondary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="mt-3 stat-value">{userData?.follows_count.toLocaleString()}</p>
                <p className="stat-label">Following</p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Ratio: {(userData?.followers_count / (userData?.follows_count || 1)).toFixed(2)}
                </div>
              </div>
              
              <div className="stat-card group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/30 dark:text-green-400 dark:group-hover:bg-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mt-3 stat-value">{userData?.media_count.toLocaleString()}</p>
                <p className="stat-label">Posts</p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Average Engagement: {(totalEngagement / (userData?.media_count || 1)).toFixed(0)}
                </div>
              </div>
              
              <div className="stat-card group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 transition-colors group-hover:bg-yellow-600 group-hover:text-white dark:bg-yellow-900/30 dark:text-yellow-400 dark:group-hover:bg-yellow-500">
                  <HeartIcon className="h-6 w-6" />
                </div>
                <p className="mt-3 stat-value">{totalEngagement.toLocaleString()}</p>
                <p className="stat-label">Engagement</p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Rate: {((totalEngagement / (userData?.followers_count || 1)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Follower Growth Chart */}
            <div className="card-gradient">
              <h2 className="section-title flex items-center">
                <UsersIcon className="mr-2 h-5 w-5 text-primary-500" />
                Follower Growth
              </h2>
              <div className="h-72">
                <Line data={followerChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Performing Content */}
              <div className="card">
                <h2 className="section-title flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Top Performing Post
                </h2>
                {topPost ? (
                  <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 md:w-48">
                      <img
                        src={topPost.media_url}
                        alt="Top performing post"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="line-clamp-2 text-sm">{topPost.caption}</p>
                      
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div className="flex items-center rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                          <HeartIcon className="mr-2 h-5 w-5 text-red-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Likes</p>
                            <p className="font-medium">{topPost.insights.likes.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                          <ChatBubbleLeftIcon className="mr-2 h-5 w-5 text-primary-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Comments</p>
                            <p className="font-medium">{(topPost.insights.engagement - topPost.insights.likes).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Saves</p>
                            <p className="font-medium">{topPost.insights.saved.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                          <EyeIcon className="mr-2 h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reach</p>
                            <p className="font-medium">{topPost.insights.reach.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex">
                        <a 
                          href={topPost.permalink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/40"
                        >
                          View on Instagram
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                  </div>
                )}
              </div>
              
              {/* Content Performance Insights */}
              <div className="card">
                <h2 className="section-title flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Content Performance Insights
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Content Type Distribution</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(mediaTypeCounts).map(([type, count]) => (
                        <div key={type} className="badge badge-primary">
                          {type.replace('_', ' ')}: {count}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-2 text-sm font-medium">AI-Powered Recommendations</h3>
                    <div className="rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 p-4 dark:from-primary-900/20 dark:to-primary-900/10">
                      <div className="mb-3 flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="ml-2 font-medium text-primary-800 dark:text-primary-300">Key Insights</h4>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {bestPerformingType ? (
                          <p className="text-primary-800 dark:text-primary-200">
                            Your <span className="font-semibold">{bestPerformingType.replace('_', ' ').toLowerCase()}</span> content performs best with an average of {Math.round(bestAvgEngagement)} engagements per post.
                          </p>
                        ) : (
                          <p className="text-primary-800 dark:text-primary-200">
                            Post more content to get personalized recommendations.
                          </p>
                        )}
                        
                        {followerHistory.length > 1 && (
                          <p className="text-primary-800 dark:text-primary-200">
                            Growth trend: <span className="font-semibold">{
                              followerHistory[followerHistory.length - 1].followers_count > 
                              followerHistory[0].followers_count ? 'Positive' : 'Negative'
                            }</span>
                            
                            {followerGrowth > 0 && (
                              <span> (+{followerGrowthPercentage}% in 30 days)</span>
                            )}
                          </p>
                        )}
                        
                        <p className="text-primary-800 dark:text-primary-200">
                          Engagement rate: <span className="font-semibold">{((totalEngagement / (userData?.followers_count || 1)) * 100).toFixed(1)}%</span>
                          {((totalEngagement / (userData?.followers_count || 1)) * 100) > 3 ? (
                            <span> (Above average 👍)</span>
                          ) : (
                            <span> (Room for improvement 💪)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard; 