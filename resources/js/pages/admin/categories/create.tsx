import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

export default function CategoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        is_active: true,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/categories');
    };

    return (
        <AdminLayout title="Tambah Kategori" headerTitle="Categories">
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Tambah Kategori</h1>
                    <Link
                        href="/admin/categories"
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
                            placeholder="Nama kategori"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(event) =>
                                setData('slug', event.target.value)
                            }
                            placeholder="contoh: top-up-game"
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
                            Kategori aktif
                        </Label>
                    </div>

                    <Button disabled={processing} type="submit">
                        Simpan
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
