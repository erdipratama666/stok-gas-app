"use client";

import React from 'react';
import GasKeluarForm from '@/components/transaksi/GasKeluarForm';
import { useStock } from '@/context/StockContext';

export default function KeluarPage() {
  const { removeStock } = useStock();

  const handleGasKeluar = (jumlah: number, keterangan: string, tipe: 'isi' | 'kosong' | 'pinjam') => {
    const ok = removeStock(tipe, jumlah);
    if (!ok) {
      alert('Stok tidak cukup.');
      return;
    }

    const riwayat = JSON.parse(localStorage.getItem('riwayatTransaksi') || '[]');
    riwayat.unshift({ type: 'keluar', tipe, jumlah, keterangan, date: new Date().toISOString() });
    localStorage.setItem('riwayatTransaksi', JSON.stringify(riwayat));

    window.dispatchEvent(new CustomEvent('stok:updated'));
    alert('Pencatatan gas keluar berhasil.');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gas Keluar</h2>
      <GasKeluarForm onGasKeluar={handleGasKeluar} />
    </div>
  );
}