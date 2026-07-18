import { Link, router } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import AdminLayout from '@/layouts/admin-layout';
import type { ProductPriceIndexProps } from '@/types';

export default function ProductPriceIndex({
    product,
    prices,
    categories,
}: ProductPriceIndexProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importCategoryId, setImportCategoryId] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!importFile || !importCategoryId) {
            alert('Pilih file dan kategori terlebih dahulu!');

            return;
        }

        setIsImporting(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;

                if (!data) {
return;
}

                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                
                const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
                
                const items = rows
                    .map((row) => {
                        const codeRaw = row[1];
                        const nameRaw = row[2];
                        const priceRaw = row[5];
                        
                        if (!codeRaw || !nameRaw || !priceRaw) {
return null;
}
                        
                        const price = typeof priceRaw === 'number' ? priceRaw : parseInt(String(priceRaw).replace(/[^0-9]/g, ''), 10);
                        
                        return {
                            code: String(codeRaw).trim(),
                            name: String(nameRaw).trim(),
                            price: price || 0,
                        };
                    })
                    .filter(Boolean);

                if (items.length === 0) {
                    alert('Tidak ada data valid yang ditemukan di file Excel.');
                    setIsImporting(false);

                    return;
                }

                router.post(`/admin/products/${product.id}/prices/import`, {
                    items,
                    category_id: importCategoryId
                }, {
                    onSuccess: () => {
                        setIsImportModalOpen(false);
                        setImportFile(null);
                        setImportCategoryId('');

                        if (fileInputRef.current) {
fileInputRef.current.value = '';
}
                    },
                    onFinish: () => setIsImporting(false)
                });
            };
            reader.readAsBinaryString(importFile);
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat memproses file Excel.');
            setIsImporting(false);
        }
    };
    const handleDelete = (priceId: number) => {
        if (!window.confirm('Hapus price list ini?')) {
            return;
        }

        router.delete(`/admin/products/${product.id}/prices/${priceId}`);
    };

    return (
        <AdminLayout
            title={`Price List - ${product.name}`}
            headerTitle="Product Prices"
        >
            <div className="space-y-4 p-4">
                <div>
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Produk
                    </Link>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {product.brand?.name}
                        </p>
                        <h1 className="text-xl font-semibold">
                            {product.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola daftar harga
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                            Import Excel
                        </button>
                        <Link
                            href={`/admin/products/${product.id}/prices/create`}
                            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                        >
                            + Tambah Price List
                        </Link>
                    </div>
                </div>

                {prices.data.length > 0 ? (
                    <div className="space-y-4">
                        <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                            <table className="w-full min-w-240 text-left text-sm">
                                <thead className="bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Kode
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Nominal
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Kategori
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Harga
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {prices.data.map((price) => (
                                    <tr
                                        key={price.id}
                                        className="border-t border-sidebar-border/50"
                                    >
                                        <td className="px-4 py-3">
                                            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                                                {price.code}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3">
                                            {price.display_name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {price.category?.name || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            Rp{' '}
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'decimal',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }).format(price.price)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    price.is_active
                                                        ? 'text-sm font-medium text-green-600'
                                                        : 'text-sm font-medium text-red-600'
                                                }
                                            >
                                                {price.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/prices/${price.id}/edit`}
                                                    className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(price.id)
                                                    }
                                                    className="inline-flex h-8 items-center rounded-md border border-red-300 px-3 text-xs font-medium text-red-600"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <Link
                            href={prices.prev_page_url || '#'}
                            className={`inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium ${prices.prev_page_url ? 'hover:bg-accent hover:text-accent-foreground' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                        >
                            Previous
                        </Link>
                        <Link
                            href={prices.next_page_url || '#'}
                            className={`inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium ${prices.next_page_url ? 'hover:bg-accent hover:text-accent-foreground' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                        >
                            Next
                        </Link>
                    </div>
                </div>
                ) : (
                    <div className="rounded border border-dashed border-muted-foreground p-8 text-center">
                        <p className="mb-4 text-muted-foreground">
                            Belum ada price list untuk produk ini
                        </p>
                        <Link
                            href={`/admin/products/${product.id}/prices/create`}
                            className="inline-block rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Tambah Price List Pertama
                        </Link>
                    </div>
                )}
            </div>

            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl border border-border">
                        <h2 className="mb-4 text-lg font-semibold">Import Price List (Excel)</h2>
                        <form onSubmit={handleImportSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Kategori Default</label>
                                    <select
                                        value={importCategoryId}
                                        onChange={(e) => setImportCategoryId(e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="">Pilih Kategori...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Digunakan jika produk baru ditemukan.
                                    </p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">File Excel (.xlsx, .xls)</label>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls, .csv"
                                        ref={fileInputRef}
                                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Kolom B: Kode, Kolom C: Nama, Kolom F: Harga
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsImportModalOpen(false)}
                                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isImporting}
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {isImporting ? 'Memproses...' : 'Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
