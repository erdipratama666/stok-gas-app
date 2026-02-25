'use client';

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

type PinjamRow = {
  id: number;
  namaPeminjam: string;
  jumlahPinjam: number;
  jumlahKembali: number;
  status: string;
  catatan: string;
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
      // Fetch dari table TabungPinjam
      const res = await fetch('/api/transaksi/pinjam');
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
      alert('Masukkan nama peminjam dan jumlah valid.');
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
        alert('✅ Berhasil meminjamkan ' + jumlah + ' tabung kepada ' + namaPangkalan);
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
    const sisaPinjam = row.jumlahPinjam - row.jumlahKembali;
    const jumlahKembali = prompt(`Berapa tabung yang dikembalikan dari ${row.namaPeminjam}? (Sisa: ${sisaPinjam})`, String(sisaPinjam));
    if (!jumlahKembali) return;

    const num = Number(jumlahKembali);
    if (num <= 0 || num > sisaPinjam) {
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
          keterangan: `Kembali dari ${row.namaPeminjam}`,
          pinjamId: row.id
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Berhasil menerima pengembalian ${num} tabung ${tipe} dari ${row.namaPeminjam}`);
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
          placeholder="Nama peminjam"
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
              <th className="px-3 py-2">Nama Peminjam</th>
              <th className="px-3 py-2 w-20">Pinjam</th>
              <th className="px-3 py-2 w-20">Kembali</th>
              <th className="px-3 py-2 w-20">Sisa</th>
              <th className="px-3 py-2 w-36">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                  Belum ada catatan pinjam
                </td>
              </tr>
            )}

            {rows.map((r) => {
              const sisaPinjam = r.jumlahPinjam - r.jumlahKembali;
              return (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{r.namaPeminjam}</td>
                  <td className="px-3 py-2 text-blue-600 font-semibold">{r.jumlahPinjam}</td>
                  <td className="px-3 py-2 text-green-600 font-semibold">{r.jumlahKembali}</td>
                  <td className="px-3 py-2">
                    <span className={`font-bold ${sisaPinjam > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {sisaPinjam}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleKembali(r)}
                        disabled={sisaPinjam === 0}
                        className={`text-white px-3 py-1 rounded text-xs transition ${
                          sisaPinjam === 0 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        Kembali
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        💡 Klik "Kembali" untuk mencatat pengembalian tabung
      </div>
    </div>
  );
}