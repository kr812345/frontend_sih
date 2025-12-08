"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, ImageIcon, Smile, Star, TrendingUp } from 'lucide-react';
import { getAllEvents } from '@/src/api/events';

// Helper to format date for event cards
const formatEventDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  return { month, day };
};

interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
    title?: string;
  };
  content: string;
  images?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

interface EventItem {
  _id: string;
  title?: string;
  name?: string;
  date?: string;
  from?: { date: string; time: string };
  description: string;
}

// --- MOCK DATA ---

const mockPosts: Post[] = [
  {
    _id: '1',
    author: {
      _id: 'u1',
      name: 'Priya Sharma',
      title: 'Product Manager at Microsoft',
      avatar: '/profile.jpeg' // Using your placeholder
    },
    content: 'Just wrapped up an amazing workshop on System Design with the final year students. The curiosity and energy on campus is unmatched! Always great to give back. 🚀 #Alumni #GivingBack #SystemDesign',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 124,
    comments: 18,
    isLiked: true
  },
  {
    _id: '2',
    author: {
      _id: 'u2',
      name: 'Rahul Verma',
      title: 'Founder at TechFlow',
      avatar: '/profile.jpeg'
    },
    content: 'We are hiring! Looking for 2 frontend developers (React/Next.js) and 1 UI/UX designer. If you are from the 2023-2024 batch, DM me your portfolios. lets build something cool together.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 89,
    comments: 45,
    isLiked: false
  },
  {
    _id: '3',
    author: {
      _id: 'u3',
      name: 'Aditya Kumar',
      title: 'Software Engineer II at Uber',
      avatar: '/profile.jpeg'
    },
    content: 'Can anyone recommend good resources for advanced Kubernetes patterns? Working on a scaling problem and would love some community insights.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    likes: 32,
    comments: 12,
    isLiked: false
  }
];

const karmaHistory = [
  { id: 1, reason: 'Helped a junior with React', points: 50, date: '2 hours ago' },
  { id: 2, reason: 'Posted a job opportunity', points: 30, date: '1 day ago' },
  { id: 3, reason: 'Attended Alumni Meetup', points: 100, date: '3 days ago' },
];

export default function HomePage() {
  // Initialize with mock posts
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false); // Set to false to show mock data immediately
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Commenting out real post fetching to keep mock data visible for design
        // const postsRes = await getAllPosts({ limit: 10 });
        // if (postsRes.items) setPosts(...)

        // Keep fetching events real-time if needed, or we can mock this too
        const eventsRes = await getAllEvents({ limit: 5 });
        if (eventsRes) {
          setEvents(eventsRes.slice(0, 5));
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLike = (postId: string) => {
    // Optimistic UI update for mock data
    setPosts(posts.map(p =>
      p._id === postId
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || posting) return;
    setPosting(true);

    // Simulate API call delay
    setTimeout(() => {
      const newMockPost: Post = {
        _id: Math.random().toString(),
        author: {
          _id: 'me',
          name: 'You', // In real app, get from auth context
          avatar: '/profile.jpeg',
          title: 'Alumni'
        },
        content: newPost,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isLiked: false,
      };

      setPosts([newMockPost, ...posts]);
      setNewPost('');
      setPosting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* LAYOUT UPDATES:
        1. w-full: Forces full width
        2. px-4: Minimal horizontal padding (reduced from larger paddings)
      */}
      <div className="w-full px-4 py-6">

        {/* GRID UPDATES:
           1. gap-10: Increased gap between the main feed and the sidebar
        */}
        {/* GRID UPDATES:
           1. gap-6: Reduced gap between the main feed and the sidebar
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ---------------- LEFT COLUMN: POSTS (Approx 58% width = 7 cols) ---------------- */}
          <div className="lg:col-span-7 space-y-6">

            {/* Create Post Widget */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <Image src="/profile.jpeg" alt="You" width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                    className="w-full px-4 py-3 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#001145]/20 border border-gray-100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#001145] hover:bg-gray-100 rounded-lg transition-colors" title="Add image">
                    <ImageIcon size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#001145] hover:bg-gray-100 rounded-lg transition-colors" title="Add emoji">
                    <Smile size={20} />
                  </button>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim() || posting}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <Send size={16} />
                  Post
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-[#001145] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-500 mt-3">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                <p className="text-gray-500">No posts yet. Be the first to post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  {/* Author */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <Image src={post.author.avatar || '/profile.jpeg'} alt={post.author.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ color: 'var(--primary-color)' }}>{post.author.name}</h4>
                        <p className="text-sm" style={{ color: 'var(--tertiary)' }}>{post.author.title}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-[#001145] hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-2 gap-1">
                        {post.images.slice(0, 4).map((img, idx) => (
                          <div key={idx} className="aspect-square relative">
                            <Image src={img} alt="" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-medium transition-colors ${post.isLiked
                        ? 'text-red-500 bg-red-50'
                        : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                      Like <span className="ml-1 text-xs text-gray-400">({post.likes})</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-gray-500 hover:bg-gray-50 font-medium transition-colors">
                      <MessageCircle size={18} />
                      Comment <span className="ml-1 text-xs text-gray-400">({post.comments})</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-gray-500 hover:bg-gray-50 font-medium transition-colors">
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ---------------- RIGHT COLUMN: SIDEBAR (Approx 42% width = 5 cols) ---------------- */}
          <div className="lg:col-span-5 space-y-6">

            {/* Karma Points Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f6faff] rounded-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--primary-color)' }}>Karma Points</h3>
                  <div className="p-2 bg-[#e4f0ff] rounded-full text-[#001339]">
                    <Star size={20} fill="currentColor" />
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">1,250</span>
                  <span className="text-sm text-gray-500 ml-2">Total Points</span>
                </div>

                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Recent Activity</h4>

                <div className="space-y-4">
                  {karmaHistory.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">{item.reason}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        +{item.points}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-600 flex items-center justify-center gap-2">
                  <TrendingUp size={16} />
                  View Leaderboard
                </button>
              </div>
            </div>

            {/* Upcoming Events - REDESIGNED */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--primary-color)' }}>Upcoming Events</h3>
                <Link href="/events" className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent)' }}>View All</Link>
              </div>

              <div className="space-y-4">
                {events.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-gray-500 text-sm">No upcoming events right now.</p>
                    <p className="text-xs text-gray-400 mt-1">Check back later!</p>
                  </div>
                ) : (
                  events.slice(0, 3).map((event) => {
                    const eventDate = event.date || event.from?.date || new Date().toISOString();
                    const { month, day } = formatEventDate(eventDate);
                    const eventTitle = event.title || event.name || 'Event';
                    return (
                      <Link
                        key={event._id}
                        href={`/events/${event._id}`}
                        className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all"
                      >
                        {/* Date Badge */}
                        <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--accent)' }}>{month}</span>
                          <span className="text-xl font-extrabold" style={{ color: 'var(--primary-color)' }}>{day}</span>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#001339] group-hover:text-[#001145] transition-colors line-clamp-2 leading-tight mb-1">
                            {eventTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>8:00 AM - 7:00 PM</span>
                            {/* Add location if available, else placeholder */}
                            <span>• Online</span>
                          </div>
                        </div>

                        {/* Action Icon */}
                        <div className="hidden sm:block text-gray-300 group-hover:text-[#001145] transition-colors">
                          <TrendingUp size={18} className="transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md active:scale-[0.98]" style={{ backgroundColor: 'var(--primary-color)' }}>
                Explore All Events
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}