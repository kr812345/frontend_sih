"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Filter, Heart, MessageCircle, Upload, Grid, List, X, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';

// Screenshot images for memories - all 24 images
const MEMORY_IMAGES = [
  '/Screenshot 2025-12-09 091511.png',
  '/Screenshot 2025-12-09 091527.png',
  '/Screenshot 2025-12-09 091532.png',
  '/Screenshot 2025-12-09 093822.png',
  '/Screenshot 2025-12-09 091537.png',
  '/Screenshot 2025-12-09 091551.png',
  '/Screenshot 2025-12-09 093830.png',
  '/Screenshot 2025-12-09 091611.png',
  '/Screenshot 2025-12-09 091619.png',
  '/Screenshot 2025-12-09 093840.png',
  '/Screenshot 2025-12-09 091627.png',
  '/Screenshot 2025-12-09 091649.png',
  '/Screenshot 2025-12-09 093900.png',
  '/Screenshot 2025-12-09 091701.png',
  '/Screenshot 2025-12-09 091709.png',
  '/Screenshot 2025-12-09 093907.png',
  '/Screenshot 2025-12-09 091714.png',
  '/Screenshot 2025-12-09 091721.png',
  '/Screenshot 2025-12-09 093913.png',
  '/Screenshot 2025-12-09 091736.png',
  '/Screenshot 2025-12-09 091748.png',
  '/Screenshot 2025-12-09 091758.png',
  '/Screenshot 2025-12-09 091803.png',
  '/Screenshot 2025-12-09 091807.png',
];

