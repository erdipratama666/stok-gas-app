import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const action = String(body.action || "").trim().toLowerCase();
    const jumlah = Number(body.jumlah);
    const tipe = String(body.tipe || "").trim().toLowerCase();
    const namaPeminjam = String(body.namaPeminjam || "").trim();
    const pinjamId = body.pinjamId ?? null;

    // Validasi input
    if (!action || !["pinjam", "kembali"].includes(action)) {
      return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
    }

    if (Number.isNaN(jumlah) || jumlah <= 0) {
      return NextResponse.json({ error: "Jumlah harus > 0" }, { status: 400 });
    }

    if (!["isi", "kosong"].includes(tipe)) {
      return NextResponse.json({ error: "Tipe tidak valid" }, { status: 400 });
    }

    // Fetch current stok
    let stok = await prisma.stok.findFirst({ orderBy: { id: "desc" } });
    if (!stok) {
      stok = await prisma.stok.create({
        data: { tabungIsi: 0, tabungKosong: 0, tabungPinjam: 0 },
      });
    }

    let newIsi = stok.tabungIsi;
    let newKosong = stok.tabungKosong;
    let newPinjam = (stok as any).tabungPinjam ?? 0;

    // Handle pinjam
    if (action === "pinjam") {
      if (tipe === "isi") {
        if (jumlah > stok.tabungIsi) {
          return NextResponse.json(
            { error: `Stok isi tidak cukup (${stok.tabungIsi})` },
            { status: 400 }
          );
        }
        newIsi -= jumlah;
      } else if (tipe === "kosong") {
        if (jumlah > stok.tabungKosong) {
          return NextResponse.json(
            { error: `Stok kosong tidak cukup (${stok.tabungKosong})` },
            { status: 400 }
          );
        }
        newKosong -= jumlah;
      }
      newPinjam += jumlah;
    }

    // Handle kembali
    if (action === "kembali") {
      if (jumlah > newPinjam) {
        return NextResponse.json(
          { error: `Jumlah kembali melebihi tabung dipinjam (${newPinjam})` },
          { status: 400 }
        );
      }

      if (tipe === "isi") newIsi += jumlah;
      else if (tipe === "kosong") newKosong += jumlah;

      newPinjam -= jumlah;
    }

    // Create new stok record
    const createdStok = await prisma.stok.create({
      data: {
        tabungIsi: newIsi,
        tabungKosong: newKosong,
        tabungPinjam: newPinjam,
      } as any,
    });

    // Create transaksi record
    const transaksi = await prisma.transaksi.create({
      data: {
        action,
        tipe,
        jumlah,
        keterangan: namaPeminjam,
        createdBy: "user",
      } as any,
    });

    // Try to handle TabungPinjam (with fallback)
    try {
      if (action === "pinjam") {
        // @ts-ignore
        await (prisma as any).tabungPinjam?.create?.({
          data: {
            namaPeminjam: namaPeminjam,
            jumlahPinjam: jumlah,
            jumlahKembali: 0,
            status: "dipinjam",
            catatan: "",
          },
        });
      } else if (action === "kembali" && pinjamId) {
        // @ts-ignore
        await (prisma as any).tabungPinjam?.update?.({
          where: { id: pinjamId },
          data: {
            jumlahKembali: {
              increment: jumlah,
            },
          },
        });
      }
    } catch (e) {
      console.warn("TabungPinjam operation skipped:", e);
      // Lanjut tanpa TabungPinjam record - ini opsional
    }

    return NextResponse.json({
      success: true,
      message: action === "pinjam" 
        ? `Tabung berhasil dipinjamkan kepada ${namaPeminjam}!`
        : `Tabung berhasil dikembalikan dari ${namaPeminjam}!`,
      stok: {
        tabungIsi: createdStok.tabungIsi,
        tabungKosong: createdStok.tabungKosong,
        tabungPinjam: (createdStok as any).tabungPinjam ?? newPinjam,
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/stok/pinjam error:", errorMsg, err);
    return NextResponse.json(
      { error: `Terjadi kesalahan: ${errorMsg}` },
      { status: 500 }
    );
  }
}
