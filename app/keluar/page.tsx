'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GasKeluarForm from '@/components/transaksi/GasKeluarForm';
import StockOverview from '@/components/stok/StockOverview';

type Stok = {
  tabungIsi: number;
  tabungKosong: number;
  tabungPinjam: number;
};

export default function KeluarPage() {
  const router = useRouter();
  const [stok, setStok] = useState<Stok>({ 
    tabungIsi: 0, 
    tabungKosong: 0, 
    tabungPinjam: 0 
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
        console.log('📦 Stok loaded:', data);
        setStok(data);
      }
    } catch (err) {
      console.error('Error fetching stok:', err);
      alert('Gagal memuat data stok');
    } finally {
      setLoading(false);
    }
  };

  const handleGasKeluar = async (
    jumlah: number, 
    keterangan: string, 
    tipe: 'isi' | 'kosong'
  ) => {
    console.log('📤 Mengirim data keluar:', { action: 'keluar', tipe, jumlah, keterangan });

    try {
      const res = await fetch('/api/stok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'keluar',
          tipe,
          jumlah,
          keterangan
        })
      });

      const data = await res.json();
      console.log('📥 Response:', data);

      if (res.ok) {
        // Update stok langsung dari response
        setStok({
          tabungIsi: data.stok.tabungIsi,
          tabungKosong: data.stok.tabungKosong,
          tabungPinjam: data.stok.tabungPinjam
        });
        
        alert(`✅ Berhasil mencatat keluar ${jumlah} tabung ${tipe}`);
        
        // Refresh stok untuk memastikan data terbaru
        await fetchStok();
      } else {
        console.error('❌ Error:', data.error);
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('❌ Catch error:', err);
      alert('Terjadi kesalahan: ' + err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/stok')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Stok Gas
          </button>
          <h1 className="text-3xl font-bold">Transaksi Keluar</h1>
        </div>

        {/* Stock Overview */}
        <div className="mb-8">
          <StockOverview
            stokTabungIsi={stok.tabungIsi}
            stokTabungKosong={stok.tabungKosong}
            stokTabungPinjam={stok.tabungPinjam}
          />
        </div>

        {/* Form */}
        <GasKeluarForm onGasKeluar={handleGasKeluar} />
      </div>
    </div>
  );
}