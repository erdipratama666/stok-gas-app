import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Ambil data stok terbaru
export async function GET() {
  try {
    let stok = await prisma.stok.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    // Jika belum ada data, create default
    if (!stok) {
      stok = await prisma.stok.create({
        data: {
          tabungIsi: 0,
          tabungKosong: 0
        }
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

// POST - Update stok (masuk/keluar)
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

    if (tipe !== 'isi' && tipe !== 'kosong') {
      return NextResponse.json(
        { error: 'Tipe tabung tidak valid' },
        { status: 400 }
      );
    }

    if (action !== 'masuk' && action !== 'keluar') {
      return NextResponse.json(
        { error: 'Action tidak valid' },
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

    // Hitung stok baru
    if (action === 'masuk') {
      if (tipe === 'isi') {
        newTabungIsi += jumlah;
      } else {
        newTabungKosong += jumlah;
      }
    } else if (action === 'keluar') {
      if (tipe === 'isi') {
        if (stok.tabungIsi < jumlah) {
          return NextResponse.json(
            { error: `Stok tabung isi tidak cukup! Stok saat ini: ${stok.tabungIsi}` },
            { status: 400 }
          );
        }
        newTabungIsi -= jumlah;
      } else {
        if (stok.tabungKosong < jumlah) {
          return NextResponse.json(
            { error: `Stok tabung kosong tidak cukup! Stok saat ini: ${stok.tabungKosong}` },
            { status: 400 }
          );
        }
        newTabungKosong -= jumlah;
      }
    }

    // Update stok dan catat transaksi dalam satu transaction
    const [updatedStok, transaksi] = await prisma.$transaction([
      prisma.stok.create({
        data: {
          tabungIsi: newTabungIsi,
          tabungKosong: newTabungKosong
        }
      }),
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
      message: `Gas ${action} berhasil dicatat`,
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