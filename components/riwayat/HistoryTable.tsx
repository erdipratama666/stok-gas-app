"use client";

import React, { useEffect, useState, useMemo } from 'react';

type Row = {
  id: number;
  action: 'masuk' | 'keluar' | 'pinjam' | 'kembali';
  tipe: 'isi' | 'kosong';
  jumlah: number;
  keterangan: string | null;
  lokasi: string | null;
  createdAt: string;
};

export default function HistoryTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterLokasi, setFilterLokasi] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

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

  // Filter data berdasarkan kriteria
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        (r.keterangan?.toLowerCase().includes(searchLower)) ||
        (r.lokasi?.toLowerCase().includes(searchLower));

      // Filter by action
      const matchesAction = !filterAction || r.action === filterAction;

      // Filter by lokasi
      const matchesLokasi = !filterLokasi || r.lokasi === filterLokasi;

      // Filter by date range
      const rowDate = new Date(r.createdAt).toISOString().split('T')[0];
      const matchesDateFrom = !dateFrom || rowDate >= dateFrom;
      const matchesDateTo = !dateTo || rowDate <= dateTo;

      return matchesSearch && matchesAction && matchesLokasi && matchesDateFrom && matchesDateTo;
    });
  }, [rows, searchQuery, filterAction, filterLokasi, dateFrom, dateTo]);

  // Get unique lokasi untuk dropdown
  const uniqueLokasi = Array.from(new Set(rows
    .filter(r => r.lokasi)
    .map(r => r.lokasi as string)
  )).sort();

  if (loading) {
    return <p className="text-gray-500">Memalu riwayat...</p>;
  }

  return (
    <div className="space-y-6" key="history-container">
      {/* Filter Section */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Filter & Pencarian</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-1">Cari Keterangan/Lokasi</label>
            <input
              type="text"
              placeholder="Ketik nama atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter by Jenis */}
          <div>
            <label className="block text-sm font-medium mb-1">Jenis Transaksi</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua</option>
              <option value="masuk">📥 Masuk</option>
              <option value="keluar">📤 Keluar</option>
              <option value="pinjam">🔄 Pinjam</option>
              <option value="kembali">↩️ Kembali</option>
            </select>
          </div>

          {/* Filter by Lokasi */}
          <div>
            <label className="block text-sm font-medium mb-1">Pangkalan/Lokasi</label>
            <select
              value={filterLokasi}
              onChange={(e) => setFilterLokasi(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua</option>
              {uniqueLokasi.map((lok) => (
                <option key={lok} value={lok}>
                  {lok}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterAction('');
                setFilterLokasi('');
                setDateFrom('');
                setDateTo('');
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Hasil: {filteredRows.length} transaksi
          </h3>
        </div>

        {filteredRows.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada transaksi yang sesuai filter</p>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="text-left text-gray-600 border-b bg-gray-50">
              <tr>
                <th className="px-3 py-2">Tanggal</th>
                <th className="px-3 py-2">Jenis</th>
                <th className="px-3 py-2">Tipe</th>
                <th className="px-3 py-2">Jumlah</th>
                <th className="px-3 py-2">Lokasi/Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-600">
                    {new Date(r.createdAt).toLocaleString('id-ID')}
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {r.action === 'masuk' && '📥 Masuk'}
                    {r.action === 'keluar' && '📤 Keluar'}
                    {r.action === 'pinjam' && '🔄 Pinjam'}
                    {r.action === 'kembali' && '↩️ Kembali'}
                  </td>
                  <td className="px-3 py-2">
                    {r.tipe === 'isi' && '🟢 Isi'}
                    {r.tipe === 'kosong' && '🟠 Kosong'}
                  </td>
                  <td className="px-3 py-2 font-semibold">{r.jumlah}</td>
                  <td className="px-3 py-2 text-gray-600">
                    {r.action === 'keluar' && r.lokasi ? (
                      <>Pangkalan {r.lokasi}</> 
                    ) : (
                      r.keterangan || '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}