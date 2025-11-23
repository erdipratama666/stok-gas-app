'use client';
import React from 'react';
import StockOverview from '@/components/stok/StockOverview';
import PinjamTable from '@/components/pinjam/PinjamTable';
import { useStock } from '@/context/StockContext';

export default function StockPage() {
  const { stokIsi, stokKosong, resetStock } = useStock();

  const handleReset = () => {
    if (!confirm('Reset semua stok dan riwayat? Tindakan ini tidak bisa dibatalkan.')) return;
    resetStock();
    alert('Semua stok dan riwayat telah di-reset.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Stok Gas</h2>
        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
        >
          Reset Stok & Riwayat
        </button>
      </div>

      <StockOverview
        stokTabungIsi={stokIsi}
        stokTabungKosong={stokKosong}
        stokTabungPinjam={0}
      />

      {/* Pastikan PinjamTable dipanggil agar muncul di halaman */}
      <div className="mt-6">
        <PinjamTable />
      </div>
    </div>
  );
}