"use client";

import React from 'react';
import HistoryTable from '@/components/riwayat/HistoryTable';

export default function RiwayatPage() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Riwayat Transaksi</h2>
      <HistoryTable />
    </div>
  );
}