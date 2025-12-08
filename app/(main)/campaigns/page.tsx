"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Target, TrendingUp, Filter, Calendar, Users, DollarSign } from 'lucide-react';
import { Card, Badge, PageHeader, LoadingSpinner, Button } from '@/components/ui';
import { getAllCampaigns, Campaign } from '@/src/api/campaigns';

// Mock Campaigns Data
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Scholarship Fund for Underprivileged Students',
    shortDescription: 'Help us provide education opportunities to brilliant students who lack financial resources.',
    description: 'Our university has always been committed to nurturing talent regardless of financial background. This scholarship fund aims to support 50 students from underprivileged backgrounds complete their education.',
    category: 'Scholarship',
    goalAmount: 2500000,
    raisedAmount: 1875000,
    donorsCount: 234,
    status: 'active',
    isFeatured: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'New Computer Lab for Engineering Department',
    shortDescription: 'Upgrade our outdated computer lab with modern equipment for better learning.',
    description: 'The engineering department needs a state-of-the-art computer lab to prepare students for the tech industry.',
    category: 'Infrastructure',
    goalAmount: 5000000,
    raisedAmount: 3250000,
    donorsCount: 156,
    status: 'active',
    isFeatured: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'AI Research Center Development',
    shortDescription: 'Contribute to building a world-class AI research facility.',
    description: 'Help us establish a cutting-edge AI research center to push the boundaries of innovation.',
    category: 'Research',
    goalAmount: 10000000,
    raisedAmount: 4500000,
    donorsCount: 89,
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Sports Complex Renovation',
    shortDescription: 'Renovate our sports facilities to Olympic standards.',
    description: 'Our sports complex needs major upgrades to host national-level tournaments.',
    category: 'Sports',
    goalAmount: 8000000,
    raisedAmount: 6800000,
    donorsCount: 312,
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Community Outreach Program',
    shortDescription: 'Fund our annual community service initiatives.',
    description: 'Support our students in making a difference in nearby villages through education and healthcare.',
    category: 'Community',
    goalAmount: 1000000,
    raisedAmount: 750000,
    donorsCount: 178,
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Library Digital Transformation',
    shortDescription: 'Convert our library into a modern digital learning hub.',
    description: 'Transform the central library with digital resources, e-books, and online databases.',
    category: 'Infrastructure',
    goalAmount: 3000000,
    raisedAmount: 3000000,
    donorsCount: 203,
    status: 'completed',
    isFeatured: false,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const CATEGORIES = ['all', 'Scholarship', 'Infrastructure', 'Research', 'Sports', 'Community'];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCampaigns();
        if (data?.items && data.items.length > 0) {
          setCampaigns(data.items);
        } else {
          setCampaigns(MOCK_CAMPAIGNS);
        }
      } catch (error) {
        console.log('Using mock campaigns');
        setCampaigns(MOCK_CAMPAIGNS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCampaigns = filter === 'all'
    ? campaigns
    : campaigns.filter(c => c.category === filter);

  const featuredCampaigns = campaigns.filter(c => c.isFeatured);
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalDonors = campaigns.reduce((sum, c) => sum + c.donorsCount, 0);

  const getProgress = (raised: number, goal: number) => Math.min((raised / goal) * 100, 100);

  if (loading) return <LoadingSpinner fullScreen text="Loading campaigns..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Donation Campaigns</h1>
          <p className="text-gray-500">Support causes that matter to our alumni community</p>
        </div>
        <Link href="/donations">
          <Button leftIcon={<Heart size={18} />}>My Donations</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <DollarSign className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Total Raised</p>
              <p className="text-2xl font-bold text-[#001145]">₹{(totalRaised / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Users className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Total Donors</p>
              <p className="text-2xl font-bold text-[#001145]">{totalDonors}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Target className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Active Campaigns</p>
              <p className="text-2xl font-bold text-[#001145]">{campaigns.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-[#001145] mb-4 flex items-center gap-2">
            <TrendingUp size={20} />Featured Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCampaigns.slice(0, 2).map((campaign) => (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group bg-[#e4f0ff] border-0">
                  <div className="h-32 bg-gradient-to-br from-[#001145] to-[#001439] -m-6 mb-4 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-white/20 group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge variant="info" className="mb-2">{campaign.category}</Badge>
                  <h3 className="text-xl font-bold text-[#001145] mb-2">{campaign.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.shortDescription}</p>
                  <div className="space-y-2">
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${getProgress(campaign.raisedAmount, campaign.goalAmount)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-[#001145]">₹{(campaign.raisedAmount / 100000).toFixed(1)}L raised</span>
                      <span className="text-gray-500">of ₹{(campaign.goalAmount / 100000).toFixed(1)}L</span>
                    </div>
                    <p className="text-xs text-gray-400">{campaign.donorsCount} donors</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={18} className="text-gray-400 flex-shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-[#001145] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            {cat === 'all' ? 'All Campaigns' : cat}
          </button>
        ))}
      </div>

      {/* All Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow bg-[#e4f0ff] border-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge size="sm">{campaign.category}</Badge>
                {campaign.status === 'completed' && <Badge variant="success" size="sm">Completed</Badge>}
              </div>
              <h3 className="font-bold text-[#001145] mb-2">{campaign.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.shortDescription}</p>
              <div className="space-y-2">
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${getProgress(campaign.raisedAmount, campaign.goalAmount)}%` }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#001145]">₹{(campaign.raisedAmount / 100000).toFixed(1)}L</span>
                  <span className="text-gray-500">{Math.round(getProgress(campaign.raisedAmount, campaign.goalAmount))}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white text-sm text-gray-500">
                <span className="flex items-center gap-1"><Target size={14} />₹{(campaign.goalAmount / 100000).toFixed(1)}L goal</span>
                <span>{campaign.donorsCount} donors</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
