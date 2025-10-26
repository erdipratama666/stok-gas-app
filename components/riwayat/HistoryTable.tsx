"use client";

import React, { useEffect, useState } from 'react';

type Row = { type: 'masuk' | 'keluar'; tipe: 'isi' | 'kosong'; jumlah: number; keterangan?: string; date: string; };

export default function HistoryTable() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const load = () => setRows(JSON.parse(localStorage.getItem('riwayatTransaksi') || '[]'));
    load();
    window.addEventListener('stok:updated', load);
    return () => window.removeEventListener('stok:updated', load);
  }, []);

  if (rows.length === 0) return <p className="text-gray-500">Belum ada riwayat</p>;

  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="text-left text-sm text-gray-500">
          <tr><th className="px-3 py-2">Tanggal</th><th className="px-3 py-2">Jenis</th><th className="px-3 py-2">Tipe</th><th className="px-3 py-2">Jumlah</th><th className="px-3 py-2">Keterangan</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2 text-sm text-gray-600">{new Date(r.date).toLocaleString('id-ID')}</td>
              <td className="px-3 py-2">{r.type}</td>
              <td className="px-3 py-2">{r.tipe}</td>
              <td className="px-3 py-2 font-semibold">{r.jumlah}</td>
              <td className="px-3 py-2 text-sm text-gray-600">{r.keterangan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}