"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Linkedin, Mail, Edit, MapPin, Briefcase, GraduationCap, Users, MessageCircle, Star } from 'lucide-react';
import { Button, LoadingSpinner } from '@/components/ui';
import apiClient from '@/src/api/apiClient';

// Type for profile data from backend
interface ProfileDetails {
    graduationYear?: number;
    degreeUrl?: string;
    skills?: string[];
    designation?: string;
    company?: string;
    location?: string;
    phone?: string;
    linkedin?: string;
    branch?: string;
    bio?: string;
    isMentor?: boolean;
    mentorBio?: string;
    mentorExpertise?: string[];
}

interface ProfileData {
    _id: string;
    name: string;
    email: string;
    userType: string;
    collegeId: string;
    profileDetails?: ProfileDetails;
    karmaPoints?: number;
}

export default function MyProfilePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = ['Overview', 'Skills', 'Connections', 'Message'];

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await apiClient.get('/alumni/me');
                if (response.data.success && response.data.data) {
                    setProfile(response.data.data);
                } else {
                    setError("Failed to load profile");
                }
            } catch (err: any) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) return <LoadingSpinner fullScreen text="Loading profile..." />;
    
    if (error || !profile) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error || "Failed to load profile"}</p>
                    <Link href="/login">
                        <Button className="mt-4">Login Again</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const details = profile.profileDetails || {};
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="relative bg-[#e4f0ff] rounded-3xl overflow-hidden shadow-sm border border-[#e4f0ff]">
                <div className="absolute top-0 left-0 w-full h-32 bg-[#001145] opacity-5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="relative p-8 pt-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4 flex-shrink-0 z-10">
                            <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white bg-[#001145]">
                                    {getInitials(profile.name)}
                                </div>
                            </div>

                            {/* LinkedIn */}
                            {details.linkedin && (
                                <a href={details.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-[#001145] hover:bg-[#001145] hover:text-white transition-colors shadow-sm">
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 pt-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-black text-[#001145] tracking-tight">{profile.name}</h1>
                                    <div className="mt-2 flex flex-wrap gap-2 items-center text-[#001145]">
                                        {details.branch && <span className="font-semibold">{details.branch}</span>}
                                        {details.graduationYear && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-[#001145]/40"></span>
                                                <span>Class of {details.graduationYear}</span>
                                            </>
                                        )}
                                    </div>
                                    {(details.designation || details.company) && (
                                        <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 max-w-2xl">
                                            <p className="text-lg font-medium text-[#001145]">
                                                {details.designation} {details.company && <><span className="text-[#001145]/60">at</span> {details.company}</>}
                                            </p>
                                            {details.bio && (
                                                <p className="text-sm text-[#001145]/70 mt-1 italic">"{details.bio}"</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Link href="/profile/edit">
                                    <button className="bg-white hover:bg-[#001145] hover:text-white text-[#001145] px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm border border-white/50 flex items-center gap-2">
                                        <Edit size={16} /> Edit Profile
                                    </button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="mt-6 flex gap-8 flex-wrap">
                                {details.location && (
                                    <div>
                                        <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Location</p>
                                        <p className="font-semibold text-[#001145] flex items-center gap-1"><MapPin size={14} /> {details.location}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Email</p>
                                    <p className="font-semibold text-[#001145] flex items-center gap-1"><Mail size={14} /> {profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Karma Points</p>
                                    <div className="font-semibold text-[#001145] flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-[#001145] animate-pulse"></span>
                                        {profile.karmaPoints?.toLocaleString() || '0'}
                                    </div>
                                </div>
                                {details.isMentor && (
                                    <div>
                                        <p className="text-xs uppercase font-bold text-[#001145]/50 tracking-wider">Status</p>
                                        <p className="font-semibold text-green-600 flex items-center gap-1">✓ Mentor</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-[#e4f0ff] p-2 rounded-2xl sticky top-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 last:mb-0 flex items-center justify-between ${
                                    activeTab === tab
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-3xl p-8 border border-[#e4f0ff] min-h-[400px]">
                        {activeTab === 'Overview' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#e4f0ff]/50 p-6 rounded-2xl border border-[#e4f0ff]">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 text-[#001145] shadow-sm">
                                            <Briefcase size={20} />
                                        </div>
                                        <h3 className="font-bold text-[#001145] text-lg">Current Role</h3>
                                        <p className="mt-2 text-[#001145] font-medium">{details.designation || 'Not specified'}</p>
                                        <p className="text-sm text-[#001145]/70">{details.company || 'Company not specified'}</p>
                                    </div>

                                    <div className="bg-[#e4f0ff]/50 p-6 rounded-2xl border border-[#e4f0ff]">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 text-[#001145] shadow-sm">
                                            <GraduationCap size={20} />
                                        </div>
                                        <h3 className="font-bold text-[#001145] text-lg">Education</h3>
                                        <p className="mt-2 text-[#001145] font-medium">{details.branch || 'Branch not specified'}</p>
                                        <p className="text-sm text-[#001145]/70">Class of {details.graduationYear || 'N/A'}</p>
                                    </div>
                                </div>

                                {details.bio && (
                                    <div>
                                        <h3 className="text-xl font-bold text-[#001145] mb-4">About Me</h3>
                                        <p className="text-gray-600 leading-relaxed bg-[#f8fbff] p-6 rounded-2xl border border-[#e4f0ff]">
                                            {details.bio}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Skills' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-[#001145] mb-4 flex items-center gap-2">
                                    <Star size={20} /> Skills
                                </h3>
                                {details.skills && details.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {details.skills.map((skill: string, idx: number) => (
                                            <span key={idx} className="px-4 py-2 bg-[#e4f0ff] rounded-lg text-sm font-bold text-[#001145]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No skills added yet. <Link href="/profile/edit" className="text-[#001145] underline">Add skills</Link></p>
                                )}

                                {details.isMentor && details.mentorExpertise && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold text-[#001145] mb-4">Mentor Expertise</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {details.mentorExpertise.map((skill: string, idx: number) => (
                                                <span key={idx} className="px-4 py-2 bg-green-100 rounded-lg text-sm font-bold text-green-700">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'Connections' && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="w-20 h-20 bg-[#e4f0ff] rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <Users size={32} className="text-[#001145]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#001145]">My Network</h3>
                                <p className="text-[#001145]/60 mt-2 mb-6">Connect with alumni and grow your network.</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
