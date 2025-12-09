"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, UserPlus, MapPin, Briefcase, GraduationCap, Mail, Check, Clock, Filter } from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { getAlumniDirectory, AlumniProfile } from '@/src/api/alumni';

export default function AlumniDirectoryPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAlumniDirectory();
        if (data && data.length > 0) {
          setAlumni(data as AlumniProfile[]);
        } else {
          setAlumni([]);
        }
      } catch (error) {
        console.error('Error fetching alumni:', error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.currentCompany || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.currentRole || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter === 'all' || a.gradYear === batchFilter;
    return matchesSearch && matchesBatch;
  });

  const batches = ['all', ...new Set(alumni.map(a => a.gradYear))].sort((a, b) => {
    if (a === 'all') return -1;
    if (b === 'all') return 1;
    return Number(b) - Number(a);
  });

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getConnectionButton = (status: 'connected' | 'pending' | 'none') => {
    if (status === 'connected') {
      return (
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium bg-[#e4f0ff] text-[#001145]">
          <Check size={16} /> Connected
        </button>
      );
    }
    if (status === 'pending') {
      return (
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium border border-gray-200 text-gray-500">
          <Clock size={16} /> Pending
        </button>
      );
    }
    return (
      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white rounded-xl font-medium bg-[#001145] hover:opacity-90">
        <UserPlus size={16} /> Connect
      </button>
    );
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading alumni directory..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Alumni Directory</h1>
          <p className="text-gray-500">Connect with {alumni.length} fellow alumni</p>
        </div>
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#e4f0ff] text-[#001145]">
          {filteredAlumni.length} alumni found
        </span>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, company, role, or department..."
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

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-2 flex-wrap">
          {batches.map(batch => (
            <button
              key={batch}
              onClick={() => setBatchFilter(batch)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${batchFilter === batch
                  ? 'bg-[#001145] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {batch === 'all' ? 'All Batches' : `Batch ${batch}`}
            </button>
          ))}
        </div>
      )}

      {/* Alumni Grid */}
      {filteredAlumni.length === 0 ? (
        <Card className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No alumni found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <Card key={person.id} className="bg-[#e4f0ff] border-0 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <Link href={`/profile/${person.id}`} className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white">
                    {person.avatarUrl ? (
                      <Image src={person.avatarUrl} alt={person.name} width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white bg-[#001145]">
                        {getInitials(person.name)}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${person.id}`}>
                    <h3 className="font-bold text-lg text-[#001145] truncate hover:underline">{person.name}</h3>
                  </Link>
                  <p className="text-[#4a5f7c] truncate">{person.currentRole}</p>
                  {person.isVerified && <Badge variant="success" size="sm" className="mt-1">Verified</Badge>}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#7088aa]">
                  <Briefcase size={14} />
                  <span className="truncate">{person.currentCompany}</span>
                </div>
                {person.location && (
                  <div className="flex items-center gap-2 text-sm text-[#7088aa]">
                    <MapPin size={14} />
                    <span>{person.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-[#7088aa]">
                  <GraduationCap size={14} />
                  <span>{person.major} • Batch {person.gradYear}</span>
                </div>
              </div>

              {/* Skills Preview */}
              {person.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {person.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 rounded-md text-xs font-medium bg-white text-[#001145]">
                      {skill}
                    </span>
                  ))}
                  {person.skills.length > 3 && (
                    <span className="px-2 py-1 rounded-md text-xs text-[#7088aa]">
                      +{person.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                {getConnectionButton(person.connectionStatus || 'none')}
                <Link href={`/messages?user=${person.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium bg-white text-[#001145]">
                    <Mail size={16} /> Message
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
