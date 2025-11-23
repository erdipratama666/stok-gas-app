'use client';

import React, { useState } from 'react';

type TipeTabung = 'isi' | 'kosong';
type Props = {
  onGasPinjam: (jumlah: number, keterangan: string, tipe: TipeTabung) => void;
};

export default function GasPinjamForm({ onGasPinjam }: Props) {
  const [tipe, setTipe] = useState<TipeTabung>('isi');
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const j = Math.max(0, parseInt(jumlah || '0', 10));
    if (j <= 0) {
      alert('Masukkan jumlah yang valid.');
      return;
    }
    onGasPinjam(j, keterangan, tipe);
    setJumlah('');
    setKeterangan('');
    setTipe('isi');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold">Form Pinjam Tabung</h3>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">Tipe Tabung</legend>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              id="pinjam-tipe-isi"
              name="pinjam-tipe"
              type="radio"
              value="isi"
              checked={tipe === 'isi'}
              onChange={() => setTipe('isi')}
              className="mr-2"
            />
            <span>Tabung Isi</span>
          </label>

          <label className="inline-flex items-center">
            <input
              id="pinjam-tipe-kosong"
              name="pinjam-tipe"
              type="radio"
              value="kosong"
              checked={tipe === 'kosong'}
              onChange={() => setTipe('kosong')}
              className="mr-2"
            />
            <span>Tabung Kosong</span>
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="pinjam-jumlah" className="block text-sm font-medium">Jumlah</label>
        <input
          id="pinjam-jumlah"
          name="jumlah"
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          className="w-full border rounded px-3 py-2"
          min={1}
          required
        />
      </div>

      <div>
        <label htmlFor="pinjam-keterangan" className="block text-sm font-medium">Keterangan</label>
        <textarea
          id="pinjam-keterangan"
          name="keterangan"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Catat Peminjaman
      </button>
    </form>
  );
}

// 'use client';

// import React from 'react';
// import GasPinjamForm from '@/components/transaksi/GasPinjamForm';
// import { useStock } from '@/context/StockContext';

// export default function PinjamPage() {
//   const { pinjamStock } = useStock();

//   const handleGasPinjam = (jumlah: number, keterangan: string, tipe: 'isi' | 'kosong') => {
//     const berhasil = pinjamStock(tipe, jumlah);
//     if (!berhasil) {
//       alert('Stok tidak cukup.');
//       return;
//     }

//     // catat ke riwayat
//     const riwayat = JSON.parse(localStorage.getItem('riwayatTransaksi') || '[]');
//     riwayat.unshift({ type: 'pinjam', tipe, jumlah, keterangan, date: new Date().toISOString() });
//     localStorage.setItem('riwayatTransaksi', JSON.stringify(riwayat));

//     // tambahkan ke daftar pinjam (untuk tabel yang sekarang ada di /stok)
//     const pinjamList = JSON.parse(localStorage.getItem('pinjamList') || '[]');
//     const id =
//       (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
//         ? (crypto as any).randomUUID()
//         : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

//     pinjamList.unshift({
//       id,
//       namaPangkalan: keterangan || 'Pangkalan',
//       jumlah,
//       status: 'dipinjam',
//       createdAt: new Date().toISOString(),
//     });
//     localStorage.setItem('pinjamList', JSON.stringify(pinjamList));

//     // beri tahu listener lain untuk reload
//     window.dispatchEvent(new CustomEvent('stok:updated'));
//     window.dispatchEvent(new CustomEvent('pinjam:updated'));

//     alert('Peminjaman dicatat.');
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Form Pinjam Tabung</h2>
//       <GasPinjamForm onGasPinjam={handleGasPinjam} />
//     </div>
//   );
// }