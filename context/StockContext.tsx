'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type TipeTabung = 'isi' | 'kosong' | 'pinjam';

interface StockContextType {
  stokIsi: number;
  stokKosong: number;
  stokPinjam: number;
  addStock: (tipe: TipeTabung, jumlah: number) => void;
  removeStock: (tipe: TipeTabung, jumlah: number) => boolean;
  pinjamStock: (tipe: TipeTabung, jumlah: number) => boolean;
  resetStock: () => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stokIsi, setStokIsi] = useState(0);
  const [stokKosong, setStokKosong] = useState(0);
  const [stokPinjam, setStokPinjam] = useState(0);

  useEffect(() => {
    const load = () => {
      const isi = localStorage.getItem('stokIsi');
      const kosong = localStorage.getItem('stokKosong');
      const pinjam = localStorage.getItem('stokPinjam');
      if (isi) setStokIsi(Number(isi));
      if (kosong) setStokKosong(Number(kosong));
      if (pinjam) setStokPinjam(Number(pinjam));
    };
    load();
    window.addEventListener('stok:updated', load);
    return () => window.removeEventListener('stok:updated', load);
  }, []);

  const persist = (isi: number, kosong: number, pinjam: number) => {
    localStorage.setItem('stokIsi', String(isi));
    localStorage.setItem('stokKosong', String(kosong));
    localStorage.setItem('stokPinjam', String(pinjam));
    setStokIsi(isi);
    setStokKosong(kosong);
    setStokPinjam(pinjam);
    window.dispatchEvent(new CustomEvent('stok:updated'));
  };

  const addStock = (tipe: TipeTabung, jumlah: number) => {
    if (tipe === 'isi') persist(stokIsi + jumlah, stokKosong, stokPinjam);
    else if (tipe === 'kosong') persist(stokIsi, stokKosong + jumlah, stokPinjam);
    else if (tipe === 'pinjam') persist(stokIsi, stokKosong, stokPinjam + jumlah);
  };

  const removeStock = (tipe: TipeTabung, jumlah: number) => {
    if (tipe === 'isi') {
      if (stokIsi < jumlah) return false;
      persist(stokIsi - jumlah, stokKosong, stokPinjam);
      return true;
    } else if (tipe === 'kosong') {
      if (stokKosong < jumlah) return false;
      persist(stokIsi, stokKosong - jumlah, stokPinjam);
      return true;
    } else if (tipe === 'pinjam') {
      if (stokPinjam < jumlah) return false;
      persist(stokIsi, stokKosong, stokPinjam - jumlah);
      return true;
    }
    return false;
  };

  const pinjamStock = (tipe: TipeTabung, jumlah: number) => {
    return removeStock(tipe, jumlah);
  };

  const resetStock = () => {
    persist(0, 0, 0);
    localStorage.removeItem('riwayatTransaksi');
    localStorage.removeItem('pinjamList');
  };

  return (
    <StockContext.Provider value={{ stokIsi, stokKosong, stokPinjam, addStock, removeStock, pinjamStock, resetStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error('useStock must be used within StockProvider');
  return context;
};
