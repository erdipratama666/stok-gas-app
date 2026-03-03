'use client';
import React, { useState } from 'react';

type TipeTabung = 'isi' | 'kosong';
type Props = { 
  onGasKeluar: (jumlah: number, keterangan: string, tipe: TipeTabung, lokasi: string) => void; 
};

const LOKASI_PANGKALAN = [
  'TATANG', 'AI SITI', 'TAUFIK', 'BUDY', 'TARI', 'AHMAD', 'WAWAN', 'ASEP', 'REKHA', 'MELLA',
  'MUH JAJULI', 'H AGAN', 'J PAKPAHAN', 'IIM', 'DILA', 'H JOJON', 'HALIM', 'NENENG', 'JAJAT', 'AS MARINGAN',
  'IBRANIUS', 'IBRA', 'DARDA', 'SUHERMAN', 'H YEYET', 'TETI'
];

export default function GasKeluarForm({ onGasKeluar }: Props) {
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tipe] = useState<TipeTabung>('isi'); // Selalu gunakan 'isi', tidak bisa diubah
  const [lokasi, setLokasi] = useState('A');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const j = Math.max(0, parseInt(jumlah || '0', 10));
    if (j <= 0) {
      alert('Masukkan jumlah yang valid (minimal 1 tabung).');
      return;
    }
    onGasKeluar(j, keterangan, tipe, lokasi);
    setJumlah('');
    setKeterangan('');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Form Gas Keluar</h3>

      <div>
        <label htmlFor="keluar-lokasi" className="block text-sm font-medium mb-2">
          Keluar Kemana (Pangkalan)
        </label>
        <select
          id="keluar-lokasi"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          required
        >
          {LOKASI_PANGKALAN.map((lok) => (
            <option key={lok} value={lok}>
              Pangkalan {lok}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="keluar-jumlah" className="block text-sm font-medium mb-2">
          Jumlah
        </label>
        <input
          id="keluar-jumlah"
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          min={1}
          required
          placeholder="Masukkan jumlah"
        />
      </div>

      <div>
        <label htmlFor="keluar-keterangan" className="block text-sm font-medium mb-2">
          Keterangan
        </label>
        <textarea
          id="keluar-keterangan"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows={3}
          placeholder="Nama customer atau catatan pengiriman"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-medium"
      >
        Catat Keluar
      </button>
    </form>
  );
}