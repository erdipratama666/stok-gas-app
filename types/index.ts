// This file exports TypeScript types and interfaces used throughout the application.

export interface Transaction {
  id: number;
  tanggal: string;
  tipe: 'masuk' | 'keluar';
  jumlah: number;
  pangkalan?: string;
  keterangan: string;
}

export interface Stock {
  tabungIsi: number;
  tabungKosong: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}