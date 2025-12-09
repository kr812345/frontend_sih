"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Calendar, DollarSign, ArrowRight, Download, Search, Filter } from 'lucide-react';
import { Card, Badge, Button, LoadingSpinner } from '@/components/ui';
import { getMyDonations, Donation } from '@/src/api/campaigns';

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const data = await getMyDonations();
        setDonations(data || []);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const campaignsSupported = new Set(donations.map(d => d.campaign?.id)).size;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredDonations = donations.filter(d =>
    (d.campaign?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">My Donations</h1>
          <p className="text-gray-500">Track your contributions and impact</p>
        </div>
        <Link href="/campaigns">
          <Button leftIcon={<Heart size={18} />}>Donate Now</Button>
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
              <p className="text-sm text-[#7088aa]">Total Donated</p>
              <p className="text-2xl font-bold text-[#001145]">₹{(totalDonated / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Heart className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Campaigns Supported</p>
              <p className="text-2xl font-bold text-[#001145]">{campaignsSupported}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Calendar className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Total Donations</p>
              <p className="text-2xl font-bold text-[#001145]">{donations.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by campaign or transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
        />
      </div>

      {/* Donations List */}
      <Card className="bg-[#e4f0ff] border-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-[#001145]">Donation History</h2>
          <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
            Export
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No donations found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="p-4 bg-white rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/campaigns/${donation.campaign?.id}`}>
                      <h3 className="font-bold text-[#001145] hover:underline line-clamp-1">
                        {donation.campaign?.title || 'Unknown Campaign'}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm text-[#7088aa]">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(donation.createdAt)}
                      </span>
                      <span className="font-mono text-xs">ID: {donation.id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                    <Badge variant="success" size="sm" className="mt-1">Completed</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Impact Section */}
      <Card className="bg-[#e4f0ff] border-0">
        <h2 className="font-bold text-lg text-[#001145] mb-4">Your Impact</h2>
        <p className="text-[#4a5f7c] mb-4">
          Your generous contributions have helped {campaignsSupported} different initiatives across education,
          infrastructure, research, sports, and community development. Thank you for making a difference!
        </p>
        <Link href="/campaigns">
          <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
            Explore More Campaigns
          </Button>
        </Link>
      </Card>
    </div>
  );
}
