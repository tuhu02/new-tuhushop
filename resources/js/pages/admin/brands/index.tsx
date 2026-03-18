import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type Brand = {
    id: number;
    name: string;
};

export default function BrandIndex({ brands }: { brands: Brand[] }) {
    const handleDelete = (brandId: number) => {
        if (!window.confirm('Hapus brand ini?')) {
            return;
        }

        router.delete(`/admin/brands/${brandId}`);
    };

    return (
        <AdminLayout title="Admin Brands" headerTitle="Brands">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Brands</h1>
                    <Link
                        href="/admin/brands/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Brand
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-120 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={2}
                                    >
                                        Belum ada brand.
                                    </td>
                                </tr>
                            )}
                            {brands.map((brand) => (
                                <tr
                                    key={brand.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">{brand.name}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/brands/${brand.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(brand.id)
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
