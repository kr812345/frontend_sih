"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Search, MessageSquare, Image as ImageIcon, Bell, Plus, Heart, MessageCircle, Share2, MoreHorizontal, Calendar, Send } from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { getAllPosts, createPost, likePost, unlikePost, type Post } from '../../../src/api/posts';
import { walletApi } from '../../../src/api/wallet';
import { showSuccess, showError, showLoading, dismissToast } from '../../../src/lib/toast';
import { Toaster } from 'react-hot-toast';

// Mock data for batch communities
const MOCK_BATCHES = [
  { id: '2024', year: '2024', members: 245, newPosts: 12, isJoined: true },
  { id: '2023', year: '2023', members: 312, newPosts: 8, isJoined: false },
  { id: '2022', year: '2022', members: 289, newPosts: 5, isJoined: false },
  { id: '2021', year: '2021', members: 276, newPosts: 3, isJoined: false },
  { id: '2020', year: '2020', members: 298, newPosts: 7, isJoined: false },
  { id: '2019', year: '2019', members: 267, newPosts: 4, isJoined: false },
  { id: '2018', year: '2018', members: 234, newPosts: 2, isJoined: false },
  { id: '2017', year: '2017', members: 198, newPosts: 1, isJoined: false },
];

const MOCK_POSTS = [
  {
    id: '1',
    author: { name: 'Rahul Verma', avatarUrl: null, gradYear: '2024' },
    content: 'Hey everyone! 👋 Anyone from our batch working in Bangalore? Planning a meetup next month. Drop a comment if interested!',
    likes: 24,
    comments: 15,
    timestamp: '2 hours ago',
    isLiked: false,
  },
  {
    id: '2',
    author: { name: 'Sneha Kapoor', avatarUrl: null, gradYear: '2024' },
    content: 'Just got promoted to Senior Developer at Flipkart! 🎉 Thank you to all batchmates who helped me prep. This community is amazing!',
    likes: 89,
    comments: 32,
    timestamp: '5 hours ago',
    isLiked: true,
  },
  {
    id: '3',
    author: { name: 'Arjun Mehta', avatarUrl: null, gradYear: '2024' },
    content: 'Throwback to our farewell party! 📸 Found some amazing photos. Uploading to the memories section soon. Those were the days!',
    likes: 56,
    comments: 21,
    timestamp: '1 day ago',
    isLiked: false,
  },
];

const MOCK_MEMORIES = [
  { id: '1', imageUrl: '/placeholder1.jpg', title: 'Farewell 2024', likes: 45 },
  { id: '2', imageUrl: '/placeholder2.jpg', title: 'Tech Fest', likes: 67 },
  { id: '3', imageUrl: '/placeholder3.jpg', title: 'Sports Day', likes: 34 },
  { id: '4', imageUrl: '/placeholder4.jpg', title: 'Cultural Night', likes: 89 },
];

