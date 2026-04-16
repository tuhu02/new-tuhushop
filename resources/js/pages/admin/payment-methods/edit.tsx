import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import type { PaymentMethod } from '@/types';
import { useState } from 'react';

type PaymentMethodWithLogoUrl = PaymentMethod & {
    logo_url?: string | null;
};

export default function PaymentMethodEdit({
    paymentMethod,
}: {
    paymentMethod: PaymentMethodWithLogoUrl;
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: paymentMethod.name,
        code: paymentMethod.code,
        logo: null as File | null,
        is_active: paymentMethod.is_active,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        paymentMethod.logo_url || null,
    );

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/admin/payment-methods/${paymentMethod.id}`);
    };

    return (
        <AdminLayout title="Edit Payment Method" headerTitle="Payment Methods">
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Edit Payment Method
                    </h1>
                    <Link
                        href="/admin/payment-methods"
                        className="text-sm text-muted-foreground underline"
                    >
                        Kembali
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                    encType="multipart/form-data"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Payment Method</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            placeholder="Contoh: Virtual Account"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(event) =>
                                setData('code', event.target.value)
                            }
                            placeholder="Contoh: virtual_account"
                        />
                        <InputError message={errors.code} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="logo">Logo</Label>
                        <Input
                            id="logo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleLogoChange}
                        />
                        <InputError message={errors.logo} />
                        {logoPreview && (
                            <div className="mt-2">
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="h-24 w-24 rounded-lg object-cover"
                                />
                            </div>
                        )}
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
                            Payment method aktif
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
