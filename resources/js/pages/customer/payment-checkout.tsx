import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { initializeEcho } from '@/lib/echo';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import InstructionModal from '@/components/customer/payment/instruction-modal';
import CheckoutStageBar, {
    type CheckoutStage,
} from '@/components/customer/payment/checkout-stage-bar';
import TransactionInfoCard from '@/components/customer/payment/transaction-info-card';
import PayCodeSection from '@/components/customer/payment/pay-code-section';

type PaymentInstruction = {
    title: string;
    steps: string[];
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
        status: string;
        expired_at: string | null;
        instructions: PaymentInstruction[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pembayaran',
        href: '',
    },
];

const statusLabelMap: Record<string, string> = {
    UNPAID: 'Menunggu pembayaran',
    PAID: 'Lunas',
    EXPIRED: 'Kedaluwarsa',
    FAILED: 'Gagal',
};

const terminalStatuses = new Set(['PAID', 'EXPIRED', 'FAILED']);

type TransactionStatusUpdatedEvent = {
    status?: string;
    reference?: string;
    merchant_ref?: string;
};

export default function PaymentCheckout({
    transaction,
}: PaymentCheckoutPageProps) {
    const [copied, setCopied] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(transaction.status);

    const expiredAtDate = transaction.expired_at
        ? new Date(transaction.expired_at)
        : null;
    const [remainingSeconds, setRemainingSeconds] = useState(() => {
        if (!expiredAtDate) return 0;
        return Math.max(
            0,
            Math.floor((expiredAtDate.getTime() - Date.now()) / 1000),
        );
    });

    useEffect(() => {
        if (!expiredAtDate) return;

        if (terminalStatuses.has(currentStatus)) {
            setRemainingSeconds(0);
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
    }, [expiredAtDate, currentStatus]);

    const formattedAmount = useMemo(
        () =>
            new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(transaction.amount),
        [transaction.amount],
    );

    const countdown = useMemo(() => {
        const hours = Math.floor(remainingSeconds / 3600)
            .toString()
            .padStart(2, '0');
        const minutes = Math.floor((remainingSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }, [remainingSeconds]);

    const handleCopy = async () => {
        if (!transaction.pay_code) return;
        await navigator.clipboard.writeText(transaction.pay_code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (terminalStatuses.has(currentStatus)) {
            return;
        }

        const echo = initializeEcho();

        if (!echo) {
            return;
        }

        const channelName = `payments.${transaction.reference}`;

        echo.channel(channelName).listen(
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
        );

        return () => {
            echo.leave(channelName);
        };
    }, [transaction.reference, currentStatus]);

    useEffect(() => {
        if (terminalStatuses.has(currentStatus)) {
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
    }, [transaction.reference, currentStatus]);

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

    const checkoutStage = useMemo<CheckoutStage>(() => {
        if (currentStatus === 'PAID') {
            return 2;
        }

        if (
            ['COMPLETED', 'SUCCESS', 'DONE', 'FINISHED'].includes(currentStatus)
        ) {
            return 3;
        }

        return 1;
    }, [currentStatus]);

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

            <div className="px-4 py-6">
                <div className="mx-auto max-w-2xl">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 text-white">
                            <p className="text-xs tracking-[0.28em] text-slate-300 uppercase">
                                Pembayaran Custom
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold">
                                Selesaikan pembayaran tanpa keluar ke Tripay
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-300">
                                Gunakan kode bayar di bawah ini dan ikuti
                                instruksi untuk menyelesaikan transaksi.
                            </p>
                        </div>

                        <div className="space-y-5 p-6">
                            <CheckoutStageBar checkoutStage={checkoutStage} />

                            <TransactionInfoCard
                                statusLabel={
                                    statusLabelMap[currentStatus] ??
                                    currentStatus
                                }
                                showCountdown={
                                    Boolean(transaction.expired_at) &&
                                    !terminalStatuses.has(currentStatus)
                                }
                                countdown={countdown}
                                reference={transaction.reference}
                                formattedAmount={formattedAmount}
                            />

                            <PayCodeSection
                                paymentMethodName={
                                    transaction.payment_method_name
                                }
                                paymentChannelName={
                                    transaction.payment_channel_name
                                }
                                payCode={transaction.pay_code}
                                copied={copied}
                                onCopy={handleCopy}
                                hasInstructions={
                                    renderedInstructions.length > 0
                                }
                                onOpenInstructions={() => setModalOpen(true)}
                            />

                            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                                Fokuskan pembayaran ke kode bayar dan instruksi
                                yang tersedia. Halaman ini tetap berada di
                                website kamu.
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
