"use client";

import React, { useState } from 'react';
import { Heart, Users, Mic, BookOpen, Briefcase, Calendar, Clock, MapPin, ChevronRight, Check, GraduationCap, Award, Target, Lightbulb } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

// Mock data for volunteer opportunities
const VOLUNTEER_PROGRAMS = [
  {
    id: '1',
    title: 'Guest Lecture Program',
    icon: Mic,
    description: 'Share your industry knowledge with current students through guest lectures and tech talks.',
    participants: 156,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    title: 'Career Mentorship',
    icon: Target,
    description: 'Guide students and recent graduates in their career decisions and job preparations.',
    participants: 89,
    color: 'from-green-500 to-green-600',
  },
  {
    id: '3',
    title: 'Workshop Conductor',
    icon: Lightbulb,
    description: 'Conduct hands-on workshops on trending technologies and practical skills.',
    participants: 67,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: '4',
    title: 'Interview Preparation',
    icon: Briefcase,
    description: 'Help students prepare for placements with mock interviews and resume reviews.',
    participants: 124,
    color: 'from-orange-500 to-orange-600',
  },
];

const UPCOMING_OPPORTUNITIES = [
  {
    id: '1',
    title: 'Guest Lecture on System Design',
    department: 'Computer Science',
    date: '2024-01-20',
    time: '10:00 AM - 12:00 PM',
    location: 'Seminar Hall A',
    slots: 2,
    urgency: 'high',
  },
  {
    id: '2',
    title: 'Resume Review Session',
    department: 'Placement Cell',
    date: '2024-01-22',
    time: '2:00 PM - 5:00 PM',
    location: 'Online (Google Meet)',
    slots: 5,
    urgency: 'medium',
  },
  {
    id: '3',
    title: 'AI/ML Workshop',
    department: 'IT Department',
    date: '2024-01-25',
    time: '9:00 AM - 4:00 PM',
    location: 'Tech Lab 3',
    slots: 1,
    urgency: 'high',
  },
  {
    id: '4',
    title: 'Career Counseling Session',
    department: 'Training & Placement',
    date: '2024-01-28',
    time: '11:00 AM - 1:00 PM',
    location: 'Conference Room B',
    slots: 3,
    urgency: 'low',
  },
];

const MY_CONTRIBUTIONS = [
  { id: '1', type: 'Guest Lecture', title: 'Introduction to Cloud Computing', date: '2023-11-15', status: 'completed' },
  { id: '2', type: 'Workshop', title: 'React.js Hands-on Workshop', date: '2023-10-20', status: 'completed' },
  { id: '3', type: 'Mentorship', title: 'Career Guidance - 3 students', date: '2023-09-10', status: 'completed' },
];

export default function GiveBackPage() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'my-contributions' | 'apply'>('opportunities');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === 'high') return <Badge variant="error" size="sm">Urgent</Badge>;
    if (urgency === 'medium') return <Badge variant="warning" size="sm">Soon</Badge>;
    return <Badge variant="info" size="sm">Open</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Give Back</h1>
          <p className="text-gray-500">Contribute to your alma mater and help the next generation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Users className="text-[#001145]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Total Volunteers</p>
              <p className="text-2xl font-bold text-[#001145]">436</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <Mic className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Guest Lectures</p>
              <p className="text-2xl font-bold text-[#001145]">156+</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <BookOpen className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Workshops</p>
              <p className="text-2xl font-bold text-[#001145]">89+</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
              <GraduationCap className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#7088aa]">Students Helped</p>
              <p className="text-2xl font-bold text-[#001145]">2.5K+</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Volunteer Programs Grid */}
      <div>
        <h2 className="text-xl font-bold text-[#001145] mb-4">Ways to Contribute</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VOLUNTEER_PROGRAMS.map((program) => (
            <Card key={program.id} className="group hover:shadow-lg transition-all cursor-pointer border-0 overflow-hidden">
              <div className={`h-24 bg-gradient-to-br ${program.color} -m-6 mb-4 flex items-center justify-center`}>
                <program.icon size={40} className="text-white/80 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-[#001145] mb-2">{program.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{program.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7088aa]">{program.participants} participants</span>
                <button className="text-[#001145] font-medium text-sm flex items-center gap-1 hover:underline">
                  Sign Up <ChevronRight size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'opportunities'
              ? 'bg-[#001145] text-white shadow-md'
              : 'text-gray-600 hover:text-[#001145]'
          }`}
        >
          Open Opportunities
        </button>
        <button
          onClick={() => setActiveTab('my-contributions')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'my-contributions'
              ? 'bg-[#001145] text-white shadow-md'
              : 'text-gray-600 hover:text-[#001145]'
          }`}
        >
          My Contributions
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'apply'
              ? 'bg-[#001145] text-white shadow-md'
              : 'text-gray-600 hover:text-[#001145]'
          }`}
        >
          Submit Proposal
        </button>
      </div>

      {activeTab === 'opportunities' && (
        <Card className="bg-[#e4f0ff] border-0">
          <h3 className="font-bold text-lg text-[#001145] mb-6">Upcoming Opportunities</h3>
          <div className="space-y-4">
            {UPCOMING_OPPORTUNITIES.map((opp) => (
              <div key={opp.id} className="flex items-start justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-[#001145]">{opp.title}</h4>
                    {getUrgencyBadge(opp.urgency)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#7088aa]">
                    <span className="flex items-center gap-1"><GraduationCap size={14} /> {opp.department}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(opp.date)}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {opp.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {opp.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#7088aa] mb-2">{opp.slots} slots left</p>
                  <Button size="sm">Volunteer</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'my-contributions' && (
        <Card className="bg-[#e4f0ff] border-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-[#001145]">My Contributions</h3>
            <div className="flex items-center gap-2">
              <Award className="text-yellow-500" size={20} />
              <span className="font-medium text-[#001145]">3 contributions</span>
            </div>
          </div>
          {MY_CONTRIBUTIONS.length > 0 ? (
            <div className="space-y-4">
              {MY_CONTRIBUTIONS.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Check className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-[#001145]">{item.title}</p>
                      <p className="text-sm text-[#7088aa]">{item.type} • {formatDate(item.date)}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Completed</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No contributions yet. Start giving back today!</p>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'apply' && (
        <Card className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#e4f0ff] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="text-[#001145]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#001145] mb-2">Submit a Proposal</h2>
            <p className="text-gray-500">Have an idea for a lecture, workshop, or session? Let us know!</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Type of Contribution</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white">
                <option>Guest Lecture</option>
                <option>Technical Workshop</option>
                <option>Career Counseling Session</option>
                <option>Mock Interview Session</option>
                <option>Panel Discussion</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Title / Topic</label>
              <input
                type="text"
                placeholder="e.g., Introduction to Cloud Computing"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Description</label>
              <textarea
                rows={4}
                placeholder="Describe what you'll cover and who it's best suited for..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#001145] mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#001145] mb-2">Duration (hours)</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white">
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                  <option>Half day (4 hours)</option>
                  <option>Full day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Mode</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" defaultChecked className="w-4 h-4 text-[#001145]" />
                  <span className="text-gray-600">On Campus</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" className="w-4 h-4 text-[#001145]" />
                  <span className="text-gray-600">Online</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" className="w-4 h-4 text-[#001145]" />
                  <span className="text-gray-600">Hybrid</span>
                </label>
              </div>
            </div>

            <Button className="w-full py-3">
              <Check size={18} /> Submit Proposal
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
