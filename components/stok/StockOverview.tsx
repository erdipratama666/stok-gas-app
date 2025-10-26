'use client';
import React from 'react';

interface Props {
  stokTabungIsi: number;
  stokTabungKosong: number;
}

export default function StockOverview({ stokTabungIsi, stokTabungKosong }: Props) {
  const total = Number(stokTabungIsi || 0) + Number(stokTabungKosong || 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-500">Total Tabung</div>
        <div className="text-3xl font-bold">{total}</div>
        <div className="text-xs text-gray-400 mt-1">Keseluruhan</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-500">Tabung Isi</div>
        <div className="text-3xl font-bold text-green-600">{stokTabungIsi}</div>
        <div className="text-xs text-gray-400 mt-1">Siap distribusi</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-500">Tabung Kosong</div>
        <div className="text-3xl font-bold text-orange-600">{stokTabungKosong}</div>
        <div className="text-xs text-gray-400 mt-1">Perlu pengisian</div>
      </div>
    </div>
  );
}