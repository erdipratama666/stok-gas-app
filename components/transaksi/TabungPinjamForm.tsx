'use client';
import React, { useState, useEffect } from 'react';

type ActionPinjam = 'pinjam' | 'kembali';
type TipeTabung = 'isi' | 'kosong';

const LOKASI_PANGKALAN = [
  'TATANG', 'AI SITI', 'TAUFIK', 'BUDY', 'TARI', 'AHMAD', 'WAWAN', 'ASEP', 'REKHA', 'MELLA',
  'MUH JAJULI', 'H AGAN', 'J PAKPAHAN', 'IIM', 'DILA', 'H JOJON', 'HALIM', 'NENENG', 'JAJAT', 'AS MARINGAN',
  'IBRANIUS', 'IBRA', 'DARDA', 'SUHERMAN', 'H YEYET', 'TETI'
];

type PinjamRecord = {
  id: number;
  namaPeminjam: string;
  tipe?: string; // 'isi' atau 'kosong' - tipe tabung yang dipinjam
  jumlahPinjam: number;
  jumlahKembali: number;
  status: string;
  catatan: string;
};

type Props = { 
  onTabungPinjam: (
    action: ActionPinjam, 
    jumlah: number, 
    namaPeminjam: string, 
    tipe: TipeTabung,
    catatan?: string,
    pinjamId?: number
  ) => void; 
  stokTabungPinjam: number;
};

export default function TabungPinjamForm({ onTabungPinjam, stokTabungPinjam }: Props) {
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [action, setAction] = useState<ActionPinjam>('pinjam');
  const [tipe, setTipe] = useState<TipeTabung>('isi');
  const [pinjamRecords, setPinjamRecords] = useState<PinjamRecord[]>([]);
  const [selectedPinjamId, setSelectedPinjamId] = useState<number | null>(null);

  // Fetch pinjam records
  useEffect(() => {
    fetchPinjamRecords();
  }, []);

  const fetchPinjamRecords = async () => {
    try {
      const response = await fetch('/api/transaksi/pinjam');
      if (response.ok) {
        const data = await response.json();
        setPinjamRecords(data);
      }
    } catch (error) {
      console.error('Error fetching pinjam records:', error);
    }
  };

  const handlePinjamSuccess = () => {
    // Refresh pinjam records setelah transaksi berhasil
    setTimeout(fetchPinjamRecords, 500);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const j = Math.max(0, parseInt(jumlah || '0', 10));
    
    if (j <= 0) {
      alert('Masukkan jumlah yang valid (minimal 1 tabung).');
      return;
    }

    // Validasi untuk pinjam - nama peminjam wajib
    if (action === 'pinjam' && !namaPeminjam.trim()) {
      alert('Masukkan nama peminjam');
      return;
    }

    // Validasi untuk pengembalian - harus pilih dari records
    if (action === 'kembali') {
      if (!selectedPinjamId) {
        alert('Pilih pinjaman yang akan dikembalikan');
        return;
      }
      const selected = pinjamRecords.find(r => r.id === selectedPinjamId);
      if (!selected || j > (selected.jumlahPinjam - selected.jumlahKembali)) {
        const sisaPinjam = selected ? (selected.jumlahPinjam - selected.jumlahKembali) : 0;
        alert(`Tidak bisa mengembalikan ${j} tabung. Sisa pinjaman hanya ${sisaPinjam} tabung.`);
        return;
      }
    }

    // Validasi untuk pengembalian - stok pinjam
    if (action === 'kembali' && j > stokTabungPinjam) {
      alert(`Tidak bisa mengembalikan ${j} tabung. Total stok pinjam hanya ${stokTabungPinjam} tabung.`);
      return;
    }

    // pass catatan only when pinjam
    onTabungPinjam(
      action,
      j,
      namaPeminjam,
      tipe,
      keterangan || undefined,
      selectedPinjamId || undefined
    );
    setJumlah('');
    setNamaPeminjam('');
    setKeterangan('');
    setSelectedPinjamId(null);
    handlePinjamSuccess();
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

      {action === 'pinjam' ? (
        <>
          <div>
            <label htmlFor="nama-peminjam" className="block text-sm font-medium mb-2">
              Pilih Pangkalan
            </label>
            <select
              id="nama-peminjam"
              value={namaPeminjam}
              onChange={(e) => setNamaPeminjam(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Pilih Pangkalan --</option>
              {LOKASI_PANGKALAN.map((pangkalan) => (
                <option key={pangkalan} value={pangkalan}>
                  {pangkalan}
                </option>
              ))}
            </select>
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
              required
              placeholder="Masukkan jumlah tabung yang dipinjamkan"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="kembali-peminjam" className="block text-sm font-medium mb-2">
              Pilih Peminjam
            </label>
            <select
              id="kembali-peminjam"
              value={selectedPinjamId || ''}
              onChange={(e) => setSelectedPinjamId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Pilih peminjam --</option>
              {pinjamRecords.map((record) => {
                const sisaPinjam = record.jumlahPinjam - record.jumlahKembali;
                const tipeLabel = record.tipe === 'kosong' ? '(Kosong)' : '(Isi)';
                return (
                  <option key={record.id} value={record.id}>
                    {record.namaPeminjam} {tipeLabel} - Sisa: {sisaPinjam} tabung
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="jumlah-kembali" className="block text-sm font-medium mb-2">
              Jumlah Dikembalikan
            </label>
            <input
              id="jumlah-kembali"
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={1}
              max={stokTabungPinjam}
              required
              placeholder={`Maks: ${stokTabungPinjam}`}
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="pinjam-catatan" className="block text-sm font-medium mb-2">
          Catatan (Opsional)
        </label>
        <textarea
          id="pinjam-catatan"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Catatan tambahan (nomor tabung, kondisi, dll)"
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