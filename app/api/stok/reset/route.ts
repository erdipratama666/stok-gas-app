import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    await prisma.transaksi.deleteMany({});
    await prisma.stok.create({
      data: {
        tabungIsi: 0,
        tabungKosong: 0,
        tabungPinjam: 0,
      },
    });

    return NextResponse.json({ success: true, message: 'Reset berhasil' });
  } catch (err) {
    console.error('POST /api/stok/reset error', err);
    return NextResponse.json({ error: 'Gagal reset stok' }, { status: 500 });
  }
}