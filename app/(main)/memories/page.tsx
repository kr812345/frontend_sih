"use client";

import React, { useState } from 'react';
import { Camera, Search, Heart, MessageCircle, Upload, Calendar, Filter, Grid, List, Play, X, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

// Mock data for memories
const MOCK_MEMORIES = [
  { id: '1', title: 'Farewell 2024', year: '2024', batch: '2024', event: 'Farewell', likes: 156, comments: 32, uploadedBy: 'Rahul Verma' },
  { id: '2', title: 'Tech Fest 2024', year: '2024', batch: 'All', event: 'Tech Fest', likes: 234, comments: 45, uploadedBy: 'Sneha Kapoor' },
  { id: '3', title: 'Sports Day Champions', year: '2024', batch: '2023', event: 'Sports Day', likes: 189, comments: 28, uploadedBy: 'Arjun Mehta' },
  { id: '4', title: 'Cultural Night', year: '2023', batch: '2023', event: 'Cultural', likes: 312, comments: 56, uploadedBy: 'Priya Singh' },
  { id: '5', title: 'Freshers Party 2023', year: '2023', batch: '2024', event: 'Freshers', likes: 267, comments: 42, uploadedBy: 'Amit Sharma' },
  { id: '6', title: 'Annual Day 2023', year: '2023', batch: 'All', event: 'Annual Day', likes: 445, comments: 78, uploadedBy: 'Kavya Reddy' },
  { id: '7', title: 'Placement Celebration', year: '2023', batch: '2023', event: 'Placement', likes: 534, comments: 89, uploadedBy: 'Vikram Singh' },
  { id: '8', title: 'Hackathon Winners', year: '2023', batch: '2024', event: 'Hackathon', likes: 198, comments: 34, uploadedBy: 'Neha Gupta' },
  { id: '9', title: 'Campus Life', year: '2022', batch: 'All', event: 'Campus', likes: 289, comments: 41, uploadedBy: 'Rohan Kumar' },
  { id: '10', title: 'Graduation Ceremony', year: '2022', batch: '2022', event: 'Graduation', likes: 678, comments: 123, uploadedBy: 'Ananya Patel' },
  { id: '11', title: 'Workshop Sessions', year: '2022', batch: 'All', event: 'Workshop', likes: 145, comments: 21, uploadedBy: 'Karthik Iyer' },
  { id: '12', title: 'Independence Day', year: '2022', batch: 'All', event: 'National', likes: 234, comments: 38, uploadedBy: 'Deepika Sharma' },
];

const YEARS = ['All Years', '2024', '2023', '2022', '2021', '2020'];
const BATCHES = ['All Batches', '2024', '2023', '2022', '2021', '2020'];
const EVENTS = ['All Events', 'Farewell', 'Tech Fest', 'Sports Day', 'Cultural', 'Freshers', 'Graduation'];

export default function MemoriesPage() {
  const [memories] = useState(MOCK_MEMORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [batchFilter, setBatchFilter] = useState('All Batches');
  const [eventFilter, setEventFilter] = useState('All Events');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<typeof MOCK_MEMORIES[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'All Years' || m.year === yearFilter;
    const matchesBatch = batchFilter === 'All Batches' || m.batch === batchFilter || m.batch === 'All';
    const matchesEvent = eventFilter === 'All Events' || m.event === eventFilter;
    return matchesSearch && matchesYear && matchesBatch && matchesEvent;
  });

  // Featured: This Week in History
  const thisWeekMemories = memories.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Campus Memories</h1>
          <p className="text-gray-500">Relive the golden days with your batchmates</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} leftIcon={<Upload size={18} />}>
          Upload Memory
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Camera className="text-[#001145]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Total Photos</p>
              <p className="text-2xl font-bold text-[#001145]">{memories.length * 24}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Heart className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Total Likes</p>
              <p className="text-2xl font-bold text-[#001145]">3.6K+</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Calendar className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Events Covered</p>
              <p className="text-2xl font-bold text-[#001145]">45+</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Upload className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Contributors</p>
              <p className="text-2xl font-bold text-[#001145]">89</p>
            </div>
          </div>
        </Card>
      </div>

      {/* This Week in History */}
      <Card className="bg-gradient-to-r from-[#001145] to-[#001339] text-white border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={20} /> This Week in History
            </h2>
            <p className="text-white/70 text-sm">See what happened on this day in previous years</p>
          </div>
          <button className="text-white/70 hover:text-white text-sm">View All →</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {thisWeekMemories.map((memory) => (
            <div 
              key={memory.id} 
              className="flex-shrink-0 w-48 aspect-[4/3] bg-white/10 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedMemory(memory)}
            >
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <Camera size={24} className="text-white/30 group-hover:scale-110 transition-transform" />
                <p className="text-xs text-white/50 mt-2">{memory.year}</p>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <p className="text-xs text-white truncate">{memory.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 bg-white"
          >
            <Filter size={18} /> Filters
          </button>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-[#001145] text-white' : 'text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-[#001145] text-white' : 'text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="flex flex-wrap gap-4">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
          >
            {YEARS.map(year => <option key={year}>{year}</option>)}
          </select>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
          >
            {BATCHES.map(batch => <option key={batch}>{batch}</option>)}
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
          >
            {EVENTS.map(event => <option key={event}>{event}</option>)}
          </select>
        </div>
      )}

      {/* Gallery Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              className="group aspect-square bg-gradient-to-br from-[#001145] to-[#001339] rounded-xl overflow-hidden cursor-pointer relative"
            >
              <div className="w-full h-full flex items-center justify-center">
                <Camera size={32} className="text-white/30 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-medium text-sm truncate">{memory.title}</p>
                <p className="text-white/70 text-xs">{memory.year} • {memory.event}</p>
                <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
                  <span className="flex items-center gap-1"><Heart size={12} /> {memory.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {memory.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="bg-[#e4f0ff] border-0">
          <div className="space-y-3">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-16 h-16 bg-[#001145] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Camera size={24} className="text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#001145] truncate">{memory.title}</h3>
                  <p className="text-sm text-[#7088aa]">{memory.year} • {memory.event} • Uploaded by {memory.uploadedBy}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#7088aa]">
                  <span className="flex items-center gap-1"><Heart size={14} /> {memory.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={14} /> {memory.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {filteredMemories.length === 0 && (
        <Card className="text-center py-12">
          <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No memories found matching your filters</p>
        </Card>
      )}

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedMemory(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
          >
            <X size={32} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20">
            <ChevronLeft size={24} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20">
            <ChevronRight size={24} />
          </button>
          
          <div className="max-w-4xl w-full">
            <div className="aspect-video bg-[#001145] rounded-2xl flex items-center justify-center mb-4">
              <Camera size={64} className="text-white/30" />
            </div>
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-xl font-bold">{selectedMemory.title}</h3>
                <p className="text-white/60">{selectedMemory.year} • {selectedMemory.event} • By {selectedMemory.uploadedBy}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
                  <Heart size={18} /> {selectedMemory.likes}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
                  <Share2 size={18} /> Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
                  <Download size={18} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#001145]">Upload Memory</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#001145] transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Drag and drop photos here</p>
                <p className="text-sm text-gray-400">or click to browse</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#001145] mb-2">Title</label>
                <input type="text" placeholder="e.g., Farewell Party 2024" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#001145] mb-2">Year</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white">
                    {YEARS.slice(1).map(year => <option key={year}>{year}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#001145] mb-2">Event</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white">
                    {EVENTS.slice(1).map(event => <option key={event}>{event}</option>)}
                  </select>
                </div>
              </div>
              <Button className="w-full">Upload Photos</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
