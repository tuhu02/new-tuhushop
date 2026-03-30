import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import type { Brand, CategoryOption, Product } from '@/types';

export default function ProductEdit({
    product,
    brands,
    categories,
}: {
    product: Product;
    brands: Brand[];
    categories: CategoryOption[];
}) {
    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        name: string;
        description: string;
        slug: string;
        brand_id: string;
        category_ids: string[];
        thumbnail: File | null;
        is_active: boolean;
    }>({
        _method: 'put',
        name: product.name,
        description: product.description ?? '',
        slug: product.slug,
        brand_id: String(product.brand_id),
        category_ids: product.categories.map((category) => String(category.id)),
        thumbnail: null,
        is_active: product.is_active,
    });

    const toggleCategory = (categoryId: string, checked: boolean) => {
        setData((previousData) => {
            const previousIds = previousData.category_ids;

            if (checked) {
                return {
                    ...previousData,
                    category_ids: Array.from(
                        new Set([...previousIds, categoryId]),
                    ),
                };
            }

            return {
                ...previousData,
                category_ids: previousIds.filter((item) => item !== categoryId),
            };
        });
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Edit Product" headerTitle="Products">
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Product</h1>
                    <Link
                        href="/admin/products"
                        className="text-sm text-muted-foreground underline"
                    >
                        Kembali
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            placeholder="Nama product"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(event) =>
                                setData('description', event.target.value)
                            }
                            placeholder="Deskripsi lengkap product"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="brand_id">Brand</Label>
                        <select
                            id="brand_id"
                            value={data.brand_id}
                            onChange={(event) =>
                                setData('brand_id', event.target.value)
                            }
                            className="h-10 rounded-md border bg-background px-3"
                        >
                            <option value="">Pilih brand</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={String(brand.id)}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.brand_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="thumbnail">Thumbnail</Label>
                        {product.thumbnail_url && (
                            <img
                                src={product.thumbnail_url}
                                alt={product.name}
                                className="h-24 w-24 rounded-md object-cover"
                            />
                        )}
                        <Input
                            id="thumbnail"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(event) =>
                                setData(
                                    'thumbnail',
                                    event.target.files?.[0] ?? null,
                                )
                            }
                        />
                        <InputError message={errors.thumbnail} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Kategori</Label>
                        <div className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-2">
                            {categories.map((category) => {
                                const id = String(category.id);

                                return (
                                    <label
                                        key={category.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.category_ids.includes(
                                                id,
                                            )}
                                            onChange={(event) =>
                                                toggleCategory(
                                                    id,
                                                    event.target.checked,
                                                )
                                            }
                                            className="size-4"
                                        />
                                        <span>{category.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                        <InputError message={errors.category_ids} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(event) =>
                                setData('slug', event.target.value)
                            }
                            placeholder="contoh: mobile-legend-weekly"
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) =>
                                setData('is_active', event.target.checked)
                            }
                            className="size-4"
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Product aktif
                        </Label>
                    </div>

                    <Button disabled={processing} type="submit">
                        Update
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
