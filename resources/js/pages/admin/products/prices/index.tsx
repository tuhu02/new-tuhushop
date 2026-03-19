import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import { ProductPriceIndexProps } from '@/types';


export default function ProductPriceIndex({
    product,
    prices,
}: ProductPriceIndexProps) {

    return (
        <AdminLayout title={`Price List - ${product.name}`}>
            <Head title={`Price List - ${product.name}`} />

            <div className="py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Link
                                href="/admin/products"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Produk
                            </Link>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {product.brand?.name}
                            </p>
                            <h1 className="text-3xl font-bold">
                                {product.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola daftar harga
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/products/${product.id}/prices/create`}
                        as="button"
                        className="inline-flex items-center rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        + Tambah Price List
                    </Link>
                </div>

                {prices.length > 0 ? (
                    <Table className="rounded border">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">
                                    Kode
                                </TableHead>
                                <TableHead>Nominal</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead className="text-right">
                                    Harga
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    Status
                                </TableHead>
                                <TableHead className="w-[150px]">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prices.map((price) => (
                                <TableRow key={price.id}>
                                    <TableCell>
                                        <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-800">
                                            {price.code}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        {price.display_name}
                                    </TableCell>
                                    <TableCell>
                                        {price.category?.name || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        Rp{' '}
                                        {price.price.toLocaleString(
                                            'id-ID',
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                price.is_active
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }
                                        >
                                            {price.is_active
                                                ? 'Aktif'
                                                : 'Tidak Aktif'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/prices/${price.id}/edit`}
                                                as="button"
                                                className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Hapus price list ini?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            `/admin/products/${product.id}/prices/${price.id}`,
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="rounded border border-dashed border-muted-foreground p-8 text-center">
                        <p className="text-muted-foreground">
                            Belum ada price list untuk produk ini
                        </p>
                        <Link
                            href={`/admin/products/${product.id}/prices/create`}
                            className="mt-4 inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Tambah Price List Pertama
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
