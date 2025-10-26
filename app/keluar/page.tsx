"use client";

import React from 'react';
import GasKeluarForm from '@/components/transaksi/GasKeluarForm';
import { useStock } from '@/context/StockContext';

export default function KeluarPage() {
  const { removeStock, stokIsi, stokKosong } = useStock();

  const handleGasKeluar = (jumlah: number, keterangan: string, tipe: 'isi' | 'kosong') => {
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
    <div className="p-6 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6">Gas Keluar</h2>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">Tabung Isi: <div className="text-2xl font-bold">{stokIsi}</div></div>
        <div className="bg-white p-4 rounded shadow">Tabung Kosong: <div className="text-2xl font-bold">{stokKosong}</div></div>
      </div>
      <GasKeluarForm onGasKeluar={handleGasKeluar} />
    </div>
  );
}