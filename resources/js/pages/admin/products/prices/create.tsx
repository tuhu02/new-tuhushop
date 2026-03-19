import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { ChevronLeft } from 'lucide-react';

interface Brand {
    id: number;
    name: string;
}

interface PriceListCategory {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: Brand;
}

interface ProductPriceCreateProps {
    product: Product;
    categories: PriceListCategory[];
}

export default function ProductPriceCreate({
    product,
    categories,
}: ProductPriceCreateProps) {
    const { data, setData, post, errors, processing } = useForm({
        price_list_category_id: '',
        display_name: '',
        code: '',
        price: '',
        order: '0',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}/prices`);
    };

    return (
        <AdminLayout title={`Tambah Price List - ${product.name}`}>
            <Head title={`Tambah Price List - ${product.name}`} />

            <div className="py-8">
                <div className="mb-8">
                    <Link
                        href={`/admin/products/${product.id}/prices`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Produk
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Brand
                                    </p>
                                    <p className="font-semibold">
                                        {product.brand?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Nama Produk
                                    </p>
                                    <p className="font-semibold">
                                        {product.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Slug
                                    </p>
                                    <p className="font-mono text-sm">
                                        {product.slug}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tambah Price List</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Kategori */}
                                    <div className="space-y-2">
                                        <Label htmlFor="category">
                                            Kategori *
                                        </Label>
                                        <select
                                            id="category"
                                            value={data.price_list_category_id}
                                            onChange={(e) =>
                                                setData(
                                                    'price_list_category_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option value="">
                                                Pilih Kategori
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.price_list_category_id && (
                                            <p className="text-sm text-red-600">
                                                {errors.price_list_category_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Display Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="display_name">
                                            Nama Nominal *
                                        </Label>
                                        <Input
                                            id="display_name"
                                            type="text"
                                            placeholder="Contoh: 70 Diamond, 100 Diamonds, Level Up Pass"
                                            value={data.display_name}
                                            onChange={(e) =>
                                                setData(
                                                    'display_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.display_name && (
                                            <p className="text-sm text-red-600">
                                                {errors.display_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Code */}
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Kode *</Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            placeholder="Contoh: ff70, ml10k, pubg_375"
                                            value={data.code}
                                            onChange={(e) =>
                                                setData('code', e.target.value)
                                            }
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Kode harus unik untuk setiap price
                                            list
                                        </p>
                                        {errors.code && (
                                            <p className="text-sm text-red-600">
                                                {errors.code}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <Label htmlFor="price">
                                            Harga (Rp) *
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="0"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData('price', e.target.value)
                                            }
                                            step="100"
                                            min="0"
                                            required
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-600">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>

                                    {/* Order */}
                                    <div className="space-y-2">
                                        <Label htmlFor="order">Urutan</Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            placeholder="0"
                                            value={data.order}
                                            onChange={(e) =>
                                                setData('order', e.target.value)
                                            }
                                            min="0"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Angka lebih kecil muncul lebih dulu
                                        </p>
                                    </div>

                                    {/* Is Active */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    'is_active',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        <Label
                                            htmlFor="is_active"
                                            className="cursor-pointer"
                                        >
                                            Aktifkan price list ini
                                        </Label>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Price List'}
                                        </Button>
                                        <Link
                                            href={`/admin/products/${product.id}/prices`}
                                            className="inline-flex items-center rounded border border-input bg-background px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            Batal
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
