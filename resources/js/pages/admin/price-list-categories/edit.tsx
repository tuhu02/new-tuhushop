import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

interface PriceListCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    order: number;
    is_active: boolean;
}

interface Props {
    category: PriceListCategory;
}

export default function PriceListCategoryEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        order: category.order.toString(),
        is_active: category.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/price-list-categories/${category.id}`);
    };

    return (
        <AdminLayout title={`Edit Price List Category - ${category.name}`}>
            <Head title={`Edit Price List Category - ${category.name}`} />

            <div className="py-8">
                <div className="mb-8">
                    <Link
                        href="/admin/price-list-categories"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Price List Category</CardTitle>
                                <CardDescription>
                                    Ubah informasi kategori harga
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Nama Kategori
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="mt-2 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800"
                                            placeholder="Contoh: Weekly Pass"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Slug
                                        </label>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData('slug', e.target.value)
                                            }
                                            className="mt-2 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800"
                                            placeholder="weekly-pass"
                                        />
                                        {errors.slug && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.slug}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Deskripsi (Opsional)
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800"
                                            placeholder="Deskripsi kategori..."
                                            rows={3}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Order */}
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Urutan Tampil
                                        </label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) =>
                                                setData('order', e.target.value)
                                            }
                                            className="mt-2 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-slate-800"
                                            placeholder="0"
                                        />
                                        {errors.order && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.order}
                                            </p>
                                        )}
                                    </div>

                                    {/* Active Toggle */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    'is_active',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <label className="text-sm font-medium">
                                            Kategori Aktif
                                        </label>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Perubahan'}
                                        </Button>
                                        <Link
                                            href="/admin/price-list-categories"
                                            className="inline-flex items-center rounded border px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            Batal
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Informasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h3 className="font-medium">ID Kategori</h3>
                                    <p className="mt-1 text-muted-foreground">
                                        {category.id}
                                    </p>
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="font-medium">Status</h3>
                                    <p className="mt-1 text-muted-foreground">
                                        {category.is_active
                                            ? 'Aktif'
                                            : 'Tidak Aktif'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
