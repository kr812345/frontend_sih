"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, Plus, Search } from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { getAllEvents } from '@/src/api/events';

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' }),
      weekday: date.toLocaleString('en-US', { weekday: 'short' }),
    };
  };

  const eventTypes = ['all', 'Reunion', 'Webinar', 'Networking', 'Workshop'];

  const filteredEvents = events.filter(event => {
    const title = event.title || event.name || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || event.eventType === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <LoadingSpinner fullScreen text="Loading events..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Events</h1>
          <p className="text-gray-500">Discover and join alumni events</p>
        </div>
        <Button onClick={() => router.push('/events/create')} leftIcon={<Plus size={20} />}>
          Create Event
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === type
                ? 'bg-[#001145] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
          >
            {type === 'all' ? 'All Events' : type}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No events found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const eventDate = event.date || event.from?.date || new Date().toISOString();
            const dateInfo = formatDate(eventDate);
            const title = event.title || event.name || 'Untitled Event';
            const location = event.location || event.venue || 'TBD';

            return (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                {/* Date Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-[#e4f0ff] flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#7088aa] uppercase">{dateInfo.month}</span>
                    <span className="text-2xl font-bold text-[#001145]">{dateInfo.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge size="sm" className="mb-2">{event.eventType || 'General'}</Badge>
                    <Link href={`/events/${event._id}`}>
                      <h3 className="font-bold text-[#001145] hover:underline line-clamp-2">{title}</h3>
                    </Link>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} className="text-gray-400" />
                    <span>{event.from?.time || '10:00 AM'} - {event.to?.time || '5:00 PM'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={14} className="text-gray-400" />
                    <span>{event.registeredUsers?.length || 0} attending</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>

                <Button variant="secondary" className="w-full">
                  Register Now
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
