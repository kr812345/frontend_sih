"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, Search, Filter, Briefcase, GraduationCap, Clock, Star, MessageSquare, UserPlus, Check, MapPin, Target, Heart, Award } from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { getAvailableMentors, requestMentorship, type Mentor } from '../../../src/api/mentorship';
import { showSuccess, showError, showLoading, dismissToast } from '../../../src/lib/toast';
import { Toaster } from 'react-hot-toast';

// Mock Mentors Data
const MOCK_MENTORS = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    avatarUrl: null,
    currentRole: 'Engineering Manager',
    currentCompany: 'Google',
    gradYear: '2015',
    major: 'Computer Science',
    location: 'Bangalore',
    expertise: ['System Design', 'Career Growth', 'Leadership'],
    yearsOfExperience: 10,
    menteesTaken: 12,
    rating: 4.9,
    availability: 'Available',
    bio: 'Passionate about helping fresh graduates navigate their tech careers. 10+ years in big tech.',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    avatarUrl: null,
    currentRole: 'Senior Product Manager',
    currentCompany: 'Microsoft',
    gradYear: '2016',
    major: 'Information Technology',
    location: 'Hyderabad',
    expertise: ['Product Management', 'Interview Prep', 'Career Switch'],
    yearsOfExperience: 8,
    menteesTaken: 8,
    rating: 4.8,
    availability: 'Limited',
    bio: 'Transitioned from engineering to PM. Happy to guide others on the same path.',
  },
  {
    id: '3',
    name: 'Amit Patel',
    avatarUrl: null,
    currentRole: 'Founder & CEO',
    currentCompany: 'TechStartup Inc.',
    gradYear: '2012',
    major: 'Electronics',
    location: 'Mumbai',
    expertise: ['Entrepreneurship', 'Fundraising', 'Startups'],
    yearsOfExperience: 12,
    menteesTaken: 25,
    rating: 4.7,
    availability: 'Available',
    bio: 'Founded 2 startups. Raised $5M+ in funding. Love helping aspiring entrepreneurs.',
  },
  {
    id: '4',
    name: 'Neha Gupta',
    avatarUrl: null,
    currentRole: 'Data Science Lead',
    currentCompany: 'Amazon',
    gradYear: '2017',
    major: 'Mathematics',
    location: 'Delhi',
    expertise: ['Machine Learning', 'Data Science', 'AI/ML Careers'],
    yearsOfExperience: 7,
    menteesTaken: 6,
    rating: 4.9,
    availability: 'Available',
    bio: 'PhD in ML from IIT. Working on cutting-edge AI at Amazon. Love teaching ML concepts.',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    avatarUrl: null,
    currentRole: 'Investment Banker',
    currentCompany: 'Goldman Sachs',
    gradYear: '2014',
    major: 'Commerce',
    location: 'Mumbai',
    expertise: ['Finance', 'Investment Banking', 'MBA Prep'],
    yearsOfExperience: 10,
    menteesTaken: 15,
    rating: 4.6,
    availability: 'Limited',
    bio: 'Helping commerce grads break into investment banking and finance.',
  },
  {
    id: '6',
    name: 'Kavitha Reddy',
    avatarUrl: null,
    currentRole: 'UX Design Director',
    currentCompany: 'Adobe',
    gradYear: '2013',
    major: 'Design',
    location: 'Bangalore',
    expertise: ['UX Design', 'Portfolio Building', 'Design Careers'],
    yearsOfExperience: 11,
    menteesTaken: 20,
    rating: 4.8,
    availability: 'Available',
    bio: 'Passion for design and mentoring. Built UX teams at 3 companies.',
  },
];

const EXPERTISE_AREAS = ['All Areas', 'Tech', 'Product', 'Entrepreneurship', 'Data Science', 'Finance', 'Design'];

