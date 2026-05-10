import { useState } from 'react';
import SectionCard from './section-card';
import type { PaymentMethod } from '@/types';
import { cn } from '@/lib/utils';

type PaymentSectionProps = {
    paymentMethods: (PaymentMethod & { logo_url?: string })[];
    selectedPayment: string;
    onSelectPayment: (payment: string) => void;
};

export default function PaymentSection({
    paymentMethods,
    selectedPayment,
    onSelectPayment,
}: PaymentSectionProps) {
    const activePayments = paymentMethods.filter((method) => method.is_active);
    const [openMethod, setOpenMethod] = useState<number | null>(null);
    return (
        <SectionCard number={4} title="Pilih Pembayaran">
            <div className="space-y-3 text-slate-900 dark:text-slate-100">
                {activePayments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Tidak ada metode pembayaran tersedia
                    </p>
                ) : (
                    activePayments.map((method) => {
                        const isOpen = openMethod === method.id;

                        return (
                            <div
                                key={method.id}
                                className="rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenMethod(isOpen ? null : method.id)
                                    }
                                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                                >
                                    <span className="flex items-center gap-3 text-sm font-semibold">
                                        {method.logo_url ? (
                                            <img
                                                src={method.logo_url}
                                                alt={method.name}
                                                className="h-5 w-5 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-5 w-5 rounded bg-slate-200" />
                                        )}
                                        {method.name}
                                    </span>

                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {isOpen ? 'Tutup' : 'Pilih'}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 p-3 dark:border-slate-700 md:grid-cols-3">
                                        {method.channels.length === 0 ? (
                                            <p className="col-span-2 text-xs text-slate-500 dark:text-slate-400">
                                                Tidak ada channel
                                            </p>
                                        ) : (
                                            method.channels.map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    type="button"
                                                    onClick={() =>
                                                        onSelectPayment(
                                                            channel.code,
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex h-20 items-center gap-3 rounded-lg px-3 py-2 text-left transition',
                                                        selectedPayment ===
                                                            channel.code
                                                            ? 'border-2 border-blue-600 bg-blue-50 shadow-sm ring-2 ring-blue-200 dark:border-blue-500 dark:bg-blue-950/45 dark:text-slate-100 dark:ring-blue-500/35'
                                                            : 'border border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600',
                                                    )}
                                                >
                                                    {channel.logo_url ? (
                                                        <img
                                                            src={
                                                                channel.logo_url
                                                            }
                                                            alt={channel.name}
                                                            className="h-5 w-10 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-5 w-5 rounded bg-slate-200" />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {channel.name}
                                                    </span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </SectionCard>
    );
}
