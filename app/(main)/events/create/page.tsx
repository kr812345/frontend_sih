"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon, Image as ImageIcon, Clock } from 'lucide-react';
import { Button, Card, Input, Textarea, Select } from '@/components/ui';
import { createEvent, CreateEventData } from '@/src/api/events';

const EVENT_TYPES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'conference', label: 'Conference' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    name: '',
    description: '',
    from: { date: '', time: '' },
    to: { date: '', time: '' },
    location: '',
    eventType: 'webinar',
    registrationLink: '',
    lastDateToRegister: '',
    image: '',
  });

  const updateField = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: 'from' | 'to', field: 'date' | 'time', value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createEvent(formData);
      router.push('/events');
    } catch (error) {
      console.error(error);
      alert("Failed to create event. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = formData.name && formData.description && formData.from.date && formData.from.time && formData.to.date && formData.to.time && formData.location && formData.registrationLink && formData.lastDateToRegister;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[#001145]">Create Event</h1>
      </div>

      {/* Basic Info */}
      <Card>
        <h2 className="font-bold text-[#001145] mb-6">Event Details</h2>
        <div className="space-y-4">
          <Input 
            label="Event Name *" 
            value={formData.name} 
            onChange={(e) => updateField('name', e.target.value)} 
            placeholder="e.g. Annual Alumni Reunion 2025" 
          />
          <Select 
            label="Event Type *" 
            options={EVENT_TYPES} 
            value={formData.eventType} 
            onChange={(e) => updateField('eventType', e.target.value)} 
          />
          <Textarea 
            label="Description *" 
            rows={5} 
            value={formData.description} 
            onChange={(e) => updateField('description', e.target.value)} 
            placeholder="Describe your event..." 
          />
        </div>
      </Card>

      {/* Date & Time */}
      <Card>
        <h2 className="font-bold text-[#001145] mb-6">Date & Time</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">Starts From</h3>
            <Input 
              label="Date *" 
              type="date" 
              value={formData.from.date} 
              onChange={(e) => updateNestedField('from', 'date', e.target.value)} 
            />
            <Input 
              label="Time *" 
              type="time" 
              value={formData.from.time} 
              onChange={(e) => updateNestedField('from', 'time', e.target.value)} 
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500">Ends At</h3>
            <Input 
              label="Date *" 
              type="date" 
              value={formData.to.date} 
              onChange={(e) => updateNestedField('to', 'date', e.target.value)} 
            />
            <Input 
              label="Time *" 
              type="time" 
              value={formData.to.time} 
              onChange={(e) => updateNestedField('to', 'time', e.target.value)} 
            />
          </div>
        </div>
      </Card>

      {/* Registration & Location */}
      <Card>
        <h2 className="font-bold text-[#001145] mb-6">Logistics</h2>
        <div className="space-y-4">
          <Input 
            label="Location *" 
            value={formData.location} 
            onChange={(e) => updateField('location', e.target.value)} 
            placeholder="e.g. Auditorium or Zoom Link" 
            leftIcon={<MapPin size={18} />} 
          />
          <Input 
            label="Registration Link *" 
            value={formData.registrationLink} 
            onChange={(e) => updateField('registrationLink', e.target.value)} 
            placeholder="https://..." 
            leftIcon={<LinkIcon size={18} />} 
          />
          <Input 
            label="Last Date to Register *" 
            type="date" 
            value={formData.lastDateToRegister} 
            onChange={(e) => updateField('lastDateToRegister', e.target.value)} 
            leftIcon={<Clock size={18} />} 
          />
          <Input 
            label="Cover Image URL (Optional)" 
            value={formData.image || ''} 
            onChange={(e) => updateField('image', e.target.value)} 
            placeholder="https://image-url.com/..." 
            leftIcon={<ImageIcon size={18} />} 
          />
        </div>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSubmit} isLoading={submitting} disabled={!isValid}>Create Event</Button>
      </div>
    </div>
  );
}
