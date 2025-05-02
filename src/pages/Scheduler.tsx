import { useState, useEffect } from 'react';
import { format, addDays, isToday, isTomorrow, parseISO } from 'date-fns';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { getUserScheduledPosts, createScheduledPost, deleteScheduledPost } from '../services/scheduler';
import { getOptimalPostingTimes } from '../services/instagram';
import { OptimalPostingTime } from '../types';
import { CalendarIcon, PlusIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ScheduledPost } from '../services/scheduler';

const Scheduler = () => {
  const { currentUser, instagramConnected } = useAuth();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalPostingTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form state for creating a new post
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostType, setNewPostType] = useState<ScheduledPost['mediaType']>('IMAGE');
  const [newPostDate, setNewPostDate] = useState('');
  const [newPostTime, setNewPostTime] = useState('');
  const [newPostImage, setNewPostImage] = useState('https://via.placeholder.com/640x640');
  
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && instagramConnected) {
        try {
          const [posts, times] = await Promise.all([
            getUserScheduledPosts(currentUser.uid),
            getOptimalPostingTimes(),
          ]);
          
          setScheduledPosts(posts);
          setOptimalTimes(times);
        } catch (error) {
          console.error('Error fetching scheduler data:', error);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [currentUser, instagramConnected]);
  
  const handleCreatePost = async () => {
    if (!currentUser || !newPostCaption || !newPostDate || !newPostTime) {
      return;
    }
    
    try {
      const scheduledDateTime = `${newPostDate}T${newPostTime}:00`;
      
      const newPost = await createScheduledPost(
        currentUser,
        newPostCaption,
        newPostType,
        [newPostImage], // For simplicity in MVP we're just using a placeholder image
        scheduledDateTime,
        []
      );
      
      setScheduledPosts([...scheduledPosts, newPost]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteScheduledPost(postId);
      setScheduledPosts(scheduledPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  const resetForm = () => {
    setNewPostCaption('');
    setNewPostType('IMAGE');
    setNewPostDate('');
    setNewPostTime('');
  };
  
  const formatScheduledDate = (dateString: string) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };
  
  // Generate next 7 days for the date picker
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: isToday(date) ? 'Today' : 
             isTomorrow(date) ? 'Tomorrow' : 
             format(date, 'EEE, MMM d')
    };
  });
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Post Scheduler</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!instagramConnected}
            className="btn btn-primary flex items-center text-sm"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Schedule New Post
          </button>
        </div>
        
        {!instagramConnected ? (
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Instagram Not Connected</h3>
            <p className="mt-2 text-yellow-700 dark:text-yellow-300">
              Please connect your Instagram account in the settings to schedule posts.
            </p>
          </div>
        ) : loading ? (
          <div className="animate-pulse text-center text-gray-500 dark:text-gray-400">
            Loading your scheduled posts...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="card">
                <h2 className="mb-4 flex items-center text-lg font-medium">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary-500" />
                  Upcoming Posts
                </h2>
                
                {scheduledPosts.length === 0 ? (
                  <div className="rounded-md bg-gray-50 p-6 text-center dark:bg-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">No posts scheduled yet</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                    >
                      Schedule your first post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scheduledPosts
                      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                      .map((post) => (
                        <div key={post.id} className="flex rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <div className="mr-4 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                            {post.mediaUrls.length > 0 && (
                              <img
                                src={post.mediaUrls[0]}
                                alt="Post preview"
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                  {post.mediaType}
                                </span>
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                  {post.status}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="mt-1 line-clamp-1 text-sm">{post.caption}</p>
                            <p className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <ClockIcon className="mr-1 h-3 w-3" />
                              {formatScheduledDate(post.scheduledDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="card">
                <h2 className="mb-4 flex items-center text-lg font-medium">
                  <ClockIcon className="mr-2 h-5 w-5 text-primary-500" />
                  Optimal Posting Times
                </h2>
                
                {optimalTimes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    Connect your Instagram account to view optimal posting times
                  </p>
                ) : (
                  <div className="space-y-3">
                    {optimalTimes.map((time, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between rounded-md p-2 ${
                          time.recommendation === 'Highly Recommended'
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{time.day} at {time.hour}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Engagement rate: {time.engagement_rate}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            time.recommendation === 'Highly Recommended'
                              ? 'text-green-700 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-300'
                          }`}
                        >
                          {time.recommendation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-medium">Schedule New Post</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="post-type" className="label">Post Type</label>
                <select
                  id="post-type"
                  value={newPostType}
                  onChange={(e) => setNewPostType(e.target.value as ScheduledPost['mediaType'])}
                  className="input"
                >
                  <option value="IMAGE">Image</option>
                  <option value="CAROUSEL_ALBUM">Carousel</option>
                  <option value="VIDEO">Video</option>
                  <option value="REEL">Reel</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="post-caption" className="label">Caption</label>
                <textarea
                  id="post-caption"
                  value={newPostCaption}
                  onChange={(e) => setNewPostCaption(e.target.value)}
                  className="input min-h-[100px]"
                  placeholder="Write your caption here..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="post-date" className="label">Date</label>
                  <select
                    id="post-date"
                    value={newPostDate}
                    onChange={(e) => setNewPostDate(e.target.value)}
                    className="input"
                  >
                    <option value="">Select date</option>
                    {nextSevenDays.map((day) => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="post-time" className="label">Time</label>
                  <input
                    id="post-time"
                    type="time"
                    value={newPostTime}
                    onChange={(e) => setNewPostTime(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <p className="label mb-2">Media Preview</p>
                <div className="flex h-40 w-full items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700">
                  <img
                    src={newPostImage}
                    alt="Post preview"
                    className="h-full max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  (In a real app, you would upload your media here)
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPostCaption || !newPostDate || !newPostTime}
                className="btn btn-primary"
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Scheduler; 