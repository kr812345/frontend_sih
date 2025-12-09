"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

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
        if (typeof window !== 'undefined' && sessionStorage.getItem('nostalgia-shown')) {
            return;
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear().toString();
        const userBatch = '2024';

        const eligibleMemories = ALL_MEMORIES.filter(m =>
            m.month === currentMonth &&
            m.year !== currentYear &&
            (m.batch === userBatch || m.batch === 'All')
        );

        const shuffled = [...eligibleMemories].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);

        if (selected.length > 0) {
            setMemories(selected);
            setIsVisible(true);
            sessionStorage.setItem('nostalgia-shown', 'true');
        }
    }, []);

    // Auto-advance slideshow - 3 seconds
    useEffect(() => {
        if (!isVisible || memories.length === 0) return;

        const timer = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(timer);
    }, [isVisible, currentIndex, memories.length]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isVisible, currentIndex, memories.length]);

    const handleNext = useCallback(() => {
        if (currentIndex >= memories.length - 1) {
            handleClose();
        } else {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setIsTransitioning(false);
            }, 200);
        }
    }, [currentIndex, memories.length]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
                setIsTransitioning(false);
            }, 200);
        }
    }, [currentIndex]);

    const handleClose = useCallback(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 200);
    }, []);

    if (!isVisible || memories.length === 0) return null;

    const currentMemory = memories[currentIndex];
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    const yearsAgo = new Date().getFullYear() - parseInt(currentMemory.year);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-200 ${isTransitioning && currentIndex >= memories.length - 1 ? 'opacity-0' : 'opacity-100'
                }`}
            style={{ backgroundColor: 'rgba(30, 41, 59, 0.92)', backdropFilter: 'blur(8px)' }}
        >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                aria-label="Close"
            >
                <X size={22} />
            </button>

            {/* Left Arrow */}
            {currentIndex > 0 && (
                <button
                    onClick={handlePrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                    aria-label="Previous"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Right Arrow */}
            {currentIndex < memories.length - 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                    aria-label="Next"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            {/* Main Content - Smaller Card */}
            <div className="max-w-lg w-full">
                {/* Header */}
                <div className="text-center mb-4">
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">
                        Memories from {monthName}
                    </p>
                    <h2 className="text-white text-lg font-medium">Look back at this time...</h2>
                </div>

                {/* Photo Card */}
                <div className={`transition-all duration-200 ${isTransitioning ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                        {/* Image - Smaller aspect ratio */}
                        <div className="relative aspect-[16/10]">
                            <Image
                                src={currentMemory.image}
                                alt={currentMemory.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{currentMemory.title}</h3>
                                    <p className="text-gray-500 text-sm">{currentMemory.event}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-semibold text-[#001145]">{currentMemory.year}</p>
                                    <p className="text-gray-400 text-xs">{yearsAgo} year{yearsAgo > 1 ? 's' : ''} ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    {memories.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setIsTransitioning(true);
                                setTimeout(() => {
                                    setCurrentIndex(idx);
                                    setIsTransitioning(false);
                                }, 200);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-200 ${idx === currentIndex
                                    ? 'w-6 bg-white'
                                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-white/70 hover:text-white text-sm transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-colors"
                    >
                        {currentIndex >= memories.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
