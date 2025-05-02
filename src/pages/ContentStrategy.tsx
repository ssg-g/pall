import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { suggestContentIdeas, suggestHashtags } from '../services/instagram';
import { ContentIdea } from '../types';
import { LightBulbIcon, HashtagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ContentStrategy = () => {
  const { instagramConnected } = useAuth();
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hashtagInput, setHashtagInput] = useState('');
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (instagramConnected) {
        try {
          const ideas = await suggestContentIdeas();
          const hashtags = await suggestHashtags();
          
          setContentIdeas(ideas);
          setSuggestedHashtags(hashtags);
        } catch (error) {
          console.error('Error fetching content suggestions:', error);
        }
      }
      setLoading(false);
    };
    
    fetchData();
  }, [instagramConnected]);
  
  const handleGenerateHashtags = async () => {
    if (!hashtagInput.trim()) {
      return;
    }
    
    setGenerating(true);
    try {
      const hashtags = await suggestHashtags(hashtagInput);
      setSuggestedHashtags(hashtags);
    } catch (error) {
      console.error('Error generating hashtags:', error);
    } finally {
      setGenerating(false);
    }
  };
  
  const refreshContentIdeas = async () => {
    setLoading(true);
    try {
      const ideas = await suggestContentIdeas();
      setContentIdeas(ideas);
    } catch (error) {
      console.error('Error refreshing content ideas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Content Strategy</h1>
          <button
            onClick={refreshContentIdeas}
            disabled={loading || !instagramConnected}
            className="btn btn-outline flex items-center text-sm"
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Refresh Ideas
          </button>
        </div>
        
        {!instagramConnected ? (
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Instagram Not Connected</h3>
            <p className="mt-2 text-yellow-700 dark:text-yellow-300">
              Please connect your Instagram account in the settings to receive AI content suggestions.
            </p>
          </div>
        ) : loading ? (
          <div className="animate-pulse text-center text-gray-500 dark:text-gray-400">
            Generating content ideas...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* AI Content Suggestions */}
            <div className="space-y-4">
              <div className="flex items-center">
                <LightBulbIcon className="mr-2 h-5 w-5 text-primary-500" />
                <h2 className="text-lg font-medium">AI Content Suggestions</h2>
              </div>
              
              <div className="space-y-4">
                {contentIdeas.map((idea, index) => (
                  <div key={index} className="card hover:shadow-lg">
                    <div className="flex justify-between">
                      <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                        {idea.type}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {idea.performance_prediction} Potential
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium">{idea.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{idea.description}</p>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                      Engagement estimate: {idea.engagement_estimate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hashtag Suggestions */}
            <div className="space-y-4">
              <div className="flex items-center">
                <HashtagIcon className="mr-2 h-5 w-5 text-primary-500" />
                <h2 className="text-lg font-medium">Hashtag Suggestions</h2>
              </div>
              
              <div className="card">
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Enter a caption or topic to get relevant hashtag suggestions for your post.
                </p>
                
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    placeholder="Enter your caption or topic..."
                    className="input"
                  />
                  <button
                    onClick={handleGenerateHashtags}
                    disabled={generating || !hashtagInput.trim()}
                    className="btn btn-primary whitespace-nowrap sm:w-auto"
                  >
                    {generating ? 'Generating...' : 'Generate Hashtags'}
                  </button>
                </div>
                
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium">Suggested Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedHashtags.map((hashtag, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => {
                          navigator.clipboard.writeText(hashtag);
                          // You could add a toast notification here in a real app
                        }}
                        title="Click to copy"
                      >
                        {hashtag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content Type Recommendations */}
              <div className="card">
                <h3 className="mb-4 text-lg font-medium">Content Type Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reels</span>
                    <div className="w-2/3 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Carousels</span>
                    <div className="w-2/3 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Single Images</span>
                    <div className="w-2/3 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: '50%' }}></div>
                    </div>
                    <span className="text-sm font-medium">50%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Videos</span>
                    <div className="w-2/3 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Based on your account's performance, we recommend focusing on Reels and Carousels for maximum engagement.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContentStrategy; 