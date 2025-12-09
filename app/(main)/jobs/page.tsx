"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Building2, Search, Plus, DollarSign, ExternalLink, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, LoadingSpinner } from '@/components/ui';
import AIAnalysisModal from '@/components/AIAnalysisModal';
import { analyzeJobCompatibility } from '@/src/lib/gemini';
import { getAllJobs } from '@/src/api/jobs';

interface Job {
  _id: string;
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
  createdAt: string;
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');

  // AI Analysis State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingJobTitle, setAnalyzingJobTitle] = useState('');

  const handleAnalyzeJob = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation(); // Prevent card click
    setAnalyzingJobTitle(job.title);
    setAiAnalysis(null);
    setIsAIModalOpen(true);
    setIsAnalyzing(true);
    
    try {
      // Pass a mock user profile or fetch real one if available
      const userProfile = {
        name: "Current User",
        skills: ["React", "JavaScript", "Node.js"], // ideally fetch from store
        experience: "Students"
      };
      const result = await analyzeJobCompatibility(job, userProfile);
      setAiAnalysis(result);
    } catch (error) {
      setAiAnalysis("Failed to analyze job compatibility. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs({ page: 1, limit: 50 });
        if (response && response.length > 0) {
          setJobs(response.map((j: any) => ({
            _id: j.id || j._id, title: j.title, company: j.company, location: j.location,
            type: j.type, isOpen: j.isOpen ?? true, salary: j.salary || 'Competitive',
            experienceLevel: j.experienceLevel || 'Not specified',
            deadline: j.deadline ? new Date(j.deadline).toLocaleDateString() : 'Open',
            description: j.description, createdAt: j.createdAt, skillsRequired: j.skillsRequired || [],
          } as Job)));
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
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
    const diffDays = Math.ceil(Math.abs(Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
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
        <Button onClick={() => router.push('/jobs/create')} leftIcon={<Plus size={20} />}>Post a Job</Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#e4f0ff] rounded-lg focus:outline-none focus:border-[#001145]" />
          </div>
          <div className="flex gap-2">
            {['all', 'full-time', 'internship'].map((type) => (
              <button key={type} onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === type ? 'bg-[#001145] text-white' : 'border border-[#e4f0ff] text-[#001145] hover:bg-[#e4f0ff]'
                  }`}>
                {type === 'all' ? 'All' : type === 'full-time' ? 'Full-time' : 'Internship'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#001145]">{jobs.length}</p>
          <p className="text-sm text-gray-500">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#001145]">{jobs.filter(j => j.type === 'full-time').length}</p>
          <p className="text-sm text-gray-500">Full-time</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#001145]">{jobs.filter(j => j.type === 'internship').length}</p>
          <p className="text-sm text-gray-500">Internships</p>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div key={job._id} onClick={() => setSelectedJob(job)}
                className={`bg-white rounded-xl p-5 cursor-pointer transition-all ${selectedJob?._id === job._id ? 'ring-2 ring-[#001145]' : 'hover:shadow-md border border-[#e4f0ff]'
                  }`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-[#001145]">{job.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleAnalyzeJob(e, job)}
                      className="p-1.5 text-[#001145] hover:bg-[#e4f0ff] rounded-full transition-colors"
                      title="Analyze with AI"
                    >
                      <Sparkles size={18} />
                    </button>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${job.type === 'full-time' ? 'bg-[#e4f0ff] text-[#001145]' : 'bg-[#e4f0ff] text-[#001145]'
                      }`}>{job.type === 'full-time' ? 'Full-time' : 'Internship'}</span>
                  </div>
                </div>

                <p className="text-gray-600 flex items-center gap-2 mb-2"><Building2 size={14} />{job.company}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  {job.location && <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>}
                  <span className="flex items-center gap-1"><DollarSign size={14} />{job.salary}</span>
                  <span className="flex items-center gap-1"><Clock size={14} />{formatDate(job.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skillsRequired.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-[#e4f0ff] text-[#001145] rounded text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            {selectedJob ? (
              <div className="bg-white rounded-xl p-6 sticky top-6 border border-[#e4f0ff]">
                <h2 className="text-2xl font-bold text-[#001145] mb-1">{selectedJob.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{selectedJob.company}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[{ label: 'Location', value: selectedJob.location }, { label: 'Salary', value: selectedJob.salary },
                  { label: 'Experience', value: selectedJob.experienceLevel }, { label: 'Deadline', value: selectedJob.deadline }]
                    .map((item) => (
                      <div key={item.label} className="bg-[#e4f0ff] rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="font-medium text-[#001145]">{item.value || 'Not specified'}</p>
                      </div>
                    ))}
                </div>
                <div className="mb-6">
                  <h3 className="font-bold text-[#001145] mb-2">Description</h3>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>
                <div className="mb-6">
                  <h3 className="font-bold text-[#001145] mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skillsRequired.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-[#e4f0ff] text-[#001145] rounded font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
                <Button className="w-full" leftIcon={<ExternalLink size={18} />}>Apply Now</Button>
              </div>
            ) : (
              <div className="bg-[#e4f0ff] rounded-xl p-12 text-center border-2 border-dashed border-[#001145]/20">
                <Briefcase className="w-12 h-12 text-[#001145]/30 mx-auto mb-4" />
                <p className="text-gray-500">Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
      <AIAnalysisModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        loading={isAnalyzing}
        analysis={aiAnalysis}
        title={`Job Fit Analysis: ${analyzingJobTitle}`}
      />
    </div>
  );
}
