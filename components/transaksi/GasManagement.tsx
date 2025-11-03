'use client';
import React, { useState, useEffect } from 'react';
import GasMasukForm from './GasMasukForm';
import GasKeluarForm from './GasKeluarForm';
import StockOverview from '../stok/StockOverview';

type TipeTabung = 'isi' | 'kosong';

const GasManagement: React.FC = () => {
  const [stokTabungIsi, setStokTabungIsi] = useState(0);
  const [stokTabungKosong, setStokTabungKosong] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch stok saat pertama kali load
  useEffect(() => {
    fetchStok();
  }, []);

  const fetchStok = async () => {
    try {
      const response = await fetch('/api/stok');
      const data = await response.json();
      setStokTabungIsi(data.tabungIsi);
      setStokTabungKosong(data.tabungKosong);
    } catch (error) {
      console.error('Error fetching stok:', error);
      alert('Gagal memuat data stok');
    }
  };

  const handleGasMasuk = async (jumlah: number, keterangan: string, tipe: TipeTabung) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'masuk',
          tipe,
          jumlah,
          keterangan
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Gagal mencatat gas masuk');
        return;
      }

      // Update stok dari response
      setStokTabungIsi(data.stok.tabungIsi);
      setStokTabungKosong(data.stok.tabungKosong);
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mencatat gas masuk');
    } finally {
      setLoading(false);
    }
  };

  const handleGasKeluar = async (jumlah: number, keterangan: string, tipe: TipeTabung) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'keluar',
          tipe,
          jumlah,
          keterangan
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Gagal mencatat gas keluar');
        return;
      }

      // Update stok dari response
      setStokTabungIsi(data.stok.tabungIsi);
      setStokTabungKosong(data.stok.tabungKosong);
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mencatat gas keluar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manajemen Stok Gas</h1>
        
        {/* Tampilan Overview Stok */}
        <StockOverview 
          stokTabungIsi={stokTabungIsi} 
          stokTabungKosong={stokTabungKosong} 
        />

        {/* Grid Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GasMasukForm onGasMasuk={handleGasMasuk} />
          <GasKeluarForm onGasKeluar={handleGasKeluar} />
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-lg">Memproses...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GasManagement;