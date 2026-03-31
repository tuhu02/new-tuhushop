import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { PaymentChannel } from '@/types';

export default function PaymentChannelIndex({
    paymentChannels,
}: {
    paymentChannels: PaymentChannel[];
}) {
    const handleDelete = (paymentChannelId: number) => {
        if (!window.confirm('Hapus payment channel ini?')) {
            return;
        }

        router.delete(`/admin/payment-channels/${paymentChannelId}`);
    };

    return (
        <AdminLayout
            title="Admin Payment Channels"
            headerTitle="Payment Channels"
        >
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Payment Channels</h1>
                    <Link
                        href="/admin/payment-channels/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Payment Channel
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-220 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    Method
                                </th>
                                <th className="px-4 py-3 font-medium">Logo</th>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Fee</th>
                                <th className="px-4 py-3 font-medium">Range</th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentChannels.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={7}
                                    >
                                        Belum ada payment channel.
                                    </td>
                                </tr>
                            )}

                            {paymentChannels.map((paymentChannel) => (
                                <tr
                                    key={paymentChannel.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        {paymentChannel.payment_method?.name ??
                                            '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {paymentChannel.logo_url ? (
                                            <img
                                                src={paymentChannel.logo_url}
                                                alt={paymentChannel.name}
                                                className="h-10 w-10 rounded-md border object-contain"
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {paymentChannel.name}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs uppercase">
                                        {paymentChannel.code}
                                    </td>
                                    <td className="px-4 py-3">
                                        {paymentChannel.fee}
                                    </td>
                                    <td className="px-4 py-3">
                                        {paymentChannel.min_amount ?? '-'} -{' '}
                                        {paymentChannel.max_amount ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {paymentChannel.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/payment-channels/${paymentChannel.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        paymentChannel.id,
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
