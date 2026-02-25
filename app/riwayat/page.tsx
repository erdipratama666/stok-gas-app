"use client";

import React from 'react';
import RiwayatDashboard from '@/components/riwayat/RiwayatDashboard';
import LaporanPenjualanPangkalan from '@/components/riwayat/LaporanPenjualanPangkalan';
import HistoryTable from '@/components/riwayat/HistoryTable';

export default function RiwayatPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-gray-600 mt-2">Kelola dan analisis data transaksi gas</p>
        </div>

        {/* Dashboard */}
        <RiwayatDashboard />

        {/* Laporan Penjualan per Pangkalan */}
        <div className="mt-8">
          <LaporanPenjualanPangkalan />
        </div>

        {/* History Table with Filter */}
        <div className="mt-8">
          <HistoryTable />
        </div>
      </div>
    </div>
  );
}