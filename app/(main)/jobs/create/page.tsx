"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { Button, Card, Input, Textarea, Select, Badge } from '@/components/ui';
import { createJob, CreateJobData } from '@/src/api/jobs';

// Local form data type extending the keys we need
// Local form data type extending the keys we need
interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  skills: string[];
  benefits: string[];
  experience: string;
  deadline: string;
}

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' }, // Corrected to lowercase for backend
  { value: 'internship', label: 'Internship' }, // Corrected to lowercase
  { value: 'part-time', label: 'Part-time' }, // Mapped to full-time or handles later? Backend only supports full-time/internship.
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' },
];

const EXPERIENCE_LEVELS = [
  { value: 'Fresher', label: 'Fresher / Entry Level' },
  { value: '1-2 years', label: '1-2 years' },
  { value: '2-5 years', label: '2-5 years' },
  { value: '5+ years', label: '5+ years' },
  { value: '10+ years', label: '10+ years' },
];

export default function CreateJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // Use local interface for state
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: 'full-time', // Default to valid backend enum
    salary: '',
    description: '',
    skills: [],
    benefits: [],
    experience: '',
    deadline: '',
  });

  const updateField = (field: keyof JobFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      updateField('skills', [...formData.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    updateField('skills', formData.skills.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Description is just description now
      let richDescription = formData.description;
      
      // Map strict backend types
      // Backend only accepts 'full-time' | 'internship'
      // Parse other types to 'full-time' or handle appropriately (maybe append to description)
      let backendType: 'full-time' | 'internship' = 'full-time';
      if (formData.type === 'internship') {
        backendType = 'internship';
      } else {
         // If it's contract/part-time/remote, set as full-time but mention in desc
         if (formData.type !== 'full-time') {
             richDescription = `**${formData.type} Role**\n\n` + richDescription;
         }
         backendType = 'full-time';
      }

      const apiPayload: CreateJobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: backendType,
        description: richDescription,
        skillsRequired: formData.skills,
        salary: formData.salary,
        experienceLevel: formData.experience,
        deadline: formData.deadline,
        isOpen: true
      };

      await createJob(apiPayload);
      router.push('/jobs');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create job. Please ensure your profile is complete.");
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = formData.title && formData.company && formData.location && formData.type;
  const isStep2Valid = formData.description;
  const isStep3Valid = formData.skills.length > 0 && formData.experience;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-[#001145]">Post a Job</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(s)}
              className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors ${
                step === s ? 'bg-[#001145] text-white' : step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s ? <Check size={18} /> : s}
            </button>
            {s < 4 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <h2 className="font-bold text-[#001145] mb-6">Basic Information</h2>
          <div className="space-y-4">
            <Input label="Job Title *" value={formData.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. Senior Software Engineer" />
            <Input label="Company Name *" value={formData.company} onChange={(e) => updateField('company', e.target.value)} placeholder="e.g. Google" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Location *" value={formData.location} onChange={(e) => updateField('location', e.target.value)} placeholder="e.g. Bangalore, India" />
              <Select label="Job Type *" options={JOB_TYPES} value={formData.type} onChange={(e) => updateField('type', e.target.value)} />
            </div>
            <Input label="Salary Range" value={formData.salary || ''} onChange={(e) => updateField('salary', e.target.value)} placeholder="e.g. ₹15-25 LPA" />
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(2)} disabled={!isStep1Valid}>Next</Button>
          </div>
        </Card>
      )}

      {/* Step 2: Description (Requirements removed as per feedback) */}
      {step === 2 && (
        <Card>
          <h2 className="font-bold text-[#001145] mb-6">Job Description</h2>
          <div className="space-y-6">
            <Textarea label="Description *" rows={10} value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Describe the role, requirements, and responsibilities..." />
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} disabled={!isStep2Valid}>Next</Button>
          </div>
        </Card>
      )}

      {/* Step 3: Skills & Experience */}
      {step === 3 && (
        <Card>
          <h2 className="font-bold text-[#001145] mb-6">Skills & Experience</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#001145] mb-2">Required Skills *</label>
              <div className="flex gap-2 mb-3">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <Button variant="outline" onClick={addSkill}><Plus size={18} /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500"><Trash2 size={12} /></button>
                  </Badge>
                ))}
              </div>
            </div>
            <Select label="Experience Level *" options={EXPERIENCE_LEVELS} value={formData.experience} onChange={(e) => updateField('experience', e.target.value)} />
            <Input label="Application Deadline" type="date" value={formData.deadline || ''} onChange={(e) => updateField('deadline', e.target.value)} />
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)} disabled={!isStep3Valid}>Next</Button>
          </div>
        </Card>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <Card>
          <h2 className="font-bold text-[#001145] mb-6">Preview & Publish</h2>
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <h3 className="text-xl font-bold text-[#001145]">{formData.title}</h3>
              <p className="text-gray-600">{formData.company} • {formData.location}</p>
              <div className="flex gap-2 mt-2">
                <Badge>{formData.type}</Badge>
                {formData.salary && <Badge variant="success">{formData.salary}</Badge>}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-[#001145]">Description</h4>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{formData.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-[#001145]">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {formData.skills.map((skill) => <Badge key={skill} size="sm">{skill}</Badge>)}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleSubmit} isLoading={submitting}>Publish Job</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
