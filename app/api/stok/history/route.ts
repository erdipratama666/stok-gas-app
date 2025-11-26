import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const transaksi = await prisma.transaksi.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, data: transaksi });
  } catch (err) {
    console.error('GET /api/stok/history error', err);
    return NextResponse.json({ error: 'Gagal mengambil riwayat' }, { status: 500 });
  }
}