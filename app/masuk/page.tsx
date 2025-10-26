"use client";

import React from 'react';
import GasMasukForm from '@/components/transaksi/GasMasukForm';
import { useStock } from '@/context/StockContext';

export default function MasukPage() {
  const { addStock, stokIsi, stokKosong } = useStock();

  const handleGasMasuk = (jumlah: number, keterangan: string, tipe: 'isi' | 'kosong') => {
    addStock(tipe, jumlah);
    const riwayat = JSON.parse(localStorage.getItem('riwayatTransaksi') || '[]');
    riwayat.unshift({ type: 'masuk', tipe, jumlah, keterangan, date: new Date().toISOString() });
    localStorage.setItem('riwayatTransaksi', JSON.stringify(riwayat));
    window.dispatchEvent(new CustomEvent('stok:updated'));
    alert('Stok berhasil diperbarui.');
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6">Gas Masuk</h2>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">Tabung Isi: <div className="text-2xl font-bold">{stokIsi}</div></div>
        <div className="bg-white p-4 rounded shadow">Tabung Kosong: <div className="text-2xl font-bold">{stokKosong}</div></div>
      </div>
      <GasMasukForm onGasMasuk={handleGasMasuk} />
    </div>
  );
}