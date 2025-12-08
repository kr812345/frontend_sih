"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Target, TrendingUp, Filter, DollarSign, Users } from 'lucide-react';
import { Button, LoadingSpinner } from '@/components/ui';
import { getAllCampaigns, Campaign } from '@/src/api/campaigns';

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1', title: 'Scholarship Fund for Underprivileged Students', shortDescription: 'Help brilliant students complete their education.',
    description: 'Support 50 students from underprivileged backgrounds.', category: 'Scholarship', goalAmount: 2500000, raisedAmount: 1875000,
    donorsCount: 234, status: 'active', isFeatured: true, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2', title: 'New Computer Lab for Engineering', shortDescription: 'Upgrade our computer lab with modern equipment.',
    description: 'State-of-the-art lab for engineering students.', category: 'Infrastructure', goalAmount: 5000000, raisedAmount: 3250000,
    donorsCount: 156, status: 'active', isFeatured: true, createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3', title: 'AI Research Center Development', shortDescription: 'Build a world-class AI research facility.',
    description: 'Cutting-edge AI research center.', category: 'Research', goalAmount: 10000000, raisedAmount: 4500000,
    donorsCount: 89, status: 'active', isFeatured: false, createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4', title: 'Sports Complex Renovation', shortDescription: 'Renovate sports facilities to Olympic standards.',
    description: 'Major upgrades for national tournaments.', category: 'Sports', goalAmount: 8000000, raisedAmount: 6800000,
    donorsCount: 312, status: 'active', isFeatured: false, createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5', title: 'Community Outreach Program', shortDescription: 'Fund annual community service initiatives.',
    description: 'Education and healthcare for nearby villages.', category: 'Community', goalAmount: 1000000, raisedAmount: 750000,
    donorsCount: 178, status: 'active', isFeatured: false, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString()
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
        setCampaigns(data?.items?.length ? data.items : MOCK_CAMPAIGNS);
      } catch {
        setCampaigns(MOCK_CAMPAIGNS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCampaigns = filter === 'all' ? campaigns : campaigns.filter(c => c.category === filter);
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
          <p className="text-gray-500">Support causes that matter</p>
        </div>
        <Link href="/donations"><Button leftIcon={<Heart size={18} />}>My Donations</Button></Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#e4f0ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e4f0ff] flex items-center justify-center">
              <DollarSign size={20} className="text-[#001145]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Raised</p>
              <p className="text-xl font-bold text-[#001145]">₹{(totalRaised / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e4f0ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e4f0ff] flex items-center justify-center">
              <Users size={20} className="text-[#001145]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Donors</p>
              <p className="text-xl font-bold text-[#001145]">{totalDonors}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#e4f0ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e4f0ff] flex items-center justify-center">
              <Target size={20} className="text-[#001145]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-xl font-bold text-[#001145]">{campaigns.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      {featuredCampaigns.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#001145] mb-4 flex items-center gap-2"><TrendingUp size={18} />Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredCampaigns.slice(0, 2).map((c) => (
              <Link key={c.id} href={`/campaigns/${c.id}`}>
                <div className="bg-white rounded-xl p-5 border border-[#e4f0ff] hover:shadow-md transition-shadow">
                  <span className="text-xs font-medium text-[#001145] bg-[#e4f0ff] px-2 py-1 rounded">{c.category}</span>
                  <h3 className="text-lg font-bold text-[#001145] mt-3 mb-2">{c.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{c.shortDescription}</p>
                  <div className="h-2 bg-[#e4f0ff] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#001145] rounded-full" style={{ width: `${getProgress(c.raisedAmount, c.goalAmount)}%` }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-[#001145]">₹{(c.raisedAmount / 100000).toFixed(1)}L</span>
                    <span className="text-gray-500">of ₹{(c.goalAmount / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} className="text-gray-400" />
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === cat ? 'bg-[#001145] text-white' : 'bg-white text-[#001145] border border-[#e4f0ff] hover:bg-[#e4f0ff]'
              }`}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* All Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map((c) => (
          <Link key={c.id} href={`/campaigns/${c.id}`}>
            <div className="bg-white rounded-xl p-5 border border-[#e4f0ff] hover:shadow-md transition-shadow h-full">
              <span className="text-xs font-medium text-[#001145] bg-[#e4f0ff] px-2 py-1 rounded">{c.category}</span>
              <h3 className="font-bold text-[#001145] mt-3 mb-2">{c.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{c.shortDescription}</p>
              <div className="h-2 bg-[#e4f0ff] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#001145] rounded-full" style={{ width: `${getProgress(c.raisedAmount, c.goalAmount)}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-[#001145]">₹{(c.raisedAmount / 100000).toFixed(1)}L</span>
                <span className="text-gray-500">{Math.round(getProgress(c.raisedAmount, c.goalAmount))}%</span>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-[#e4f0ff] text-xs text-gray-500">
                <span>Goal: ₹{(c.goalAmount / 100000).toFixed(1)}L</span>
                <span>{c.donorsCount} donors</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
