"use client";

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { walletApi, Transaction } from '@/src/api/wallet';
import { LoadingSpinner } from '@/components/ui';
import Link from 'next/link';

interface KarmaPointsCardProps {
  userId: string;
}

export default function KarmaPointsCard({ userId }: KarmaPointsCardProps) {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKarmaData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await walletApi.getTransactions(userId);
        setBalance(data.balance);
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Error fetching karma data:', err);
        setError('Failed to load karma data');
        setBalance(0);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchKarmaData();
    }
  }, [userId]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return then.toLocaleDateString();
  };

  const getActivityIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('post') || desc.includes('community')) return '📝';
    if (desc.includes('mentor') || desc.includes('mentorship')) return '🎓';
    if (desc.includes('profile') || desc.includes('social')) return '👤';
    if (desc.includes('event') || desc.includes('attend')) return '🎉';
    if (desc.includes('job') || desc.includes('opportunity')) return '💼';
    if (desc.includes('help') || desc.includes('junior')) return '🤝';
    return '⭐';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e4f0ff] shadow-sm">
        <LoadingSpinner text="Loading karma..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e4f0ff] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#001145] to-[#002266] p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider opacity-90">Karma Points</h3>
          <Star size={18} fill="white" className="opacity-80" />
        </div>
        
        <div className="relative z-10 flex items-baseline gap-2">
          <span className="text-5xl font-black">{balance.toLocaleString()}</span>
          <span className="text-sm opacity-70 font-medium">Total Points</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-[#001145] uppercase tracking-wide">Recent Activity</h4>
          {transactions.length > 0 && (
            <TrendingUp size={14} className="text-green-500" />
          )}
        </div>

        {error && (
          <div className="text-center py-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {!error && transactions.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-[#e4f0ff] rounded-full flex items-center justify-center mx-auto mb-3">
              <Award size={20} className="text-[#001145]" />
            </div>
            <p className="text-sm text-[#001145]/60 font-medium">No activity yet</p>
            <p className="text-xs text-[#001145]/40 mt-1">Start earning karma by engaging!</p>
          </div>
        )}

        {!error && transactions.length > 0 && (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div 
                key={transaction._id || index} 
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f8fbff] transition-colors border border-transparent hover:border-[#e4f0ff]"
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">
                  {getActivityIcon(transaction.description)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#001145] leading-snug">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-[#001145]/50 mt-1 font-bold uppercase tracking-wide">
                    {formatTimeAgo(transaction.timestamp)}
                  </p>
                </div>
                <div className={`flex-shrink-0 font-bold text-sm ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Leaderboard Link */}
        <Link 
          href="/leaderboard" 
          className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#e4f0ff] hover:bg-[#001145] text-[#001145] hover:text-white rounded-xl transition-all font-bold text-sm group"
        >
          <span>View Leaderboard</span>
          <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
