import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { initializeEcho } from '@/lib/echo';
import { Check, Clock3, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

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

type CheckoutStage = 1 | 2 | 3;

type TransactionStatusUpdatedEvent = {
    status?: string;
    reference?: string;
    merchant_ref?: string;
};

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}

function AccordionItem({
    instruction,
    isOpen,
    onToggle,
    renderStep,
}: {
    instruction: { title: string; steps: string[] };
    isOpen: boolean;
    onToggle: () => void;
    renderStep: (step: string) => ReactNode[];
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
            >
                <h2 className="text-sm font-semibold text-slate-900">
                    {instruction.title}
                </h2>
                <ChevronIcon open={isOpen} />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-slate-100 p-5">
                        <ol className="space-y-3 text-sm text-slate-700">
                            {instruction.steps.map((step, index) => (
                                <li
                                    key={`${instruction.title}-${index}`}
                                    className="flex items-start gap-3 leading-relaxed"
                                >
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                        {index + 1}
                                    </span>
                                    <span>{renderStep(step)}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InstructionModal({
    open,
    onClose,
    title,
    instructions,
    renderStep,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    instructions: { title: string; steps: string[] }[];
    renderStep: (step: string) => ReactNode[];
}) {
    const [openIndex, setOpenIndex] = useState<number>(0);
    const backdropRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={backdropRef}
            onClick={(e) => {
                if (e.target === backdropRef.current) onClose();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
        >
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Cara Pembayaran {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[70vh] space-y-2 overflow-y-auto p-5">
                    {instructions.map((instruction, index) => (
                        <AccordionItem
                            key={instruction.title}
                            instruction={instruction}
                            isOpen={openIndex === index}
                            onToggle={() =>
                                setOpenIndex((prev) =>
                                    prev === index ? -1 : index,
                                )
                            }
                            renderStep={renderStep}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

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

    const stageSteps: Array<{
        label: string;
        icon: 'pay' | 'process' | 'done';
    }> = [
        { label: 'Bayar', icon: 'pay' },
        { label: 'Diproses', icon: 'process' },
        { label: 'Selesai', icon: 'done' },
    ];

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
                            <div className="rounded-2xl bg-slate-100 px-4 py-4">
                                <div className="grid grid-cols-3 items-center">
                                    {stageSteps.map((step, index) => {
                                        const stageIndex = (index +
                                            1) as CheckoutStage;
                                        const isActive =
                                            stageIndex === checkoutStage;
                                        const iconClass = isActive
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-slate-400 text-white';

                                        return (
                                            <div
                                                key={step.label}
                                                className="relative flex justify-center"
                                            >
                                                {index > 0 ? (
                                                    <span className="absolute top-1/2 left-0 h-1 w-1/2 -translate-y-1/2 rounded-full bg-slate-300" />
                                                ) : null}
                                                {index <
                                                stageSteps.length - 1 ? (
                                                    <span className="absolute top-1/2 right-0 h-1 w-1/2 -translate-y-1/2 rounded-full bg-slate-300" />
                                                ) : null}
                                                <span
                                                    className={`relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full ${iconClass}`}
                                                >
                                                    {step.icon === 'pay' ? (
                                                        <WalletCards className="h-3.5 w-3.5" />
                                                    ) : step.icon ===
                                                      'process' ? (
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Check className="h-3.5 w-3.5" />
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-2 grid grid-cols-3 text-sm font-medium text-slate-700">
                                    {stageSteps.map((step) => (
                                        <p
                                            key={`${step.label}-label`}
                                            className="text-center"
                                        >
                                            {step.label}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Status
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {statusLabelMap[currentStatus] ??
                                            currentStatus}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Sisa waktu
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {transaction.expired_at &&
                                        !terminalStatuses.has(currentStatus)
                                            ? countdown
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Referensi
                                    </p>
                                    <p className="font-mono text-sm text-slate-900">
                                        {transaction.reference}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Total Bayar
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formattedAmount}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-sm font-medium text-slate-900">
                                    Metode Pembayaran
                                </p>
                                <p className="mt-1 text-sm text-slate-600">
                                    {transaction.payment_method_name ?? '-'}
                                    {transaction.payment_channel_name
                                        ? ` - ${transaction.payment_channel_name}`
                                        : ''}
                                </p>
                                <p className="mt-2 text-xs tracking-[0.2em] text-slate-500 uppercase">
                                    Kode pembayaran
                                </p>
                                <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-mono text-2xl font-semibold tracking-wider text-slate-900">
                                            {transaction.pay_code ?? '-'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Salin kode ini saat melakukan
                                            pembayaran.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        disabled={!transaction.pay_code}
                                        className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {copied ? 'Tersalin' : 'Salin kode'}
                                    </button>
                                </div>

                                {/* Tombol Lihat cara bayar */}
                                {renderedInstructions.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(true)}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-slate-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        Lihat cara bayar
                                    </button>
                                )}
                            </div>

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
