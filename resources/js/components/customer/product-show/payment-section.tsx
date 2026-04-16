import { useState } from 'react';
import SectionCard from './section-card';
import type { PaymentMethod } from '@/types';

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
            <div className="space-y-3 text-slate-900">
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
                                className="rounded-lg border border-slate-200"
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

                                    <span className="text-xs text-slate-500">
                                        {isOpen ? 'Tutup' : 'Pilih'}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 p-3 md:grid-cols-3">
                                        {method.channels.length === 0 ? (
                                            <p className="col-span-2 text-xs text-slate-500">
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
                                                    className={`flex h-20 items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                                                        selectedPayment ===
                                                        channel.code
                                                            ? 'border border-slate-900 bg-white ring-2 ring-slate-900/20'
                                                            : 'border border-slate-200 bg-slate-50'
                                                    }`}
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
