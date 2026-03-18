import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { CarouselItem } from '@/types';

export default function CarouselIndex({
    carousels,
}: {
    carousels: CarouselItem[];
}) {
    const handleDelete = (carouselId: number) => {
        if (!window.confirm('Hapus slide carousel ini?')) {
            return;
        }

        router.delete(`/admin/carousels/${carouselId}`);
    };

    return (
        <AdminLayout title="Admin Carousels" headerTitle="Carousels">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Carousels</h1>
                    <Link
                        href="/admin/carousels/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Slide
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Image</th>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Order</th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carousels.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={5}
                                    >
                                        Belum ada slide carousel.
                                    </td>
                                </tr>
                            )}
                            {carousels.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        <img
                                            src={item.image_url}
                                            alt={item.title ?? 'carousel image'}
                                            className="h-14 w-24 rounded-md object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.title ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.sort_order}
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/carousels/${item.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(item.id)
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
