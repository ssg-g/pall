import { User } from '@supabase/supabase-js';

// In a real app, this would interact with a backend service
// For the MVP, we'll use localStorage to store scheduled posts

export interface ScheduledPost {
  id: string;
  userId: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REEL';
  mediaUrls: string[];
  scheduledDate: string; // ISO date string
  status: 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  hashtags: string[];
  createdAt: string;
}

const STORAGE_KEY = 'pal_scheduled_posts';

// Helper to get all scheduled posts
const getScheduledPosts = (): ScheduledPost[] => {
  const posts = localStorage.getItem(STORAGE_KEY);
  return posts ? JSON.parse(posts) : [];
};

// Helper to save scheduled posts
const saveScheduledPosts = (posts: ScheduledPost[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

// Create a new scheduled post
export const createScheduledPost = async (
  user: User,
  caption: string,
  mediaType: ScheduledPost['mediaType'],
  mediaUrls: string[],
  scheduledDate: string,
  hashtags: string[] = []
): Promise<ScheduledPost> => {
  const posts = getScheduledPosts();
  
  const newPost: ScheduledPost = {
    id: `post_${Date.now()}`,
    userId: user.id,
    caption,
    mediaType,
    mediaUrls,
    scheduledDate,
    status: 'SCHEDULED',
    hashtags,
    createdAt: new Date().toISOString()
  };
  
  posts.push(newPost);
  saveScheduledPosts(posts);
  
  return newPost;
};

// Get scheduled posts for a user
export const getUserScheduledPosts = async (userId: string): Promise<ScheduledPost[]> => {
  const posts = getScheduledPosts();
  return posts.filter(post => post.userId === userId);
};

// Update a scheduled post
export const updateScheduledPost = async (
  postId: string,
  updates: Partial<Omit<ScheduledPost, 'id' | 'userId' | 'createdAt'>>
): Promise<ScheduledPost | null> => {
  const posts = getScheduledPosts();
  const postIndex = posts.findIndex(post => post.id === postId);
  
  if (postIndex === -1) {
    return null;
  }
  
  posts[postIndex] = { ...posts[postIndex], ...updates };
  saveScheduledPosts(posts);
  
  return posts[postIndex];
};

// Delete a scheduled post
export const deleteScheduledPost = async (postId: string): Promise<boolean> => {
  const posts = getScheduledPosts();
  const filteredPosts = posts.filter(post => post.id !== postId);
  
  if (filteredPosts.length === posts.length) {
    return false; // Post wasn't found
  }
  
  saveScheduledPosts(filteredPosts);
  return true;
};

// Get posts for a specific date range
export const getPostsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<ScheduledPost[]> => {
  const posts = await getUserScheduledPosts(userId);
  
  return posts.filter(post => {
    const postDate = new Date(post.scheduledDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return postDate >= start && postDate <= end;
  });
};

// Check for posts that need to be published
export const checkScheduledPosts = async (userId: string): Promise<ScheduledPost[]> => {
  const posts = await getUserScheduledPosts(userId);
  const now = new Date();
  
  const postsToPublish = posts.filter(post => {
    return post.status === 'SCHEDULED' && new Date(post.scheduledDate) <= now;
  });
  
  // In a real app, this would trigger a real Instagram post
  // For MVP, we'll just mark them as published
  if (postsToPublish.length > 0) {
    postsToPublish.forEach(post => {
      updateScheduledPost(post.id, { status: 'PUBLISHED' });
    });
  }
  
  return postsToPublish;
};

export default {
  createScheduledPost,
  getUserScheduledPosts,
  updateScheduledPost,
  deleteScheduledPost,
  getPostsByDateRange,
  checkScheduledPosts
}; 