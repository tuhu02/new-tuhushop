import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { PaymentMethod } from '@/types';

type PaymentMethodWithCount = PaymentMethod & {
    channels_count?: number;
};

export default function PaymentMethodIndex({
    paymentMethods,
}: {
    paymentMethods: PaymentMethodWithCount[];
}) {
    const handleDelete = (paymentMethodId: number) => {
        if (!window.confirm('Hapus payment method ini?')) {
            return;
        }

        router.delete(`/admin/payment-methods/${paymentMethodId}`);
    };

    return (
        <AdminLayout
            title="Admin Payment Methods"
            headerTitle="Payment Methods"
        >
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Payment Methods</h1>
                    <Link
                        href="/admin/payment-methods/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Payment Method
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-150 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">
                                    Channels
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentMethods.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={5}
                                    >
                                        Belum ada payment method.
                                    </td>
                                </tr>
                            )}
                            {paymentMethods.map((paymentMethod) => (
                                <tr
                                    key={paymentMethod.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        {paymentMethod.name}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs uppercase">
                                        {paymentMethod.code}
                                    </td>
                                    <td className="px-4 py-3">
                                        {paymentMethod.channels_count ?? 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        {paymentMethod.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/payment-methods/${paymentMethod.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        paymentMethod.id,
                                                    )
                                                }
                                                className="inline-flex h-8 items-center rounded-md border border-red-300 px-3 text-xs font-medium text-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
