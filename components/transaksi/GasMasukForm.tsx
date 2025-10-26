'use client';
import React, { useState } from 'react';

type TipeTabung = 'isi' | 'kosong';
type Props = { onGasMasuk: (jumlah: number, keterangan: string, tipe: TipeTabung) => void; };

export default function GasMasukForm({ onGasMasuk }: Props) {
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tipe, setTipe] = useState<TipeTabung>('isi');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const j = Math.max(0, parseInt(jumlah || '0', 10));
    if (j <= 0) { alert('Masukkan jumlah yang valid.'); return; }
    onGasMasuk(j, keterangan, tipe);
    setJumlah(''); setKeterangan('');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Form Gas Masuk</h3>

      <div>
        <label className="block text-sm font-medium">Tipe</label>
        <div className="flex gap-4 mt-2">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="tipe-masuk" checked={tipe === 'isi'} onChange={() => setTipe('isi')} />
            Tabung Isi
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="tipe-masuk" checked={tipe === 'kosong'} onChange={() => setTipe('kosong')} />
            Tabung Kosong
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Jumlah</label>
        <input type="number" value={jumlah} onChange={(e) => setJumlah(e.target.value)} className="w-full border rounded px-3 py-2" min={1} required />
      </div>

      <div>
        <label className="block text-sm font-medium">Keterangan</label>
        <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
      </div>

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Catat / Tambah Stok</button>
    </form>
  );
}