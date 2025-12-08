"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Linkedin, Github, Twitter, Globe, Mail, MapPin, Phone,
  Briefcase, GraduationCap, Award, Calendar, Clock, Star, Users,
  UserPlus, MessageSquare, Check, ChevronRight
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { MOCK_ALUMNI, AlumniProfileComplete } from '@/src/data/mockData';
import { getAlumniProfile } from '@/src/api/alumni';
import { sendConnectionRequest } from '@/src/api/connections';

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

export default function ViewProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<AlumniProfileComplete | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'pending' | 'none'>('none');

  const tabs = ['Overview', 'Experience', 'Education', 'Skills', 'Achievements', 'Activity'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try API first
        const data = await getAlumniProfile(id);
        const mockProfile = MOCK_ALUMNI.find(a => a.id === id);
        setProfile({ ...mockProfile, ...data } as AlumniProfileComplete);
        setConnectionStatus(mockProfile?.connectionStatus || 'none');
      } catch (error) {
        // Fallback to mock data
        const mockProfile = MOCK_ALUMNI.find(a => a.id === id);
        if (mockProfile) {
          setProfile(mockProfile);
          setConnectionStatus(mockProfile.connectionStatus);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(id);
      setConnectionStatus('pending');
    } catch (error) {
      setConnectionStatus('pending'); // Optimistic update even on error for demo
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (loading) return <LoadingSpinner fullScreen text="Loading profile..." />;
  if (!profile) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="text-center p-8">
        <h2 className="text-xl font-bold mb-2" style={{ color: theme.primary }}>Profile Not Found</h2>
        <p style={{ color: theme.tertiary }}>The profile you're looking for doesn't exist.</p>
        <Link href="/alumni" className="mt-4 inline-block">
          <Button>Browse Alumni Directory</Button>
        </Link>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bgLight }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Profile Header Card */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-36 relative" style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)` }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20" />
              <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-16 relative">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white flex-shrink-0">
                {profile.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt={profile.name} width={128} height={128} className="object-cover w-full h-full" priority />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: theme.primary }}>
                    {getInitials(profile.name)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 md:pt-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.primary }}>{profile.name}</h1>
                      {profile.isVerified && <Badge variant="success">✓ Verified</Badge>}
                    </div>
                    <p className="text-lg mt-1" style={{ color: theme.tertiary }}>{profile.currentRole} at {profile.currentCompany}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: theme.secondary }}>
                      {profile.location && <span className="flex items-center gap-1"><MapPin size={14} />{profile.location}</span>}
                      <span className="flex items-center gap-1"><GraduationCap size={14} />{profile.degree} • {profile.gradYear}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {connectionStatus === 'connected' ? (
                      <Button variant="secondary" leftIcon={<Check size={18} />}>Connected</Button>
                    ) : connectionStatus === 'pending' ? (
                      <Button variant="outline" leftIcon={<Clock size={18} />}>Pending</Button>
                    ) : (
                      <Button leftIcon={<UserPlus size={18} />} onClick={handleConnect}>Connect</Button>
                    )}
                    <Link href={`/messages?user=${id}`}>
                      <Button variant="outline" leftIcon={<MessageSquare size={18} />}>Message</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab ? 'text-white shadow-md' : 'text-gray-600 hover:bg-white hover:shadow'
                }`}
              style={activeTab === tab ? { backgroundColor: theme.primary } : { backgroundColor: 'white' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content - Overview */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h3 className="font-bold text-lg mb-3" style={{ color: theme.primary }}>About</h3>
                <p className="leading-relaxed" style={{ color: theme.tertiary }}>{profile.bio || 'No bio available.'}</p>
              </Card>

              {profile.experiences.length > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg" style={{ color: theme.primary }}>Experience</h3>
                    <button onClick={() => setActiveTab('Experience')} className="text-sm font-medium flex items-center gap-1" style={{ color: theme.secondary }}>
                      View all <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {profile.experiences.slice(0, 2).map((exp) => (
                      <div key={exp.id} className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.cardBg }}>
                          <Briefcase size={20} style={{ color: theme.primary }} />
                        </div>
                        <div>
                          <h4 className="font-bold" style={{ color: theme.primary }}>{exp.role}</h4>
                          <p style={{ color: theme.tertiary }}>{exp.company}</p>
                          <p className="text-sm" style={{ color: theme.secondary }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {profile.skills.length > 0 && (
                <Card>
                  <h3 className="font-bold text-lg mb-4" style={{ color: theme.primary }}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: theme.cardBg, color: theme.primary }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <h3 className="font-bold text-lg mb-4" style={{ color: theme.primary }}>Contact</h3>
                <div className="space-y-3">
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-sm hover:underline" style={{ color: theme.tertiary }}>
                    <Mail size={16} style={{ color: theme.secondary }} /> {profile.email}
                  </a>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-lg mb-4" style={{ color: theme.primary }}>Social Links</h3>
                <div className="space-y-2">
                  {profile.socials?.linkedin && (
                    <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-gray-50" style={{ color: theme.tertiary }}>
                      <Linkedin size={18} style={{ color: '#0077b5' }} /> LinkedIn
                    </a>
                  )}
                  {profile.socials?.github && (
                    <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-gray-50" style={{ color: theme.tertiary }}>
                      <Github size={18} style={{ color: '#333' }} /> GitHub
                    </a>
                  )}
                  {profile.socials?.twitter && (
                    <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-gray-50" style={{ color: theme.tertiary }}>
                      <Twitter size={18} style={{ color: '#1da1f2' }} /> Twitter
                    </a>
                  )}
                  {profile.socials?.portfolio && (
                    <a href={profile.socials.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-gray-50" style={{ color: theme.tertiary }}>
                      <Globe size={18} style={{ color: theme.primary }} /> Portfolio
                    </a>
                  )}
                  {!profile.socials?.linkedin && !profile.socials?.github && !profile.socials?.twitter && !profile.socials?.portfolio && (
                    <p className="text-sm" style={{ color: theme.secondary }}>No social links available</p>
                  )}
                </div>
              </Card>

              {profile.interests.length > 0 && (
                <Card>
                  <h3 className="font-bold text-lg mb-4" style={{ color: theme.primary }}>Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span key={interest} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: theme.cardBg, color: theme.primary }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'Experience' && (
          <Card>
            <h3 className="font-bold text-xl mb-6" style={{ color: theme.primary }}>Work Experience</h3>
            {profile.experiences.length === 0 ? (
              <p style={{ color: theme.secondary }}>No experience information available.</p>
            ) : (
              <div className="space-y-6">
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.cardBg }}>
                      <Briefcase size={24} style={{ color: theme.primary }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-lg" style={{ color: theme.primary }}>{exp.role}</h4>
                          <p className="font-medium" style={{ color: theme.tertiary }}>{exp.company}</p>
                        </div>
                        {exp.current && <Badge variant="success">Current</Badge>}
                      </div>
                      <p className="text-sm mt-1" style={{ color: theme.secondary }}>
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                      {exp.description && <p className="mt-3 leading-relaxed" style={{ color: theme.tertiary }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Education Tab */}
        {activeTab === 'Education' && (
          <Card>
            <h3 className="font-bold text-xl mb-6" style={{ color: theme.primary }}>Education</h3>
            {profile.education.length === 0 ? (
              <p style={{ color: theme.secondary }}>No education information available.</p>
            ) : (
              <div className="space-y-6">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.cardBg }}>
                      <GraduationCap size={24} style={{ color: theme.primary }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg" style={{ color: theme.primary }}>{edu.degree} in {edu.field}</h4>
                      <p className="font-medium" style={{ color: theme.tertiary }}>{edu.institution}</p>
                      <p className="text-sm mt-1" style={{ color: theme.secondary }}>
                        {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                        {edu.grade && <span className="ml-4">• {edu.grade}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Skills Tab */}
        {activeTab === 'Skills' && (
          <Card>
            <h3 className="font-bold text-xl mb-6" style={{ color: theme.primary }}>Skills & Expertise</h3>
            {profile.skills.length === 0 ? (
              <p style={{ color: theme.secondary }}>No skills listed.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <span key={skill} className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm" style={{ backgroundColor: theme.cardBg, color: theme.primary }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Achievements Tab */}
        {activeTab === 'Achievements' && (
          <Card>
            <h3 className="font-bold text-xl mb-6" style={{ color: theme.primary }}>Achievements</h3>
            {profile.achievements.length === 0 ? (
              <p style={{ color: theme.secondary }}>No achievements listed.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.achievements.map((ach) => (
                  <div key={ach.id} className="p-5 rounded-xl border" style={{ borderColor: theme.accent }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.cardBg }}>
                        {ach.type === 'award' && <Award size={24} style={{ color: '#f59e0b' }} />}
                        {ach.type === 'certification' && <Star size={24} style={{ color: '#10b981' }} />}
                        {ach.type === 'publication' && <GraduationCap size={24} style={{ color: '#6366f1' }} />}
                        {ach.type === 'recognition' && <Users size={24} style={{ color: theme.primary }} />}
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ color: theme.primary }}>{ach.title}</h4>
                        <p className="text-sm mt-1" style={{ color: theme.tertiary }}>{ach.description}</p>
                        <p className="text-xs mt-2" style={{ color: theme.secondary }}>{ach.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Activity Tab */}
        {activeTab === 'Activity' && (
          <Card>
            <h3 className="font-bold text-xl mb-6" style={{ color: theme.primary }}>Recent Activity</h3>
            {profile.activities.length === 0 ? (
              <p style={{ color: theme.secondary }}>No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {profile.activities.map((act) => (
                  <div key={act.id} className="flex gap-4 p-4 rounded-xl" style={{ backgroundColor: theme.bgLight }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.cardBg }}>
                      {act.type === 'post' && <MessageSquare size={18} style={{ color: theme.primary }} />}
                      {act.type === 'event' && <Calendar size={18} style={{ color: '#f59e0b' }} />}
                      {act.type === 'connection' && <Users size={18} style={{ color: '#10b981' }} />}
                      {act.type === 'job' && <Briefcase size={18} style={{ color: '#6366f1' }} />}
                      {act.type === 'achievement' && <Award size={18} style={{ color: '#ef4444' }} />}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: theme.tertiary }}>{act.description}</p>
                      <p className="text-xs mt-1" style={{ color: theme.secondary }}>{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

      </div>
    </div>
  );
}
