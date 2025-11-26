import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let stok = await prisma.stok.findFirst({ orderBy: { id: 'desc' } });
    if (!stok) {
      stok = await prisma.stok.create({ 
        data: { tabungIsi: 0, tabungKosong: 0, tabungPinjam: 0 } 
      });
    }
    return NextResponse.json({
      tabungIsi: stok.tabungIsi,
      tabungKosong: stok.tabungKosong,
      tabungPinjam: (stok as any).tabungPinjam ?? 0,
    });
  } catch (err) {
    console.error('GET /api/stok error', err);
    return NextResponse.json({ error: 'Gagal mengambil stok' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body.action || '').trim();
    const tipe = String(body.tipe || '').trim();
    const jumlah = Number(body.jumlah);
    const keterangan = body.keterangan ?? '';

    if (!action || !tipe || Number.isNaN(jumlah)) {
      return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 });
    }

    let stok = await prisma.stok.findFirst({ orderBy: { id: 'desc' } });
    if (!stok) stok = await prisma.stok.create({ data: { tabungIsi: 0, tabungKosong: 0, tabungPinjam: 0 } });

    let newIsi = stok.tabungIsi;
    let newKosong = stok.tabungKosong;
    let newPinjam = (stok as any).tabungPinjam ?? 0;

    // validasi action
    if (!['masuk', 'keluar', 'pinjam'].includes(action)) {
      return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });
    }

    if (action === 'masuk') {
      if (tipe === 'isi') newIsi += jumlah;
      else if (tipe === 'kosong') newKosong += jumlah;
      else return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 });
    } else if (action === 'keluar') {
      if (tipe === 'isi') {
        if (jumlah > stok.tabungIsi) return NextResponse.json({ error: `Stok isi tidak cukup (${stok.tabungIsi})` }, { status: 400 });
        newIsi -= jumlah;
      } else if (tipe === 'kosong') {
        if (jumlah > stok.tabungKosong) return NextResponse.json({ error: `Stok kosong tidak cukup (${stok.tabungKosong})` }, { status: 400 });
        newKosong -= jumlah;
      } else return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 });
    } else if (action === 'pinjam') {
      if (tipe === 'isi') {
        if (jumlah > stok.tabungIsi) return NextResponse.json({ error: `Stok isi tidak cukup (${stok.tabungIsi})` }, { status: 400 });
        newIsi -= jumlah;
      } else if (tipe === 'kosong') {
        if (jumlah > stok.tabungKosong) return NextResponse.json({ error: `Stok kosong tidak cukup (${stok.tabungKosong})` }, { status: 400 });
        newKosong -= jumlah;
      } else return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 });
      newPinjam += jumlah;
    }

    // simpan stok baru + riwayat transaksi dalam 1 transaksi
    const [createdStok] = await prisma.$transaction([
      prisma.stok.create({
        data: {
          tabungIsi: newIsi,
          tabungKosong: newKosong,
          tabungPinjam: newPinjam,
        } as any,
      }),
      prisma.transaksi.create({
        data: { 
          action, 
          tipe, 
          jumlah, 
          keterangan: String(keterangan),
          createdBy: 'user', // bisa dari session nanti
        },
      }),
    ]);

    const responseStok = {
      tabungIsi: createdStok.tabungIsi,
      tabungKosong: createdStok.tabungKosong,
      tabungPinjam: (createdStok as any).tabungPinjam ?? newPinjam,
    };

    return NextResponse.json({ success: true, stok: responseStok });
  } catch (err) {
    console.error('POST /api/stok error', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
