"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Linkedin, Github, Twitter, Globe, Mail, MapPin, Phone,
    Briefcase, GraduationCap, Award, Edit, Calendar,
    Clock, Star, Users, MessageCircle, ChevronRight
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '@/components/ui';
import { MY_PROFILE, AlumniProfileComplete } from '@/src/data/mockData';
import { verifyAlumni } from '@/src/api/auth';
import { getAlumniProfile } from '@/src/api/alumni';

export default function MyProfilePage() {
    const [profile, setProfile] = useState<AlumniProfileComplete>(MY_PROFILE);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = ['Overview', 'Experience', 'Education', 'Skills', 'Achievements', 'Activity'];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const authData = await verifyAlumni();
                const payload: any = (authData as any)?.data ?? authData;
                const userId = payload?.user?.id || payload?.user?._id || payload?.id;

                if (userId) {
                    const profileData = await getAlumniProfile(userId);
                    setProfile({ ...MY_PROFILE, ...profileData } as AlumniProfileComplete);
                }
            } catch (err) {
                console.log('Using mock profile data');
                setProfile(MY_PROFILE);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <LoadingSpinner fullScreen text="Loading your profile..." />;

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="space-y-6">
            {/* Profile Header Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
                <div className="h-32 relative bg-gradient-to-r from-[#001145] to-[#001439]">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-8 w-24 h-24 rounded-full bg-white/20" />
                        <div className="absolute bottom-0 left-1/4 w-32 h-32 rounded-full bg-white/10" />
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row gap-6 -mt-12 relative">
                        {/* Avatar + Social Links */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white flex-shrink-0">
                                {profile.avatarUrl ? (
                                    <Image src={profile.avatarUrl} alt={profile.name} width={112} height={112} className="object-cover w-full h-full" priority />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white bg-[#001145]">
                                        {getInitials(profile.name)}
                                    </div>
                                )}
                            </div>
                            {/* Social Links Below Avatar */}
                            <div className="flex items-center gap-2 mt-3">
                                {profile.socials.linkedin && (
                                    <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#e4f0ff] flex items-center justify-center hover:bg-[#d4e4f7] transition-colors">
                                        <Linkedin size={18} className="text-[#0077b5]" />
                                    </a>
                                )}
                                {profile.socials.github && (
                                    <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#e4f0ff] flex items-center justify-center hover:bg-[#d4e4f7] transition-colors">
                                        <Github size={18} className="text-gray-700" />
                                    </a>
                                )}
                                {profile.socials.twitter && (
                                    <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#e4f0ff] flex items-center justify-center hover:bg-[#d4e4f7] transition-colors">
                                        <Twitter size={18} className="text-[#1da1f2]" />
                                    </a>
                                )}
                                {profile.socials.portfolio && (
                                    <a href={profile.socials.portfolio} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#e4f0ff] flex items-center justify-center hover:bg-[#d4e4f7] transition-colors">
                                        <Globe size={18} className="text-[#001145]" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 pt-4 md:pt-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-2xl md:text-3xl font-bold text-[#001145]">{profile.name}</h1>
                                        {profile.isVerified && <Badge variant="success">✓ Verified Alumni</Badge>}
                                    </div>
                                    <p className="text-lg mt-1 text-[#4a5f7c]">{profile.currentRole} at {profile.currentCompany}</p>
                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#7088aa]">
                                        {profile.location && <span className="flex items-center gap-1"><MapPin size={14} />{profile.location}</span>}
                                        <span className="flex items-center gap-1"><GraduationCap size={14} />{profile.degree} • {profile.gradYear}</span>
                                        <span className="flex items-center gap-1"><Mail size={14} />{profile.email}</span>
                                    </div>
                                </div>
                                <Link href="/profile/edit">
                                    <Button leftIcon={<Edit size={18} />}>Edit Profile</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab
                                ? 'bg-[#001145] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bio */}
                        <Card className="bg-[#e4f0ff] border-0">
                            <h3 className="font-bold text-lg mb-3 text-[#001145]">About</h3>
                            <p className="leading-relaxed text-[#4a5f7c]">{profile.bio}</p>
                        </Card>

                        {/* Quick Experience */}
                        <Card className="bg-[#e4f0ff] border-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-[#001145]">Experience</h3>
                                <button onClick={() => setActiveTab('Experience')} className="text-sm font-medium flex items-center gap-1 text-[#7088aa]">
                                    View all <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {profile.experiences.slice(0, 2).map((exp) => (
                                    <div key={exp.id} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                                            <Briefcase size={20} className="text-[#001145]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#001145]">{exp.role}</h4>
                                            <p className="text-[#4a5f7c]">{exp.company}</p>
                                            <p className="text-sm text-[#7088aa]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Skills Preview */}
                        <Card className="bg-[#e4f0ff] border-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-[#001145]">Skills</h3>
                                <button onClick={() => setActiveTab('Skills')} className="text-sm font-medium flex items-center gap-1 text-[#7088aa]">
                                    View all <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.slice(0, 8).map((skill) => (
                                    <span key={skill} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-[#001145]">
                                        {skill}
                                    </span>
                                ))}
                                {profile.skills.length > 8 && (
                                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#a8bdda] text-[#001145]">
                                        +{profile.skills.length - 8} more
                                    </span>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <Card className="bg-[#e4f0ff] border-0">
                            <h3 className="font-bold text-lg mb-4 text-[#001145]">Contact</h3>
                            <div className="space-y-3">
                                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-sm text-[#4a5f7c] hover:underline">
                                    <Mail size={16} className="text-[#7088aa]" /> {profile.email}
                                </a>
                                {profile.phone && (
                                    <a href={`tel:${profile.phone}`} className="flex items-center gap-3 text-sm text-[#4a5f7c] hover:underline">
                                        <Phone size={16} className="text-[#7088aa]" /> {profile.phone}
                                    </a>
                                )}
                                {profile.location && (
                                    <span className="flex items-center gap-3 text-sm text-[#4a5f7c]">
                                        <MapPin size={16} className="text-[#7088aa]" /> {profile.location}
                                    </span>
                                )}
                            </div>
                        </Card>

                        {/* Alumni Relation */}
                        <Card className="bg-[#e4f0ff] border-0">
                            <h3 className="font-bold text-lg mb-4 text-[#001145]">Alumni Relation</h3>
                            <div className="space-y-2 text-sm text-[#4a5f7c]">
                                <p><strong>Department:</strong> {profile.alumniRelation.department}</p>
                                <p><strong>Faculty:</strong> {profile.alumniRelation.faculty}</p>
                                <p><strong>University:</strong> {profile.alumniRelation.university}</p>
                                <p><strong>Batch:</strong> {profile.alumniRelation.batch}</p>
                            </div>
                        </Card>

                        {/* Interests */}
                        <Card className="bg-[#e4f0ff] border-0">
                            <h3 className="font-bold text-lg mb-4 text-[#001145]">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.interests.map((interest) => (
                                    <span key={interest} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#001145]">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'Experience' && (
                <Card className="bg-[#e4f0ff] border-0">
                    <h3 className="font-bold text-xl mb-6 text-[#001145]">Work Experience</h3>
                    <div className="space-y-6">
                        {profile.experiences.map((exp, idx) => (
                            <div key={exp.id} className="flex gap-4 pb-6 border-b border-white/50 last:border-0 last:pb-0">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                                        <Briefcase size={24} className="text-[#001145]" />
                                    </div>
                                    {idx < profile.experiences.length - 1 && (
                                        <div className="absolute top-16 left-1/2 w-0.5 h-full -translate-x-1/2 bg-[#a8bdda]" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg text-[#001145]">{exp.role}</h4>
                                            <p className="font-medium text-[#4a5f7c]">{exp.company}</p>
                                        </div>
                                        {exp.current && <Badge variant="success">Current</Badge>}
                                    </div>
                                    <p className="text-sm mt-1 flex items-center gap-2 text-[#7088aa]">
                                        <Calendar size={14} /> {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        {exp.location && <><MapPin size={14} className="ml-2" /> {exp.location}</>}
                                    </p>
                                    {exp.description && <p className="mt-3 leading-relaxed text-[#4a5f7c]">{exp.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'Education' && (
                <Card className="bg-[#e4f0ff] border-0">
                    <h3 className="font-bold text-xl mb-6 text-[#001145]">Education</h3>
                    <div className="space-y-6">
                        {profile.education.map((edu) => (
                            <div key={edu.id} className="flex gap-4 pb-6 border-b border-white/50 last:border-0 last:pb-0">
                                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                                    <GraduationCap size={24} className="text-[#001145]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-[#001145]">{edu.degree} in {edu.field}</h4>
                                    <p className="font-medium text-[#4a5f7c]">{edu.institution}</p>
                                    <p className="text-sm mt-1 text-[#7088aa]">
                                        {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                                        {edu.grade && <span className="ml-4">• {edu.grade}</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'Skills' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-[#e4f0ff] border-0">
                        <h3 className="font-bold text-xl mb-4 text-[#001145]">Technical Skills</h3>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill) => (
                                <span key={skill} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#001145] shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Card>
                    <Card className="bg-[#e4f0ff] border-0">
                        <h3 className="font-bold text-xl mb-4 text-[#001145]">Interests & Expertise</h3>
                        <div className="flex flex-wrap gap-3">
                            {profile.interests.map((interest) => (
                                <span key={interest} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#001145] border border-[#a8bdda]">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'Achievements' && (
                <Card className="bg-[#e4f0ff] border-0">
                    <h3 className="font-bold text-xl mb-6 text-[#001145]">Achievements & Recognitions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.achievements.map((ach) => (
                            <div key={ach.id} className="p-5 rounded-xl bg-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#e4f0ff] flex items-center justify-center flex-shrink-0">
                                        {ach.type === 'award' && <Award size={24} className="text-amber-500" />}
                                        {ach.type === 'certification' && <Star size={24} className="text-green-500" />}
                                        {ach.type === 'publication' && <GraduationCap size={24} className="text-indigo-500" />}
                                        {ach.type === 'recognition' && <Users size={24} className="text-[#001145]" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#001145]">{ach.title}</h4>
                                        <p className="text-sm mt-1 text-[#4a5f7c]">{ach.description}</p>
                                        <p className="text-xs mt-2 flex items-center gap-1 text-[#7088aa]">
                                            <Calendar size={12} /> {ach.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'Activity' && (
                <Card className="bg-[#e4f0ff] border-0">
                    <h3 className="font-bold text-xl mb-6 text-[#001145]">Activity Timeline</h3>
                    <div className="space-y-4">
                        {profile.activities.map((act, idx) => (
                            <div key={act.id} className="flex gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                        {act.type === 'post' && <MessageCircle size={18} className="text-[#001145]" />}
                                        {act.type === 'event' && <Calendar size={18} className="text-amber-500" />}
                                        {act.type === 'connection' && <Users size={18} className="text-green-500" />}
                                        {act.type === 'job' && <Briefcase size={18} className="text-indigo-500" />}
                                        {act.type === 'achievement' && <Award size={18} className="text-red-500" />}
                                    </div>
                                    {idx < profile.activities.length - 1 && (
                                        <div className="absolute top-12 left-1/2 w-0.5 h-6 -translate-x-1/2 bg-white" />
                                    )}
                                </div>
                                <div className="flex-1 pb-4">
                                    <p className="font-medium text-[#4a5f7c]">{act.description}</p>
                                    <p className="text-xs mt-1 flex items-center gap-1 text-[#7088aa]">
                                        <Clock size={12} /> {act.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
