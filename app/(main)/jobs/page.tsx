"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Building2, Search, Plus, DollarSign, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { MOCK_JOBS } from '@/src/data/mockData';
import { getAllJobs } from '@/src/api/jobs';

interface Job {
  _id: string;
  id?: string;
  title: string;
  company: string;
  location?: string;
  type: 'full-time' | 'internship';
  isOpen: boolean;
  description?: string;
  skillsRequired: string[];
  salary?: string;
  experienceLevel?: string;
  deadline?: string;
  postedBy?: string;
  createdAt: string;
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs({ page: 1, limit: 50 });
        if (response && response.length > 0) {
          const jobList = response.map((j: any) => ({
            _id: j.id || j._id,
            title: j.title,
            company: j.company,
            location: j.location,
            type: j.type,
            isOpen: j.isOpen ?? true,
            salary: j.salary || 'Competitive',
            experienceLevel: j.experienceLevel || 'Not specified',
            deadline: j.deadline ? new Date(j.deadline).toLocaleDateString() : 'Open',
            description: j.description,
            createdAt: j.createdAt,
            skillsRequired: j.skillsRequired || j.skills || [],
          }));
          setJobs(jobList);
        } else {
          setJobs(MOCK_JOBS);
        }
      } catch (error) {
        console.log('Using mock jobs data');
        setJobs(MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading jobs..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001145]">Job Board</h1>
          <p className="text-gray-500">{jobs.length} open positions</p>
        </div>
        <Button onClick={() => router.push('/jobs/create')} leftIcon={<Plus size={20} />}>
          Post a Job
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001145]/20 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'full-time', 'internship'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === type
                  ? 'bg-[#001145] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {type === 'all' ? 'All' : type === 'full-time' ? 'Full-time' : 'Internship'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#e4f0ff] border-0">
          <p className="text-2xl font-bold text-[#001145]">{jobs.length}</p>
          <p className="text-sm text-[#7088aa]">Total Jobs</p>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <p className="text-2xl font-bold text-green-600">{jobs.filter(j => j.type === 'full-time').length}</p>
          <p className="text-sm text-[#7088aa]">Full-time</p>
        </Card>
        <Card className="bg-[#e4f0ff] border-0">
          <p className="text-2xl font-bold text-amber-600">{jobs.filter(j => j.type === 'internship').length}</p>
          <p className="text-sm text-[#7088aa]">Internships</p>
        </Card>
      </div>

      {/* Job Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="text-center py-12 bg-[#e4f0ff] border-0">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No jobs found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                onClick={() => setSelectedJob(job)}
                className={`cursor-pointer transition-all bg-[#e4f0ff] border-0 ${selectedJob?._id === job._id ? 'ring-2 ring-[#001145] shadow-lg' : 'hover:shadow-md'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#001145] truncate">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-[#4a5f7c]">
                      <Building2 size={14} />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <Badge size="sm" variant={job.type === 'full-time' ? 'success' : 'warning'}>
                    {job.type === 'full-time' ? 'Full-time' : 'Internship'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-[#7088aa] mb-3">
                  {job.location && <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>}
                  <span className="flex items-center gap-1"><DollarSign size={14} />{job.salary}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{formatDate(job.createdAt)}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.slice(0, 3).map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-white text-[#001145]">
                      {skill}
                    </span>
                  ))}
                  {job.skillsRequired.length > 3 && (
                    <span className="px-3 py-1 text-xs text-[#7088aa]">+{job.skillsRequired.length - 3}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Job Details */}
          <div className="hidden lg:block">
            {selectedJob ? (
              <Card className="bg-[#e4f0ff] border-0 sticky top-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#001145] mb-2">{selectedJob.title}</h2>
                  <p className="text-lg text-[#4a5f7c]">{selectedJob.company}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white">
                    <p className="text-sm text-[#7088aa] mb-1">Location</p>
                    <p className="font-medium text-[#001145]">{selectedJob.location || 'Not specified'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white">
                    <p className="text-sm text-[#7088aa] mb-1">Salary</p>
                    <p className="font-medium text-[#001145]">{selectedJob.salary}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white">
                    <p className="text-sm text-[#7088aa] mb-1">Experience</p>
                    <p className="font-medium text-[#001145]">{selectedJob.experienceLevel}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white">
                    <p className="text-sm text-[#7088aa] mb-1">Deadline</p>
                    <p className="font-medium text-[#001145]">{selectedJob.deadline}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-[#001145] mb-3">Description</h3>
                  <p className="text-[#4a5f7c] leading-relaxed">{selectedJob.description}</p>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-[#001145] mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skillsRequired.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 rounded-full font-medium bg-white text-[#001145]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="lg" leftIcon={<ExternalLink size={18} />}>
                  Apply Now
                </Button>
              </Card>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 flex items-center justify-center h-full bg-[#e4f0ff]">
                <div className="text-center">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#7088aa]">Select a job to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