export default function MentorshipPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('All Areas');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'find' | 'become'>('find');
  const [requestingMentorship, setRequestingMentorship] = useState<string | null>(null);

  // Fetch mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await getAvailableMentors();
        setMentors(data);
      } catch (error) {
        showError('Failed to load mentors. Please try again.');
        console.error('Error fetching mentors:', error);
        // Fallback to mock data if API fails
        setMentors(MOCK_MENTORS as any);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'find') {
      fetchMentors();
    }
  }, [activeTab]);

  // Handle mentorship request
  const handleRequestMentorship = async (mentorId: string) => {
    const toastId = showLoading('Sending mentorship request...');
    setRequestingMentorship(mentorId);
    
    try {
      await requestMentorship({ mentorId });
      dismissToast(toastId);
      showSuccess('Mentorship request sent successfully!');
    } catch (error) {
      dismissToast(toastId);
      showError('Failed to send mentorship request. Please try again.');
      console.error('Error requesting mentorship:', error);
    } finally {
      setRequestingMentorship(null);
    }
  };

  // Handle message button click
  const handleMessage = (mentorId: string) => {
    router.push(`/messages?userId=${mentorId}`);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mentor.profileDetails?.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ?? false) ||
      (mentor.profileDetails?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesExpertise = expertiseFilter === 'All Areas' || 
      (mentor.profileDetails?.skills?.some(s => s.toLowerCase().includes(expertiseFilter.toLowerCase())) ?? false);
    
    return matchesSearch && matchesExpertise;
  });

  const getAvailabilityBadge = (availability: string) => {
    if (availability === 'Available') {
      return <Badge variant="success" size="sm">Available</Badge>;
    }
    return <Badge variant="warning" size="sm">Limited Slots</Badge>;
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Mentorship Hub</h1>
          <p className="text-gray-500">Connect with experienced alumni mentors or share your expertise</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Users className="text-[#001145]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Active Mentors</p>
              <p className="text-2xl font-bold text-[#001145]">{mentors.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Target className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Mentees Helped</p>
              <p className="text-2xl font-bold text-[#001145]">86+</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Award className="text-yellow-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Avg. Rating</p>
              <p className="text-2xl font-bold text-[#001145]">4.8 ⭐</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Heart className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Success Stories</p>
              <p className="text-2xl font-bold text-[#001145]">45+</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('find')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'find' 
              ? 'bg-[#001145] text-white shadow-md' 
              : 'text-gray-600 hover:text-[#001145]'
          }`}
        >
          Find a Mentor
        </button>
        <button
          onClick={() => setActiveTab('become')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'become' 
              ? 'bg-[#001145] text-white shadow-md' 
              : 'text-gray-600 hover:text-[#001145]'
          }`}
        >
          Become a Mentor
        </button>
      </div>

      {activeTab === 'find' ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, expertise, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 bg-white"
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* Expertise Filters */}
          {showFilters && (
            <div className="flex gap-2 flex-wrap">
              {EXPERTISE_AREAS.map(area => (
                <button
                  key={area}
                  onClick={() => setExpertiseFilter(area)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    expertiseFilter === area
                      ? 'bg-[#001145] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredMentors.map((mentor) => (
              <Card key={mentor._id || (mentor as any).id} className="bg-[#e4f0ff] border-0 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white flex-shrink-0">
                    {mentor.avatarUrl ? (
                      <Image src={mentor.avatarUrl} alt={mentor.name} width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white bg-[#001145]">
                        {getInitials(mentor.name)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-[#001145] truncate">{mentor.name}</h3>
                      <Badge variant="success" size="sm">Available</Badge>
                    </div>
                    <p className="text-[#4a5f7c] truncate">{mentor.profileDetails?.designation || 'Alumni'}</p>
                    <p className="text-sm text-[#7088aa]">{mentor.profileDetails?.company || 'Not specified'}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#7088aa]">
                    <Users size={14} />
                    <span>{mentor.email}</span>
                  </div>
                  {mentor.profileDetails?.linkedin && (
                    <div className="flex items-center gap-2 text-sm text-[#7088aa]">
                      <Star size={14} />
                      <a href={mentor.profileDetails.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#001145]">LinkedIn Profile</a>
                    </div>
                  )}
                </div>

                {/* Expertise */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(mentor.profileDetails?.skills || []).map((skill: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 rounded-md text-xs font-medium bg-white text-[#001145]">
                      {skill}
                    </span>
                  ))}
                  {(!mentor.profileDetails?.skills || mentor.profileDetails.skills.length === 0) && (
                    <span className="text-xs text-gray-400">No skills listed</span>
                  )}
                </div>

                {/* Interests */}
                {mentor.profileDetails?.interests && mentor.profileDetails.interests.length > 0 && (
                  <p className="text-sm text-[#4a5f7c] mb-4 line-clamp-2">
                    Interests: {mentor.profileDetails.interests.join(', ')}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRequestMentorship(mentor._id)}
                    disabled={requestingMentorship === mentor._id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white rounded-xl font-medium bg-[#001145] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {requestingMentorship === mentor._id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <UserPlus size={16} />
                    )}
                    Request Mentorship
                  </button>
                  <button 
                    onClick={() => handleMessage(mentor._id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-white text-[#001145] hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No mentors found matching your criteria</p>
            </Card>
          )}
        </>
      ) : (
        /* Become a Mentor Form */
        <Card className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#e4f0ff] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="text-[#001145]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#001145] mb-2">Become a Mentor</h2>
            <p className="text-gray-500">Share your experience and help fellow alumni grow in their careers</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Areas of Expertise</label>
              <input
                type="text"
                placeholder="e.g., System Design, Career Growth, Interview Prep"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Years of Experience</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white">
                <option>3-5 years</option>
                <option>5-8 years</option>
                <option>8-12 years</option>
                <option>12+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">How many mentees can you take?</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white">
                <option>1-2 mentees</option>
                <option>3-5 mentees</option>
                <option>5+ mentees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Availability</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="availability" defaultChecked className="w-4 h-4 text-[#001145]" />
                  <span className="text-gray-600">Weekdays</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="availability" className="w-4 h-4 text-[#001145]" />
                  <span className="text-gray-600">Weekends</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="availability" className="w-4 h-4 text-[#001145]" />
                  <span className="text-gray-600">Both</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Brief Bio (For mentees to know you better)</label>
              <textarea
                rows={4}
                placeholder="Tell us about your journey and what you can offer as a mentor..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 resize-none"
              />
            </div>

            <Button className="w-full py-3">
              <Check size={18} /> Submit Application
            </Button>

            <p className="text-xs text-center text-gray-400">
              We&apos;ll review your application and get back within 3-5 business days.
            </p>
          </form>
        </Card>
      )}
    </div>
  );
}
