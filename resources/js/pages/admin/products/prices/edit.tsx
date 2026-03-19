import { Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { ChevronLeft } from 'lucide-react';
import { Brand, Product } from '@/types/admin';

interface PriceListCategory {
    id: number;
    name: string;
    slug: string;
}

interface ProductPrice {
    id: number;
    product_id: number;
    price_list_category_id: number;
    display_name: string;
    code: string;
    price: number;
    order: number;
    is_active: boolean;
    category: PriceListCategory;
}

interface ProductPriceEditProps {
    product: Product;
    price: ProductPrice;
    categories: PriceListCategory[];
}

export default function ProductPriceEdit({
    product,
    price,
    categories,
}: ProductPriceEditProps) {
    const { data, setData, put, errors, processing } = useForm({
        price_list_category_id: price.price_list_category_id.toString(),
        display_name: price.display_name,
        code: price.code,
        price: price.price.toString(),
        order: price.order.toString(),
        is_active: price.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}/prices/${price.id}`);
    };

    return (
        <AdminLayout
            title={`Edit Price List - ${product.name}`}
            headerTitle="Edit Product Price"
        >
            <div className="space-y-4 p-4">
                <div>
                    <Link
                        href={`/admin/products/${product.id}/prices`}
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
                                <CardTitle>Edit Price List</CardTitle>
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
                                            className="rounded border-input"
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
                                        <Button type="submit" disabled={processing}>
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Update Price List'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/products/${product.id}/prices`}
                                            >
                                                Batal
                                            </Link>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

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
                </div>
            </div>
        </AdminLayout>
    );
}