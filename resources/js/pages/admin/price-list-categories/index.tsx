import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { PriceListCategoryIndexProps } from '@/types';

export default function PriceListCategoryIndex({
    categories,
}: PriceListCategoryIndexProps) {
    const handleDelete = (id: number) => {
        if (!window.confirm('Hapus kategori price list ini?')) {
            return;
        }

        router.delete(`/admin/price-list-categories/${id}`);
    };

    return (
        <AdminLayout
            title="Admin Price List Categories"
            headerTitle="Price List Categories"
        >
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Price List Categories
                    </h1>
                    <Link
                        href="/admin/price-list-categories/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Kategori
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-200 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Slug</th>
                                <th className="px-4 py-3 font-medium">
                                    Deskripsi
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Urutan
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={6}
                                    >
                                        Belum ada kategori price list.
                                    </td>
                                </tr>
                            )}
                            {categories.data.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                                            {category.slug}
                                        </code>
                                    </td>
                                    <td className="max-w-40 truncate px-4 py-3 text-muted-foreground">
                                        {category.description || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.order}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                category.is_active
                                                    ? 'text-sm font-medium text-black-600'
                                                    : 'text-sm font-medium text-red-600'
                                            }
                                        >
                                            {category.is_active
                                                ? 'Aktif'
                                                : 'Tidak Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/price-list-categories/${category.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(category.id)
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

                {/* Pagination */}
                {categories.data.length > 0 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {categories.from} hingga {categories.to}{' '}
                            dari {categories.total} kategori
                        </p>
                        <div className="flex gap-2">
                            {categories.current_page > 1 && (
                                <Link
                                    href={`/admin/price-list-categories?page=${categories.current_page - 1}`}
                                    className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                >
                                    Sebelumnya
                                </Link>
                            )}
                            {categories.current_page < categories.last_page && (
                                <Link
                                    href={`/admin/price-list-categories?page=${categories.current_page + 1}`}
                                    className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                >
                                    Berikutnya
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
