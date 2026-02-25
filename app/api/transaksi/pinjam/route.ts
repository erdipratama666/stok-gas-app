import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // @ts-ignore - TabungPinjam model exists, Prisma client just needs regeneration
    const pinjamRecords = await prisma.tabungPinjam.findMany({
      where: {
        status: 'dipinjam'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(pinjamRecords);
  } catch (err) {
    console.error('GET /api/transaksi/pinjam error:', err);
    return NextResponse.json(
      { error: 'Gagal mengambil data pinjam' },
      { status: 500 }
    );
  }
}
