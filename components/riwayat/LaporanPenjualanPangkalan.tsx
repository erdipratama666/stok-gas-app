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

type LaporanPangkalan = {
  lokasi: string;
  totalPenjualan: number;
  frekuensi: number;
  terakhirTransaksi: string;
  tipeIsi: number;
  tipeKosong: number;
};

const LOKASI_PANGKALAN = [
  'TATANG', 'AI SITI', 'TAUFIK', 'BUDY', 'TARI', 'AHMAD', 'WAWAN', 'ASEP', 'REKHA', 'MELLA',
  'MUH JAJULI', 'H AGAN', 'J PAKPAHAN', 'IIM', 'DILA', 'H JOJON', 'HALIM', 'NENENG', 'JAJAT', 'AS MARINGAN',
  'IBRANIUS', 'IBRA', 'DARDA', 'SUHERMAN', 'H YEYET', 'TETI'
];

// Fungsi untuk mapping kode lama (A, B, C, dst) ke nama pangkalan
const mapLokasiToName = (lokasi: string | null): string => {
  if (!lokasi) return '-';
  
  // Jika sudah berupa nama pangkalan (bukan huruf tunggal atau jika huruf uppercase panjang)
  if (lokasi.length > 1 || LOKASI_PANGKALAN.includes(lokasi)) {
    return lokasi;
  }
  
  // Mapping dari kode huruf lama (A=0, B=1, ..., Z=25)
  const charCode = lokasi.toUpperCase().charCodeAt(0) - 65;
  if (charCode >= 0 && charCode < LOKASI_PANGKALAN.length) {
    return LOKASI_PANGKALAN[charCode];
  }
  
  return lokasi;
};

export default function LaporanPenjualanPangkalan() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriode, setFilterPeriode] = useState<'hari' | 'minggu' | 'bulan'>('bulan');
  const [laporanData, setLaporanData] = useState<LaporanPangkalan[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      generateLaporan();
    }
  }, [rows, filterPeriode]);

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

  const generateLaporan = () => {
    const today = new Date();
    let startDate = new Date();

    // Tentukan range berdasarkan filter periode
    if (filterPeriode === 'hari') {
      startDate.setHours(0, 0, 0, 0);
    } else if (filterPeriode === 'minggu') {
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (filterPeriode === 'bulan') {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    // Filter transaksi keluar dalam periode
    const keluarTransaksi = rows.filter((r) => {
      return (
        r.action === 'keluar' &&
        r.lokasi &&
        new Date(r.createdAt) >= startDate
      );
    });

    // Group by lokasi
    const groupedByLokasi: { [key: string]: LaporanPangkalan } = {};

    keluarTransaksi.forEach((t) => {
      const lok = mapLokasiToName(t.lokasi);
      
      if (!groupedByLokasi[lok]) {
        groupedByLokasi[lok] = {
          lokasi: lok,
          totalPenjualan: 0,
          frekuensi: 0,
          terakhirTransaksi: t.createdAt,
          tipeIsi: 0,
          tipeKosong: 0,
        };
      }

      groupedByLokasi[lok].totalPenjualan += t.jumlah;
      groupedByLokasi[lok].frekuensi += 1;
      groupedByLokasi[lok].terakhirTransaksi = new Date(t.createdAt) > new Date(groupedByLokasi[lok].terakhirTransaksi)
        ? t.createdAt
        : groupedByLokasi[lok].terakhirTransaksi;

      if (t.tipe === 'isi') {
        groupedByLokasi[lok].tipeIsi += t.jumlah;
      } else {
        groupedByLokasi[lok].tipeKosong += t.jumlah;
      }
    });

    // Convert to array dan sort by total penjualan
    const laporan = Object.values(groupedByLokasi)
      .sort((a, b) => b.totalPenjualan - a.totalPenjualan);

    setLaporanData(laporan);
  };

  const totalPenjualanSemua = useMemo(() => {
    return laporanData.reduce((sum, item) => sum + item.totalPenjualan, 0);
  }, [laporanData]);

  if (loading) {
    return <div className="text-gray-500">Memuat data...</div>;
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📊 Laporan Penjualan per Pangkalan</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterPeriode('hari')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              filterPeriode === 'hari'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterPeriode('minggu')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              filterPeriode === 'minggu'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => setFilterPeriode('bulan')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              filterPeriode === 'bulan'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {laporanData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Belum ada penjualan dalam periode ini</p>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-gray-600">Total Penjualan</p>
              <p className="text-2xl font-bold text-blue-600">{totalPenjualanSemua}</p>
              <p className="text-xs text-gray-500 mt-1">Tabung</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-sm text-gray-600">Pangkalan Aktif</p>
              <p className="text-2xl font-bold text-green-600">{laporanData.length}</p>
              <p className="text-xs text-gray-500 mt-1">Destinasi</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded p-4">
              <p className="text-sm text-gray-600">Rata-rata Penjualan</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(totalPenjualanSemua / laporanData.length)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Per Pangkalan</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-600 bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3">Pangkalan</th>
                  <th className="px-4 py-3">Total Penjualan</th>
                  <th className="px-4 py-3">Tabung Isi</th>
                  <th className="px-4 py-3">Tabung Kosong</th>
                  <th className="px-4 py-3">Frekuensi</th>
                  <th className="px-4 py-3">Terakhir Transaksi</th>
                  <th className="px-4 py-3">Persentase</th>
                </tr>
              </thead>
              <tbody>
                {laporanData.map((item, index) => {
                  const persentase = ((item.totalPenjualan / totalPenjualanSemua) * 100).toFixed(1);
                  return (
                    <tr key={item.lokasi} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                          #{index + 1}
                        </span>
                        {item.lokasi}
                      </td>
                      <td className="px-4 py-3 text-lg font-bold text-red-600">
                        {item.totalPenjualan}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {item.tipeIsi} 🟢
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          {item.tipeKosong} 🟠
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">
                          {item.frekuensi}x
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {new Date(item.terakhirTransaksi).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${persentase}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-700 w-12">
                            {persentase}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
