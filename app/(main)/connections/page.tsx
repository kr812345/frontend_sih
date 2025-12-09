"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, UserPlus, Check, X, MessageSquare, Users, Clock, Sparkles } from 'lucide-react';
import { Button, LoadingSpinner } from '@/components/ui';
import AIAnalysisModal from '@/components/AIAnalysisModal';
import { analyzeProfile } from '@/src/lib/gemini';
import { getConnections, getPendingRequests, getConnectionSuggestions, sendConnectionRequest } from '@/src/api/connections';
import { searchAlumni, AlumniProfile } from '@/src/api/alumni';
import toast from 'react-hot-toast';

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'suggestions'>('suggestions');
  const [connections, setConnections] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<AlumniProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // AI Analysis State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProfileName, setSelectedProfileName] = useState('');

  interface Suggestion {
    id: string;
    name: string;
    avatarUrl?: string;
    currentRole?: string;
    currentCompany?: string;
    gradYear?: string;
    mutualConnections: number;
    reason: string;
  }

  const handleAnalyzeProfile = async (profile: Suggestion) => {
    setSelectedProfileName(profile.name);
    setAiAnalysis(null);
    setIsAIModalOpen(true);
    setIsAnalyzing(true);

    try {
      const result = await analyzeProfile(profile);
      setAiAnalysis(result);
    } catch (error) {
      setAiAnalysis("Failed to analyze profile. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [connData, reqData, sugData] = await Promise.all([
          getConnections(), getPendingRequests(), getConnectionSuggestions()
        ]);
        setConnections(connData.items || []);
        setPendingRequests(reqData || []);
        setSuggestions(sugData || []);
      } catch (error) {
        console.error("Error fetching connections:", error);
        setConnections([]);
        setPendingRequests([]);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Global search handler - searches ALL registered users
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchAlumni(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching alumni:', error);
        toast.error('Failed to search users');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleAccept = (id: string) => {
    const req = pendingRequests.find(r => r.id === id);
    setPendingRequests(prev => prev.filter(r => r.id !== id));
    if (req) setConnections(prev => [...prev, { id: `conn-${req.from.id}`, user: req.from, connectedAt: new Date().toISOString() }]);
  };

  const handleReject = (id: string) => setPendingRequests(prev => prev.filter(r => r.id !== id));
  
  const handleConnect = async (id: string) => {
    try {
      await sendConnectionRequest(id);
      toast.success('Connection request sent!');
      setSuggestions(prev => prev.filter(s => s.id !== id));
      setSearchResults(prev => prev.filter(s => s.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send connection request');
    }
  };
  
  const handleRemove = (id: string) => setConnections(prev => prev.filter(c => c.id !== id));

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const tabs = [
    { id: 'suggestions' as const, label: 'Suggestions', count: suggestions.length },
    { id: 'connections' as const, label: 'My Connections', count: connections.length },
    { id: 'pending' as const, label: 'Pending', count: pendingRequests.length },
  ];

  if (loading) return <LoadingSpinner fullScreen text="Loading..." />;

  // Filter all data based on search term
  const filteredConnections = connections.filter(c =>
    c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.user.currentRole && c.user.currentRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.user.currentCompany && c.user.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPending = pendingRequests.filter(r =>
    r.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.from.currentRole && r.from.currentRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.from.currentCompany && r.from.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSuggestions = suggestions.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.currentRole && s.currentRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.currentCompany && s.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#001145]">Connections</h1>
        <p className="text-gray-500">Manage your alumni network</p>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search all alumni by name, role, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#e4f0ff] rounded-lg focus:outline-none focus:border-[#001145]"
        />
      </div>

      {/* Global Search Results */}
      {searchTerm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#001145]">Search Results</h2>
            {isSearching && <LoadingSpinner size="sm" />}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.length === 0 && !isSearching ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No users found matching "{searchTerm}"</p>
              </div>
            ) : searchResults.map((user) => (
              <div key={user.id} className="bg-white rounded-xl p-5 border border-[#e4f0ff]">
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${user.id}`}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#e4f0ff]">
                      {user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt={user.name} width={56} height={56} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-[#001145]">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${user.id}`} className="font-bold text-[#001145] hover:underline block truncate">
                      {user.name}
                    </Link>
                    <p className="text-sm text-gray-600 truncate">{user.currentRole}</p>
                    <p className="text-sm text-gray-500 truncate">{user.currentCompany}</p>
                    {user.gradYear && <p className="text-xs text-gray-400 mt-1">Class of {user.gradYear}</p>}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#e4f0ff]">
                  <button 
                    onClick={() => handleConnect(user.id)}
                    className="w-full py-2 bg-[#001145] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#001145]/90 transition-colors"
                  >
                    <UserPlus size={14} /> Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hide tabs when searching */}
      {!searchTerm && (
        <>
          {/* Tabs */}
          <div className="flex gap-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#001145] text-white' : 'bg-white text-[#001145] border border-[#e4f0ff] hover:bg-[#e4f0ff]'
              }`}>
            {tab.label} {tab.count > 0 && <span className="ml-1 opacity-70">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* My Connections */}
      {activeTab === 'connections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No connections yet</p>
            </div>
          ) : filteredConnections.map((conn) => (
            <div key={conn.id} className="bg-white rounded-xl p-5 border border-[#e4f0ff]">
              <div className="flex items-start gap-4">
                <Link href={`/profile/${conn.user.id}`}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#e4f0ff]">
                    {conn.user.avatarUrl ? (
                      <Image src={conn.user.avatarUrl} alt={conn.user.name} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-[#001145]">
                        {getInitials(conn.user.name)}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${conn.user.id}`} className="font-bold text-[#001145] hover:underline block truncate">
                    {conn.user.name}
                  </Link>
                  <p className="text-sm text-gray-600 truncate">{conn.user.currentRole}</p>
                  <p className="text-sm text-gray-500 truncate">{conn.user.currentCompany}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-[#e4f0ff]">
                <Link href={`/messages?user=${conn.user.id}`} className="flex-1">
                  <button className="w-full py-2 bg-[#e4f0ff] text-[#001145] rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <MessageSquare size={14} /> Message
                  </button>
                </Link>
                <button onClick={() => handleRemove(conn.id)} className="px-3 py-2 text-gray-400 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {filteredPending.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{searchTerm ? 'No matching pending requests' : 'No pending requests'}</p>
            </div>
          ) : filteredPending.map((req) => (
            <div key={req.id} className="bg-white rounded-xl p-5 border border-[#e4f0ff] flex items-center gap-4">
              <Link href={`/profile/${req.from.id}`}>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#e4f0ff]">
                  {req.from.avatarUrl ? (
                    <Image src={req.from.avatarUrl} alt={req.from.name} width={56} height={56} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-[#001145]">
                      {getInitials(req.from.name)}
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#001145]">{req.from.name}</p>
                <p className="text-sm text-gray-600">{req.from.currentRole} at {req.from.currentCompany}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAccept(req.id)}><Check size={14} /> Accept</Button>
                <button onClick={() => handleReject(req.id)} className="px-3 py-2 border border-[#e4f0ff] rounded-lg text-gray-500 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{searchTerm ? 'No matching suggestions' : 'No suggestions right now'}</p>
            </div>
          ) : filteredSuggestions.map((sug, idx) => (
            <div key={`${sug.id}-${idx}`} className="bg-white rounded-xl p-5 border border-[#e4f0ff]">
              <div className="flex items-start gap-4">
                <Link href={`/profile/${sug.id}`}>
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#e4f0ff]">
                    {sug.avatarUrl ? (
                      <Image src={sug.avatarUrl} alt={sug.name} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white bg-[#001145]">
                        {getInitials(sug.name)}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${sug.id}`} className="font-bold text-[#001145] hover:underline block truncate">
                    {sug.name}
                  </Link>
                  <p className="text-sm text-gray-600 truncate">{sug.currentRole}</p>
                  <p className="text-sm text-gray-500 truncate">{sug.currentCompany}</p>
                  <p className="text-xs text-[#001145] mt-1">{sug.mutualConnections} mutual connections</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAnalyzeProfile(sug)}
                  className="flex-1 py-2 bg-[#e4f0ff] text-[#001145] rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#d0e6ff] transition-colors"
                >
                  <Sparkles size={14} /> Analyze
                </button>
                <button onClick={() => handleConnect(sug.id)}
                  className="flex-1 py-2 bg-[#001145] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#001145]/90 transition-colors">
                  <UserPlus size={14} /> Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}
      <AIAnalysisModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        loading={isAnalyzing}
        analysis={aiAnalysis}
        title={`AI Analysis: ${selectedProfileName}`}
      />
    </div>
  );
}