export default function CommunitiesPage() {
  const [batches] = useState(MOCK_BATCHES);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('2024');
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'memories'>('feed');
  const [newPost, setNewPost] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [likingPost, setLikingPost] = useState<string | null>(null);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        if (data && data.items) {
          setPosts(data.items);
        } else if (Array.isArray(data)) {
           // @ts-ignore
          setPosts(data);
        } else {
          setPosts(MOCK_POSTS as any);
        }
      } catch (error) {
        showError('Failed to load posts. Please try again.');
        console.error('Error fetching posts:', error);
        // Fallback to mock data if API fails
        setPosts(MOCK_POSTS as any);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'feed') {
      fetchPosts();
    }
  }, [activeTab]);

  const myBatch = batches.find(b => b.year === selectedBatch);
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Handle create post
  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      showError('Please enter some content for your post.');
      return;
    }

    const toastId = showLoading('Creating post...');
    setCreatingPost(true);

    try {
      const createdPost = await createPost(newPost);
      setPosts([createdPost, ...posts]);
      
      // Reward user for creating a post
      if (createdPost.author?._id) {
        try {
          await walletApi.rewardCoin(createdPost.author._id, 10, 'Created a community post');
          showSuccess('Post created! You earned 10 coins 🎉');
        } catch (rewardError) {
          console.error('Error rewarding coins:', rewardError);
          // Don't fail the whole action if reward fails, just show the post success
          showSuccess('Post created successfully!');
        }
      } else {
        showSuccess('Post created successfully!');
      }

      setNewPost('');
      dismissToast(toastId);
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    } finally {
      setCreatingPost(false);
    }
  };

  // Handle like/unlike post
  const handleLikePost = async (postId: string, isLiked: boolean) => {
    setLikingPost(postId);

    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      // Update posts state
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !isLiked
          };
        }
        return post;
      }));
    } catch (error) {
      showError('Failed to update like. Please try again.');
      console.error('Error liking/unliking post:', error);
    } finally {
      setLikingPost(null);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Batch Communities</h1>
          <p className="text-gray-500">Connect with your classmates and relive memories</p>
        </div>
        <Button leftIcon={<Plus size={18} />}>Create Post</Button>
      </div>

      {/* My Batch Highlight */}
      {myBatch && (
        <Card className="bg-gradient-to-r from-[#001145] to-[#001339] text-white border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Users size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Class of {myBatch.year}</h2>
                <p className="text-white/70">{myBatch.members} members • {myBatch.newPosts} new posts today</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                <Bell size={20} />
              </button>
              <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Batch List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-[#e4f0ff] border-0">
            <h3 className="font-bold text-[#001145] mb-4">All Batches</h3>
            <div className="space-y-2">
              {batches.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch.year)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                    selectedBatch === batch.year
                      ? 'bg-[#001145] text-white'
                      : 'bg-white text-[#001145] hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Class of {batch.year}</span>
                  <span className={`text-xs ${selectedBatch === batch.year ? 'text-white/70' : 'text-gray-500'}`}>
                    {batch.members}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab Switcher */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
            {(['feed', 'members', 'memories'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[#001145] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#001145]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'feed' && (
            <>
              {/* Create Post */}
              <Card className="bg-white">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#001145] flex items-center justify-center text-white font-bold flex-shrink-0">
                    RV
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share something with your batch..."
                      className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#001145]/20"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                          <ImageIcon size={16} /> Photo
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                          <Calendar size={16} /> Event
                        </button>
                      </div>
                      <Button 
                        size="sm" 
                        leftIcon={<Send size={14} />}
                        onClick={handleCreatePost}
                        disabled={creatingPost || !newPost.trim()}
                      >
                        {creatingPost ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Posts Feed */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post._id} className="bg-white hover:shadow-md transition-shadow">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#001145] flex items-center justify-center text-white font-bold">
                          {getInitials(post.author.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#001145]">{post.author.name}</h4>
                          <p className="text-sm text-gray-500">{post.author.title || 'Alumni'} • {new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <MoreHorizontal size={18} className="text-gray-400" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-[#1e293b] mb-4 whitespace-pre-wrap">{post.content}</p>

                    {/* Post Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleLikePost(post._id, post.isLiked || false)}
                        disabled={likingPost === post._id}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                          post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} /> {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#001145] transition-colors">
                        <MessageCircle size={18} /> {post.comments}
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#001145] transition-colors">
                        <Share2 size={18} /> Share
                      </button>
                    </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'members' && (
            <Card className="bg-[#e4f0ff] border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#001145]">Batch Members</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Rahul Verma', 'Sneha Kapoor', 'Arjun Mehta', 'Priya Singh', 'Amit Sharma', 'Kavya Reddy'].map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#001145] flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#001145] truncate">{name}</p>
                      <p className="text-xs text-gray-500">Software Engineer</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <MessageSquare size={16} className="text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-4">
              <Card className="bg-[#e4f0ff] border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-[#001145]">Batch Memories</h3>
                  <Button size="sm" leftIcon={<Plus size={16} />}>Upload Photo</Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {MOCK_MEMORIES.map((memory) => (
                    <div key={memory.id} className="group relative aspect-square bg-gradient-to-br from-[#001145] to-[#001339] rounded-xl overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon size={32} className="text-white/30" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-white font-medium text-sm">{memory.title}</p>
                        <p className="text-white/70 text-xs flex items-center gap-1">
                          <Heart size={12} /> {memory.likes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white">
                <h3 className="font-bold text-lg text-[#001145] mb-4">📅 This Week in History</h3>
                <p className="text-gray-500 text-sm mb-4">See what happened on this day in previous years</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {['2023', '2022', '2021', '2020'].map((year) => (
                    <div key={year} className="flex-shrink-0 w-32 aspect-square bg-[#e4f0ff] rounded-xl flex flex-col items-center justify-center">
                      <ImageIcon size={24} className="text-[#001145]/30 mb-2" />
                      <p className="text-xs text-[#7088aa]">{year}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
