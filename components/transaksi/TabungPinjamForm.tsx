'use client';
import React, { useState } from 'react';

type ActionPinjam = 'pinjam' | 'kembali';
type TipeTabung = 'isi' | 'kosong';

type Props = { 
  onTabungPinjam: (
    action: ActionPinjam, 
    jumlah: number, 
    keterangan: string, 
    tipe: TipeTabung
  ) => void; 
  stokTabungPinjam: number;
};

export default function TabungPinjamForm({ onTabungPinjam, stokTabungPinjam }: Props) {
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [action, setAction] = useState<ActionPinjam>('pinjam');
  const [tipe, setTipe] = useState<TipeTabung>('isi');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const j = Math.max(0, parseInt(jumlah || '0', 10));
    
    if (j <= 0) {
      alert('Masukkan jumlah yang valid (minimal 1 tabung).');
      return;
    }

    // Validasi untuk pengembalian
    if (action === 'kembali' && j > stokTabungPinjam) {
      alert(`Tidak bisa mengembalikan ${j} tabung. Yang dipinjam hanya ${stokTabungPinjam} tabung.`);
      return;
    }

    onTabungPinjam(action, j, keterangan, tipe);
    setJumlah('');
    setKeterangan('');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Kelola Tabung Pinjam</h3>
        <div className="bg-blue-100 px-3 py-1 rounded text-sm font-medium">
          Dipinjam: {stokTabungPinjam} tabung
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Aksi</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="action-pinjam"
              value="pinjam"
              checked={action === 'pinjam'}
              onChange={() => setAction('pinjam')}
              className="w-4 h-4 cursor-pointer"
            />
            <span>Pinjamkan Tabung</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="action-pinjam"
              value="kembali"
              checked={action === 'kembali'}
              onChange={() => setAction('kembali')}
              className="w-4 h-4 cursor-pointer"
            />
            <span>Kembalikan Tabung</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {action === 'pinjam' ? 'Pinjam dari Stok' : 'Kembali sebagai'}
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipe-pinjam"
              value="isi"
              checked={tipe === 'isi'}
              onChange={() => setTipe('isi')}
              className="w-4 h-4 cursor-pointer"
            />
            <span>Tabung Isi</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipe-pinjam"
              value="kosong"
              checked={tipe === 'kosong'}
              onChange={() => setTipe('kosong')}
              className="w-4 h-4 cursor-pointer"
            />
            <span>Tabung Kosong</span>
          </label>
        </div>
        {action === 'kembali' && (
          <p className="text-xs text-gray-500 mt-1">
            💡 Pilih sesuai kondisi tabung saat dikembalikan
          </p>
        )}
      </div>

      <div>
        <label htmlFor="pinjam-jumlah" className="block text-sm font-medium mb-2">
          Jumlah Tabung
        </label>
        <input
          id="pinjam-jumlah"
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          min={1}
          max={action === 'kembali' ? stokTabungPinjam : undefined}
          required
          placeholder={action === 'kembali' ? `Maks: ${stokTabungPinjam}` : 'Masukkan jumlah'}
        />
      </div>

      <div>
        <label htmlFor="pinjam-keterangan" className="block text-sm font-medium mb-2">
          Keterangan
        </label>
        <textarea
          id="pinjam-keterangan"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Nama peminjam atau catatan lainnya"
        />
      </div>

      <button 
        type="submit" 
        className={`w-full py-2 rounded transition text-white font-medium ${
          action === 'pinjam' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {action === 'pinjam' ? 'Pinjamkan Tabung' : 'Terima Pengembalian'}
      </button>
    </form>
  );
}