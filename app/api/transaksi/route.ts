import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // ================== PINJAMAN SAAT INI ==================
    if (action === 'pinjam') {
      const transaksi = await prisma.transaksi.findMany({
        where: { action: { in: ['pinjam', 'kembali'] } },
        orderBy: { createdAt: 'desc' }
      });

      const grouped = transaksi.reduce((acc: any, t) => {
        const key = t.keterangan || 'Unknown';

        if (!acc[key]) {
          acc[key] = {
            namaPangkalan: key,
            jumlahPinjam: 0,
            jumlahKembali: 0,
            firstId: t.id,
            createdAt: t.createdAt
          };
        }

        if (t.action === 'pinjam') acc[key].jumlahPinjam += t.jumlah;
        if (t.action === 'kembali') acc[key].jumlahKembali += t.jumlah;

        return acc;
      }, {});

      const result = Object.values(grouped)
        .map((g: any) => ({
          id: g.firstId,
          namaPangkalan: g.namaPangkalan,
          jumlah: g.jumlahPinjam - g.jumlahKembali,
          createdAt: g.createdAt
        }))
        .filter((r: any) => r.jumlah > 0);

      return NextResponse.json(result);
    }

    // ================== SEMUA TRANSAKSI ==================
    const transaksi = await prisma.transaksi.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return NextResponse.json(transaksi);
  } catch (err) {
    console.error('GET /api/transaksi error:', err);
    return NextResponse.json({ error: 'Gagal mengambil transaksi' }, { status: 500 });
  }
}
