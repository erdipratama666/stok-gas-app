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
    keterangan: string,
    tipe: 'isi' | 'kosong'
  ) => {
    try {
      const res = await fetch('/api/stok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          tipe,
          jumlah,
          keterangan,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStok({
          tabungIsi: data.stok.tabungIsi ?? 0,
          tabungKosong: data.stok.tabungKosong ?? 0,
          tabungPinjam: data.stok.tabungPinjam ?? 0,
        });

        alert(action === 'pinjam' ? 'Tabung berhasil dipinjamkan!' : 'Tabung berhasil dikembalikan!');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal memproses tabung pinjam');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan');
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