// Mock data for memories
const MOCK_MEMORIES = [
  { id: '1', title: 'Farewell 2024', year: '2024', batch: '2024', event: 'Farewell', likes: 156, comments: 32, uploadedBy: 'Rahul Verma', image: MEMORY_IMAGES[0] },
  { id: '2', title: 'Tech Fest 2024', year: '2024', batch: 'All', event: 'Tech Fest', likes: 234, comments: 45, uploadedBy: 'Sneha Kapoor', image: MEMORY_IMAGES[1] },
  { id: '3', title: 'Sports Day Champions', year: '2024', batch: '2023', event: 'Sports Day', likes: 189, comments: 28, uploadedBy: 'Arjun Mehta', image: MEMORY_IMAGES[2] },
  { id: '4', title: 'Cultural Night', year: '2023', batch: '2023', event: 'Cultural', likes: 312, comments: 56, uploadedBy: 'Priya Singh', image: MEMORY_IMAGES[3] },
  { id: '5', title: 'Freshers Party 2023', year: '2023', batch: '2024', event: 'Freshers', likes: 267, comments: 42, uploadedBy: 'Amit Sharma', image: MEMORY_IMAGES[4] },
  { id: '6', title: 'Annual Day 2023', year: '2023', batch: 'All', event: 'Annual Day', likes: 445, comments: 78, uploadedBy: 'Kavya Reddy', image: MEMORY_IMAGES[5] },
  { id: '7', title: 'Placement Celebration', year: '2023', batch: '2023', event: 'Placement', likes: 534, comments: 89, uploadedBy: 'Vikram Singh', image: MEMORY_IMAGES[6] },
  { id: '8', title: 'Hackathon Winners', year: '2023', batch: '2024', event: 'Hackathon', likes: 198, comments: 34, uploadedBy: 'Neha Gupta', image: MEMORY_IMAGES[7] },
  { id: '9', title: 'Campus Life', year: '2022', batch: 'All', event: 'Campus', likes: 289, comments: 41, uploadedBy: 'Rohan Kumar', image: MEMORY_IMAGES[8] },
  { id: '10', title: 'Graduation Ceremony', year: '2022', batch: '2022', event: 'Graduation', likes: 678, comments: 123, uploadedBy: 'Ananya Patel', image: MEMORY_IMAGES[9] },
  { id: '11', title: 'Workshop Sessions', year: '2022', batch: 'All', event: 'Workshop', likes: 145, comments: 21, uploadedBy: 'Karthik Iyer', image: MEMORY_IMAGES[10] },
  { id: '12', title: 'Independence Day', year: '2022', batch: 'All', event: 'National', likes: 234, comments: 38, uploadedBy: 'Deepika Sharma', image: MEMORY_IMAGES[11] },
  { id: '13', title: 'Alumni Meet 2024', year: '2024', batch: 'All', event: 'Alumni Meet', likes: 456, comments: 67, uploadedBy: 'Raj Malhotra', image: MEMORY_IMAGES[12] },
  { id: '14', title: 'Convocation Day', year: '2023', batch: '2023', event: 'Graduation', likes: 589, comments: 98, uploadedBy: 'Simran Kaur', image: MEMORY_IMAGES[13] },
  { id: '15', title: 'Foundation Day', year: '2024', batch: 'All', event: 'Annual Day', likes: 345, comments: 52, uploadedBy: 'Arun Sharma', image: MEMORY_IMAGES[14] },
  { id: '16', title: 'College Fest', year: '2023', batch: 'All', event: 'Cultural', likes: 423, comments: 71, uploadedBy: 'Meera Joshi', image: MEMORY_IMAGES[15] },
  { id: '17', title: 'Project Exhibition', year: '2024', batch: '2024', event: 'Tech Fest', likes: 287, comments: 43, uploadedBy: 'Venkat Rao', image: MEMORY_IMAGES[16] },
  { id: '18', title: 'Sports Meet Finals', year: '2023', batch: 'All', event: 'Sports Day', likes: 356, comments: 54, uploadedBy: 'Rashid Khan', image: MEMORY_IMAGES[17] },
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

  const thisWeekMemories = memories.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Memories</h1>
          <p className="text-gray-500">Relive the golden days with your batchmates</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Upload size={16} /> Upload Memory
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Photos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{memories.length * 24}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Likes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">3.6K+</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Events Covered</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">45+</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Contributors</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
        </div>
      </div>

      {/* This Week in History */}
      <div className="bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">This Week in History</h2>
            <p className="text-white/60 text-sm mt-0.5">See what happened on this day in previous years</p>
          </div>
          <button className="text-white/60 hover:text-white text-sm font-medium transition-colors">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {thisWeekMemories.map((memory) => (
            <div
              key={memory.id}
              className="flex-shrink-0 w-48 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedMemory(memory)}
            >
              <Image src={memory.image} alt={memory.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm text-white font-medium truncate">{memory.title}</p>
                <p className="text-xs text-white/60">{memory.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 bg-white text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${showFilters ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Filter size={16} /> Filters
          </button>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm">
            {YEARS.map(year => <option key={year}>{year}</option>)}
          </select>
          <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm">
            {BATCHES.map(batch => <option key={batch}>{batch}</option>)}
          </select>
          <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm">
            {EVENTS.map(event => <option key={event}>{event}</option>)}
          </select>
        </div>
      )}

      {/* Gallery - CSS Columns Masonry (renders based on natural image sizes, no white space) */}
      {viewMode === 'grid' ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 mb-4 break-inside-avoid"
            >
              <Image
                src={memory.image}
                alt={memory.title}
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-semibold text-sm truncate">{memory.title}</p>
                <p className="text-white/70 text-xs mt-0.5">{memory.year} - {memory.event}</p>
                <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
                  <span className="flex items-center gap-1"><Heart size={12} /> {memory.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {memory.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image src={memory.image} alt={memory.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{memory.title}</h3>
                  <p className="text-sm text-gray-500">{memory.year} - {memory.event} - Uploaded by {memory.uploadedBy}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Heart size={14} /> {memory.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={14} /> {memory.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredMemories.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-500">No memories found matching your filters</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button onClick={() => setSelectedMemory(null)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10">
            <X size={28} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
            <ChevronRight size={24} />
          </button>

          <div className="max-w-5xl w-full">
            <div className="aspect-video rounded-2xl overflow-hidden relative shadow-2xl">
              <Image src={selectedMemory.image} alt={selectedMemory.title} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between text-white mt-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedMemory.title}</h3>
                <p className="text-white/60 mt-1">{selectedMemory.year} - {selectedMemory.event} - By {selectedMemory.uploadedBy}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 text-sm transition-colors">
                  <Heart size={16} /> {selectedMemory.likes}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 text-sm transition-colors">
                  <Share2 size={16} /> Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 text-sm transition-colors">
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Memory</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">Drag and drop photos here</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" placeholder="e.g., Farewell Party 2024" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm">
                    {YEARS.slice(1).map(year => <option key={year}>{year}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm">
                    {EVENTS.slice(1).map(event => <option key={event}>{event}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm">
                Upload Photos
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
