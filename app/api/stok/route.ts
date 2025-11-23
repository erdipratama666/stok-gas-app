import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    let stok = await prisma.stok.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    // Jika belum ada stok, buat default
    if (!stok) {
      stok = await prisma.stok.create({
        data: { tabungIsi: 0, tabungKosong: 0 }
      });
    }

    return NextResponse.json({
      tabungIsi: stok.tabungIsi,
      tabungKosong: stok.tabungKosong
    });
  } catch (error) {
    console.error('Error fetching stok:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data stok' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tipe, jumlah, keterangan } = body;

    // Validasi input
    if (!action || !tipe || !jumlah) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    if (!['isi', 'kosong'].includes(tipe)) {
      return NextResponse.json(
        { error: 'Tipe tabung tidak valid' },
        { status: 400 }
      );
    }

    if (!['masuk', 'keluar', 'pinjam'].includes(action)) {
      return NextResponse.json(
        { error: 'Action tidak valid (masuk/keluar/pinjam)' },
        { status: 400 }
      );
    }

    // Ambil stok terbaru
    let stok = await prisma.stok.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!stok) {
      stok = await prisma.stok.create({
        data: { tabungIsi: 0, tabungKosong: 0 }
      });
    }

    let newTabungIsi = stok.tabungIsi;
    let newTabungKosong = stok.tabungKosong;



    // GAS MASUK
    if (action === 'masuk') {
      if (tipe === 'isi') newTabungIsi += jumlah;
      else newTabungKosong += jumlah;
    }

    // GAS KELUAR atau PINJAM
    if (action === 'keluar' || action === 'pinjam') {
      if (tipe === 'isi') {
        if (jumlah > stok.tabungIsi) {
          return NextResponse.json(
            { error: `Stok tabung isi tidak cukup! Stok saat ini: ${stok.tabungIsi}` },
            { status: 400 }
          );
        }
        newTabungIsi -= jumlah;
      } else {
        if (jumlah > stok.tabungKosong) {
          return NextResponse.json(
            { error: `Stok tabung kosong tidak cukup! Stok saat ini: ${stok.tabungKosong}` },
            { status: 400 }
          );
        }
        newTabungKosong -= jumlah;
      }
    }


    const [updatedStok] = await prisma.$transaction([
      // simpan versi stok baru
      prisma.stok.create({
        data: {
          tabungIsi: newTabungIsi,
          tabungKosong: newTabungKosong
        }
      }),

      // simpan log transaksi
      prisma.transaksi.create({
        data: {
          action,
          tipe,
          jumlah,
          keterangan: keterangan || ''
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message:
        action === 'masuk'
          ? 'Gas masuk berhasil dicatat'
          : action === 'keluar'
          ? 'Gas keluar berhasil dicatat'
          : 'Gas pinjam berhasil dicatat',
      stok: {
        tabungIsi: updatedStok.tabungIsi,
        tabungKosong: updatedStok.tabungKosong
      }
    });
  } catch (error) {
    console.error('Error updating stok:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
