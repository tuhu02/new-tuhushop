import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Package } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { history, checkout, dashboard } from '@/routes';
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
    const { auth } = usePage().props as unknown as { auth: { user: any } };
    const user = auth.user;

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

            <div className="space-y-8 p-4 py-10">
                {/* Results Area */}
                <div className="space-y-4">
                    {transactions.length > 0 && (
                        <h2 className="text-xl font-bold">
                            Riwayat Transaksi
                        </h2>
                    )}

                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                {/* Use an illustration placeholder since we don't have the exact image */}
                                <div className="mb-6 h-40 w-40 opacity-80">
                                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
                                        <path fill="currentColor" d="M150.3,51.8C163.6,63.1,173.8,78.2,176.6,94.6C179.4,111,174.8,128.7,163.5,141.6C152.2,154.5,134.1,162.6,116.3,165.4C98.5,168.2,81.1,165.7,65.8,157.6C50.5,149.5,37.3,135.8,29.9,119.8C22.5,103.8,20.9,85.5,26.5,69.9C32.1,54.3,44.9,41.4,59.8,32.3C74.7,23.2,91.7,17.9,108.3,19.2C124.9,20.5,141.1,28.4,150.3,51.8Z" transform="translate(0 0) scale(1)" className="opacity-20" />
                                        <path stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M120 75H80C74.4772 75 70 79.4772 70 85V115C70 120.523 74.4772 125 80 125H120C125.523 125 130 120.523 130 115V85C130 79.4772 125.523 75 120 75Z" />
                                        <path stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M85 75V60C85 51.7157 91.7157 45 100 45C108.284 45 115 51.7157 115 60V75" />
                                        <circle cx="100" cy="100" r="8" fill="currentColor" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Belum ada transaksi</h3>
                                <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                    Riwayat transaksi kamu akan muncul di sini. Mulai top up game favorit kamu sekarang.
                                </p>
                                <Button className="rounded-full px-8 font-semibold bg-blue-800 hover:bg-blue-900 text-white" asChild>
                                    <Link href={dashboard()}>
                                        Lihat pilihan game
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex flex-col gap-4 rounded-2xl border border-sidebar-border/70 bg-card p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {transaction.merchant_ref}
                                                </span>
                                                <span className="text-muted-foreground/40">•</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold line-clamp-1">{transaction.product_name}</h3>
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <span>
                                                    Rp {new Intl.NumberFormat('id-ID').format(transaction.amount)}
                                                </span>
                                                <span className="text-muted-foreground/40">•</span>
                                                <span className="text-muted-foreground">{transaction.payment_method_name}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:items-end">
                                            <div className="flex gap-2">
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
                                                        {transaction.digiflazz_status}
                                                    </div>
                                                )}
                                            </div>
                                            <Button variant="outline" size="sm" className="rounded-full w-full sm:w-auto group" asChild>
                                                {/* @ts-ignore - The route name is dynamic and checking type is complicated */}
                                                <Link href={`/checkout/${transaction.merchant_ref}`}>
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
