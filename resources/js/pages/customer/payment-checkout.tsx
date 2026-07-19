import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import CheckoutStageBar from '@/components/customer/payment/checkout-stage-bar';
import type { CheckoutStage } from '@/components/customer/payment/checkout-stage-bar';
import InstructionModal from '@/components/customer/payment/instruction-modal';
import PayCodeSection from '@/components/customer/payment/pay-code-section';
import TransactionInfoCard from '@/components/customer/payment/transaction-info-card';
import AppLayout from '@/layouts/app-layout';
import { initializeEcho } from '@/lib/echo';
import type { BreadcrumbItem } from '@/types';

type PaymentInstruction = {
    title: string;
    steps: string[];
};

type DigiflazzStatusUpdatedEvent = {
    digiflazz_status?: string;
    digiflazz_sn?: string;
};

type PaymentCheckoutPageProps = {
    transaction: {
        reference: string;
        merchant_ref: string;
        payment_channel_name: string | null;
        payment_channel_code: string | null;
        payment_method_name: string | null;
        amount: number;
        pay_code: string | null;
        pay_url: string | null;
        qr_string: string | null;
        status: string;
        expired_at: string | null;
        instructions: PaymentInstruction[];
        digiflazz_status: string | null;
        digiflazz_sn: string | null;
    };
};

type TransactionStatusUpdatedEvent = {
    status?: string;
    reference?: string;
    merchant_ref?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pembayaran',
        href: '',
    },
];

const statusLabelMap: Record<string, string> = {
    UNPAID: 'Menunggu Pembayaran',
    PAID: 'Pembayaran Berhasil',
    EXPIRED: 'Kedaluwarsa',
    FAILED: 'Gagal',
    REFUND: 'Refund',
};

const terminalStatuses = new Set(['EXPIRED', 'FAILED', 'REFUND']);

const redirectPaymentChannels = {
    OVO: 'OVO',
    DANA: 'DANA',
    SHOPEEPAY: 'ShopeePay',
} as const;

