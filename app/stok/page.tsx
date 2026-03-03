'use client';
import React, { useState, useEffect } from 'react';
import StockOverview from '@/components/stok/StockOverview';

type PinjamRecord = {
  id: number;
  namaPeminjam: string;
  tipe?: string; // 'isi' atau 'kosong' - tipe tabung yang dipinjam
  jumlahPinjam: number;
  jumlahKembali: number;
  status: string;
  catatan: string;
};

type Stok = {
  tabungIsi: number;
  tabungKosong: number;
  tabungPinjam: number;
};

export default function StockPage() {
  const [stok, setStok] = useState<Stok>({ 
    tabungIsi: 0, 
    tabungKosong: 0, 
    tabungPinjam: 0 
  });
  const [loading, setLoading] = useState(true);
  const [pinjamNotes, setPinjamNotes] = useState<PinjamRecord[]>([]);
  const [pinjamSummary, setPinjamSummary] = useState<Record<string, { isi: number; kosong: number; total: number }>>({});

  useEffect(() => {
    fetchStok();
    fetchPinjamNotes();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchPinjamNotes = async () => {
    try {
      const res = await fetch('/api/transaksi/pinjam');
      if (res.ok) {
        const data: PinjamRecord[] = await res.json();
        setPinjamNotes(data);
        
        // Build summary by borrower name with type breakdown
        const summary: Record<string, { isi: number; kosong: number; total: number }> = {};
        data.forEach((rec) => {
          const key = rec.namaPeminjam || 'Unknown';
          // @ts-ignore - tipe field added from schema update
          const tipe = rec.tipe || 'isi';
          
          if (!summary[key]) {
            summary[key] = { isi: 0, kosong: 0, total: 0 };
          }
          
          if (tipe === 'isi') {
            summary[key].isi += rec.jumlahPinjam;
          } else if (tipe === 'kosong') {
            summary[key].kosong += rec.jumlahPinjam;
          }
          summary[key].total += rec.jumlahPinjam;
        });
        setPinjamSummary(summary);
      }
    } catch (err) {
      console.error('Error fetching pinjam notes:', err);
    }
  };

  const handleReset = async () => {
    const confirmText = prompt(
      'PERINGATAN: Ini akan menghapus SEMUA data stok dan transaksi!\n\n' +
      'Ketik "RESET" (huruf besar) untuk konfirmasi:'
    );
    
    if (confirmText !== 'RESET') {
      if (confirmText !== null) {
        alert('Reset dibatalkan. Anda harus mengetik "RESET" dengan benar.');
      }
      return;
    }

    try {
      const res = await fetch('/api/stok/reset', {
        method: 'POST',
      });

      if (res.ok) {
        alert('✅ Semua stok dan riwayat telah di-reset.');
        window.location.reload();
      } else {
        alert('❌ Gagal reset. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error reset:', err);
      alert('❌ Terjadi kesalahan saat reset');
    }
  };

  const handleStokUpdate = () => {
    fetchStok();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Stok Gas</h2>
        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
        >
          Reset Stok & Riwayat
        </button>
      </div>

      <StockOverview
        stokTabungIsi={stok.tabungIsi}
        stokTabungKosong={stok.tabungKosong}
        stokTabungPinjam={stok.tabungPinjam}
      />

      {/* tampilkan catatan peminjaman terbaru */}
      {/* tampilkan ringkasan total pinjam per peminjam dengan breakdown isi/kosong */}
      {Object.keys(pinjamSummary).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Total Pinjam per Nama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(pinjamSummary).map(([name, breakdown]) => (
              <div key={name} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="font-semibold text-lg mb-2 text-gray-800">{name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tabung Isi:</span>
                    <span className="font-semibold text-green-600">{breakdown.isi} tabung</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tabung Kosong:</span>
                    <span className="font-semibold text-orange-600">{breakdown.kosong} tabung</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Total Pinjam:</span>
                    <span className="font-bold text-blue-600 text-lg">{breakdown.total} tabung</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}