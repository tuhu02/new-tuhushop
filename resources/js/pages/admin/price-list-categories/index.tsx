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
import { Pencil, Trash2, Plus } from 'lucide-react';

interface PriceListCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    order: number;
    is_active: boolean;
}

interface PaginatedData {
    data: PriceListCategory[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    categories: PaginatedData;
}

export default function PriceListCategoryIndex({ categories }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Hapus kategori price list ini?')) {
            router.delete(`/admin/price-list-categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Price List Categories">
            <Head title="Price List Categories" />

            <div className="py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Price List Categories
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori harga (Diamond, Weekly Pass, dll)
                        </p>
                    </div>
                    <Link
                        href="/admin/price-list-categories/create"
                        as="button"
                        className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Category
                    </Link>
                </div>

                {categories.data.length > 0 ? (
                    <div>
                        <Table className="rounded border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead className="w-40">
                                        Deskripsi
                                    </TableHead>
                                    <TableHead className="w-20">
                                        Urutan
                                    </TableHead>
                                    <TableHead className="w-20">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-32">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            {category.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-800">
                                                {category.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell className="max-w-40 truncate">
                                            {category.description || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {category.order}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={
                                                    category.is_active
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }
                                            >
                                                {category.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/price-list-categories/${category.id}/edit`}
                                                    as="button"
                                                    className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {categories.from} hingga{' '}
                                {categories.to} dari {categories.total} kategori
                            </p>
                            <div className="flex gap-2">
                                {categories.current_page > 1 && (
                                    <Link
                                        href={`/admin/price-list-categories?page=${categories.current_page - 1}`}
                                        className="rounded border px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Sebelumnya
                                    </Link>
                                )}
                                {categories.current_page <
                                    categories.last_page && (
                                    <Link
                                        href={`/admin/price-list-categories?page=${categories.current_page + 1}`}
                                        className="rounded border px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Berikutnya
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded border border-dashed border-muted-foreground p-8 text-center">
                        <p className="mb-4 text-muted-foreground">
                            Belum ada kategori price list
                        </p>
                        <Link
                            href="/admin/price-list-categories/create"
                            className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Buat Category Pertama
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
