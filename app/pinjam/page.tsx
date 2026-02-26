'use client';
import { useState, useEffect } from 'react';
import TabungPinjamForm from '@/components/transaksi/TabungPinjamForm';

type Stok = {
  tabungIsi: number;
  tabungKosong: number;
  tabungPinjam: number;
};

export default function PinjamPage() {
  const [stok, setStok] = useState<Stok>({
    tabungIsi: 0,
    tabungKosong: 0,
    tabungPinjam: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStok();
  }, []);

  const fetchStok = async () => {
    try {
      const res = await fetch('/api/stok');
      if (res.ok) {
        const data = await res.json();
        setStok({
          tabungIsi: data.tabungIsi ?? 0,
          tabungKosong: data.tabungKosong ?? 0,
          tabungPinjam: data.tabungPinjam ?? 0,
        });
      }
    } catch (err) {
      console.error('Error fetching stok:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabungPinjam = async (
    action: 'pinjam' | 'kembali',
    jumlah: number,
    namaPeminjam: string,
    tipe: 'isi' | 'kosong',
    catatan?: string,
    pinjamId?: number
  ) => {
    try {
      const res = await fetch('/api/stok/pinjam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          tipe,
          jumlah,
          namaPeminjam,
          catatan,
          pinjamId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStok({
          tabungIsi: data.stok.tabungIsi ?? 0,
          tabungKosong: data.stok.tabungKosong ?? 0,
          tabungPinjam: data.stok.tabungPinjam ?? 0,
        });

        alert(data.message || (action === 'pinjam' ? 'Tabung berhasil dipinjamkan!' : 'Tabung berhasil dikembalikan!'));
        await fetchStok(); // Refresh data
      } else {
        alert(data.error || 'Gagal memproses tabung pinjam');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan: ' + String(err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  // ✅ Return baru tanpa UI lain
  return (
    <div className="p-4">
      <TabungPinjamForm 
        onTabungPinjam={handleTabungPinjam} 
        stokTabungPinjam={stok.tabungPinjam} 
      />
    </div>
  );
}
