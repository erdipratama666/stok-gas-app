'use client';
import React, { useState, useEffect } from 'react';
import StockOverview from '@/components/stok/StockOverview';
import PinjamTable from '@/components/pinjam/PinjamTable';

type Stok = {
  tabungIsi: number;
  tabungKosong: number;
  tabungPinjam: number;
};

export default function StockPage() {
  const [stok, setStok] = useState<Stok>({ 
    tabungIsi: 0, 
    tabungKosong: 0, 
    tabungPinjam: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStok();
  }, []);

  const fetchStok = async () => {
    try {
      const res = await fetch('/api/stok');
      if (res.ok) {
        const data = await res.json();
        console.log('📦 Stok loaded:', data);
        setStok(data);
      }
    } catch (err) {
      console.error('Error fetching stok:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const confirmText = prompt(
      'PERINGATAN: Ini akan menghapus SEMUA data stok dan transaksi!\n\n' +
      'Ketik "RESET" (huruf besar) untuk konfirmasi:'
    );
    
    if (confirmText !== 'RESET') {
      if (confirmText !== null) {
        alert('Reset dibatalkan. Anda harus mengetik "RESET" dengan benar.');
      }
      return;
    }

    try {
      const res = await fetch('/api/stok/reset', {
        method: 'POST',
      });

      if (res.ok) {
        alert('✅ Semua stok dan riwayat telah di-reset.');
        window.location.reload();
      } else {
        alert('❌ Gagal reset. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error reset:', err);
      alert('❌ Terjadi kesalahan saat reset');
    }
  };

  const handleStokUpdate = () => {
    fetchStok();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Stok Gas</h2>
        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
        >
          Reset Stok & Riwayat
        </button>
      </div>

      <StockOverview
        stokTabungIsi={stok.tabungIsi}
        stokTabungKosong={stok.tabungKosong}
        stokTabungPinjam={stok.tabungPinjam}
      />

      <div className="mt-6">
        <PinjamTable onUpdate={handleStokUpdate} />
      </div>
    </div>
  );
}