'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type TipeTabung = 'isi' | 'kosong';

type StockContextType = {
  stokIsi: number;
  stokKosong: number;
  stokPinjam: number;
  addStock: (tipe: TipeTabung, jumlah: number) => void;
  removeStock: (tipe: TipeTabung, jumlah: number) => boolean;
  pinjamStock: (tipe: TipeTabung, jumlah: number) => boolean;
  kembalikanPinjam: (jumlah: number) => boolean;
  resetStock: () => void;
  reload: () => void;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children: ReactNode }) => {
  const [stokIsi, setStokIsi] = useState<number>(0);
  const [stokKosong, setStokKosong] = useState<number>(0);
  const [stokPinjam, setStokPinjam] = useState<number>(0);

  const load = () => {
    if (typeof window === 'undefined') return;
    setStokIsi(parseInt(localStorage.getItem('stokTabungIsi') || '0', 10));
    setStokKosong(parseInt(localStorage.getItem('stokTabungKosong') || '0', 10));
    setStokPinjam(parseInt(localStorage.getItem('stokTabungPinjam') || '0', 10));
  };

  useEffect(() => {
    load();
    const onStorage = () => load();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = (key: string, value: number) => {
    localStorage.setItem(key, String(value));
    window.dispatchEvent(new CustomEvent('stok:updated'));
  };

  useEffect(() => {
    const onCustom = () => load();
    window.addEventListener('stok:updated', onCustom);
    return () => window.removeEventListener('stok:updated', onCustom);
  }, []);

  // ---- GAS MASUK ----
  const addStock = (tipe: TipeTabung, jumlah: number) => {
    if (tipe === 'isi') {
      const n = stokIsi + jumlah;
      setStokIsi(n);
      persist('stokTabungIsi', n);
    } else {
      const n = stokKosong + jumlah;
      setStokKosong(n);
      persist('stokTabungKosong', n);
    }
  };

  // ---- GAS KELUAR ----
  const removeStock = (tipe: TipeTabung, jumlah: number): boolean => {
    if (tipe === 'isi') {
      if (jumlah > stokIsi) return false;
      const n = stokIsi - jumlah;
      setStokIsi(n);
      persist('stokTabungIsi', n);
      return true;
    } else {
      if (jumlah > stokKosong) return false;
      const n = stokKosong - jumlah;
      setStokKosong(n);
      persist('stokTabungKosong', n);
      return true;
    }
  };

  // ---- PINJAM TABUNG ----
  const pinjamStock = (tipe: TipeTabung, jumlah: number): boolean => {
    if (tipe === 'isi') {
      if (jumlah > stokIsi) return false;

      // kurangi stok isi
      const newIsi = stokIsi - jumlah;
      setStokIsi(newIsi);
      persist('stokTabungIsi', newIsi);

    } else {
      if (jumlah > stokKosong) return false;

      // kurangi stok kosong
      const newKosong = stokKosong - jumlah;
      setStokKosong(newKosong);
      persist('stokTabungKosong', newKosong);
    }

    // tambah stok pinjam
    const newPinjam = stokPinjam + jumlah;
    setStokPinjam(newPinjam);
    persist('stokTabungPinjam', newPinjam);

    return true;
  };

  // ---- MENGEMBALIKAN TABUNG PINJAMAN ----
  const kembalikanPinjam = (jumlah: number): boolean => {
    if (jumlah > stokPinjam) return false;

    // kurangi pinjam
    const newPinjam = stokPinjam - jumlah;
    setStokPinjam(newPinjam);
    persist('stokTabungPinjam', newPinjam);

    // tabung kembali → masuk kategori KOSONG
    const newKosong = stokKosong + jumlah;
    setStokKosong(newKosong);
    persist('stokTabungKosong', newKosong);

    return true;
  };

  const resetStock = () => {
    setStokIsi(0);
    setStokKosong(0);
    setStokPinjam(0);

    localStorage.removeItem('stokTabungIsi');
    localStorage.removeItem('stokTabungKosong');
    localStorage.removeItem('stokTabungPinjam');
    localStorage.removeItem('riwayatTransaksi');

    window.dispatchEvent(new CustomEvent('stok:updated'));
    window.dispatchEvent(new CustomEvent('riwayat:cleared'));
  };

  return (
    <StockContext.Provider
      value={{
        stokIsi,
        stokKosong,
        stokPinjam,
        addStock,
        removeStock,
        pinjamStock,
        kembalikanPinjam,
        resetStock,
        reload: load,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error('useStock must be used within StockProvider');
  return ctx;
};
