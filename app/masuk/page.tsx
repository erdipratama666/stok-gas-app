"use client";

import React from 'react';
import GasMasukForm from '@/components/transaksi/GasMasukForm';
import { useStock } from '@/context/StockContext';

const generateId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? (crypto as any).randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export default function MasukPage() {
  const { addStock } = useStock();

  const handleGasMasuk = (jumlah: number, keterangan: string, tipe: 'isi' | 'kosong' | 'pinjam') => {
    // tambahkan ke stok sesuai tipe (termasuk 'pinjam')
    addStock(tipe, jumlah);

    // catat riwayat
    const riwayat = JSON.parse(localStorage.getItem('riwayatTransaksi') || '[]');
    riwayat.unshift({ type: 'masuk', tipe, jumlah, keterangan, date: new Date().toISOString() });
    localStorage.setItem('riwayatTransaksi', JSON.stringify(riwayat));

    // jika tipe pinjam, tambahkan juga ke daftar pinjam supaya tampil di PinjamTable / StockOverview
    if (tipe === 'pinjam') {
      const pinjamList = JSON.parse(localStorage.getItem('pinjamList') || '[]');
      pinjamList.unshift({
        id: generateId(),
        namaPangkalan: keterangan || 'Pangkalan',
        jumlah,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('pinjamList', JSON.stringify(pinjamList));
      window.dispatchEvent(new CustomEvent('pinjam:updated'));
    }

    // beri tahu komponen lain untuk reload stok/riwayat
    window.dispatchEvent(new CustomEvent('stok:updated'));

    alert(`${jumlah} tabung (${tipe}) berhasil dicatat ke stok.`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gas Masuk</h2>
      <GasMasukForm onGasMasuk={handleGasMasuk} />
    </div>
  );
}