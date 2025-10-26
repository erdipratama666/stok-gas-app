import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transaksi = await prisma.transaksi.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Ambil 100 transaksi terakhir
    });

    return NextResponse.json(transaksi);
  } catch (error) {
    console.error('Error fetching transaksi:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data transaksi' },
      { status: 500 }
    );
  }
}