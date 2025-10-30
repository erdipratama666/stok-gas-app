'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Topbar: React.FC = () => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return; // aman: dijalankan hanya pada client
    // akses window / document di sini
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitial = () => {
    return (user?.name || 'A').charAt(0).toUpperCase();
  };

  return (
    <div className="hidden md:flex bg-green-700 px-6 py-2 justify-between items-center shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-white">Agen Gas LPG</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((s) => !s)}
          className="flex items-center gap-3 px-3 py-1 rounded-lg hover:bg-green-600/10 transition"
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
            {getInitial()}
          </div>

          <span className="font-semibold text-white">
            {user?.name || 'Admin'}
          </span>

          <ChevronDown
            size={20}
            className={`text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;