import { Link, useForm } from '@inertiajs/react';
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

export default function PriceListCategoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        order: '0',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/price-list-categories');
    };

    const handleNameChange = (value: string) => {
        setData('name', value);
        if (
            !data.slug ||
            data.slug === value.toLowerCase().replace(/\s+/g, '-')
        ) {
            setData('slug', value.toLowerCase().replace(/\s+/g, '-'));
        }
    };

    return (
        <AdminLayout
            title="Tambah Price List Category"
            headerTitle="Price List Categories"
        >
            <div className="space-y-4 p-4">
                <div>
                    <Link
                        href="/admin/price-list-categories"
                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
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
                                <CardTitle>
                                    Buat Price List Category Baru
                                </CardTitle>
                                <CardDescription>
                                    Contoh: Diamond, Weekly Pass, Level Up Pass
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
                                                handleNameChange(e.target.value)
                                            }
                                            className="mt-2 w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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
                                            className="mt-2 w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                            placeholder="weekly-pass"
                                        />
                                        {errors.slug && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.slug}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Slug untuk URL (otomatis dari nama)
                                        </p>
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
                                            className="mt-2 w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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
                                            className="mt-2 w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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
                                            className="h-4 w-4 rounded border border-input"
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
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Category'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href="/admin/price-list-categories">
                                                Batal
                                            </Link>
                                        </Button>
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
                                    Catatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h3 className="font-medium">
                                        Contoh Kategori:
                                    </h3>
                                    <ul className="mt-2 space-y-1 text-muted-foreground">
                                        <li>• Diamond</li>
                                        <li>• Weekly Pass</li>
                                        <li>• Level Up Pass</li>
                                        <li>• Battle Pass</li>
                                        <li>• Elite Pass</li>
                                    </ul>
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="font-medium">
                                        Apa itu Category?
                                    </h3>
                                    <p className="mt-2 text-muted-foreground">
                                        Kategori digunakan untuk mengelompokkan
                                        berbagai tipe harga untuk sebuah produk.
                                        Misalnya Mobile Legend bisa memiliki
                                        kategori Diamond, Weekly Pass, dll.
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
