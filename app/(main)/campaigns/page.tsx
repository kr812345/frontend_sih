"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Target, TrendingUp, Filter, DollarSign, Users } from 'lucide-react';
import { Button, LoadingSpinner } from '@/components/ui';
import { getAllCampaigns, Campaign } from '@/src/api/campaigns';

const CATEGORIES = ['all', 'Scholarship', 'Infrastructure', 'Research', 'Sports', 'Community'];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCampaigns();
        setCampaigns(data?.items || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
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
