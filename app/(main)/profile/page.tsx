"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Github, Twitter, Globe, Mail, Edit, MapPin, Briefcase, GraduationCap, Users, MessageCircle, Activity, Star, Clock } from 'lucide-react';
import { Button, LoadingSpinner, Badge } from '@/components/ui';
import { MY_PROFILE, AlumniProfileComplete } from '@/src/data/mockData';

export default function MyProfilePage() {
    const [profile, setProfile] = useState<AlumniProfileComplete | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = ['Overview', 'Experience', 'Education', 'Connections', 'Message', 'Activities'];

    useEffect(() => {
        setTimeout(() => {
            setProfile(MY_PROFILE);
            setLoading(false);
        }, 300);
    }, []);

    if (loading || !profile) return <LoadingSpinner fullScreen text="Loading profile..." />;

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Creative Header Section */}
            <div className="relative bg-[#e4f0ff] rounded-3xl overflow-hidden shadow-sm border border-[#e4f0ff]">
                {/* Decorative Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-32 bg-[#001145] opacity-5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="relative p-8 pt-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Column */}
                        <div className="flex flex-col items-center gap-4 flex-shrink-0 z-10">
                            <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white rotate-3 hover:rotate-0 transition-transform duration-300">
                                {profile.avatarUrl ? (
                                    <Image src={profile.avatarUrl} alt={profile.name} width={160} height={160} className="object-cover w-full h-full" priority />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white bg-[#001145]">
                                        {getInitials(profile.name)}
                                    </div>
                                )}
                            </div>

                            {/* Social Pills */}
                            <div className="flex gap-2 justify-center flex-wrap max-w-[200px]">
                                {profile.socials?.linkedin && (
                                    <a href={profile.socials.linkedin} className="p-2 bg-white rounded-full text-[#001145] hover:bg-[#001145] hover:text-white transition-colors shadow-sm">
                                        <Linkedin size={18} />
                                    </a>
                                )}
                                {profile.socials?.github && (
                                    <a href={profile.socials.github} className="p-2 bg-white rounded-full text-[#001145] hover:bg-[#001145] hover:text-white transition-colors shadow-sm">
                                        <Github size={18} />
                                    </a>
                                )}
                                {profile.socials?.twitter && (
                                    <a href={profile.socials.twitter} className="p-2 bg-white rounded-full text-[#001145] hover:bg-[#001145] hover:text-white transition-colors shadow-sm">
                                        <Twitter size={18} />
                                    </a>
                                )}
                                {profile.socials?.portfolio && (
                                    <a href={profile.socials.portfolio} className="p-2 bg-white rounded-full text-[#001145] hover:bg-[#001145] hover:text-white transition-colors shadow-sm">
                                        <Globe size={18} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="flex-1 pt-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-black text-[#001145] tracking-tight">{profile.name}</h1>
                                    <div className="mt-2 flex flex-wrap gap-2 items-center text-[#001145]">
                                        <span className="font-semibold">{profile.degree}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#001145]/40"></span>
                                        <span className="font-medium">{profile.major}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#001145]/40"></span>
                                        <span>{profile.gradYear}</span>
                                    </div>
                                    <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 max-w-2xl">
                                        <p className="text-lg font-medium text-[#001145]">
                                            {profile.currentRole} <span className="text-[#001145]/60">at</span> {profile.currentCompany}
                                        </p>
                                        <p className="text-sm text-[#001145]/70 mt-1 italic">
                                            "{profile.bio}"
                                        </p>
                                    </div>
                                </div>
                                <Link href="/profile/edit">
                                    <button className="bg-white hover:bg-[#001145] hover:text-white text-[#001145] px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm border border-white/50 flex items-center gap-2">
                                        <Edit size={16} /> Edit Profile
                                    </button>
                                </Link>
                            </div>

                            {/* Stats / Quick Info */}
                            <div className="mt-6 flex gap-8">
                                <div>
                                    <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Location</p>
                                    <p className="font-semibold text-[#001145] flex items-center gap-1"><MapPin size={14} /> {profile.location || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Email</p>
                                    <p className="font-semibold text-[#001145] flex items-center gap-1"><Mail size={14} /> {profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Faculty</p>
                                    <p className="font-semibold text-[#001145]">{profile.alumniRelation.faculty}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Karma Points</p>
                                    <div className="font-semibold text-[#001145] flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                        {profile.karmaPoints ? profile.karmaPoints.toLocaleString() : '0'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Navigation Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-[#e4f0ff] p-2 rounded-2xl sticky top-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 last:mb-0 flex items-center justify-between group ${activeTab === tab
                                    ? 'bg-white text-[#001145] shadow-sm'
                                    : 'text-[#001145]/60 hover:bg-white/50 hover:text-[#001145]'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && <div className="w-1.5 h-1.5 rounded-full bg-[#001145]"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-3xl p-8 border border-[#e4f0ff] min-h-[500px]">

                        {activeTab === 'Overview' && (
                            <div className="space-y-8">
                                {/* Highlight Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#e4f0ff]/50 p-6 rounded-2xl border border-[#e4f0ff]">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 text-[#001145] shadow-sm">
                                            <Star size={20} fill="#001145" className="text-[#001145]" />
                                        </div>
                                        <h3 className="font-bold text-[#001145] text-lg">Areas of Interest</h3>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {profile.interests.map(i => (
                                                <span key={i} className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-[#001145] border border-[#e4f0ff]">
                                                    {i}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-[#e4f0ff]/50 p-6 rounded-2xl border border-[#e4f0ff]">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 text-[#001145] shadow-sm">
                                            <GraduationCap size={20} />
                                        </div>
                                        <h3 className="font-bold text-[#001145] text-lg">Education Highlight</h3>
                                        <p className="mt-2 text-[#001145] font-medium">{profile.degree} in {profile.major}</p>
                                        <p className="text-sm text-[#001145]/70">{profile.alumniRelation.university}</p>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div>
                                    <h3 className="text-xl font-bold text-[#001145] mb-4">About Me</h3>
                                    <p className="text-gray-600 leading-relaxed bg-[#f8fbff] p-6 rounded-2xl border border-[#e4f0ff]">
                                        {profile.bio}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Experience' && (
                            <div className="space-y-8 relative">
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#e4f0ff]"></div>
                                {profile.experiences.map((exp, idx) => (
                                    <div key={exp.id} className="relative pl-12 group">
                                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-4 border-[#e4f0ff] flex items-center justify-center z-10 group-hover:border-[#001145] transition-colors">
                                            <Briefcase size={12} className="text-[#001145]" />
                                        </div>
                                        <div className="bg-[#f8fbff] p-6 rounded-2xl border border-[#e4f0ff] hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-xl text-[#001145]">{exp.role}</h3>
                                                    <p className="font-medium text-[#001145]/80">{exp.company}</p>
                                                </div>
                                                {exp.current && <span className="bg-[#e4f0ff] text-[#001145] px-3 py-1 rounded-full text-xs font-bold">Current</span>}
                                            </div>
                                            <p className="text-sm text-[#001145]/50 mb-4 flex items-center gap-1 font-medium">
                                                <Clock size={14} /> {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                                            </p>
                                            <p className="text-gray-600 leading-relaxed text-sm">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'Education' && (
                            <div className="grid gap-4">
                                {profile.education.map((edu) => (
                                    <div key={edu.id} className="flex gap-6 items-center bg-[#f8fbff] p-6 rounded-2xl border border-[#e4f0ff] hover:bg-[#e4f0ff]/30 transition-colors">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#001145] shadow-sm border border-[#e4f0ff] flex-shrink-0">
                                            <GraduationCap size={32} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-[#001145]">{edu.degree} <span className="text-[#001145]/60 font-normal">in</span> {edu.field}</h3>
                                            <p className="text-[#001145] font-medium mt-1">{edu.institution}</p>
                                            <p className="text-sm text-[#001145]/50 mt-2 font-bold">{edu.startYear} - {edu.endYear}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'Connections' && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="w-20 h-20 bg-[#e4f0ff] rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <Users size={32} className="text-[#001145]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#001145]">My Network</h3>
                                <p className="text-[#001145]/60 mt-2 mb-6">You have a growing network of alumni.</p>
                                <Link href="/connections">
                                    <Button>Manage Connections</Button>
                                </Link>
                            </div>
                        )}

                        {activeTab === 'Message' && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="w-20 h-20 bg-[#e4f0ff] rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle size={32} className="text-[#001145]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#001145]">Messages</h3>
                                <p className="text-[#001145]/60 mt-2 mb-6">Check your inbox for new opportunities.</p>
                                <Link href="/messages">
                                    <Button>Go to Inbox</Button>
                                </Link>
                            </div>
                        )}

                        {activeTab === 'Activities' && (
                            <div className="space-y-4">
                                {profile.activities?.map((act) => (
                                    <div key={act.id} className="flex gap-4 items-center p-4 rounded-xl hover:bg-[#f8fbff] transition-colors border border-transparent hover:border-[#e4f0ff]">
                                        <div className="w-10 h-10 rounded-full bg-[#e4f0ff] flex items-center justify-center flex-shrink-0">
                                            <Activity size={16} className="text-[#001145]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#001145]">{act.description}</p>
                                            <p className="text-xs font-bold text-[#001145]/40 mt-1 uppercase tracking-wide">{act.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
