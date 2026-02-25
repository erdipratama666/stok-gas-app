-- AlterTable
ALTER TABLE "transaksi" ADD COLUMN     "lokasi" TEXT;

-- CreateTable
CREATE TABLE "tabung_pinjam" (
    "id" SERIAL NOT NULL,
    "namaPeminjam" TEXT NOT NULL,
    "jumlahPinjam" INTEGER NOT NULL,
    "jumlahKembali" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'dipinjam',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tabung_pinjam_pkey" PRIMARY KEY ("id")
);
