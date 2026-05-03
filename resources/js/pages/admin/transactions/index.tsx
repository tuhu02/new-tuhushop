import { Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Transaction = {
    id: number;
    reference: string;
    customer_name: string;
    customer_phone: string;
    amount: number;
    status: string;
    created_at: string;
    product?: {
        name: string;
    };
    product_price?: {
        name: string;
    };
    payment_channel?: {
        name: string;
    };
};

export default function TransactionIndex({
    transactions,
}: {
    transactions: PaginatedData<Transaction>;
}) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(dateString));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">PAID</span>;
            case 'UNPAID':
                return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">UNPAID</span>;
            case 'EXPIRED':
                return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">EXPIRED</span>;
            case 'FAILED':
                return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">FAILED</span>;
            default:
                return <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{status}</span>;
        }
    };

    return (
        <AdminLayout title="Admin Transactions" headerTitle="Transactions">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Semua Transaksi</h1>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Ref</th>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Produk</th>
                                <th className="px-4 py-3 font-medium">Pembayaran</th>
                                <th className="px-4 py-3 font-medium">Nominal</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.data.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-center text-muted-foreground"
                                        colSpan={7}
                                    >
                                        Belum ada transaksi.
                                    </td>
                                </tr>
                            )}
                            {transactions.data.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3 font-mono text-xs">
                                        {transaction.reference}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{transaction.customer_name || '-'}</div>
                                        <div className="text-xs text-muted-foreground">{transaction.customer_phone || '-'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{transaction.product?.name || '-'}</div>
                                        <div className="text-xs text-muted-foreground">{transaction.product_price?.name || '-'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {transaction.payment_channel?.name || '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(transaction.status)}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {formatDate(transaction.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transactions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1 pt-4">
                        {transactions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm ${
                                    link.active
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-sidebar-border/70 hover:bg-muted'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
