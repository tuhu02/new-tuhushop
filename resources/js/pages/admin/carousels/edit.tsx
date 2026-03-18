import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import type { CarouselItem } from '@/types';

export default function CarouselEdit({ carousel }: { carousel: CarouselItem }) {
    const { data, setData, put, processing, errors } = useForm({
        title: carousel.title ?? '',
        image: null as File | null,
        sort_order: String(carousel.sort_order),
        is_active: carousel.is_active,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/admin/carousels/${carousel.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Edit Carousel" headerTitle="Carousels">
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Edit Slide Carousel
                    </h1>
                    <Link
                        href="/admin/carousels"
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
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(event) =>
                                setData('title', event.target.value)
                            }
                            placeholder="Slide promo utama"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Gambar</Label>
                        <img
                            src={carousel.image_url}
                            alt={carousel.title ?? 'carousel image'}
                            className="h-28 w-44 rounded-md object-cover"
                        />
                        <Input
                            id="image"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(event) =>
                                setData(
                                    'image',
                                    event.target.files?.[0] ?? null,
                                )
                            }
                        />
                        <InputError message={errors.image} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sort_order">Urutan</Label>
                        <Input
                            id="sort_order"
                            type="number"
                            min="0"
                            value={data.sort_order}
                            onChange={(event) =>
                                setData('sort_order', event.target.value)
                            }
                        />
                        <InputError message={errors.sort_order} />
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
                            Aktif ditampilkan
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