export default function PaymentCheckout({
    transaction,
}: PaymentCheckoutPageProps) {
    const [copied, setCopied] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(transaction.status);

    const [digiflazzStatus, setDigiflazzStatus] = useState<string | null>(
        transaction.digiflazz_status,
    );

    const [digiflazzSn, setDigiflazzSn] = useState<string | null>(
        transaction.digiflazz_sn,
    );

    const expiredAtDate = useMemo(
        () =>
            transaction.expired_at ? new Date(transaction.expired_at) : null,
        [transaction.expired_at],
    );

    const [remainingSeconds, setRemainingSeconds] = useState(() => {
        if (!transaction.expired_at) {
            return 0;
        }

        const expiredAt = new Date(transaction.expired_at);

        return Math.max(
            0,
            Math.floor((expiredAt.getTime() - Date.now()) / 1000),
        );
    });

    const isTerminalStatus = terminalStatuses.has(currentStatus);

    const paymentChannelCode =
        transaction.payment_channel_code?.toUpperCase() ?? '';

    const redirectPaymentName =
        redirectPaymentChannels[
            paymentChannelCode as keyof typeof redirectPaymentChannels
        ];

    const isRedirectPayment = Boolean(redirectPaymentName);

    const shouldShowPayCodeSection = currentStatus === 'UNPAID';

    useEffect(() => {
        if (!expiredAtDate || isTerminalStatus) {
            return;
        }

        const interval = window.setInterval(() => {
            setRemainingSeconds(
                Math.max(
                    0,
                    Math.floor((expiredAtDate.getTime() - Date.now()) / 1000),
                ),
            );
        }, 1000);

        return () => window.clearInterval(interval);
    }, [expiredAtDate, isTerminalStatus]);

    useEffect(() => {
        if (isTerminalStatus) {
            return;
        }

        const echo = initializeEcho();

        if (!echo) {
            return;
        }

        const channelName = `transaction.${transaction.reference}`;

        echo.channel(channelName)
            .listen(
                '.transaction.status.updated',
                (event: TransactionStatusUpdatedEvent) => {
                    const latestStatus = event.status;

                    if (!latestStatus) {
                        return;
                    }

                    setCurrentStatus(latestStatus);

                    if (terminalStatuses.has(latestStatus)) {
                        echo.leave(channelName);
                    }
                },
            )
            .listen(
                '.digiflazz.status.updated',
                (event: DigiflazzStatusUpdatedEvent) => {
                    setDigiflazzStatus(event.digiflazz_status ?? null);
                    setDigiflazzSn(event.digiflazz_sn ?? null);
                },
            );

        return () => {
            echo.leave(channelName);
        };
    }, [transaction.reference, isTerminalStatus]);

    useEffect(() => {
        if (isTerminalStatus) {
            return;
        }

        const interval = window.setInterval(async () => {
            try {
                const response = await fetch(
                    `/api/check-status/${encodeURIComponent(transaction.reference)}`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    return;
                }

                const payload = (await response.json()) as {
                    status?: string;
                };

                if (payload.status) {
                    setCurrentStatus(payload.status);
                }
            } catch {
                // Ignore transient polling errors.
            }
        }, 10000);

        return () => {
            window.clearInterval(interval);
        };
    }, [transaction.reference, isTerminalStatus]);

    const formattedAmount = useMemo(
        () =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(transaction.amount),
        [transaction.amount],
    );

    const effectiveRemainingSeconds = isTerminalStatus ? 0 : remainingSeconds;

    const countdown = useMemo(() => {
        const hours = Math.floor(effectiveRemainingSeconds / 3600)
            .toString()
            .padStart(2, '0');

        const minutes = Math.floor((effectiveRemainingSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0');

        const seconds = (effectiveRemainingSeconds % 60)
            .toString()
            .padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }, [effectiveRemainingSeconds]);

    const handleCopy = async () => {
        if (!transaction.pay_code) {
            return;
        }

        await navigator.clipboard.writeText(transaction.pay_code);

        setCopied(true);

        window.setTimeout(() => setCopied(false), 2000);
    };

    const renderedInstructions = transaction.instructions.map(
        (instruction) => ({
            ...instruction,
            steps: instruction.steps.map((step) =>
                step.replaceAll('{{pay_code}}', transaction.pay_code ?? ''),
            ),
        }),
    );

    const renderInstructionStep = (step: string): ReactNode[] => {
        return step
            .split(/(<b>.*?<\/b>)/gi)
            .filter((part) => part.length > 0)
            .map((part, index) => {
                const boldMatch = part.match(/^<b>(.*?)<\/b>$/i);

                if (boldMatch) {
                    return (
                        <strong
                            key={index}
                            className="font-semibold text-slate-900"
                        >
                            {boldMatch[1]}
                        </strong>
                    );
                }

                return <span key={index}>{part}</span>;
            });
    };

    const modalTitle = [
        transaction.payment_method_name,
        transaction.payment_channel_name,
    ]
        .filter(Boolean)
        .join(' ');

    const finalStatusLabel = useMemo(() => {
        if (currentStatus === 'REFUND') {
            return 'Refund';
        }

        if (currentStatus === 'EXPIRED') {
            return 'Kedaluwarsa';
        }

        if (currentStatus === 'FAILED') {
            return 'Gagal';
        }

        if (digiflazzStatus === 'Sukses') {
            return 'Transaksi Sukses';
        }

        if (digiflazzStatus === 'Gagal') {
            return 'Transaksi Gagal';
        }

        if (digiflazzStatus === 'Pending') {
            return 'Transaksi Pending';
        }

        return statusLabelMap[currentStatus] ?? currentStatus;
    }, [currentStatus, digiflazzStatus]);

    const checkoutStage = useMemo<CheckoutStage>(() => {
        if (digiflazzStatus === 'Sukses') {
            return 3;
        }

        if (
            currentStatus === 'PAID' ||
            digiflazzStatus === 'Pending' ||
            digiflazzStatus === 'Gagal'
        ) {
            return 2;
        }

        return 1;
    }, [currentStatus, digiflazzStatus]);

    const pageTitle = useMemo(() => {
        if (currentStatus === 'REFUND') {
            return 'Pembayaran Dikembalikan';
        }

        if (currentStatus === 'EXPIRED') {
            return 'Pembayaran Kedaluwarsa';
        }

        if (currentStatus === 'FAILED') {
            return 'Pembayaran Gagal';
        }

        if (digiflazzStatus === 'Sukses') {
            return 'Transaksi Berhasil';
        }

        if (digiflazzStatus === 'Gagal') {
            return 'Transaksi Gagal';
        }

        if (currentStatus === 'PAID' || digiflazzStatus === 'Pending') {
            return 'Transaksi Diproses';
        }

        return 'Selesaikan Pembayaran Anda';
    }, [currentStatus, digiflazzStatus]);

    const pageDescription = useMemo(() => {
        if (currentStatus === 'REFUND') {
            return 'Transaksi ini telah dikembalikan atau dibatalkan oleh sistem pembayaran.';
        }

        if (currentStatus === 'EXPIRED') {
            return 'Waktu pembayaran telah habis. Silakan buat transaksi baru jika ingin melanjutkan.';
        }

        if (currentStatus === 'FAILED') {
            return 'Pembayaran gagal diproses. Silakan coba lagi menggunakan metode pembayaran lain.';
        }

        if (digiflazzStatus === 'Sukses') {
            return 'Transaksi berhasil diproses. Terima kasih sudah berbelanja.';
        }

        if (digiflazzStatus === 'Gagal') {
            return 'Pembayaran berhasil diterima, tetapi proses top up gagal. Silakan hubungi admin untuk bantuan.';
        }

        if (currentStatus === 'PAID' || digiflazzStatus === 'Pending') {
            return 'Pembayaran berhasil diterima. Pesanan kamu sedang diproses.';
        }

        return 'Silakan lakukan pembayaran menggunakan metode yang dipilih. Ikuti instruksi yang tersedia untuk menyelesaikan transaksi dengan aman.';
    }, [currentStatus, digiflazzStatus]);

    const bottomMessage = useMemo(() => {
        if (currentStatus === 'REFUND') {
            return 'Transaksi ini berstatus refund. Jika dana sudah terpotong, proses pengembalian mengikuti ketentuan metode pembayaran.';
        }

        if (currentStatus === 'EXPIRED') {
            return 'Transaksi ini sudah kedaluwarsa. Silakan buat transaksi baru jika ingin melanjutkan pembayaran.';
        }

        if (currentStatus === 'FAILED') {
            return 'Transaksi ini gagal diproses. Silakan buat transaksi baru atau gunakan metode pembayaran lain.';
        }

        if (digiflazzStatus === 'Sukses') {
            return 'Transaksi berhasil. Simpan halaman ini sebagai bukti jika diperlukan.';
        }

        if (digiflazzStatus === 'Gagal') {
            return 'Top up gagal diproses. Silakan hubungi admin dengan menyertakan nomor referensi transaksi.';
        }

        if (currentStatus === 'PAID' || digiflazzStatus === 'Pending') {
            return 'Pembayaran sudah diterima. Mohon tunggu, pesanan sedang diproses oleh sistem.';
        }

        return 'Fokuskan pembayaran ke kode bayar dan instruksi yang tersedia. Halaman ini tetap berada di website kamu.';
    }, [currentStatus, digiflazzStatus]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembayaran" />

            <InstructionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                instructions={renderedInstructions}
                renderStep={renderInstructionStep}
            />

            <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mx-auto w-full max-w-3xl">
                    <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                        <div className="border-b border-slate-100 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-7 text-white sm:px-8 sm:py-8">
                            <p className="text-[0.7rem] tracking-[0.3em] text-slate-300 uppercase">
                                Pembayaran
                            </p>

                            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                                {pageTitle}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-[15px]">
                                {pageDescription}
                            </p>
                        </div>

                        <div className="space-y-6 p-5 sm:p-6">
                            <CheckoutStageBar checkoutStage={checkoutStage} />

                            <TransactionInfoCard
                                statusLabel={finalStatusLabel}
                                showCountdown={
                                    Boolean(transaction.expired_at) &&
                                    currentStatus === 'UNPAID' &&
                                    digiflazzStatus !== 'Sukses' &&
                                    digiflazzStatus !== 'Gagal'
                                }
                                countdown={countdown}
                                reference={transaction.reference}
                                formattedAmount={formattedAmount}
                            />

                            {digiflazzStatus && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
                                    <p className="font-semibold text-slate-900">
                                        Status Top Up: {digiflazzStatus}
                                    </p>

                                    {digiflazzSn && (
                                        <p className="mt-1 text-slate-600">
                                            SN: {digiflazzSn}
                                        </p>
                                    )}
                                </div>
                            )}

                            {shouldShowPayCodeSection && isRedirectPayment ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                                    <p className="font-semibold text-slate-900">
                                        Lanjutkan Pembayaran{' '}
                                        {redirectPaymentName}
                                    </p>

                                    <p className="mt-2 text-slate-600">
                                        Klik tombol di bawah untuk membuka
                                        halaman pembayaran. Selesaikan
                                        pembayaran sebelum waktu habis.
                                    </p>

                                    {transaction.pay_url ? (
                                        <a
                                            href={transaction.pay_url}
                                            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                        >
                                            Bayar Sekarang
                                        </a>
                                    ) : (
                                        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-slate-600">
                                            Link pembayaran belum tersedia.
                                            Silakan tunggu beberapa saat atau
                                            buat transaksi baru jika tombol
                                            pembayaran tidak muncul.
                                        </div>
                                    )}

                                    {renderedInstructions.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(true)}
                                            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Lihat cara bayar
                                        </button>
                                    )}
                                </div>
                            ) : (
                                shouldShowPayCodeSection && (
                                    <PayCodeSection
                                        paymentMethodName={
                                            transaction.payment_method_name
                                        }
                                        paymentChannelName={
                                            transaction.payment_channel_name
                                        }
                                        paymentChannelCode={
                                            transaction.payment_channel_code
                                        }
                                        payCode={transaction.pay_code}
                                        payUrl={transaction.pay_url}
                                        qrString={transaction.qr_string}
                                        copied={copied}
                                        onCopy={handleCopy}
                                        hasInstructions={
                                            renderedInstructions.length > 0
                                        }
                                        onOpenInstructions={() =>
                                            setModalOpen(true)
                                        }
                                    />
                                )
                            )}

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                                {bottomMessage}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
