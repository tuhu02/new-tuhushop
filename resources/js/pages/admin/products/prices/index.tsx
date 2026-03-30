import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ChevronLeft } from 'lucide-react';
import { ProductPriceIndexProps } from '@/types';

export default function ProductPriceIndex({
    product,
    prices,
}: ProductPriceIndexProps) {
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
                    <Link
                        href={`/admin/products/${product.id}/prices/create`}
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        + Tambah Price List
                    </Link>
                </div>

                {prices.length > 0 ? (
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
                                {prices.map((price) => (
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
        </AdminLayout>
    );
}
