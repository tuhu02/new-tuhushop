import { router, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    PlayCircle,
    X,
    Loader2,
    ClipboardList,
    User,
    Phone,
    Package,
    CreditCard,
    Hash,
    FileText,
} from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    merchant_ref: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    customer_inputs: Record<string, string> | null;
    digiflazz_customer_no: string | null;
    amount: number;
    status: string;
    digiflazz_status: string | null;
    digiflazz_sn: string | null;
    digiflazz_processed_at: string | null;
    created_at: string;
    product?: { id: number; name: string; fulfillment_type: string };
    product_price?: { id: number; display_name: string; code: string };
    payment_channel?: { name: string };
};

type PageProps = {
    flash?: { success?: string; error?: string };
    errors?: Record<string, string>;
};

export default function ManualTransactionPage({
    transactions,
    filters,
}: {
    transactions: PaginatedData<Transaction>;
    filters: { status: string };
}) {
    const { props } = usePage<PageProps>();
    const flash = props.flash;

    const [modalTx, setModalTx] = useState<Transaction | null>(null);
    const [serialNumber, setSerialNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(dateString));

    const openModal = (tx: Transaction) => {
        setModalTx(tx);
        setSerialNumber('');
        setNotes('');
    };

    const closeModal = () => {
        setModalTx(null);
        setSerialNumber('');
        setNotes('');
        setSubmitting(false);
    };

    const handleProcess = () => {
        if (!modalTx || !serialNumber.trim()) {
            return;
        }

        setSubmitting(true);

        router.post(
            `/admin/transactions/manual/${modalTx.id}/process`,
            { serial_number: serialNumber.trim(), notes: notes.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeModal();
                },
                onError: () => {
                    setSubmitting(false);
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            },
        );
    };

    const tabs = [
        { key: 'pending', label: 'Menunggu Proses', icon: Clock },
        { key: 'done', label: 'Selesai', icon: CheckCircle2 },
        { key: 'all', label: 'Semua', icon: ClipboardList },
    ];

    return (
        <AdminLayout title="Transaksi Manual" headerTitle="Transaksi Manual">
            <div className="space-y-6 p-4 lg:p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="font-medium text-green-800">
                            {flash.success}
                        </AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="font-medium text-red-800">
                            {flash.error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Tab Filter */}
                <div className="flex w-fit gap-1 rounded-lg border border-sidebar-border/70 bg-muted/30 p-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = filters.status === tab.key;

                        return (
                            <Link
                                key={tab.key}
                                href={`/admin/transactions/manual?status=${tab.key}`}
                                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-background text-foreground shadow'
                                        : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            {filters.status === 'pending' &&
                                'Transaksi Menunggu Proses'}
                            {filters.status === 'done' &&
                                'Transaksi Selesai Diproses'}
                            {filters.status === 'all' &&
                                'Semua Transaksi Manual'}
                        </CardTitle>
                        <CardDescription>
                            Total: {transactions.total} transaksi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-225 text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/40">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Referensi
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Produk
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Target
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Nominal
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-3 font-medium text-muted-foreground">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length === 0 && (
                                        <tr>
                                            <td
                                                className="px-4 py-12 text-center text-muted-foreground"
                                                colSpan={8}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                                                    <p className="font-medium">
                                                        {filters.status ===
                                                        'pending'
                                                            ? 'Tidak ada transaksi yang menunggu proses.'
                                                            : 'Tidak ada data.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {transactions.data.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className="border-t border-sidebar-border/40 transition-colors hover:bg-muted/20"
                                        >
                                            {/* Referensi */}
                                            <td className="px-4 py-3">
                                                <div className="font-mono text-xs text-primary">
                                                    {tx.reference ||
                                                        tx.merchant_ref}
                                                </div>
                                                <div className="font-mono text-xs text-muted-foreground">
                                                    {tx.merchant_ref}
                                                </div>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {tx.customer_name ||
                                                            '-'}
                                                    </span>
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-1.5">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {tx.customer_phone ||
                                                            '-'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Produk */}
                                            <td className="px-4 py-3">
                                                <div className="font-medium">
                                                    {tx.product?.name || '-'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {tx.product_price
                                                        ?.display_name || '-'}
                                                </div>
                                            </td>

                                            {/* Target / Customer No */}
                                            <td className="px-4 py-3">
                                                <div
                                                    className="inline-block max-w-45 truncate rounded bg-muted px-2 py-1 font-mono text-xs"
                                                    title={
                                                        tx.digiflazz_customer_no ||
                                                        '-'
                                                    }
                                                >
                                                    {tx.digiflazz_customer_no ||
                                                        '-'}
                                                </div>
                                                {tx.customer_inputs &&
                                                    Object.keys(
                                                        tx.customer_inputs,
                                                    ).length > 0 && (
                                                        <div className="mt-1 space-y-0.5">
                                                            {Object.entries(
                                                                tx.customer_inputs,
                                                            ).map(([k, v]) => (
                                                                <div
                                                                    key={k}
                                                                    className="text-xs text-muted-foreground"
                                                                >
                                                                    <span className="font-medium capitalize">
                                                                        {k}:
                                                                    </span>{' '}
                                                                    {v}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                            </td>

                                            {/* Nominal */}
                                            <td className="px-4 py-3 font-medium whitespace-nowrap">
                                                {formatCurrency(tx.amount)}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <StatusBadge
                                                    status={tx.status}
                                                    digiflazzStatus={
                                                        tx.digiflazz_status
                                                    }
                                                />
                                                {tx.digiflazz_sn && (
                                                    <div className="mt-1 inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
                                                        <Hash className="h-3 w-3" />
                                                        {tx.digiflazz_sn}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-foreground">
                                                {formatDate(tx.created_at)}
                                                {tx.digiflazz_processed_at && (
                                                    <div className="mt-0.5 text-green-600">
                                                        ✓{' '}
                                                        {formatDate(
                                                            tx.digiflazz_processed_at,
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-3">
                                                {tx.status === 'PAID' &&
                                                tx.digiflazz_status !==
                                                    'Sukses' &&
                                                tx.digiflazz_status !==
                                                    'sukses' ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            openModal(tx)
                                                        }
                                                        className="flex items-center gap-1.5"
                                                    >
                                                        <PlayCircle className="h-3.5 w-3.5" />
                                                        Proses
                                                    </Button>
                                                ) : tx.digiflazz_status ===
                                                      'Sukses' ||
                                                  tx.digiflazz_status ===
                                                      'sukses' ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Selesai
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {transactions.last_page > 1 && (
                            <div className="flex items-center justify-center gap-1 border-t border-sidebar-border/50 p-4">
                                {transactions.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={
                                            link.url
                                                ? `${link.url}&status=${filters.status}`
                                                : '#'
                                        }
                                        className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm ${
                                            link.active
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-sidebar-border/70 hover:bg-muted'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Process Modal */}
            {modalTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative z-10 mx-4 w-full max-w-lg rounded-xl border border-sidebar-border bg-background shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-sidebar-border/50 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Proses Transaksi Manual
                                </h2>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Isi serial number / akun untuk customer
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-md p-1.5 transition-colors hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4 px-6 py-5">
                            {/* Transaction Info */}
                            <div className="space-y-2.5 rounded-lg border border-sidebar-border/50 bg-muted/30 p-4">
                                <InfoRow
                                    icon={Hash}
                                    label="Referensi"
                                    value={
                                        modalTx.reference ||
                                        modalTx.merchant_ref
                                    }
                                    mono
                                />
                                <InfoRow
                                    icon={User}
                                    label="Customer"
                                    value={modalTx.customer_name || '-'}
                                />
                                <InfoRow
                                    icon={Phone}
                                    label="No. HP"
                                    value={modalTx.customer_phone || '-'}
                                />
                                <InfoRow
                                    icon={Package}
                                    label="Produk"
                                    value={`${modalTx.product?.name || '-'} — ${modalTx.product_price?.display_name || '-'}`}
                                />
                                <InfoRow
                                    icon={CreditCard}
                                    label="Target"
                                    value={modalTx.digiflazz_customer_no || '-'}
                                    mono
                                />
                                {modalTx.customer_inputs &&
                                    Object.entries(modalTx.customer_inputs).map(
                                        ([k, v]) => (
                                            <InfoRow
                                                key={k}
                                                icon={FileText}
                                                label={
                                                    k.charAt(0).toUpperCase() +
                                                    k.slice(1)
                                                }
                                                value={v}
                                            />
                                        ),
                                    )}
                            </div>

                            {/* Serial Number Input */}
                            <div className="space-y-1.5">
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="serial_number"
                                >
                                    Serial Number / Akun{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="serial_number"
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                    placeholder="Contoh: user@email.com | password123&#10;atau kode voucher: ABCD-1234-EFGH"
                                    value={serialNumber}
                                    onChange={(e) =>
                                        setSerialNumber(e.target.value)
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Isi dengan akun, kode voucher, atau serial
                                    number yang akan dikirimkan ke customer.
                                </p>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="notes"
                                >
                                    Catatan (opsional)
                                </label>
                                <textarea
                                    id="notes"
                                    rows={2}
                                    className="w-full resize-none rounded-lg border border-sidebar-border/70 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                                    placeholder="Catatan tambahan untuk internal admin..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-sidebar-border/50 px-6 py-4">
                            <Button
                                variant="outline"
                                onClick={closeModal}
                                disabled={submitting}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleProcess}
                                disabled={!serialNumber.trim() || submitting}
                                className="flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Tandai Selesai
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

/* ── Helper Components ────────────────────────────────────── */

function StatusBadge({
    status,
    digiflazzStatus,
}: {
    status: string;
    digiflazzStatus: string | null;
}) {
    if (digiflazzStatus === 'Sukses' || digiflazzStatus === 'sukses') {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                <CheckCircle2 className="h-3 w-3" />
                Selesai
            </span>
        );
    }

    if (status === 'PAID') {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-600/20 ring-inset">
                <Clock className="h-3 w-3" />
                Menunggu
            </span>
        );
    }

    if (status === 'UNPAID') {
        return (
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                UNPAID
            </span>
        );
    }

    if (status === 'EXPIRED') {
        return (
            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                EXPIRED
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
            {status}
        </span>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
    mono = false,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 items-start gap-2">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">
                    {label}
                </span>
                <span
                    className={`truncate text-xs font-medium ${mono ? 'font-mono' : ''}`}
                >
                    {value}
                </span>
            </div>
        </div>
    );
}
