"use client";

import React, { useEffect, useState } from 'react';

type Row = {
  id: number;
  action: 'masuk' | 'keluar' | 'pinjam' | 'kembali';
  tipe: 'isi' | 'kosong';
  jumlah: number;
  keterangan: string | null;
  lokasi: string | null;
  createdAt: string;
};

type Summary = {
  totalTransaksiHariIni: number;
  totalKeluarHariIni: number;
  totalMasukHariIni: number;
  totalPinjamAktif: number;
  rekapPerJenis: {
    masuk: number;
    keluar: number;
    pinjam: number;
    kembali: number;
  };
};

export default function RiwayatDashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>({
    totalTransaksiHariIni: 0,
    totalKeluarHariIni: 0,
    totalMasukHariIni: 0,
    totalPinjamAktif: 0,
    rekapPerJenis: {
      masuk: 0,
      keluar: 0,
      pinjam: 0,
      kembali: 0,
    },
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/stok/history');
      if (res.ok) {
        const data = await res.json();
        const allRows = data.data || [];
        setRows(allRows);
        calculateSummary(allRows);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: Row[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayTransactions = data.filter((r) => {
      const rowDate = new Date(r.createdAt).toISOString().split('T')[0];
      return rowDate === today;
    });

    const totalKeluarHariIni = todayTransactions
      .filter((r) => r.action === 'keluar')
      .reduce((sum, r) => sum + r.jumlah, 0);

    const totalMasukHariIni = todayTransactions
      .filter((r) => r.action === 'masuk')
      .reduce((sum, r) => sum + r.jumlah, 0);

    const rekapPerJenis = {
      masuk: data.filter((r) => r.action === 'masuk').reduce((sum, r) => sum + r.jumlah, 0),
      keluar: data.filter((r) => r.action === 'keluar').reduce((sum, r) => sum + r.jumlah, 0),
      pinjam: data.filter((r) => r.action === 'pinjam').reduce((sum, r) => sum + r.jumlah, 0),
      kembali: data.filter((r) => r.action === 'kembali').reduce((sum, r) => sum + r.jumlah, 0),
    };

    setSummary({
      totalTransaksiHariIni: todayTransactions.length,
      totalKeluarHariIni,
      totalMasukHariIni,
      totalPinjamAktif: rekapPerJenis.pinjam - rekapPerJenis.kembali,
      rekapPerJenis,
    });
  };

  if (loading) {
    return <div className="text-gray-500">Memuat data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Transaksi Hari Ini */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Transaksi Hari Ini</p>
            <p className="text-3xl font-bold mt-2">{summary.totalTransaksiHariIni}</p>
          </div>
          <div className="text-4xl opacity-30">📋</div>
        </div>
        <p className="text-blue-100 text-xs mt-3">Total catatan hari ini</p>
      </div>

      {/* Card 2: Total Keluar (Penjualan) Hari Ini */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Volume Keluar Hari Ini</p>
            <p className="text-3xl font-bold mt-2">{summary.totalKeluarHariIni}</p>
          </div>
          <div className="text-4xl opacity-30">📤</div>
        </div>
        <p className="text-red-100 text-xs mt-3">Tabung terjual hari ini</p>
      </div>

      {/* Card 3: Total Masuk Hari Ini */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Volume Masuk Hari Ini</p>
            <p className="text-3xl font-bold mt-2">{summary.totalMasukHariIni}</p>
          </div>
          <div className="text-4xl opacity-30">📥</div>
        </div>
        <p className="text-green-100 text-xs mt-3">Tabung diterima hari ini</p>
      </div>

      {/* Card 4: Total Pinjaman Aktif */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Pinjaman Aktif</p>
            <p className="text-3xl font-bold mt-2">{summary.totalPinjamAktif}</p>
          </div>
          <div className="text-4xl opacity-30">🔄</div>
        </div>
        <p className="text-purple-100 text-xs mt-3">Tabung dalam pinjaman</p>
      </div>

      {/* Card 5-8: Rekapitulasi Per Jenis */}
      <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Rekapitulasi Transaksi (Total Sepanjang Waktu)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-gray-600 text-sm">Total Masuk</p>
            <p className="text-2xl font-bold text-blue-600">{summary.rekapPerJenis.masuk}</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <p className="text-gray-600 text-sm">Total Keluar</p>
            <p className="text-2xl font-bold text-red-600">{summary.rekapPerJenis.keluar}</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <p className="text-gray-600 text-sm">Total Pinjam</p>
            <p className="text-2xl font-bold text-purple-600">{summary.rekapPerJenis.pinjam}</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-gray-600 text-sm">Total Kembali</p>
            <p className="text-2xl font-bold text-green-600">{summary.rekapPerJenis.kembali}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
