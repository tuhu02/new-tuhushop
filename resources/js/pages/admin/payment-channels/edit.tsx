import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import type { PaymentChannel, PaymentMethodOption } from '@/types';

type PaymentChannelEditProps = {
    paymentChannel: PaymentChannel;
    paymentMethods: PaymentMethodOption[];
};

export default function PaymentChannelEdit({
    paymentChannel,
    paymentMethods,
}: PaymentChannelEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        payment_method_id: paymentChannel.payment_method_id.toString(),
        name: paymentChannel.name,
        code: paymentChannel.code,
        logo: paymentChannel.logo,
        fee: paymentChannel.fee.toString(),
        min_amount:
            paymentChannel.min_amount === null
                ? ''
                : paymentChannel.min_amount.toString(),
        max_amount:
            paymentChannel.max_amount === null
                ? ''
                : paymentChannel.max_amount.toString(),
        is_active: paymentChannel.is_active,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/admin/payment-channels/${paymentChannel.id}`);
    };

    return (
        <AdminLayout
            title="Edit Payment Channel"
            headerTitle="Payment Channels"
        >
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Edit Payment Channel
                    </h1>
                    <Link
                        href="/admin/payment-channels"
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
                        <Label htmlFor="payment_method_id">
                            Payment Method
                        </Label>
                        <select
                            id="payment_method_id"
                            value={data.payment_method_id}
                            onChange={(event) =>
                                setData('payment_method_id', event.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <option value="">Pilih payment method</option>
                            {paymentMethods.map((paymentMethod) => (
                                <option
                                    key={paymentMethod.id}
                                    value={paymentMethod.id}
                                >
                                    {paymentMethod.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.payment_method_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Channel</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            placeholder="Contoh: BCA Virtual Account"
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
                            placeholder="Contoh: bca_va"
                        />
                        <InputError message={errors.code} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="logo">Logo URL / Path</Label>
                        <Input
                            id="logo"
                            value={data.logo}
                            onChange={(event) =>
                                setData('logo', event.target.value)
                            }
                            placeholder="Contoh: /images/payments/bca.png"
                        />
                        <InputError message={errors.logo} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="fee">Fee</Label>
                            <Input
                                id="fee"
                                type="number"
                                min={0}
                                value={data.fee}
                                onChange={(event) =>
                                    setData('fee', event.target.value)
                                }
                                placeholder="0"
                            />
                            <InputError message={errors.fee} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="min_amount">Min Amount</Label>
                            <Input
                                id="min_amount"
                                type="number"
                                min={0}
                                value={data.min_amount}
                                onChange={(event) =>
                                    setData('min_amount', event.target.value)
                                }
                                placeholder="Opsional"
                            />
                            <InputError message={errors.min_amount} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="max_amount">Max Amount</Label>
                            <Input
                                id="max_amount"
                                type="number"
                                min={0}
                                value={data.max_amount}
                                onChange={(event) =>
                                    setData('max_amount', event.target.value)
                                }
                                placeholder="Opsional"
                            />
                            <InputError message={errors.max_amount} />
                        </div>
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
                            Payment channel aktif
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
