"use client";

import React from 'react';
import GasPinjamForm from '@/components/transaksi/GasPinjamForm';
import { useStock } from '@/context/StockContext';

export default function PinjamPage() {
  const { pinjamStock, stokIsi, stokKosong } = useStock();

  const handleGasPinjam = (jumlah: number, keterangan: string, tipe: 'isi' | 'kosong') => {
    const berhasil = pinjamStock(tipe, jumlah);
    if (!berhasil) return alert('Stok tidak mencukupi.');

    const riwayat = JSON.parse(localStorage.getItem('riwayatTransaksi') || '[]');
    riwayat.unshift({
      type: 'pinjam',
      tipe,
      jumlah,
      keterangan,
      date: new Date().toISOString(),
    });
    localStorage.setItem('riwayatTransaksi', JSON.stringify(riwayat));

    window.dispatchEvent(new CustomEvent('stok:updated'));
    alert('Peminjaman berhasil dicatat.');
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-3xl font-bold mb-6">Pinjam Gas</h2>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Tabung Isi:
          <div className="text-2xl font-bold">{stokIsi}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          Tabung Kosong:
          <div className="text-2xl font-bold">{stokKosong}</div>
        </div>
      </div>
      <GasPinjamForm onGasPinjam={handleGasPinjam} />
    </div>
  );
}
