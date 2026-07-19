import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { history, dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Transaction = {
    id: number;
    reference: string;
    merchant_ref: string;
    payment_channel_name: string;
    payment_method_name: string;
    amount: number;
    status: string;
    digiflazz_status: string | null;
    created_at: string;
    product_name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Histori Transaksi',
        href: history(),
    },
];

export default function History({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
            case 'SUCCESS':
            case 'SUKSES':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'UNPAID':
            case 'PENDING':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'FAILED':
            case 'EXPIRED':
            case 'GAGAL':
                return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Histori Transaksi" />

            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="space-y-5">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                            Histori Transaksi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pantau status pembayaran dan lihat detail setiap
                            transaksi di sini.
                        </p>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-sidebar-border/70 bg-card px-6 py-12 text-center shadow-sm sm:px-10">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Package className="h-10 w-10" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                Belum ada transaksi
                            </h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Riwayat transaksi kamu akan muncul di sini.
                                Mulai top up game favorit kamu sekarang.
                            </p>
                            <Button
                                className="mt-6 rounded-full bg-blue-800 px-8 font-semibold text-white hover:bg-blue-900"
                                asChild
                            >
                                <Link href={dashboard()}>
                                    Lihat pilihan game
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-sidebar-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
                                >
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-medium">
                                                {transaction.merchant_ref}
                                            </span>
                                            <span className="text-muted-foreground/40">
                                                •
                                            </span>
                                            <span>
                                                {new Date(
                                                    transaction.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>

                                        <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-slate-50">
                                            {transaction.product_name}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                            <span>
                                                Rp{' '}
                                                {new Intl.NumberFormat(
                                                    'id-ID',
                                                ).format(transaction.amount)}
                                            </span>
                                            <span className="text-muted-foreground/40">
                                                •
                                            </span>
                                            <span className="text-muted-foreground">
                                                {
                                                    transaction.payment_method_name
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:items-end">
                                        <div className="flex flex-wrap gap-2">
                                            <div
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                                                    transaction.status,
                                                )}`}
                                            >
                                                {transaction.status}
                                            </div>
                                            {transaction.digiflazz_status && (
                                                <div
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                                                        transaction.digiflazz_status,
                                                    )}`}
                                                >
                                                    {
                                                        transaction.digiflazz_status
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="group w-full rounded-full sm:w-auto"
                                            asChild
                                        >
                                            <Link
                                                href={`/checkout/${transaction.merchant_ref}`}
                                            >
                                                Lihat Detail
                                                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
