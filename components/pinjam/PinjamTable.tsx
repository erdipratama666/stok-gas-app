'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

type PinjamRow = {
  id: number;
  namaPangkalan: string;
  jumlah: number;
  createdAt: string;
};

type Props = {
  onUpdate?: () => void;
};

export default function PinjamTable({ onUpdate }: Props = {}) {
  const [rows, setRows] = useState<PinjamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [namaPangkalan, setNamaPangkalan] = useState('');
  const [jumlah, setJumlah] = useState('');

  useEffect(() => {
    fetchPinjam();
  }, []);

  const fetchPinjam = async () => {
    try {
      // Fetch transaksi dengan action 'pinjam' yang belum 'kembali'
      const res = await fetch('/api/transaksi?action=pinjam');
      if (res.ok) {
        const data = await res.json();
        setRows(data);
      }
    } catch (err) {
      console.error('Error fetching pinjam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!namaPangkalan.trim() || Number(jumlah) <= 0) {
      alert('Masukkan nama pangkalan dan jumlah valid.');
      return;
    }

    try {
      const res = await fetch('/api/stok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pinjam',
          tipe: 'isi',  // Default pinjam tabung isi
          jumlah: Number(jumlah),
          keterangan: namaPangkalan.trim()
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Berhasil meminjamkan ' + jumlah + ' tabung');
        setNamaPangkalan('');
        setJumlah('');
        fetchPinjam();
        onUpdate?.(); // Refresh stok di parent
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan');
    }
  };

  const handleKembali = async (row: PinjamRow) => {
    const jumlahKembali = prompt(`Berapa tabung yang dikembalikan dari ${row.namaPangkalan}?`, String(row.jumlah));
    if (!jumlahKembali) return;

    const num = Number(jumlahKembali);
    if (num <= 0 || num > row.jumlah) {
      alert('Jumlah tidak valid');
      return;
    }

    // Tanya kondisi tabung
    const kondisi = confirm('Tabung dikembalikan dalam kondisi ISI?\n\nOK = Isi\nCancel = Kosong');
    const tipe = kondisi ? 'isi' : 'kosong';

    try {
      const res = await fetch('/api/stok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'kembali',
          tipe: tipe,
          jumlah: num,
          keterangan: `Kembali dari ${row.namaPangkalan}`
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Berhasil menerima pengembalian ${num} tabung ${tipe}`);
        fetchPinjam();
        onUpdate?.();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan');
    }
  };

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-4">Memuat data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Catatan Pinjam</h3>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          placeholder="Nama pangkalan"
          className="px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500"
          value={namaPangkalan}
          onChange={(e) => setNamaPangkalan(e.target.value)}
        />
        <input
          placeholder="Jumlah"
          className="px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500"
          type="number"
          min={1}
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          Tambah
        </button>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600 bg-gray-50">
            <tr>
              <th className="px-3 py-2">Nama Pangkalan</th>
              <th className="px-3 py-2 w-28">Jumlah</th>
              <th className="px-3 py-2 w-36">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                  Belum ada catatan pinjam
                </td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{r.namaPangkalan}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.jumlah}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleKembali(r)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-xs"
                    >
                      Kembali
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        💡 Klik "Kembali" untuk mencatat pengembalian tabung
      </div>
    </div>
  );
}