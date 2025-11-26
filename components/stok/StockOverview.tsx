import React from 'react';

type Props = {
  stokTabungIsi: number;
  stokTabungKosong: number;
  stokTabungPinjam: number;
};

export default function StockOverview({ 
  stokTabungIsi, 
  stokTabungKosong, 
  stokTabungPinjam 
}: Props) {
  const totalTabung = stokTabungIsi + stokTabungKosong + stokTabungPinjam;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Stok Saat Ini</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Tabung */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Total Tabung</div>
          <div className="text-3xl font-bold text-gray-700">{totalTabung}</div>
          <div className="text-xs text-gray-500 mt-1">Isi + Kosong + Pinjam</div>
        </div>

        {/* Tabung Isi */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Tabung Isi</div>
          <div className="text-3xl font-bold text-green-700">{stokTabungIsi}</div>
          <div className="text-xs text-gray-500 mt-1">Siap distribusi</div>
        </div>

        {/* Tabung Kosong */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Tabung Kosong</div>
          <div className="text-3xl font-bold text-orange-700">{stokTabungKosong}</div>
          <div className="text-xs text-gray-500 mt-1">Perlu pengisian</div>
        </div>

        {/* Tabung Pinjam */}
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
          <div className="text-sm text-gray-600 mb-1">Tabung Dipinjam</div>
          <div className="text-3xl font-bold text-blue-700">{stokTabungPinjam}</div>
          <div className="text-xs text-gray-500 mt-1">Sedang dipinjam pelanggan</div>
        </div>
      </div>
    </div>
  );
}