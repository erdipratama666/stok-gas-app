"use client";

import React, { useEffect, useState } from 'react';

type Row = {
  id: number;
  action: 'masuk' | 'keluar' | 'pinjam';
  tipe: 'isi' | 'kosong';
  jumlah: number;
  keterangan: string | null;
  createdAt: string;
};

export default function HistoryTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    
    // reload saat ada perubahan stok
    const handleUpdate = () => fetchHistory();
    window.addEventListener('stok:updated', handleUpdate);
    return () => window.removeEventListener('stok:updated', handleUpdate);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/stok/history');
      if (res.ok) {
        const data = await res.json();
        setRows(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Memuat riwayat...</p>;
  }

  if (rows.length === 0) {
    return <p className="text-gray-500">Belum ada riwayat</p>;
  }

  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="text-left text-gray-600 border-b">
          <tr>
            <th className="px-3 py-2">Tanggal</th>
            <th className="px-3 py-2">Jenis</th>
            <th className="px-3 py-2">Tipe</th>
            <th className="px-3 py-2">Jumlah</th>
            <th className="px-3 py-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-600">
                {new Date(r.createdAt).toLocaleString('id-ID')}
              </td>
              <td className="px-3 py-2 font-medium">
                {r.action === 'masuk' && '📥 Masuk'}
                {r.action === 'keluar' && '📤 Keluar'}
                {r.action === 'pinjam' && '🔄 Pinjam'}
              </td>
              <td className="px-3 py-2">
                {r.tipe === 'isi' && '🟢 Isi'}
                {r.tipe === 'kosong' && '🟠 Kosong'}
              </td>
              <td className="px-3 py-2 font-semibold">{r.jumlah}</td>
              <td className="px-3 py-2 text-gray-600">{r.keterangan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}