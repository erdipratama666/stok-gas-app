'use client';
import React, { useState } from 'react';

type TipeTabung = 'isi' | 'kosong';
type Props = { 
  onGasMasuk: (jumlah: number, keterangan: string, tipe: TipeTabung) => void; 
};

export default function GasMasukForm({ onGasMasuk }: Props) {
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tipe, setTipe] = useState<TipeTabung>('isi');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const j = Math.max(0, parseInt(jumlah || '0', 10));
    if (j <= 0) {
      alert('Masukkan jumlah yang valid (minimal 1 tabung).');
      return;
    }

    onGasMasuk(j, keterangan, tipe);
    setJumlah('');
    setKeterangan('');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Form Gas Masuk</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Tipe Tabung</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              id="masuk-tipe-isi"
              type="radio"
              name="tipe-masuk"
              value="isi"
              checked={tipe === 'isi'}
              onChange={() => setTipe('isi')}
              className="w-4 h-4 cursor-pointer"
            />
            <span>Tabung Isi</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              id="masuk-tipe-kosong"
              type="radio"
              name="tipe-masuk"
              value="kosong"
              checked={tipe === 'kosong'}
              onChange={() => setTipe('kosong')}
              className="w-4 h-4 cursor-pointer"
            />
            <span>Tabung Kosong</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="masuk-jumlah" className="block text-sm font-medium mb-2">
          Jumlah
        </label>
        <input
          id="masuk-jumlah"
          name="jumlah"
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          min={1}
          required
          placeholder="Masukkan jumlah"
        />
      </div>

      <div>
        <label htmlFor="masuk-keterangan" className="block text-sm font-medium mb-2">
          Keterangan
        </label>
        <textarea
          id="masuk-keterangan"
          name="keterangan"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={3}
          placeholder="Catatan tambahan (opsional)"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-medium"
      >
        Tambah Stok
      </button>
    </form>
  );
}