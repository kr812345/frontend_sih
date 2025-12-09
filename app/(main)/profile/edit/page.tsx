"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, ArrowLeft, Plus, Trash2, Camera, Check, AlertCircle } from 'lucide-react';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { walletApi } from '@/src/api/wallet';
import { showSuccess, showError } from '@/src/lib/toast';
import { MY_PROFILE, AlumniProfileComplete, Achievement } from '@/src/data/mockData';

// Sarthak Light Theme Colors
const theme = {
  primary: '#001145',
  primaryDark: '#001439',
  secondary: '#7088aa',
  tertiary: '#4a5f7c',
  accent: '#a8bdda',
  bgLight: '#f6faff',
  cardBg: '#e4f0ff',
};

interface ValidationErrors {
  [key: string]: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [profile, setProfile] = useState<AlumniProfileComplete>(MY_PROFILE);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'work', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'social', label: 'Social Links' },
  ];

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfile(MY_PROFILE);
      setLoading(false);
    }, 500);
  }, []);

  // Validation functions
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === 'email' && value && !validateEmail(value)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (field === 'email') {
      delete newErrors.email;
    }

    if (field.includes('linkedin') || field.includes('github') || field.includes('twitter') || field.includes('portfolio')) {
      if (value && !validateUrl(value)) {
        newErrors[field] = 'Please enter a valid URL';
      } else {
        delete newErrors[field];
      }
    }

    setErrors(newErrors);
  };

  const handleSave = async () => {
    // Validate required fields
    const newErrors: ValidationErrors = {};
    if (!profile.name) newErrors.name = 'Name is required';
    if (!profile.email) newErrors.email = 'Email is required';
    else if (!validateEmail(profile.email)) newErrors.email = 'Please enter a valid email';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reward for updating social links
    if (activeSection === 'social') {
      try {
        // Rewarding 20 coins for updating social profile
        if (profile.id) {
          await walletApi.rewardCoin(profile.id, 20, 'Updated social profile');
          showSuccess('Profile updated! You earned 20 coins 🎉');
        } else {
           showSuccess('Profile updated successfully!');
        }
      } catch (error) {
        console.error('Error rewarding coins:', error);
        showSuccess('Profile updated successfully!');
      }
    } else {
        // Only show success for other sections (no reward) or if reward failed silently
        // But wait, the reward block above handles success message for social.
        // We need to handle non-social updates.
    }
    
    if (activeSection !== 'social') {
        showSuccess('Profile updated successfully!');
    }

    setSaving(false);
    setSaved(true);

    // Show success message for 2 seconds then redirect
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  };

  const updateField = (field: string, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string') {
      validateField(field, value);
    }
    setSaved(false);
  };

  const updateSocial = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, socials: { ...prev.socials, [field]: value } }));
    validateField(`socials.${field}`, value);
    setSaved(false);
  };

  const addExperience = () => {
    const newExp = { id: Date.now().toString(), company: '', role: '', startDate: '', current: false, description: '' };
    setProfile(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp),
    }));
    setSaved(false);
  };

  const removeExperience = (id: string) => {
    setProfile(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }));
  };

  const addEducation = () => {
    const newEdu = { id: Date.now().toString(), institution: '', degree: '', field: '', startYear: new Date().getFullYear(), current: false };
    setProfile(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: string, value: string | number | boolean) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu),
    }));
    setSaved(false);
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const addAchievement = () => {
    const newAch: Achievement = { id: Date.now().toString(), title: '', description: '', date: '', type: 'award' };
    setProfile(prev => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  };

  const updateAchievement = (id: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      achievements: prev.achievements.map(ach => ach.id === id ? { ...ach, [field]: value } : ach),
    }));
    setSaved(false);
  };

  const removeAchievement = (id: string) => {
    setProfile(prev => ({ ...prev, achievements: prev.achievements.filter(ach => ach.id !== id) }));
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (loading) return <LoadingSpinner fullScreen text="Loading profile..." />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bgLight }}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg transition-colors" style={{ color: theme.tertiary }}>
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: theme.primary }}>Edit Profile</h1>
              <p className="text-sm" style={{ color: theme.secondary }}>Update your profile information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <Check size={18} /> Saved successfully!
              </span>
            )}
            <Button onClick={handleSave} isLoading={saving} leftIcon={<Save size={18} />}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeSection === section.id ? 'text-white shadow-md' : 'text-gray-600 hover:bg-white hover:shadow'
                }`}
              style={activeSection === section.id ? { backgroundColor: theme.primary } : { backgroundColor: 'white' }}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Avatar Upload Section */}
        {activeSection === 'personal' && (
          <Card className="overflow-visible">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-lg" style={{ borderColor: theme.accent }}>
                  {profile.avatarUrl ? (
                    <Image src={profile.avatarUrl} alt={profile.name} width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: theme.primary }}>
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border" style={{ borderColor: theme.accent }}>
                  <Camera size={16} style={{ color: theme.primary }} />
                </button>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: theme.primary }}>Profile Photo</h3>
                <p className="text-sm" style={{ color: theme.secondary }}>Click to upload a new photo</p>
              </div>
            </div>
          </Card>
        )}

        {/* Personal Info */}
        {activeSection === 'personal' && (
          <Card>
            <h3 className="font-bold text-lg mb-6" style={{ color: theme.primary }}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Full Name *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                  style={{ borderColor: errors.name ? undefined : theme.accent }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Email *</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Wallet ID (Metamask/Web3)</label>
                <input
                  type="text"
                  value={profile.walletId || ''}
                  onChange={(e) => updateField('walletId', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono text-sm"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Phone</label>
                <input type="tel" value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Location</label>
                <input type="text" value={profile.location} onChange={(e) => updateField('location', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Current Role</label>
                <input type="text" value={profile.currentRole} onChange={(e) => updateField('currentRole', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Current Company</label>
                <input type="text" value={profile.currentCompany} onChange={(e) => updateField('currentCompany', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Bio</label>
                <textarea rows={4} value={profile.bio} onChange={(e) => updateField('bio', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" placeholder="Tell us about yourself..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Interests (comma-separated)</label>
                <input type="text" value={profile.interests.join(', ')} onChange={(e) => updateField('interests', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Machine Learning, Web Development, Open Source" />
              </div>
            </div>
          </Card>
        )}

        {/* Work Experience */}
        {activeSection === 'work' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: theme.primary }}>Work Experience</h3>
              <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={addExperience}>Add Experience</Button>
            </div>
            <div className="space-y-6">
              {profile.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-5 rounded-xl space-y-4" style={{ backgroundColor: theme.bgLight }}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold" style={{ color: theme.primary }}>Experience #{idx + 1}</h4>
                    <button onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Company</label>
                      <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Role</label>
                      <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Start Date</label>
                      <input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>End Date</label>
                      <input type="month" value={exp.endDate || ''} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: theme.tertiary }}>
                    <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="rounded" />
                    Currently working here
                  </label>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Description</label>
                    <textarea rows={2} value={exp.description || ''} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                  </div>
                </div>
              ))}
              {profile.experiences.length === 0 && (
                <p className="text-center py-8" style={{ color: theme.secondary }}>No work experience added yet. Click "Add Experience" to get started.</p>
              )}
            </div>
          </Card>
        )}

        {/* Education */}
        {activeSection === 'education' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: theme.primary }}>Education</h3>
              <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={addEducation}>Add Education</Button>
            </div>
            <div className="space-y-6">
              {profile.education.map((edu, idx) => (
                <div key={edu.id} className="p-5 rounded-xl space-y-4" style={{ backgroundColor: theme.bgLight }}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold" style={{ color: theme.primary }}>Education #{idx + 1}</h4>
                    <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Institution</label>
                      <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Degree</label>
                      <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Field of Study</label>
                      <input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Start Year</label>
                      <input type="number" value={edu.startYear} onChange={(e) => updateEducation(edu.id, 'startYear', parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>End Year</label>
                      <input type="number" value={edu.endYear || ''} onChange={(e) => updateEducation(edu.id, 'endYear', parseInt(e.target.value))} disabled={edu.current} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: theme.tertiary }}>
                    <input type="checkbox" checked={edu.current} onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)} className="rounded" />
                    Currently studying here
                  </label>
                </div>
              ))}
              {profile.education.length === 0 && (
                <p className="text-center py-8" style={{ color: theme.secondary }}>No education added yet.</p>
              )}
            </div>
          </Card>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <Card>
            <h3 className="font-bold text-lg mb-6" style={{ color: theme.primary }}>Skills & Expertise</h3>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Skills (comma-separated)</label>
              <textarea rows={3} value={profile.skills.join(', ')} onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" placeholder="React, Node.js, Python, AWS, System Design" />
            </div>
            <div className="mt-4">
              <p className="text-sm mb-3" style={{ color: theme.tertiary }}>Current Skills:</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2" style={{ backgroundColor: theme.cardBg, color: theme.primary }}>
                    {skill}
                    <button onClick={() => updateField('skills', profile.skills.filter(s => s !== skill))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Achievements */}
        {activeSection === 'achievements' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: theme.primary }}>Achievements & Recognitions</h3>
              <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={addAchievement}>Add Achievement</Button>
            </div>
            <div className="space-y-6">
              {profile.achievements.map((ach, idx) => (
                <div key={ach.id} className="p-5 rounded-xl space-y-4" style={{ backgroundColor: theme.bgLight }}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold" style={{ color: theme.primary }}>Achievement #{idx + 1}</h4>
                    <button onClick={() => removeAchievement(ach.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Title</label>
                      <input type="text" value={ach.title} onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Type</label>
                      <select value={ach.type} onChange={(e) => updateAchievement(ach.id, 'type', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                        <option value="award">Award</option>
                        <option value="certification">Certification</option>
                        <option value="publication">Publication</option>
                        <option value="recognition">Recognition</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Date</label>
                      <input type="month" value={ach.date} onChange={(e) => updateAchievement(ach.id, 'date', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Description</label>
                      <textarea rows={2} value={ach.description} onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
              {profile.achievements.length === 0 && (
                <p className="text-center py-8" style={{ color: theme.secondary }}>No achievements added yet.</p>
              )}
            </div>
          </Card>
        )}

        {/* Social Links */}
        {activeSection === 'social' && (
          <Card>
            <h3 className="font-bold text-lg mb-6" style={{ color: theme.primary }}>Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>LinkedIn URL</label>
                <input type="url" value={profile.socials.linkedin || ''} onChange={(e) => updateSocial('linkedin', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>GitHub URL</label>
                <input type="url" value={profile.socials.github || ''} onChange={(e) => updateSocial('github', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Twitter URL</label>
                <input type="url" value={profile.socials.twitter || ''} onChange={(e) => updateSocial('twitter', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="https://twitter.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.tertiary }}>Portfolio URL</label>
                <input type="url" value={profile.socials.portfolio || ''} onChange={(e) => updateSocial('portfolio', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
