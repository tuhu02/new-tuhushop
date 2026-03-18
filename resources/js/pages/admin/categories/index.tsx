import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type Category = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
};

export default function CategoryIndex({
    categories,
}: {
    categories: Category[];
}) {
    const handleDelete = (categoryId: number) => {
        if (!window.confirm('Hapus kategori ini?')) {
            return;
        }

        router.delete(`/admin/categories/${categoryId}`);
    };

    return (
        <AdminLayout title="Admin Categories" headerTitle="Categories">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Categories</h1>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Kategori
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Slug</th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={4}
                                    >
                                        Belum ada kategori.
                                    </td>
                                </tr>
                            )}
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.slug}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
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
            </div>
        </AdminLayout>
    );
}
