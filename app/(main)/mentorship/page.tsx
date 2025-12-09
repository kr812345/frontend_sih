"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Filter, MessageSquare, UserPlus, Check } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';
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

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await getAvailableMentors();
        setMentors(data);
      } catch (error) {
        showError('Failed to load mentors. Please try again.');
        console.error('Error fetching mentors:', error);
        setMentors(MOCK_MENTORS as any);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'find') {
      fetchMentors();
    }
  }, [activeTab]);

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

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentorship Hub</h1>
          <p className="text-gray-500 mt-1">Connect with experienced alumni mentors or share your expertise</p>
        </div>
      </div>

      {/* Stats Cards - Clean White */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Active Mentors</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mentors.length || 6}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Mentees Helped</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">86+</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Avg. Rating</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">4.8</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Success Stories</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">45+</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('find')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'find'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Find a Mentor
        </button>
        <button
          onClick={() => setActiveTab('become')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'become'
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Become a Mentor
        </button>
      </div>

      {activeTab === 'find' ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, expertise, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-white text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${showFilters
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Filter size={16} /> Filters
            </button>
          </div>

          {/* Expertise Filters */}
          {showFilters && (
            <div className="flex gap-2 flex-wrap">
              {EXPERTISE_AREAS.map(area => (
                <button
                  key={area}
                  onClick={() => setExpertiseFilter(area)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${expertiseFilter === area
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredMentors.map((mentor) => (
              <div key={mentor._id || (mentor as any).id} className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {mentor.avatarUrl ? (
                      <Image src={mentor.avatarUrl} alt={mentor.name} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-gray-900">
                        {getInitials(mentor.name)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{mentor.name}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Available
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{mentor.profileDetails?.designation || 'Alumni'}</p>
                    <p className="text-xs text-gray-400">{mentor.profileDetails?.company || 'Not specified'}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 truncate">{mentor.email}</p>
                  {mentor.profileDetails?.linkedin && (
                    <a href={mentor.profileDetails.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">LinkedIn Profile</a>
                  )}
                </div>

                {/* Expertise */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(mentor.profileDetails?.skills || []).slice(0, 3).map((skill: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                      {skill}
                    </span>
                  ))}
                  {(!mentor.profileDetails?.skills || mentor.profileDetails.skills.length === 0) && (
                    <span className="text-xs text-gray-400">No skills listed</span>
                  )}
                </div>

                {/* Interests */}
                {mentor.profileDetails?.interests && mentor.profileDetails.interests.length > 0 && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                    Interests: {mentor.profileDetails.interests.slice(0, 3).join(', ')}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleRequestMentorship(mentor._id)}
                    disabled={requestingMentorship === mentor._id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white rounded-xl text-sm font-medium bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {requestingMentorship === mentor._id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <UserPlus size={14} />
                    )}
                    Request
                  </button>
                  <button
                    onClick={() => handleMessage(mentor._id)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMentors.length === 0 && !loading && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500">No mentors found matching your criteria</p>
            </div>
          )}
        </>
      ) : (
        /* Become a Mentor Form */
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Mentor</h2>
            <p className="text-gray-500 text-sm">Share your experience and help fellow alumni grow in their careers</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise</label>
              <input
                type="text"
                placeholder="e.g., System Design, Career Growth, Interview Prep"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-white text-sm">
                <option>3-5 years</option>
                <option>5-8 years</option>
                <option>8-12 years</option>
                <option>12+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How many mentees can you take?</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-white text-sm">
                <option>1-2 mentees</option>
                <option>3-5 mentees</option>
                <option>5+ mentees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="availability" defaultChecked className="w-4 h-4 text-gray-900" />
                  <span className="text-sm text-gray-600">Weekdays</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="availability" className="w-4 h-4 text-gray-900" />
                  <span className="text-sm text-gray-600">Weekends</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="availability" className="w-4 h-4 text-gray-900" />
                  <span className="text-sm text-gray-600">Both</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brief Bio (For mentees to know you better)</label>
              <textarea
                rows={4}
                placeholder="Tell us about your journey and what you can offer as a mentor..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 resize-none text-sm"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Check size={18} /> Submit Application
            </button>

            <p className="text-xs text-center text-gray-400">
              We'll review your application and get back within 3-5 business days.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
