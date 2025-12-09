"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronRight } from 'lucide-react';

// Memory images from public folder
const MEMORY_IMAGES = [
    '/Screenshot 2025-12-09 091511.png',
    '/Screenshot 2025-12-09 091527.png',
    '/Screenshot 2025-12-09 091532.png',
    '/Screenshot 2025-12-09 093822.png',
    '/Screenshot 2025-12-09 091537.png',
    '/Screenshot 2025-12-09 091551.png',
    '/Screenshot 2025-12-09 093830.png',
    '/Screenshot 2025-12-09 091611.png',
    '/Screenshot 2025-12-09 091619.png',
    '/Screenshot 2025-12-09 093840.png',
    '/Screenshot 2025-12-09 091627.png',
    '/Screenshot 2025-12-09 091649.png',
    '/Screenshot 2025-12-09 093900.png',
    '/Screenshot 2025-12-09 091701.png',
    '/Screenshot 2025-12-09 091709.png',
    '/Screenshot 2025-12-09 093907.png',
    '/Screenshot 2025-12-09 091714.png',
    '/Screenshot 2025-12-09 091721.png',
];

// Mock memories data with month information for filtering
const ALL_MEMORIES = [
    { id: '1', title: 'Farewell 2023', year: '2023', month: 12, batch: 'All', event: 'Farewell', image: MEMORY_IMAGES[0] },
    { id: '2', title: 'Tech Fest 2022', year: '2022', month: 12, batch: 'All', event: 'Tech Fest', image: MEMORY_IMAGES[1] },
    { id: '3', title: 'Cultural Night 2021', year: '2021', month: 12, batch: '2022', event: 'Cultural', image: MEMORY_IMAGES[2] },
    { id: '4', title: 'Annual Day 2020', year: '2020', month: 12, batch: 'All', event: 'Annual Day', image: MEMORY_IMAGES[3] },
    { id: '5', title: 'Winter Fest 2023', year: '2023', month: 12, batch: '2024', event: 'Winter Fest', image: MEMORY_IMAGES[4] },
    { id: '6', title: 'Convocation 2022', year: '2022', month: 12, batch: '2022', event: 'Graduation', image: MEMORY_IMAGES[5] },
    { id: '7', title: 'Project Exhibition 2021', year: '2021', month: 12, batch: 'All', event: 'Exhibition', image: MEMORY_IMAGES[6] },
    { id: '8', title: 'Sports Day 2023', year: '2023', month: 12, batch: 'All', event: 'Sports Day', image: MEMORY_IMAGES[7] },
    { id: '9', title: 'Hackathon 2022', year: '2022', month: 12, batch: '2023', event: 'Hackathon', image: MEMORY_IMAGES[8] },
    { id: '10', title: 'Campus Life 2020', year: '2020', month: 12, batch: 'All', event: 'Campus', image: MEMORY_IMAGES[9] },
    { id: '11', title: 'Alumni Meet 2023', year: '2023', month: 12, batch: 'All', event: 'Alumni Meet', image: MEMORY_IMAGES[10] },
    { id: '12', title: 'Foundation Day 2021', year: '2021', month: 12, batch: 'All', event: 'Foundation', image: MEMORY_IMAGES[11] },
    // Non-December memories (for testing filtering)
    { id: '13', title: 'Summer Fest 2023', year: '2023', month: 6, batch: 'All', event: 'Fest', image: MEMORY_IMAGES[12] },
    { id: '14', title: 'Freshers 2022', year: '2022', month: 8, batch: '2026', event: 'Freshers', image: MEMORY_IMAGES[13] },
];

interface Memory {
    id: string;
    title: string;
    year: string;
    month: number;
    batch: string;
    event: string;
    image: string;
}

export default function NostalgiaOverlay() {
    const [isVisible, setIsVisible] = useState(false);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Filter and select memories on mount
    useEffect(() => {
        // Check if already shown this session
        if (typeof window !== 'undefined' && sessionStorage.getItem('nostalgia-shown')) {
            return;
        }

        const currentMonth = new Date().getMonth() + 1; // 1-indexed
        const currentYear = new Date().getFullYear().toString();

        // For demo: use mock user batch (in real app, get from auth context)
        const userBatch = '2024';

        // Filter memories from same month, previous years, matching batch or 'All'
        const eligibleMemories = ALL_MEMORIES.filter(m =>
            m.month === currentMonth &&
            m.year !== currentYear &&
            (m.batch === userBatch || m.batch === 'All')
        );

        // Randomly select up to 5 memories
        const shuffled = [...eligibleMemories].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);

        if (selected.length > 0) {
            setMemories(selected);
            setIsVisible(true);
            // Mark as shown for this session
            sessionStorage.setItem('nostalgia-shown', 'true');
        }
    }, []);

    // Auto-advance slideshow
    useEffect(() => {
        if (!isVisible || memories.length === 0) return;

        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
    }, [isVisible, currentIndex, memories.length]);

    const handleNext = useCallback(() => {
        if (currentIndex >= memories.length - 1) {
            // Last slide - close overlay
            handleClose();
        } else {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setIsTransitioning(false);
            }, 300);
        }
    }, [currentIndex, memories.length]);

    const handleClose = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    }, []);

    if (!isVisible || memories.length === 0) return null;

    const currentMemory = memories[currentIndex];
    const monthName = new Date().toLocaleString('default', { month: 'long' });

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isTransitioning && currentIndex >= memories.length - 1 ? 'opacity-0' : 'opacity-100'
                }`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)' }}
        >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Close"
            >
                <X size={28} />
            </button>

            {/* Main Content Card */}
            <div className="max-w-3xl w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Memories from {monthName}</p>
                    <h2 className="text-white text-2xl font-light">Look back at this time...</h2>
                </div>

                {/* Photo Card */}
                <div className={`relative transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                        {/* Image */}
                        <div className="relative aspect-video">
                            <Image
                                src={currentMemory.image}
                                alt={currentMemory.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Info */}
                        <div className="p-6 bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{currentMemory.title}</h3>
                                    <p className="text-gray-500 mt-1">{currentMemory.year} • {currentMemory.event}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-light text-gray-900">{currentMemory.year}</p>
                                    <p className="text-gray-400 text-sm">{parseInt(new Date().getFullYear().toString()) - parseInt(currentMemory.year)} years ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {memories.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'w-8 bg-white'
                                    : idx < currentIndex
                                        ? 'w-1.5 bg-white/60'
                                        : 'w-1.5 bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Skip Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2.5 text-white/80 hover:text-white text-sm font-medium transition-colors rounded-full hover:bg-white/10"
                    >
                        {currentIndex >= memories.length - 1 ? 'Close' : 'Skip'} <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
