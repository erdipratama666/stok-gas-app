'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Package, 
  Home, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History, 
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Stok Gas', icon: Package, path: '/stok' },
    { name: 'Gas Masuk', icon: ArrowDownCircle, path: '/masuk' },
    { name: 'Gas Keluar', icon: ArrowUpCircle, path: '/keluar' },
    { name: 'Riwayat', icon: History, path: '/riwayat' },
  ];

  return (
    <div className="w-64 bg-green-700 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-green-800 bg-green-800">
        <div className="flex items-center gap-2">
          <Package size={32} className="text-green-100" />
          <div>
            <h1 className="text-xl font-bold">PT Kharisma Radja</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-green-600 font-semibold shadow-md' 
                  : 'hover:bg-green-600 hover:shadow-sm'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info at Bottom */}
      <div>
      </div>
    </div>
  );
}