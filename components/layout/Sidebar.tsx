'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Package,
  Home,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Stok Gas', icon: Package, path: '/stok' },
    { name: 'Gas Masuk', icon: ArrowDownCircle, path: '/masuk' },
    { name: 'Gas Keluar', icon: ArrowUpCircle, path: '/keluar' },
    { name: 'Gas Pinjam', icon: ArrowUpCircle, path: '/pinjam' },
    { name: 'Riwayat', icon: History, path: '/riwayat' },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push('/login');
  };

  // Navigation content (no user block here)
  const NavContent = (
    <nav className="flex-1 p-4 space-y-2 overflow-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              setOpen(false);
              router.push(item.path);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
              isActive
                ? 'bg-green-600 font-semibold shadow-md'
                : 'hover:bg-green-600/80'
            }`}
          >
            <Icon size={20} />
            <span>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar (no user/logout block) */}
      <aside className="hidden md:flex w-64 bg-green-700 text-white h-screen fixed left-0 top-0 flex-col shadow-xl">
        <div className="p-6 bg-green-800">
          <div className="flex items-center gap-3">
            <Package size={32} className="text-green-100" />
            <div>
              <h1 className="text-xl font-bold text-white">PT Kharisma Radja</h1>
            </div>
          </div>
        </div>

        {NavContent}

        {/* Desktop intentionally has no user/logout here */}
      </aside>

      {/* Mobile: menu button */}
      <button
        aria-label="Buka menu"
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded-lg shadow"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay / drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          {/* panel */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-green-700 text-white shadow-xl transform transition-transform flex flex-col">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Package size={28} className="text-green-100" />
                <h2 className="text-lg font-semibold text-white">PT Kharisma Radja</h2>
              </div>
              <button
                aria-label="Tutup menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-md bg-green-800/60 hover:bg-green-800/80"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile navigation */}
            <div className="p-4 flex-1 overflow-auto">{NavContent}</div>

            {/* User Info & Logout — VISIBLE ONLY ON MOBILE */}
            <div className="p-4 md:hidden border-t border-green-600/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 font-medium">
                  {(user?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user?.name || 'Admin'}</div>
                  <div className="text-xs text-green-200">{user?.email || '-'}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}