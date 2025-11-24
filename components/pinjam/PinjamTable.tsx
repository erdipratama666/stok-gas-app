'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';

type PinjamRow = {
  id: string;
  namaPangkalan: string;
  jumlah: number;
  status: 'dipinjam' | 'kembali';
  createdAt: string;
};

const STORAGE_KEY = 'pinjamList';

const generateId = () => {
  return (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? (crypto as any).randomUUID()
    : String(Date.now()) + Math.random().toString(36).slice(2);
};

export default function PinjamTable() {
  const [rows, setRows] = useState<PinjamRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ namaPangkalan: string; jumlah: string }>({ namaPangkalan: '', jumlah: '' });

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem(STORAGE_KEY) || '[]';
      try {
        setRows(JSON.parse(raw));
      } catch {
        setRows([]);
      }
    };
    load();
    window.addEventListener('pinjam:updated', load);
    return () => window.removeEventListener('pinjam:updated', load);
  }, []);

  const persist = (nextRows: PinjamRow[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRows));
    setRows(nextRows);
    window.dispatchEvent(new CustomEvent('pinjam:updated'));
  };

  const handleAdd = () => {
    if (!draft.namaPangkalan.trim() || Number(draft.jumlah) <= 0) {
      alert('Masukkan nama pangkalan dan jumlah valid.');
      return;
    }
    const newRow: PinjamRow = {
      id: generateId(),
      namaPangkalan: draft.namaPangkalan.trim(),
      jumlah: Number(draft.jumlah),
      status: 'dipinjam',
      createdAt: new Date().toISOString(),
    };
    persist([newRow, ...rows]);
    setDraft({ namaPangkalan: '', jumlah: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus catatan pinjam ini?')) return;
    persist(rows.filter((r) => r.id !== id));
  };

  const startEdit = (r: PinjamRow) => {
    setEditingId(r.id);
    setDraft({ namaPangkalan: r.namaPangkalan, jumlah: String(r.jumlah) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ namaPangkalan: '', jumlah: '' });
  };

  const saveEdit = (id: string) => {
    if (!draft.namaPangkalan.trim() || Number(draft.jumlah) <= 0) {
      alert('Masukkan nama pangkalan dan jumlah valid.');
      return;
    }
    const next = rows.map((r) => (r.id === id ? { ...r, namaPangkalan: draft.namaPangkalan.trim(), jumlah: Number(draft.jumlah) } : r));
    persist(next);
    cancelEdit();
  };

  const toggleStatus = (id: string) => {
    const next = rows.map((r) => (r.id === id ? { ...r, status: r.status === 'dipinjam' ? 'kembali' : 'dipinjam' } : r));
    persist(next);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Catatan Pinjam</h3>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          aria-label="Nama pangkalan"
          placeholder="Nama pangkalan"
          className="px-3 py-2 rounded border"
          value={draft.namaPangkalan}
          onChange={(e) => setDraft((d) => ({ ...d, namaPangkalan: e.target.value }))}
        />
        <input
          aria-label="Jumlah tabung"
          placeholder="Jumlah"
          className="px-3 py-2 rounded border"
          type="number"
          min={1}
          value={draft.jumlah}
          onChange={(e) => setDraft((d) => ({ ...d, jumlah: e.target.value }))}
        />
        <div className="flex gap-2">
          <button type="button" onClick={handleAdd} className="bg-blue-600 text-white px-3 py-2 rounded">
            Tambah
          </button>
          <button
            type="button"
            onClick={() => setDraft({ namaPangkalan: '', jumlah: '' })}
            className="bg-gray-100 px-3 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {rows.length === 0 && (
          <div className="text-center text-gray-500 py-6">Belum ada catatan pinjam</div>
        )}

        {rows.map((r) => (
          <div key={r.id} className="border rounded-lg p-3 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">Pangkalan</div>
                <div className="font-medium text-gray-800">{r.namaPangkalan}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Jumlah</div>
                <div className="font-semibold text-gray-800">{r.jumlah}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => toggleStatus(r.id)}
                className={`px-2 py-1 rounded text-sm ${
                  r.status === 'dipinjam' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {r.status}
              </button>

              <div className="flex items-center gap-2">
                {editingId === r.id ? (
                  <>
                    <button onClick={() => saveEdit(r.id)} className="bg-green-600 text-white px-2 py-1 rounded">
                      <Check size={14} />
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-200 px-2 py-1 rounded">
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(r)} className="bg-yellow-400 text-white px-2 py-1 rounded">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="bg-red-600 text-white px-2 py-1 rounded">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingId === r.id && (
              <div className="mt-3 space-y-2">
                <input
                  className="w-full px-2 py-1 border rounded"
                  value={draft.namaPangkalan}
                  onChange={(e) => setDraft((d) => ({ ...d, namaPangkalan: e.target.value }))}
                />
                <input
                  className="w-full px-2 py-1 border rounded"
                  type="number"
                  min={1}
                  value={draft.jumlah}
                  onChange={(e) => setDraft((d) => ({ ...d, jumlah: e.target.value }))}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="px-3 py-2">Nama Pangkal</th>
              <th className="px-3 py-2 w-28">Jumlah</th>
              <th className="px-3 py-2 w-32">Status</th>
              <th className="px-3 py-2 w-36">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  Belum ada catatan pinjam
                </td>
              </tr>
            )}

            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 align-top">
                  {editingId === r.id ? (
                    <input
                      id={`nama-${r.id}`}
                      className="px-2 py-1 border rounded w-full"
                      value={draft.namaPangkalan}
                      onChange={(e) => setDraft((d) => ({ ...d, namaPangkalan: e.target.value }))}
                    />
                  ) : (
                    <div>{r.namaPangkalan}</div>
                  )}
                </td>

                <td className="px-3 py-2 align-top">
                  {editingId === r.id ? (
                    <input
                      id={`jumlah-${r.id}`}
                      className="px-2 py-1 border rounded w-full"
                      type="number"
                      min={1}
                      value={draft.jumlah}
                      onChange={(e) => setDraft((d) => ({ ...d, jumlah: e.target.value }))}
                    />
                  ) : (
                    <div className="font-medium">{r.jumlah}</div>
                  )}
                </td>

                <td className="px-3 py-2 align-top">
                  <button
                    onClick={() => toggleStatus(r.id)}
                    className={`px-2 py-1 rounded text-sm ${
                      r.status === 'dipinjam' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}
                    aria-label={`Toggle status ${r.namaPangkalan}`}
                  >
                    {r.status}
                  </button>
                </td>

                <td className="px-3 py-2 align-top">
                  {editingId === r.id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => saveEdit(r.id)} className="bg-green-600 text-white px-2 py-1 rounded" title="Simpan">
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="bg-gray-200 px-2 py-1 rounded" title="Batal">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(r)} className="bg-yellow-400 text-white px-2 py-1 rounded" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="bg-red-600 text-white px-2 py-1 rounded" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}