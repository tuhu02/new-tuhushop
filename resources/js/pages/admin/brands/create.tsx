import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

export default function BrandCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/brands');
    };

    return (
        <AdminLayout title="Tambah Brand" headerTitle="Brands">
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Tambah Brand</h1>
                    <Link
                        href="/admin/brands"
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
                        <Label htmlFor="name">Nama Brand</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            placeholder="Contoh: Moonton"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <Button disabled={processing} type="submit">
                        Simpan
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
