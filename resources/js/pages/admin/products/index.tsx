import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type Product = {
    id: number;
    name: string;
    slug: string;
    brand_id: number;
    thumbnail: string | null;
    thumbnail_url: string | null;
    is_active: boolean;
    brand: {
        id: number;
        name: string;
    } | null;
    categories: {
        id: number;
        name: string;
    }[];
};

export default function ProductIndex({ products }: { products: Product[] }) {
    const handleDelete = (productId: number) => {
        if (!window.confirm('Hapus product ini?')) {
            return;
        }

        router.delete(`/admin/products/${productId}`);
    };

    return (
        <AdminLayout title="Admin Products" headerTitle="Products">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Products</h1>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Product
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Slug</th>
                                <th className="px-4 py-3 font-medium">Brand</th>
                                <th className="px-4 py-3 font-medium">
                                    Kategori
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Thumbnail
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={7}
                                    >
                                        Belum ada product.
                                    </td>
                                </tr>
                            )}
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.slug}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.brand?.name ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.categories.length > 0
                                            ? product.categories
                                                  .map(
                                                      (category) =>
                                                          category.name,
                                                  )
                                                  .join(', ')
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.thumbnail_url ? (
                                            <img
                                                src={product.thumbnail_url}
                                                alt={product.name}
                                                className="h-10 w-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(product.id)
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
