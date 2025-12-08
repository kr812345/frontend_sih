"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, Bell, Menu, X, LogOut, ChevronDown, Settings } from 'lucide-react';

const navItems = [
  // { name: "Dashboard", href: "/dashboard" },
  { name: "Home", href: "/home" },
  { name: "Connections", href: "/connections" },
  { name: "Messages", href: "/messages" },
  { name: "Jobs", href: "/jobs" },
  { name: "Events", href: "/events" },
  { name: "Campaigns", href: "/campaigns" },
  { name: "Stories", href: "/success-stories" },
  { name: "AI Chatbot", href: "/chatbot" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Ref to handle clicking outside the dropdown to close it
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="w-full bg-white font-sans border-b border-gray-100 sticky top-0 z-50">
      <header className="max-w-7xl mx-auto w-full py-3 px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/home">
            <Image
              src="/sarthak.png"
              alt="Sarthak Logo"
              width={180}
              height={100}
              className="h-18 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav - Pill Shape, No Active Background Shade */}
        <nav className="hidden lg:block bg-[#001339] text-white rounded-full px-8 py-3 shadow-lg">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-sm tracking-wide transition-all duration-200 ${isActive
                        ? 'text-white font-bold' // Active: Bold, Pure White, No Background
                        : 'text-white/70 hover:text-white font-medium' // Inactive: Transparent White
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-[#001145] hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Desktop User Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-all focus:outline-none"
            >
              <div className="w-8 h-8 bg-[#001145] rounded-full flex items-center justify-center overflow-hidden">
                <User size={18} className="text-white" />
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase">Account</p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} />
                  Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </Link>

                <div className="h-px bg-gray-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#001145] hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                      ? 'bg-[#001145] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="h-px bg-gray-100 my-3"></div>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100"
            >
              <User size={18} />
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 text-left"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}