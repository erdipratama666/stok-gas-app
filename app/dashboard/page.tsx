'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Selamat datang, Admin!</h1>

      <div className="mt-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Informasi Akun</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p><span className="font-medium">Nama:</span> {user?.name || '-'}</p>
          <p><span className="font-medium">Email:</span> {user?.email || '-'}</p>
        </div>
      </div>
    </div>
  );
}