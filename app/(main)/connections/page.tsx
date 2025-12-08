"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, UserPlus, Check, X, MessageSquare, Users, Clock, Sparkles } from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { MOCK_CONNECTIONS, MOCK_PENDING_REQUESTS, MOCK_SUGGESTIONS } from '@/src/data/mockData';
import { getConnections, getPendingRequests, getConnectionSuggestions } from '@/src/api/connections';

interface Connection {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    currentRole?: string;
    currentCompany?: string;
    gradYear?: string;
  };
  connectedAt: string;
}

interface ConnectionRequest {
  id: string;
  from: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    currentRole?: string;
    currentCompany?: string;
  };
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

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

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'suggestions'>('connections');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [connData, reqData, sugData] = await Promise.all([
          getConnections(),
          getPendingRequests(),
          getConnectionSuggestions(),
        ]);
        setConnections(connData.items?.length ? connData.items : MOCK_CONNECTIONS);
        setPendingRequests(reqData?.length ? reqData : MOCK_PENDING_REQUESTS);
        setSuggestions(sugData?.length ? sugData : MOCK_SUGGESTIONS);
      } catch (error) {
        console.log('Using mock connections data');
        setConnections(MOCK_CONNECTIONS);
        setPendingRequests(MOCK_PENDING_REQUESTS);
        setSuggestions(MOCK_SUGGESTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAccept = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    if (request) {
      setConnections(prev => [...prev, {
        id: `conn-${request.from.id}`,
        user: request.from,
        connectedAt: new Date().toISOString(),
      }]);
    }
  };

  const handleReject = (requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleConnect = (userId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== userId));
  };

  const handleRemove = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  };

  const filteredConnections = connections.filter(c =>
    c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const tabs = [
    { id: 'connections' as const, label: 'My Connections', icon: Users, count: connections.length },
    { id: 'pending' as const, label: 'Pending', icon: Clock, count: pendingRequests.length },
    { id: 'suggestions' as const, label: 'Suggestions', icon: Sparkles, count: suggestions.length },
  ];

  if (loading) return <LoadingSpinner fullScreen text="Loading connections..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#001145]">Connections</h1>
        <p className="text-gray-500">Manage your alumni network</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id
                ? 'bg-[#001145] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#e4f0ff]'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      {activeTab === 'connections' && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
          />
        </div>
      )}

      {/* My Connections */}
      {activeTab === 'connections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnections.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12 bg-[#e4f0ff] border-0">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No connections yet</p>
              </Card>
            </div>
          ) : (
            filteredConnections.map((conn) => (
              <Card key={conn.id} className="bg-[#e4f0ff] border-0 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${conn.user.id}`}>
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white">
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
                    <p className="text-sm text-[#4a5f7c] truncate">{conn.user.currentRole}</p>
                    <p className="text-sm text-[#7088aa] truncate">{conn.user.currentCompany}</p>
                    {conn.user.gradYear && <Badge size="sm" className="mt-2">Batch {conn.user.gradYear}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white">
                  <Link href={`/messages?user=${conn.user.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full" leftIcon={<MessageSquare size={14} />}>Message</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(conn.id)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pending Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card className="text-center py-12 bg-[#e4f0ff] border-0">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No pending requests</p>
            </Card>
          ) : (
            pendingRequests.map((req) => (
              <Card key={req.id} className="bg-[#e4f0ff] border-0">
                <div className="flex items-center gap-4">
                  <Link href={`/profile/${req.from.id}`}>
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white">
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
                    <Link href={`/profile/${req.from.id}`} className="font-bold text-[#001145] hover:underline">
                      {req.from.name}
                    </Link>
                    <p className="text-sm text-[#4a5f7c]">{req.from.currentRole} at {req.from.currentCompany}</p>
                    {req.message && <p className="text-sm mt-1 italic text-[#7088aa]">"{req.message}"</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" leftIcon={<Check size={14} />} onClick={() => handleAccept(req.id)}>Accept</Button>
                    <Button variant="outline" size="sm" onClick={() => handleReject(req.id)}><X size={14} /></Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12 bg-[#e4f0ff] border-0">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No suggestions right now</p>
              </Card>
            </div>
          ) : (
            suggestions.map((sug) => (
              <Card key={sug.id} className="bg-[#e4f0ff] border-0 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${sug.id}`}>
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white">
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
                    <p className="text-sm text-[#4a5f7c] truncate">{sug.currentRole}</p>
                    <p className="text-sm text-[#7088aa] truncate">{sug.currentCompany}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge size="sm" variant="info">{sug.mutualConnections} mutual</Badge>
                      <span className="text-xs text-[#7088aa]">{sug.reason}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm" leftIcon={<UserPlus size={14} />} onClick={() => handleConnect(sug.id)}>
                  Connect
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
